import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, FileExcelOutlined, TableOutlined } from '@ant-design/icons';
import { detectionParametersData, elnTemplatesData } from '../../../mock/basicParameters';
import type { DetectionParameter, ELNTemplate } from '../../../mock/basicParameters';
import DynamicFormRenderer from '../../../components/DynamicFormRenderer';

const DetectionParameters: React.FC = () => {
    const [dataSource, setDataSource] = useState<DetectionParameter[]>(detectionParametersData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DetectionParameter | null>(null);

    // Preview Modal State
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<ELNTemplate | null>(null);

    const [form] = Form.useForm();
    const [previewForm] = Form.useForm(); // Form instance for the preview

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: DetectionParameter) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handlePreview = (record: DetectionParameter) => {
        const template = elnTemplatesData.find(t => t.parameterName === record.name);
        if (template) {
            setPreviewTemplate(template);
            setIsPreviewModalOpen(true);
        } else {
            message.info('该参数暂无关联的ELN模板');
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                setDataSource([...dataSource, { id: newId, ...values }]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<DetectionParameter> = [
        { title: '参数名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '方法标准', dataIndex: 'method', key: 'method', width: 180 },
        { title: '单位', dataIndex: 'unit', key: 'unit', width: 100 },
        {
            title: '检测模板',
            key: 'template',
            width: 300,
            render: (_, record) => {
                const template = elnTemplatesData.find(t => t.parameterName === record.name);
                if (template) {
                    return (
                        <Space>
                            <Tag icon={<FileExcelOutlined />} color="success">{template.name}</Tag>
                            <a onClick={() => handlePreview(record)}>预览</a>
                            <a onClick={() => message.success('开始下载...')}>下载</a>
                        </Space>
                    );
                }
                return <span style={{ color: '#ccc' }}>暂无模板</span>;
            }
        },
        {
            title: '检测内容',
            key: 'content',
            width: 120,
            render: (_, record) => {
                const template = elnTemplatesData.find(t => t.parameterName === record.name);
                return (
                    <Button
                        size="small"
                        icon={<TableOutlined />}
                        disabled={!template}
                        onClick={() => handlePreview(record)}
                    >
                        查看
                    </Button>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card title="检测参数/项目" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增参数</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />

            {/* Edit/Create Modal */}
            <Modal
                title={editingRecord ? "编辑参数" : "新增参数"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="参数名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="method" label="方法标准" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal
                title={`模板预览: ${previewTemplate?.name || ''}`}
                open={isPreviewModalOpen}
                onCancel={() => setIsPreviewModalOpen(false)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                {previewTemplate && (
                    <Form form={previewForm} layout="vertical">
                        <DynamicFormRenderer template={previewTemplate} />
                    </Form>
                )}
            </Modal>
        </Card>
    );
};

export default DetectionParameters;
