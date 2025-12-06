import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, message, Tag, Popconfirm, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { supplierCategoryData, supplierData, type ISupplierCategory } from '../../mock/supplier';
import dayjs from 'dayjs';

const SupplierCategory: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISupplierCategory[]>(supplierCategoryData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISupplierCategory | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISupplierCategory) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        // 检查是否有供应商使用该分类
        const usedCount = supplierData.filter(s => s.categories.includes(id)).length;
        if (usedCount > 0) {
            message.error(`该分类下有 ${usedCount} 个供应商，无法删除`);
            return;
        }
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleToggleStatus = (record: ISupplierCategory) => {
        const newStatus = record.status === 'active' ? 'inactive' : 'active';
        setDataSource(dataSource.map(item =>
            item.id === record.id ? { ...item, status: newStatus } : item
        ));
        message.success(`已${newStatus === 'active' ? '启用' : '停用'}`);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, updateTime: new Date().toISOString() }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = `CAT${String(dataSource.length + 1).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    ...values,
                    status: 'active',
                    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
                }]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    // 统计每个分类下的供应商数量
    const getSupplierCount = (categoryId: string): number => {
        return supplierData.filter(s => s.categories.includes(categoryId)).length;
    };

    const columns: ColumnsType<ISupplierCategory> = [
        { title: '类别编码', dataIndex: 'code', key: 'code', width: 120 },
        { title: '类别名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '供应商数量',
            key: 'count',
            width: 120,
            render: (_, record) => {
                const count = getSupplierCount(record.id);
                return <Badge count={count} showZero color="#1890ff" />;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '启用' : '停用'}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleToggleStatus(record)}>
                        {record.status === 'active' ? '停用' : '启用'}
                    </a>
                    <Popconfirm
                        title="确定删除吗?"
                        description={getSupplierCount(record.id) > 0 ? '该分类下有供应商，无法删除' : undefined}
                        onConfirm={() => handleDelete(record.id)}
                        okButtonProps={{ disabled: getSupplierCount(record.id) > 0 }}
                    >
                        <a style={{ color: getSupplierCount(record.id) > 0 ? '#ccc' : 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
    ];

    return (
        <Card
            title={<><AppstoreOutlined /> 供应商分类管理</>}
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建分类</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingRecord ? "编辑分类" : "新建分类"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="类别编码"
                        rules={[{ required: true, message: '请输入类别编码' }]}
                    >
                        <Input placeholder="如: OUTSOURCE" disabled={!!editingRecord} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="类别名称"
                        rules={[{ required: true, message: '请输入类别名称' }]}
                    >
                        <Input placeholder="如: 外包供应商" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                        rules={[{ required: true, message: '请输入描述' }]}
                    >
                        <Input.TextArea rows={3} placeholder="请描述该类别供应商的特点" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SupplierCategory;
