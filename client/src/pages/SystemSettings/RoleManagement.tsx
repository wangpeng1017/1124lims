import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Tabs, Checkbox, Row, Col, Descriptions, Badge, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import {
    roleData as initialRoles,
    OPERATION_PERMISSIONS,
    SYSTEM_MODULES,
    DATA_SCOPE_OPTIONS,
    MODULE_ACCESS_OPTIONS,
    APPROVAL_BUSINESS_TYPES,
    type IRole,
    type IModuleAccess,
    type IApprovalPermission
} from '../../mock/auth';

const RoleManagement: React.FC = () => {
    const { canDelete, isAdmin } = useAuth();
    const [dataSource, setDataSource] = useState<IRole[]>(initialRoles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IRole | null>(null);
    const [detailRecord, setDetailRecord] = useState<IRole | null>(null);
    const [form] = Form.useForm();

    const columns: ColumnsType<IRole> = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text, record) => (
                <Space>
                    {text}
                    {record.isSystem && <Tag color="blue">系统</Tag>}
                </Space>
            ),
        },
        {
            title: '角色代码',
            dataIndex: 'code',
            key: 'code',
            width: 120,
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '数据权限',
            dataIndex: 'dataScope',
            key: 'dataScope',
            width: 120,
            render: (scope: IRole['dataScope']) => {
                const option = DATA_SCOPE_OPTIONS.find(o => o.value === scope);
                const colorMap = { all: 'green', department: 'blue', self: 'orange' };
                return <Tag color={colorMap[scope]}>{option?.label}</Tag>;
            },
        },
        {
            title: '操作权限',
            dataIndex: 'permissions',
            key: 'permissions',
            width: 200,
            render: (perms: string[]) => (
                <Space size={[0, 4]} wrap>
                    {perms.slice(0, 4).map(p => {
                        const perm = OPERATION_PERMISSIONS.find(op => op.key === p);
                        return <Tag key={p} color="default">{perm?.label || p}</Tag>;
                    })}
                    {perms.length > 4 && <Tag>+{perms.length - 4}</Tag>}
                </Space>
            ),
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 120,
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
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
                    {canDelete && !record.isSystem && (
                        <Popconfirm
                            title="确定要删除该角色吗?"
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
        // 设置默认值
        form.setFieldsValue({
            permissions: ['create', 'read', 'update'],
            dataScope: 'department',
            moduleAccess: SYSTEM_MODULES.map(m => ({ moduleKey: m.key, moduleName: m.name, access: 'read' })),
            approvalPermissions: APPROVAL_BUSINESS_TYPES.map(t => ({ businessType: t.key, businessName: t.name, canApprove: false })),
        });
        setIsModalOpen(true);
    };

    const handleEdit = (record: IRole) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            permissions: record.permissions,
        });
        setIsModalOpen(true);
    };

    const handleViewDetail = (record: IRole) => {
        setDetailRecord(record);
        setIsDetailOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const now = new Date().toISOString().split('T')[0];

            if (editingRecord) {
                setDataSource(prev => prev.map(item =>
                    item.id === editingRecord.id ? {
                        ...item,
                        ...values,
                        updateTime: now,
                    } : item
                ));
                message.success('更新成功');
            } else {
                const newRole: IRole = {
                    id: `role-${Date.now()}`,
                    ...values,
                    isSystem: false,
                    createTime: now,
                    updateTime: now,
                };
                setDataSource(prev => [...prev, newRole]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    // 模块权限配置组件
    const ModuleAccessConfig = () => {
        const moduleAccess = Form.useWatch('moduleAccess', form) || [];

        return (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {SYSTEM_MODULES.map((module, index) => (
                    <Row key={module.key} gutter={16} style={{ marginBottom: 8, alignItems: 'center' }}>
                        <Col span={8}>
                            <span>{module.name}</span>
                        </Col>
                        <Col span={16}>
                            <Select
                                style={{ width: '100%' }}
                                value={moduleAccess[index]?.access || 'none'}
                                onChange={(value) => {
                                    const newAccess = [...moduleAccess];
                                    newAccess[index] = {
                                        moduleKey: module.key,
                                        moduleName: module.name,
                                        access: value
                                    };
                                    form.setFieldsValue({ moduleAccess: newAccess });
                                }}
                            >
                                {MODULE_ACCESS_OPTIONS.map(opt => (
                                    <Select.Option key={opt.value} value={opt.value}>
                                        <Tag color={opt.color}>{opt.label}</Tag>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                ))}
            </div>
        );
    };

    // 审批权限配置组件
    const ApprovalPermissionConfig = () => {
        const approvalPerms = Form.useWatch('approvalPermissions', form) || [];

        return (
            <div>
                {APPROVAL_BUSINESS_TYPES.map((biz, index) => (
                    <Row key={biz.key} gutter={16} style={{ marginBottom: 8, alignItems: 'center' }}>
                        <Col span={16}>
                            <span>{biz.name}</span>
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                checked={approvalPerms[index]?.canApprove || false}
                                onChange={(e) => {
                                    const newPerms = [...approvalPerms];
                                    newPerms[index] = {
                                        businessType: biz.key,
                                        businessName: biz.name,
                                        canApprove: e.target.checked
                                    };
                                    form.setFieldsValue({ approvalPermissions: newPerms });
                                }}
                            >
                                可审批
                            </Checkbox>
                        </Col>
                    </Row>
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="角色管理"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新增角色
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* 编辑/新增弹窗 */}
            <Modal
                title={editingRecord ? "编辑角色" : "新增角色"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Tabs
                        items={[
                            {
                                key: 'basic',
                                label: '基本信息',
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="name"
                                                    label="角色名称"
                                                    rules={[{ required: true, message: '请输入角色名称' }]}
                                                >
                                                    <Input placeholder="如：检测工程师" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="code"
                                                    label="角色代码"
                                                    rules={[{ required: true, message: '请输入角色代码' }]}
                                                >
                                                    <Input placeholder="如：test_engineer" disabled={editingRecord?.isSystem} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item name="description" label="描述">
                                            <Input.TextArea rows={2} placeholder="角色描述" />
                                        </Form.Item>
                                        <Form.Item
                                            name="permissions"
                                            label="操作权限"
                                            rules={[{ required: true, message: '请选择操作权限' }]}
                                        >
                                            <Checkbox.Group>
                                                <Row>
                                                    {OPERATION_PERMISSIONS.map(perm => (
                                                        <Col span={6} key={perm.key}>
                                                            <Checkbox
                                                                value={perm.key}
                                                                disabled={perm.key === 'delete' && !isAdmin}
                                                            >
                                                                {perm.label}
                                                                {perm.key === 'delete' && <Tag color="red" style={{ marginLeft: 4 }}>管理员</Tag>}
                                                            </Checkbox>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Checkbox.Group>
                                        </Form.Item>
                                        <Form.Item
                                            name="dataScope"
                                            label="数据权限范围"
                                            rules={[{ required: true, message: '请选择数据权限范围' }]}
                                        >
                                            <Select>
                                                {DATA_SCOPE_OPTIONS.map(opt => (
                                                    <Select.Option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </>
                                ),
                            },
                            {
                                key: 'module',
                                label: '模块权限',
                                children: (
                                    <>
                                        <Form.Item name="moduleAccess" hidden><Input /></Form.Item>
                                        <ModuleAccessConfig />
                                    </>
                                ),
                            },
                            {
                                key: 'approval',
                                label: '审批权限',
                                children: (
                                    <>
                                        <Form.Item name="approvalPermissions" hidden><Input /></Form.Item>
                                        <ApprovalPermissionConfig />
                                    </>
                                ),
                            },
                        ]}
                    />
                </Form>
            </Modal>

            {/* 详情弹窗 */}
            <Modal
                title={`角色详情 - ${detailRecord?.name}`}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                width={700}
            >
                {detailRecord && (
                    <Tabs
                        items={[
                            {
                                key: 'basic',
                                label: '基本信息',
                                children: (
                                    <Descriptions column={2} bordered size="small">
                                        <Descriptions.Item label="角色名称">{detailRecord.name}</Descriptions.Item>
                                        <Descriptions.Item label="角色代码">{detailRecord.code}</Descriptions.Item>
                                        <Descriptions.Item label="描述" span={2}>{detailRecord.description || '-'}</Descriptions.Item>
                                        <Descriptions.Item label="系统角色">
                                            {detailRecord.isSystem ? <Badge status="processing" text="是" /> : <Badge status="default" text="否" />}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="数据权限">
                                            {DATA_SCOPE_OPTIONS.find(o => o.value === detailRecord.dataScope)?.label}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="操作权限" span={2}>
                                            <Space wrap>
                                                {detailRecord.permissions.map(p => (
                                                    <Tag key={p}>{OPERATION_PERMISSIONS.find(op => op.key === p)?.label || p}</Tag>
                                                ))}
                                            </Space>
                                        </Descriptions.Item>
                                    </Descriptions>
                                ),
                            },
                            {
                                key: 'module',
                                label: '模块权限',
                                children: (
                                    <div>
                                        {detailRecord.moduleAccess.map(ma => {
                                            const opt = MODULE_ACCESS_OPTIONS.find(o => o.value === ma.access);
                                            return (
                                                <Row key={ma.moduleKey} style={{ marginBottom: 8 }}>
                                                    <Col span={12}>{ma.moduleName}</Col>
                                                    <Col span={12}>
                                                        <Tag color={opt?.color}>{opt?.label}</Tag>
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                    </div>
                                ),
                            },
                            {
                                key: 'approval',
                                label: '审批权限',
                                children: (
                                    <div>
                                        {detailRecord.approvalPermissions.length > 0 ? (
                                            detailRecord.approvalPermissions.filter(ap => ap.canApprove).map(ap => (
                                                <Tag key={ap.businessType} color="green" style={{ marginBottom: 8 }}>
                                                    {ap.businessName}
                                                </Tag>
                                            ))
                                        ) : (
                                            <span style={{ color: '#999' }}>无审批权限</span>
                                        )}
                                        {detailRecord.approvalPermissions.filter(ap => ap.canApprove).length === 0 && (
                                            <span style={{ color: '#999' }}>无审批权限</span>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                    />
                )}
            </Modal>
        </div>
    );
};

export default RoleManagement;
