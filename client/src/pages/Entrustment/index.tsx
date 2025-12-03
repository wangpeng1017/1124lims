import React, { useState } from 'react';
import { Table, Card, Tag, Space, Button, Drawer, Form, Input, Popconfirm, message, Tooltip, Select, Row, Col, Divider, List, Radio, Modal, DatePicker } from 'antd';
import { LinkOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { entrustmentData } from '../../mock/entrustment';
import type { IEntrustmentRecord, IEntrustmentProject } from '../../mock/entrustment';
import { detectionParametersData } from '../../mock/basicParameters';
import { deviceData } from '../../mock/devices';
import { supplierData } from '../../mock/supplier';
import dayjs from 'dayjs';
import { employeeData } from '../../mock/personnel';
import PersonSelector from '../../components/PersonSelector';

const orgUsers = [
    {
        department: '力学实验室',
        users: [
            { id: 'EMP001', name: '张三' },
            { id: 'EMP002', name: '李四' }
        ]
    },
    {
        department: '金相实验室',
        users: [
            { id: 'EMP003', name: '王五' },
            { id: 'EMP004', name: '赵六' }
        ]
    },
    {
        department: '化学实验室',
        users: [
            { id: 'EMP005', name: '陈七' },
            { id: 'EMP006', name: '刘八' }
        ]
    }
];

const outsourcingSuppliers = supplierData.filter(s => s.categories.includes('CAT001'));

const Entrustment: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEntrustmentRecord[]>(entrustmentData);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEntrustmentRecord | null>(null);
    const [form] = Form.useForm();
    // const navigate = useNavigate(); // Unused

    // 项目管理状态
    const [projects, setProjects] = useState<IEntrustmentProject[]>([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<IEntrustmentProject | null>(null);
    const [projectForm] = Form.useForm();

    // 任务分配/分包状态
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignType, setAssignType] = useState<'internal' | 'external'>('internal');
    const [currentProject, setCurrentProject] = useState<IEntrustmentProject | null>(null);
    const [assignForm] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        setProjects([]);
        form.resetFields();
        setIsDrawerOpen(true);
    };

    const handleEdit = (record: IEntrustmentRecord) => {
        setEditingRecord(record);
        setProjects(record.projects || []);
        form.setFieldsValue(record);
        setIsDrawerOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleGenerateLink = (record: IEntrustmentRecord) => {
        const link = `${window.location.origin}/fill/${record.entrustmentId}`;
        Modal.info({
            title: '生成外部链接',
            content: (
                <div>
                    <p>委托单: {record.entrustmentId}</p>
                    <p>外部链接已生成:</p>
                    <a href={link} target="_blank" rel="noreferrer">{link}</a>
                </div>
            ),
            onOk() { },
        });
    };

    // 保存委托单
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // 自动生成 testItems 字符串 (用于列表显示)
            const testItemsStr = projects.map(p => p.name).join('、');

            const finalValues = {
                ...values,
                projects,
                testItems: testItemsStr,
                assignmentMode: 'manual'
            };

            if (editingRecord) {
                setDataSource(prev => prev.map(item => item.id === editingRecord.id ? { ...item, ...finalValues } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
                setDataSource(prev => [{ id: newId, ...finalValues }, ...prev]);
                message.success('添加成功');
            }
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    // 项目管理逻辑
    const handleAddProject = () => {
        setEditingProject(null);
        projectForm.resetFields();
        setIsProjectModalOpen(true);
    };

    const handleEditProject = (project: IEntrustmentProject) => {
        setEditingProject(project);
        projectForm.setFieldsValue(project);
        setIsProjectModalOpen(true);
    };

    const handleDeleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const handleSaveProject = async () => {
        try {
            const values = await projectForm.validateFields();
            if (editingProject) {
                setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...values } : p));
            } else {
                const newProject: IEntrustmentProject = {
                    id: Date.now().toString(),
                    status: 'pending',
                    ...values
                };
                setProjects(prev => [...prev, newProject]);
            }
            setIsProjectModalOpen(false);
        } catch (error) {
            console.error('Project Validate Failed:', error);
        }
    };

    // 任务分配/分包逻辑
    const handleOpenAssign = (project: IEntrustmentProject, type: 'internal' | 'external') => {
        if (project.status !== 'pending') {
            message.warning('任务已开始，不可修改分配');
            return;
        }
        setCurrentProject(project);
        setAssignType(type);
        assignForm.resetFields();
        assignForm.setFieldsValue({
            assignTo: project.assignTo,
            subcontractor: project.subcontractor,
            deviceId: project.deviceId,
            assignDate: project.assignDate ? dayjs(project.assignDate) : dayjs(),
            deadline: project.deadline ? dayjs(project.deadline) : undefined
        });
        setIsAssignModalOpen(true);
    };

    const handleSaveAssign = async () => {
        try {
            const values = await assignForm.validateFields();
            if (!currentProject) return;

            setProjects(prev => prev.map(p => {
                if (p.id === currentProject.id) {
                    const next: IEntrustmentProject = { ...p };

                    if ('assignTo' in values) {
                        next.assignTo = values.assignTo || undefined;
                    }
                    if ('subcontractor' in values) {
                        next.subcontractor = values.subcontractor || undefined;
                    }
                    if ('deviceId' in values) {
                        next.deviceId = values.deviceId || undefined;
                    }
                    if ('assignDate' in values) {
                        next.assignDate = values.assignDate ? values.assignDate.format('YYYY-MM-DD') : undefined;
                    }
                    if ('deadline' in values) {
                        next.deadline = values.deadline ? values.deadline.format('YYYY-MM-DD') : undefined;
                    }

                    if (!next.assignTo && !next.subcontractor) {
                        next.status = 'pending';
                    } else if (next.assignTo) {
                        next.status = 'assigned';
                    } else if (next.subcontractor) {
                        next.status = 'subcontracted';
                    }

                    return next;
                }
                return p;
            }));
            setIsAssignModalOpen(false);
            message.success('分配信息已更新');
        } catch (error) {
            console.error('Assign Validate Failed:', error);
        }
    };

    const expandedRowRender = (record: IEntrustmentRecord) => {
        const projectColumns: ColumnsType<IEntrustmentProject> = [
            { title: '项目名称', dataIndex: 'name', key: 'name' },
            {
                title: '检测参数',
                dataIndex: 'testItems',
                key: 'testItems',
                render: (items: string[]) => (
                    <Space size={[0, 8]} wrap>
                        {items.map(item => <Tag key={item}>{item}</Tag>)}
                    </Space>
                )
            },
            { title: '检测方法', dataIndex: 'method', key: 'method' },
            { title: '判定标准', dataIndex: 'standard', key: 'standard' },
            {
                title: '状态',
                key: 'status',
                render: (_, project) => {
                    let color = 'default';
                    let text = '待处理';
                    if (project.status === 'assigned') {
                        color = 'blue';
                        text = `已分配: ${project.assignTo}`;
                    } else if (project.status === 'subcontracted') {
                        color = 'orange';
                        text = `已分包: ${project.subcontractor}`;
                    } else if (project.status === 'completed') {
                        color = 'success';
                        text = '已完成';
                    }
                    return <Tag color={color}>{text}</Tag>;
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (_, project) => (
                    <Space size="small">
                        <Button
                            type="link"
                            size="small"
                            disabled={project.status !== 'pending'}
                            onClick={() => handleOpenAssign(project, 'internal')}
                        >
                            分配
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            disabled={project.status !== 'pending'}
                            onClick={() => handleOpenAssign(project, 'external')}
                        >
                            分包
                        </Button>
                    </Space>
                )
            }
        ];

        return (
            <Table
                columns={projectColumns}
                dataSource={record.projects || []}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: '暂无检测项目' }}
            />
        );
    };

    const columns: ColumnsType<IEntrustmentRecord> = [
        {
            title: '委托编号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            width: 150,
            render: (text, record) => <a onClick={() => handleEdit(record)}>{text}</a>,
        },
        { title: '委托单位', dataIndex: 'clientName', key: 'clientName', width: 200 },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName', width: 150 },
        {
            title: '订单时间',
            dataIndex: 'sampleDate',
            key: 'sampleDate',
            width: 120,
            defaultSortOrder: 'descend',
            sorter: (a, b) => new Date(a.sampleDate).getTime() - new Date(b.sampleDate).getTime()
        },
        {
            title: '检测项目',
            dataIndex: 'testItems',
            key: 'testItems',
            width: 120,
            render: (_, record) => {
                const count = record.projects?.length || 0;
                return <Tag color="blue">{count}个项目</Tag>;
            }
        },
        {
            title: '状态',
            key: 'status',
            width: 120,
            render: (_, record) => {
                const projects = record.projects || [];
                if (projects.length === 0) return <Tag>待录入</Tag>;
                const allCompleted = projects.every(p => p.status === 'completed');
                if (allCompleted) return <Tag color="success">已完成</Tag>;
                const hasAssigned = projects.some(p => p.status === 'assigned' || p.status === 'subcontracted');
                if (hasAssigned) return <Tag color="processing">进行中</Tag>;
                return <Tag color="warning">待分配</Tag>;
            }
        },
        {
            title: '跟单人',
            dataIndex: 'follower',
            key: 'follower',
            width: 100,
            render: (text) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="生成外部链接">
                        <a onClick={() => handleGenerateLink(record)}><LinkOutlined /></a>
                    </Tooltip>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="委托单管理"
            extra={<Button type="primary" onClick={handleAdd}>新建委托</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1300 }}
                expandable={{
                    expandedRowRender,
                    defaultExpandAllRows: false
                }}
            />

            {/* 编辑/新建 Drawer */}
            <Drawer
                title={editingRecord ? "编辑委托单" : "新建委托单"}
                width={800}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                extra={
                    <Space>
                        <Button onClick={() => setIsDrawerOpen(false)}>取消</Button>
                        <Button type="primary" onClick={handleSave}>保存</Button>
                    </Space>
                }
            >
                <Form form={form} layout="vertical">
                    <Divider>基本信息</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="entrustmentId" label="委托编号" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="contractNo" label="合同编号">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="clientName" label="委托单位" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="contactPerson" label="联系人">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="sampleDate" label="送样时间" rules={[{ required: true }]}>
                                <Input placeholder="YYYY.MM.DD" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="follower" label="跟进人" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>样品信息</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="sampleName" label="样品名称" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="sampleModel" label="规格型号">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="sampleMaterial" label="材质牌号">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="sampleQuantity" label="样品数量">
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isSampleReturn" label="是否退样" valuePropName="checked">
                                <Radio.Group>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>检测项目管理</Divider>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="dashed" onClick={handleAddProject} block icon={<PlusOutlined />}>
                            添加检测项目
                        </Button>
                    </div>
                    <List
                        dataSource={projects}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditProject(item)} />,
                                    <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteProject(item.id)} />
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            {item.name}
                                            {item.status === 'assigned' && <Tag color="blue">已分配: {item.assignTo}</Tag>}
                                            {item.status === 'subcontracted' && <Tag color="orange">已分包: {item.subcontractor}</Tag>}
                                            {item.status === 'pending' && <Tag>待处理</Tag>}
                                        </Space>
                                    }
                                    description={
                                        <div>
                                            <div>参数: {item.testItems.join('、')}</div>
                                            <div style={{ fontSize: 12, color: '#999' }}>
                                                方法: {item.method} | 标准: {item.standard}
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Form>
            </Drawer>

            {/* 任务分配/分包 Drawer */}
            <Drawer
                title={assignType === 'internal' ? '项目分配' : '项目分配'}
                open={isAssignModalOpen}
                width={480}
                placement="right"
                onClose={() => setIsAssignModalOpen(false)}
                extra={
                    <Space>
                        <Button onClick={() => setIsAssignModalOpen(false)}>取消</Button>
                        <Button type="primary" onClick={handleSaveAssign}>保存</Button>
                    </Space>
                }
            >
                <Form form={assignForm} layout="vertical">
                    {assignType === 'internal' ? (
                        <>
                            <Divider>内部分配</Divider>
                            <Form.Item name="assignTo" label="分配给(组织架构人员)">
                                <PersonSelector
                                    employees={orgUsers.flatMap(group =>
                                        group.users.map(user => ({
                                            id: user.id,
                                            name: user.name,
                                            position: group.department
                                        }))
                                    )}
                                />
                            </Form.Item>
                            <Form.Item name="deviceId" label="分配设备">
                                <Select
                                    allowClear
                                    placeholder="请选择设备"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {deviceData.map(device => (
                                        <Select.Option key={device.id} value={device.id}>
                                            {device.name} ({device.code})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="assignDate" label="分配时间" initialValue={dayjs()}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="deadline" label="截止时间">
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <>
                            <Divider>外部分配</Divider>
                            <Form.Item name="subcontractor" label="分包供应商(来源于供应商列表)">
                                <Select
                                    allowClear
                                    placeholder="请选择外部分配供应商"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {outsourcingSuppliers.map(supplier => (
                                        <Select.Option key={supplier.id} value={supplier.name}>
                                            {supplier.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="internalManagerId"
                                label="内部责任人"
                                rules={[{ required: true, message: '请选择内部责任人' }]}
                            >
                                <PersonSelector
                                    employees={employeeData.map(emp => ({
                                        id: emp.id,
                                        name: emp.name,
                                        position: emp.position
                                    }))}
                                />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="assignDate" label="分配时间" initialValue={dayjs()}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="deadline" label="截止时间">
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Drawer>

            {/* 项目管理 Modal */}
            <Modal
                title={editingProject ? "编辑检测项目" : "添加检测项目"}
                open={isProjectModalOpen}
                onCancel={() => setIsProjectModalOpen(false)}
                onOk={handleSaveProject}
                width={600}
            >
                <Form form={projectForm} layout="vertical">
                    <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
                        <Input placeholder="例如：混凝土抗压强度检测" />
                    </Form.Item>
                    <Form.Item name="testItems" label="检测参数" rules={[{ required: true }]}>
                        <Select mode="multiple" placeholder="请选择检测参数">
                            {detectionParametersData.map(param => (
                                <Select.Option key={param.id} value={param.name}>
                                    {param.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="method" label="检测方法">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="standard" label="判定标准">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
};

export default Entrustment;
