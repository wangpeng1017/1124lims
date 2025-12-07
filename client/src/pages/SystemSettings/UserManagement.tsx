import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Switch, Avatar, Descriptions, Badge, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import {
    userData as initialUsers,
    roleData,
    departmentData,
    getRoleById,
    getDepartmentById,
    type IUser,
} from '../../mock/auth';

const UserManagement: React.FC = () => {
    const { canDelete, isAdmin, user: currentUser } = useAuth();
    const [dataSource, setDataSource] = useState<IUser[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IUser | null>(null);
    const [detailRecord, setDetailRecord] = useState<IUser | null>(null);
    const [form] = Form.useForm();

    const columns: ColumnsType<IUser> = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 120,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            render: (text, record) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {text}
                </Space>
            ),
        },
        {
            title: '所属部门',
            dataIndex: 'departmentId',
            key: 'departmentId',
            width: 150,
            render: (deptId: string) => {
                const dept = getDepartmentById(deptId);
                return dept?.name || '-';
            },
        },
        {
            title: '角色',
            dataIndex: 'roleIds',
            key: 'roleIds',
            width: 200,
            render: (roleIds: string[]) => {
                const colorMap: Record<string, string> = {
                    admin: 'red',
                    lab_director: 'purple',
                    sales_manager: 'blue',
                    test_engineer: 'green',
                    sample_admin: 'orange',
                    finance: 'cyan',
                    user: 'default',
                };
                return (
                    <Space wrap size={[0, 4]}>
                        {(roleIds || []).map(roleId => {
                            const role = getRoleById(roleId);
                            return role ? (
                                <Tag key={roleId} color={colorMap[role.code] || 'default'}>{role.name}</Tag>
                            ) : null;
                        })}
                    </Space>
                );
            },
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: string) => (
                <Badge
                    status={status === 'active' ? 'success' : 'error'}
                    text={status === 'active' ? '启用' : '禁用'}
                />
            ),
        },
        {
            title: '最后登录',
            dataIndex: 'lastLoginTime',
            key: 'lastLoginTime',
            width: 170,
            render: (time: string) => time ? new Date(time).toLocaleString('zh-CN') : '-',
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<KeyOutlined />}
                        onClick={() => handleResetPassword(record)}
                    >
                        重置密码
                    </Button>
                    {canDelete && record.id !== currentUser?.id && (
                        <Popconfirm
                            title="确定要删除该用户吗?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        form.setFieldsValue({
            status: 'active',
            roleIds: ['role-007'],  // 默认普通用户
            departmentId: 'dept-001',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (record: IUser) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleViewDetail = (record: IUser) => {
        setDetailRecord(record);
        setIsDetailOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleResetPassword = (record: IUser) => {
        Modal.confirm({
            title: '重置密码',
            content: `确定要重置用户 "${record.name}" 的密码吗？重置后密码将变为: 123456`,
            onOk: () => {
                message.success(`已重置用户 ${record.name} 的密码为: 123456`);
            },
        });
    };

    const handleToggleStatus = (record: IUser) => {
        const newStatus = record.status === 'active' ? 'disabled' : 'active';
        setDataSource(prev => prev.map(item =>
            item.id === record.id ? { ...item, status: newStatus } : item
        ));
        message.success(`已${newStatus === 'active' ? '启用' : '禁用'}用户 ${record.name}`);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const now = new Date().toISOString().split('T')[0];

            if (editingRecord) {
                setDataSource(prev => prev.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const newUser: IUser = {
                    id: `user-${Date.now()}`,
                    ...values,
                    createTime: now,
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
            <Card
                title="用户管理"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新增用户
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    scroll={{ x: 1300 }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* 编辑/新增弹窗 */}
            <Modal
                title={editingRecord ? "编辑用户" : "新增用户"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="登录账号" disabled={!!editingRecord} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="真实姓名" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号"
                    >
                        <Input placeholder="手机号码" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                    >
                        <Input placeholder="电子邮箱" />
                    </Form.Item>
                    <Form.Item
                        name="departmentId"
                        label="所属部门"
                        rules={[{ required: true, message: '请选择部门' }]}
                    >
                        <Select placeholder="选择部门">
                            {departmentData.map(dept => (
                                <Select.Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="roleIds"
                        label="角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select mode="multiple" placeholder="选择角色(可多选)">
                            {roleData.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    <Space>
                                        {role.name}
                                        {role.isSystem && <Tag color="blue" style={{ marginLeft: 4 }}>系统</Tag>}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                    >
                        <Select>
                            <Select.Option value="active">启用</Select.Option>
                            <Select.Option value="disabled">禁用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 详情抽屉 */}
            <Drawer
                title="用户详情"
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                width={500}
            >
                {detailRecord && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar size={80} icon={<UserOutlined />} />
                            <h2 style={{ marginTop: 12, marginBottom: 4 }}>{detailRecord.name}</h2>
                            <Tag color={detailRecord.status === 'active' ? 'success' : 'error'}>
                                {detailRecord.status === 'active' ? '已启用' : '已禁用'}
                            </Tag>
                        </div>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="用户名">{detailRecord.username}</Descriptions.Item>
                            <Descriptions.Item label="姓名">{detailRecord.name}</Descriptions.Item>
                            <Descriptions.Item label="手机号">{detailRecord.phone || '-'}</Descriptions.Item>
                            <Descriptions.Item label="邮箱">{detailRecord.email || '-'}</Descriptions.Item>
                            <Descriptions.Item label="所属部门">
                                {getDepartmentById(detailRecord.departmentId)?.name || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="角色">
                                <Space wrap size={[0, 4]}>
                                    {(detailRecord.roleIds || []).map(roleId => {
                                        const role = getRoleById(roleId);
                                        return role ? <Tag key={roleId} color="blue">{role.name}</Tag> : null;
                                    })}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间">{detailRecord.createTime}</Descriptions.Item>
                            <Descriptions.Item label="最后登录">
                                {detailRecord.lastLoginTime ? new Date(detailRecord.lastLoginTime).toLocaleString('zh-CN') : '-'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 24 }}>
                            <h4>角色权限</h4>
                            <Space wrap>
                                {(detailRecord.roleIds || []).flatMap(roleId => {
                                    const role = getRoleById(roleId);
                                    return role ? role.permissions.map(p => <Tag key={`${roleId}-${p}`}>{p}</Tag>) : [];
                                })}
                            </Space>
                        </div>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default UserManagement;
