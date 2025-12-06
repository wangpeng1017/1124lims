import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, TreeSelect } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { roleData as initialData, permissionTreeData } from '../../mock/system';
import type { IRole } from '../../mock/system';

const RoleManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<IRole[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IRole | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'error'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: IRole) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除该角色吗?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
        },
    ];

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IRole) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRecord) {
                setDataSource(prev => prev.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const newRole: IRole = {
                    id: String(Date.now()),
                    ...values,
                    createTime: new Date().toISOString().split('T')[0],
                    status: 'active'
                };
                setDataSource(prev => [...prev, newRole]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card title="角色管理" extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增角色
                </Button>
            }>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingRecord ? "编辑角色" : "新增角色"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="roleName"
                        label="角色名称"
                        rules={[{ required: true, message: '请输入角色名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="permissions"
                        label="权限分配"
                        rules={[{ required: true, message: '请选择权限' }]}
                    >
                        <TreeSelect
                            treeData={permissionTreeData}
                            treeCheckable={true}
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}
                            placeholder="请选择权限"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        initialValue="active"
                    >
                        <Select>
                            <Select.Option value="active">启用</Select.Option>
                            <Select.Option value="inactive">禁用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
