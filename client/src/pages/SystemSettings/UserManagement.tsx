import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { userData as initialData, roleData } from '../../mock/system';
import type { IUser } from '../../mock/system';

const UserManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<IUser[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IUser | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => (
                <>
                    {roles.map(roleId => {
                        const role = roleData.find(r => r.id === roleId);
                        return <Tag color="blue" key={roleId}>{role?.roleName || roleId}</Tag>;
                    })}
                </>
            ),
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
            title: '最后登录',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: IUser) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        icon={<KeyOutlined />}
                        onClick={() => message.success(`已重置用户 ${record.username} 的密码`)}
                    >
                        重置密码
                    </Button>
                    <Popconfirm
                        title="确定要删除该用户吗?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IUser) => {
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
                const newUser: IUser = {
                    id: String(Date.now()),
                    ...values,
                    createTime: new Date().toISOString().split('T')[0],
                    status: 'active'
                };
                setDataSource(prev => [...prev, newUser]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card title="用户管理" extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增用户
                </Button>
            }>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingRecord ? "编辑用户" : "新增用户"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input disabled={!!editingRecord} />
                    </Form.Item>
                    <Form.Item
                        name="realName"
                        label="真实姓名"
                        rules={[{ required: true, message: '请输入真实姓名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="部门"
                        rules={[{ required: true, message: '请输入部门' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ type: 'email', message: '请输入有效的邮箱' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="联系电话"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="roles"
                        label="角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select mode="multiple">
                            {roleData.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.roleName}
                                </Select.Option>
                            ))}
                        </Select>
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

export default UserManagement;
