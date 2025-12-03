import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, Popconfirm, message, Tabs, Row, Col, Divider, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { testTemplatesData, type TestTemplate } from '../../../mock/testTemplates';
import { inspectionStandardsData } from '../../../mock/basicParameters';
import DynamicFormRenderer from '../../../components/DynamicFormRenderer';

const { TextArea } = Input;
const { TabPane } = Tabs;

const TestTemplateManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<TestTemplate[]>(testTemplatesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TestTemplate | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<TestTemplate | null>(null);
    const [form] = Form.useForm();

    // 筛选检测标准选项
    const standardOptions = inspectionStandardsData.map(s => ({
        label: `${s.standardNo} ${s.name}`,
        value: s.standardNo
    }));

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: TestTemplate) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handlePreview = (record: TestTemplate) => {
        setPreviewTemplate(record);
        setIsPreviewModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // 这里简化处理，实际应该包含schema的配置
            // 暂时沿用旧的schema或默认schema
            const schema = editingRecord?.schema || {
                title: `${values.name}记录`,
                columns: [],
                environment: true
            };

            const newData: TestTemplate = {
                id: editingRecord ? editingRecord.id : Math.max(...dataSource.map(d => d.id), 0) + 1,
                ...values,
                updateTime: new Date().toISOString().split('T')[0],
                author: '管理员',
                status: 'active',
                schema
            };

            if (editingRecord) {
                setDataSource(dataSource.map(item => item.id === editingRecord.id ? newData : item));
                message.success('更新成功');
            } else {
                setDataSource([...dataSource, newData]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<TestTemplate> = [
        { title: '模版编号', dataIndex: 'code', key: 'code', width: 150 },
        { title: '模版名称', dataIndex: 'name', key: 'name', width: 250 },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            filters: Array.from(new Set(dataSource.map(d => d.category))).map(c => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        { title: '检测方法/标准', dataIndex: 'method', key: 'method' },
        { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 120 },
        {
            title: '操作',
            key: 'action',
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>预览</Button>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="检测模版管理"
            extra={
                <Space>
                    <Upload showUploadList={false}>
                        <Button icon={<UploadOutlined />}>导入模版</Button>
                    </Upload>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增模版</Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
            />

            {/* 编辑/新增模态框 */}
            <Modal
                title={editingRecord ? "编辑检测模版" : "新增检测模版"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="模版名称" rules={[{ required: true }]}>
                                <Input placeholder="如：复合材料拉伸性能检测" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="code" label="模版编号" rules={[{ required: true }]}>
                                <Input placeholder="如：COMP-TENSILE-GB" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
                                <Select options={[
                                    { label: '复合材料', value: '复合材料' },
                                    { label: '金属材料', value: '金属材料' },
                                    { label: '金相分析', value: '金相分析' },
                                    { label: '混凝土', value: '混凝土' },
                                    { label: '水质检测', value: '水质检测' },
                                    { label: '其他', value: '其他' }
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="version" label="版本号" initialValue="1.0">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="method" label="检测方法/标准" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={standardOptions}
                            placeholder="选择关联的检测标准"
                        />
                    </Form.Item>
                    <Form.Item name="unit" label="默认单位">
                        <Input placeholder="如：MPa" />
                    </Form.Item>

                    <Divider orientation="left">表单结构配置</Divider>
                    <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                        <p style={{ color: '#999' }}>表单结构配置功能开发中，目前请使用JSON导入或联系管理员配置</p>
                        <Button icon={<FileExcelOutlined />}>导入Excel模版结构</Button>
                    </div>
                </Form>
            </Modal>

            {/* 预览模态框 */}
            <Modal
                title={`模版预览: ${previewTemplate?.name || ''}`}
                open={isPreviewModalOpen}
                onCancel={() => setIsPreviewModalOpen(false)}
                width={1000}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                {previewTemplate && (
                    <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '0 16px' }}>
                        <DynamicFormRenderer template={previewTemplate} />
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default TestTemplateManagement;
