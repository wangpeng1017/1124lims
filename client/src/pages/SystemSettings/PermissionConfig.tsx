import React, { useState } from 'react';
import { Card, Table, Tag, Select, Space, Button, message, Tabs, Switch, Tooltip, Badge, Row, Col, Divider, Alert } from 'antd';
import { SaveOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import {
    roleData,
    SYSTEM_MODULES,
    MODULE_ACCESS_OPTIONS,
    OPERATION_PERMISSIONS,
    APPROVAL_BUSINESS_TYPES,
    DATA_SCOPE_OPTIONS,
    type IRole,
    type IModuleAccess,
} from '../../mock/auth';

const PermissionConfig: React.FC = () => {
    const { isAdmin, canDelete } = useAuth();
    const [roles, setRoles] = useState<IRole[]>(roleData);
    const [selectedRoleId, setSelectedRoleId] = useState<string>(roleData[0]?.id || '');
    const [hasChanges, setHasChanges] = useState(false);

    const selectedRole = roles.find(r => r.id === selectedRoleId);

    // 更新角色的模块权限
    const updateModuleAccess = (moduleKey: string, newAccess: IModuleAccess['access']) => {
        if (!isAdmin) {
            message.warning('只有管理员才能修改权限配置');
            return;
        }
        setRoles(prev => prev.map(role => {
            if (role.id === selectedRoleId) {
                const newModuleAccess = role.moduleAccess.map(ma =>
                    ma.moduleKey === moduleKey ? { ...ma, access: newAccess } : ma
                );
                return { ...role, moduleAccess: newModuleAccess };
            }
            return role;
        }));
        setHasChanges(true);
    };

    // 更新角色的操作权限
    const updateOperationPermission = (permission: string, enabled: boolean) => {
        if (!isAdmin) {
            message.warning('只有管理员才能修改权限配置');
            return;
        }
        if (permission === 'delete' && enabled) {
            message.warning('删除权限仅管理员角色可拥有');
            return;
        }
        setRoles(prev => prev.map(role => {
            if (role.id === selectedRoleId) {
                const newPerms = enabled
                    ? [...role.permissions, permission]
                    : role.permissions.filter(p => p !== permission);
                return { ...role, permissions: newPerms };
            }
            return role;
        }));
        setHasChanges(true);
    };

    // 更新角色的审批权限
    const updateApprovalPermission = (businessType: string, canApprove: boolean) => {
        if (!isAdmin) {
            message.warning('只有管理员才能修改权限配置');
            return;
        }
        setRoles(prev => prev.map(role => {
            if (role.id === selectedRoleId) {
                const newApprovalPerms = role.approvalPermissions.map(ap =>
                    ap.businessType === businessType ? { ...ap, canApprove } : ap
                );
                return { ...role, approvalPermissions: newApprovalPerms };
            }
            return role;
        }));
        setHasChanges(true);
    };

    // 更新数据权限范围
    const updateDataScope = (scope: IRole['dataScope']) => {
        if (!isAdmin) {
            message.warning('只有管理员才能修改权限配置');
            return;
        }
        setRoles(prev => prev.map(role => {
            if (role.id === selectedRoleId) {
                return { ...role, dataScope: scope };
            }
            return role;
        }));
        setHasChanges(true);
    };

    // 保存配置
    const handleSave = () => {
        // 实际应用中这里会调用API保存
        message.success('权限配置已保存');
        setHasChanges(false);
    };

    // 重置
    const handleReset = () => {
        setRoles(roleData);
        setHasChanges(false);
        message.info('已重置为初始配置');
    };

    // 模块权限表格列
    const moduleColumns: ColumnsType<{ moduleKey: string; moduleName: string; access: IModuleAccess['access'] }> = [
        {
            title: '模块名称',
            dataIndex: 'moduleName',
            key: 'moduleName',
            width: 150,
        },
        {
            title: '模块标识',
            dataIndex: 'moduleKey',
            key: 'moduleKey',
            width: 120,
            render: (key: string) => <code>{key}</code>,
        },
        {
            title: '访问权限',
            dataIndex: 'access',
            key: 'access',
            width: 200,
            render: (access: IModuleAccess['access'], record) => (
                <Select
                    value={access}
                    style={{ width: 150 }}
                    onChange={(value) => updateModuleAccess(record.moduleKey, value)}
                    disabled={!isAdmin || selectedRole?.isSystem && selectedRole?.code === 'admin'}
                >
                    {MODULE_ACCESS_OPTIONS.map(opt => (
                        <Select.Option key={opt.value} value={opt.value}>
                            <Tag color={opt.color}>{opt.label}</Tag>
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: '说明',
            key: 'description',
            render: (_, record) => {
                const opt = MODULE_ACCESS_OPTIONS.find(o => o.value === record.access);
                const descriptions: Record<string, string> = {
                    full: '可进行所有操作',
                    operate: '可查看和操作，不能审批',
                    approve: '可查看和审批',
                    read: '仅能查看',
                    none: '无法访问此模块',
                };
                return <span style={{ color: '#666' }}>{descriptions[record.access]}</span>;
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={
                    <Space>
                        <span>权限配置</span>
                        {hasChanges && <Badge status="processing" text="有未保存的更改" />}
                    </Space>
                }
                extra={
                    <Space>
                        <Select
                            value={selectedRoleId}
                            onChange={setSelectedRoleId}
                            style={{ width: 200 }}
                        >
                            {roles.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    <Space>
                                        {role.name}
                                        {role.isSystem && <Tag color="blue">系统</Tag>}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                        <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={!hasChanges}>
                            重置
                        </Button>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} disabled={!hasChanges}>
                            保存配置
                        </Button>
                    </Space>
                }
            >
                {!isAdmin && (
                    <Alert
                        message="权限不足"
                        description="只有系统管理员才能修改权限配置，当前为只读模式。"
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {selectedRole && (
                    <Tabs
                        items={[
                            {
                                key: 'module',
                                label: '模块权限',
                                children: (
                                    <>
                                        <Alert
                                            message="模块权限控制用户能访问哪些功能模块，以及在模块内的操作级别。"
                                            type="info"
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                        <Table
                                            columns={moduleColumns}
                                            dataSource={selectedRole.moduleAccess}
                                            rowKey="moduleKey"
                                            pagination={false}
                                            size="small"
                                        />
                                    </>
                                ),
                            },
                            {
                                key: 'operation',
                                label: '操作权限',
                                children: (
                                    <>
                                        <Alert
                                            message="操作权限控制用户能执行哪些类型的操作（增删改查等）。"
                                            type="info"
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                        <Row gutter={[16, 16]}>
                                            {OPERATION_PERMISSIONS.map(perm => (
                                                <Col span={6} key={perm.key}>
                                                    <Card size="small">
                                                        <Space>
                                                            <Switch
                                                                checked={selectedRole.permissions.includes(perm.key)}
                                                                onChange={(checked) => updateOperationPermission(perm.key, checked)}
                                                                disabled={
                                                                    !isAdmin ||
                                                                    (perm.key === 'delete') ||
                                                                    (selectedRole.code === 'admin')
                                                                }
                                                            />
                                                            <span>{perm.label}</span>
                                                            {perm.key === 'delete' && (
                                                                <Tooltip title="删除权限仅管理员可拥有">
                                                                    <Tag color="red">管理员专属</Tag>
                                                                </Tooltip>
                                                            )}
                                                        </Space>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </>
                                ),
                            },
                            {
                                key: 'approval',
                                label: '审批权限',
                                children: (
                                    <>
                                        <Alert
                                            message="审批权限控制用户能审批哪些类型的业务单据。"
                                            type="info"
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                        <Row gutter={[16, 16]}>
                                            {APPROVAL_BUSINESS_TYPES.map(biz => {
                                                const perm = selectedRole.approvalPermissions.find(ap => ap.businessType === biz.key);
                                                return (
                                                    <Col span={8} key={biz.key}>
                                                        <Card size="small">
                                                            <Space>
                                                                <Switch
                                                                    checked={perm?.canApprove || false}
                                                                    onChange={(checked) => updateApprovalPermission(biz.key, checked)}
                                                                    disabled={!isAdmin || selectedRole.code === 'admin'}
                                                                />
                                                                <span>{biz.name}</span>
                                                            </Space>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </>
                                ),
                            },
                            {
                                key: 'data',
                                label: '数据权限',
                                children: (
                                    <>
                                        <Alert
                                            message="数据权限控制用户能查看的数据范围（全部数据、本部门数据、仅本人数据）。"
                                            type="info"
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                        <Row gutter={[16, 16]}>
                                            {DATA_SCOPE_OPTIONS.map(opt => {
                                                const isSelected = selectedRole.dataScope === opt.value;
                                                const colorMap: Record<string, string> = { all: 'green', department: 'blue', self: 'orange' };
                                                return (
                                                    <Col span={8} key={opt.value}>
                                                        <Card
                                                            size="small"
                                                            style={{
                                                                cursor: isAdmin ? 'pointer' : 'default',
                                                                borderColor: isSelected ? colorMap[opt.value] : undefined,
                                                                borderWidth: isSelected ? 2 : 1,
                                                            }}
                                                            onClick={() => isAdmin && updateDataScope(opt.value as IRole['dataScope'])}
                                                        >
                                                            <Space>
                                                                {isSelected && <CheckCircleOutlined style={{ color: colorMap[opt.value] }} />}
                                                                <Tag color={isSelected ? colorMap[opt.value] : 'default'}>{opt.label}</Tag>
                                                            </Space>
                                                            <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
                                                                {opt.value === 'all' && '可查看系统内所有数据'}
                                                                {opt.value === 'department' && '只能查看本部门的数据'}
                                                                {opt.value === 'self' && '只能查看自己创建的数据'}
                                                            </p>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </>
                                ),
                            },
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default PermissionConfig;
