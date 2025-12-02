import React, { useState } from 'react';
import { Table, Card, Tag, Space, Button, Drawer, Form, Input, Popconfirm, message, Tooltip, Select, Row, Col, Divider, List, Radio, Modal } from 'antd';
import { LinkOutlined, FileExcelOutlined, TableOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { entrustmentData } from '../../mock/entrustment';
import type { IEntrustmentRecord, IEntrustmentProject } from '../../mock/entrustment';
import { detectionParametersData, elnTemplatesData } from '../../mock/basicParameters';
import type { ELNTemplate } from '../../mock/basicParameters';
import DynamicFormRenderer from '../../components/DynamicFormRenderer';

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

    // Preview Modal State
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<ELNTemplate | null>(null);
    const [previewForm] = Form.useForm();

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

    const handlePreview = (template: ELNTemplate) => {
        setPreviewTemplate(template);
        setIsPreviewModalOpen(true);
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
        setCurrentProject(project);
        setAssignType(type);
        assignForm.resetFields();
        if (type === 'internal' && project.assignTo) {
            assignForm.setFieldsValue({ assignTo: project.assignTo });
        } else if (type === 'external' && project.subcontractor) {
            assignForm.setFieldsValue({ subcontractor: project.subcontractor });
        }
        setIsAssignModalOpen(true);
    };

    const handleSaveAssign = async () => {
        try {
            const values = await assignForm.validateFields();
            if (!currentProject) return;

            setProjects(prev => prev.map(p => {
                if (p.id === currentProject.id) {
                    if (assignType === 'internal') {
                        return { ...p, status: 'assigned', assignTo: values.assignTo };
                    } else {
                        return { ...p, status: 'subcontracted', subcontractor: values.subcontractor };
                    }
                }
                return p;
            }));
            setIsAssignModalOpen(false);
            message.success(assignType === 'internal' ? '任务分配成功' : '委外分包成功');
        } catch (error) {
            console.error('Assign Validate Failed:', error);
        }
    };

    const columns: ColumnsType<IEntrustmentRecord> = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 70 },
        {
            title: '委托编号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            width: 150,
            render: (text, record) => <a onClick={() => handleEdit(record)}>{text}</a>,
        },
        { title: '委托单位', dataIndex: 'clientName', key: 'clientName', width: 200 },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName', width: 150 },
        { title: '送样时间', dataIndex: 'sampleDate', key: 'sampleDate', width: 120 },
        {
            title: '检测项目',
            dataIndex: 'testItems',
            key: 'testItems',
            ellipsis: true,
            render: (text, record) => {
                const count = record.projects?.length || 0;
                return (
                    <Space>
                        <Tag color="blue">{count}个项目</Tag>
                        {text}
                    </Space>
                );
            }
        },
        {
            title: '状态',
            key: 'status',
            width: 120,
            render: (_, record) => {
                // 简单根据项目状态汇总
                const projects = record.projects || [];
                if (projects.length === 0) return <Tag>待录入</Tag>;
                const allCompleted = projects.every(p => p.status === 'completed');
                if (allCompleted) return <Tag color="success">已完成</Tag>;
                const hasAssigned = projects.some(p => p.status === 'assigned' || p.status === 'subcontracted');
                if (hasAssigned) return <Tag color="processing">进行中</Tag>;
                return <Tag color="warning">待处理</Tag>;
            }
        },
        {
            title: '检测模板',
            key: 'templates',
            width: 200,
            render: (_, record) => {
                // Determine parameters: use projects testItems if available, otherwise split testItems string
                const params = record.projects && record.projects.length > 0
                    ? record.projects.flatMap(p => p.testItems)
                    : (record.testItems ? record.testItems.split('、') : []);

                // Find matching templates
                const templates = params
                    .map((param: string) => elnTemplatesData.find(t => t.parameterName === param))
                    .filter((t): t is ELNTemplate => !!t);

                if (templates.length === 0) {
                    return <span style={{ color: '#ccc' }}>无关联模板</span>;
                }

                // Deduplicate templates
                const uniqueTemplates = Array.from(new Set(templates.map(t => t.id)))
                    .map(id => templates.find(t => t.id === id)!);

                return (
                    <Space direction="vertical" size={0}>
                        {uniqueTemplates.map((t: ELNTemplate) => (
                            <Tag
                                key={t.id}
                                icon={<FileExcelOutlined />}
                                color="success"
                                style={{ cursor: 'pointer', marginBottom: 2 }}
                                onClick={() => handlePreview(t)}
                            >
                                {t.name}
                            </Tag>
                        ))}
                    </Space>
                );
            }
        },
        {
            title: '检测内容',
            key: 'content',
            width: 100,
            render: (_, record) => {
                const params = record.projects && record.projects.length > 0
                    ? record.projects.flatMap(p => p.testItems)
                    : (record.testItems ? record.testItems.split('、') : []);

                const templates = params
                    .map((param: string) => elnTemplatesData.find(t => t.parameterName === param))
                    .filter((t): t is ELNTemplate => !!t);

                return (
                    <Button
                        size="small"
                        icon={<TableOutlined />}
                        disabled={templates.length === 0}
                        onClick={() => {
                            if (templates.length > 0) {
                                handlePreview(templates[0]);
                            }
                        }}
                    >
                        查看
                    </Button>
                );
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
            <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1500 }} />

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
                                    <Button type="link" size="small" icon={<UserOutlined />} onClick={() => handleOpenAssign(item, 'internal')}>分配</Button>,
                                    <Button type="link" size="small" icon={<GlobalOutlined />} onClick={() => handleOpenAssign(item, 'external')}>分包</Button>,
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

            {/* 项目编辑 Modal */}
            <Modal
                title={editingProject ? "编辑项目" : "添加项目"}
                open={isProjectModalOpen}
                onOk={handleSaveProject}
                onCancel={() => setIsProjectModalOpen(false)}
            >
                <Form form={projectForm} layout="vertical">
                    <Form.Item name="name" label="项目名称" rules={[{ required: true }]} tooltip="如: 力学性能、金相分析">
                        <Input />
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
                    <Form.Item name="method" label="检测方法" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="standard" label="判定标准" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 任务分配/分包 Modal */}
            <Modal
                title={assignType === 'internal' ? "内部任务分配" : "委外分包"}
                open={isAssignModalOpen}
                onOk={handleSaveAssign}
                onCancel={() => setIsAssignModalOpen(false)}
            >
                <Form form={assignForm} layout="vertical">
                    {assignType === 'internal' ? (
                        <Form.Item name="assignTo" label="分配给(实验室/人员)" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="力学实验室">力学实验室</Select.Option>
                                <Select.Option value="金相实验室">金相实验室</Select.Option>
                                <Select.Option value="化学实验室">化学实验室</Select.Option>
                                <Select.Option value="张三">张三</Select.Option>
                                <Select.Option value="李四">李四</Select.Option>
                            </Select>
                        </Form.Item>
                    ) : (
                        <Form.Item name="subcontractor" label="分包供应商" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="SGS">SGS</Select.Option>
                                <Select.Option value="华测检测">华测检测</Select.Option>
                                <Select.Option value="国轻检测">国轻检测</Select.Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal
                title={`模板预览: ${previewTemplate?.name || ''}`}
                open={isPreviewModalOpen}
                onCancel={() => setIsPreviewModalOpen(false)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                {previewTemplate && (
                    <Form form={previewForm} layout="vertical">
                        <DynamicFormRenderer template={previewTemplate} />
                    </Form>
                )}
            </Modal>
        </Card>
    );
};

export default Entrustment;
