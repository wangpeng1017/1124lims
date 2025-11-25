import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { reportCategoryData, type IReportCategory } from '../../mock/report';

const ReportCategories: React.FC = () => {
    const [dataSource, setDataSource] = useState(reportCategoryData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IReportCategory | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IReportCategory) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                setDataSource([...dataSource, { id: newId, ...values }]);
                message.success('新增成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IReportCategory> = [
        { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
        { title: '分类代码', dataIndex: 'categoryCode', key: 'categoryCode' },
        {
            title: '适用试验类型',
            dataIndex: 'testTypes',
            key: 'testTypes',
            render: (types: string[]) => (
                <Space size={[0, 8]} wrap>
                    {types.map(t => <Tag key={t}>{t}</Tag>)}
                </Space>
            )
        },
        { title: '模板名称', dataIndex: 'templateName', key: 'templateName' },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="样品报告分类管理"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增分类</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />

            <Modal
                title={editingRecord ? "编辑报告分类" : "新增报告分类"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="categoryName"
                        label="分类名称"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="例如：力学性能报告" />
                    </Form.Item>

                    <Form.Item
                        name="categoryCode"
                        label="分类代码"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="例如：MECH" />
                    </Form.Item>

                    <Form.Item
                        name="testTypes"
                        label="适用试验类型"
                        rules={[{ required: true }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="输入试验类型并回车添加"
                        />
                    </Form.Item>

                    <Form.Item
                        name="templateName"
                        label="模板名称"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="例如：力学性能标准模板" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea rows={3} placeholder="分类描述..." />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ReportCategories;
