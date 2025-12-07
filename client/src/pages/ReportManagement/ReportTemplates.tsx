import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Upload, message, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { reportTemplateData, reportCategoryData, type IReportTemplate } from '../../mock/report';
import { useAuth } from '../../hooks/useAuth';

const { Option } = Select;

const ReportTemplates: React.FC = () => {
    const { canDelete } = useAuth();

    const [dataSource, setDataSource] = useState<IReportTemplate[]>(reportTemplateData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAdd = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('模板已删除');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
            const newTemplate: IReportTemplate = {
                id: newId,
                name: values.name,
                code: `TPL-${values.categoryCode}-${newId.toString().padStart(3, '0')}`,
                category: values.category,
                fileUrl: '/templates/new_template.docx', // Mock file path
                uploadDate: new Date().toISOString().split('T')[0],
                uploader: 'Admin', // Mock uploader
                status: 'active'
            };
            setDataSource([...dataSource, newTemplate]);
            message.success('模板上传成功');
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IReportTemplate> = [
        { title: '模板编号', dataIndex: 'code', key: 'code' },
        { title: '模板名称', dataIndex: 'name', key: 'name' },
        { title: '适用报告分类', dataIndex: 'category', key: 'category' },
        { title: '上传人', dataIndex: 'uploader', key: 'uploader' },
        { title: '上传日期', dataIndex: 'uploadDate', key: 'uploadDate' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? '启用' : '停用'}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" href={record.fileUrl} target="_blank">下载</Button>
                    {canDelete && (
                        <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card title="报告模板管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>上传模板</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title="上传新模板"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="适用报告分类" rules={[{ required: true }]}>
                        <Select>
                            {reportCategoryData.map(cat => (
                                <Option key={cat.id} value={cat.categoryName}>{cat.categoryName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="file" label="模板文件" valuePropName="fileList" getValueFromEvent={(e: any) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e?.fileList;
                    }}>
                        <Upload name="file" action="/upload.do" listType="text">
                            <Button icon={<UploadOutlined />}>点击上传 Word 模板</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ReportTemplates;
