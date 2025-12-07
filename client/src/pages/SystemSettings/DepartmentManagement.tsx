import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Tree, Row, Col, Descriptions, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined, ApartmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useAuth } from '../../hooks/useAuth';
import { departmentData as initialDepartments, userData, type IDepartment } from '../../mock/auth';

const DepartmentManagement: React.FC = () => {
    const { canDelete, isAdmin } = useAuth();
    const [dataSource, setDataSource] = useState<IDepartment[]>(initialDepartments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IDepartment | null>(null);
    const [detailRecord, setDetailRecord] = useState<IDepartment | null>(null);
    const [form] = Form.useForm();

    // 构建树形数据
    const buildTreeData = (departments: IDepartment[], parentId?: string): DataNode[] => {
        return departments
            .filter(d => d.parentId === parentId)
            .map(dept => ({
                key: dept.id,
                title: (
                    <Space>
                        <ApartmentOutlined />
                        {dept.name}
                        <Tag color={dept.status === 'active' ? 'success' : 'error'}>
                            {dept.status === 'active' ? '启用' : '禁用'}
                        </Tag>
                    </Space>
                ),
                children: buildTreeData(departments, dept.id),
            }));
    };

    // 获取部门人数
    const getDepartmentUserCount = (deptId: string): number => {
        return userData.filter(u => u.departmentId === deptId).length;
    };

    // 获取父部门名称
    const getParentDeptName = (parentId?: string): string => {
        if (!parentId) return '-';
        const parent = dataSource.find(d => d.id === parentId);
        return parent?.name || '-';
    };

    const columns: ColumnsType<IDepartment> = [
        {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (text, record) => (
                <Space>
                    <ApartmentOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: '部门代码',
            dataIndex: 'code',
            key: 'code',
            width: 100,
            render: (code: string) => <code>{code}</code>,
        },
        {
            title: '上级部门',
            dataIndex: 'parentId',
            key: 'parentId',
            width: 150,
            render: (parentId: string) => getParentDeptName(parentId),
        },
        {
            title: '人员数量',
            key: 'userCount',
            width: 100,
            render: (_, record) => (
                <Space>
                    <TeamOutlined />
                    {getDepartmentUserCount(record.id)}
                </Space>
            ),
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
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
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
                    {canDelete && getDepartmentUserCount(record.id) === 0 && (
                        <Popconfirm
                            title="确定要删除该部门吗?"
                            description="只有没有人员的部门才能删除"
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
        form.setFieldsValue({ status: 'active' });
        setIsModalOpen(true);
    };

    const handleEdit = (record: IDepartment) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleViewDetail = (record: IDepartment) => {
        setDetailRecord(record);
        setIsDetailOpen(true);
    };

    const handleDelete = (id: string) => {
        // 检查是否有子部门
        const hasChildren = dataSource.some(d => d.parentId === id);
        if (hasChildren) {
            message.error('该部门下有子部门，无法删除');
            return;
        }
        // 检查是否有人员
        if (getDepartmentUserCount(id) > 0) {
            message.error('该部门下有人员，无法删除');
            return;
        }
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
                const newDept: IDepartment = {
                    id: `dept-${Date.now()}`,
                    ...values,
                };
                setDataSource(prev => [...prev, newDept]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const treeData = buildTreeData(dataSource, undefined);

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={24}>
                {/* 左侧：部门树 */}
                <Col span={8}>
                    <Card title="部门结构" size="small">
                        <Tree
                            treeData={treeData}
                            defaultExpandAll
                            showIcon
                        />
                    </Card>
                </Col>

                {/* 右侧：部门列表 */}
                <Col span={16}>
                    <Card
                        title="部门管理"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                新增部门
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            rowKey="id"
                            size="small"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 编辑/新增弹窗 */}
            <Modal
                title={editingRecord ? "编辑部门" : "新增部门"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={500}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="部门名称"
                        rules={[{ required: true, message: '请输入部门名称' }]}
                    >
                        <Input placeholder="如：检测一部" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="部门代码"
                        rules={[{ required: true, message: '请输入部门代码' }]}
                    >
                        <Input placeholder="如：LAB1" />
                    </Form.Item>
                    <Form.Item
                        name="parentId"
                        label="上级部门"
                    >
                        <Select placeholder="选择上级部门（可选）" allowClear>
                            {dataSource
                                .filter(d => d.id !== editingRecord?.id)
                                .map(dept => (
                                    <Select.Option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea rows={2} placeholder="部门职责描述" />
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

            {/* 详情弹窗 */}
            <Modal
                title={`部门详情 - ${detailRecord?.name}`}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                width={500}
            >
                {detailRecord && (
                    <>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="部门名称">{detailRecord.name}</Descriptions.Item>
                            <Descriptions.Item label="部门代码">{detailRecord.code}</Descriptions.Item>
                            <Descriptions.Item label="上级部门">{getParentDeptName(detailRecord.parentId)}</Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Badge
                                    status={detailRecord.status === 'active' ? 'success' : 'error'}
                                    text={detailRecord.status === 'active' ? '启用' : '禁用'}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="描述">{detailRecord.description || '-'}</Descriptions.Item>
                            <Descriptions.Item label="人员数量">
                                <Space>
                                    <TeamOutlined />
                                    {getDepartmentUserCount(detailRecord.id)} 人
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 16 }}>
                            <h4>部门人员</h4>
                            {userData
                                .filter(u => u.departmentId === detailRecord.id)
                                .map(u => (
                                    <Tag key={u.id} style={{ marginBottom: 4 }}>{u.name}</Tag>
                                ))
                            }
                            {getDepartmentUserCount(detailRecord.id) === 0 && (
                                <span style={{ color: '#999' }}>暂无人员</span>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default DepartmentManagement;
