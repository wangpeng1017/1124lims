import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, message, Popconfirm, Badge, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlayCircleOutlined, FormOutlined, CheckCircleOutlined, SwapOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { type ITestTask } from '../../mock/test';
import { employeeData } from '../../mock/personnel';
import PersonSelector from '../../components/PersonSelector';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';
import { useTaskService } from '../../services/useDataService';


const MyTasks: React.FC = () => {
    const navigate = useNavigate();
    // 使用API服务
    const { loading, data: apiData, fetchMyTasks, start, complete } = useTaskService();
    const [dataSource, setDataSource] = useState<ITestTask[]>([]);

    // 初始化加载数据
    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    // 同步API数据（只显示内部任务）
    useEffect(() => {
        if (apiData && apiData.length > 0) {
            setDataSource((apiData as any).filter((t: any) => !t.isOutsourced));
        }
    }, [apiData]);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<ITestTask | null>(null);
    const [form] = Form.useForm();

    // 详情抽屉状态
    const [detailVisible, setDetailVisible] = useState(false);
    const [detailTask, setDetailTask] = useState<ITestTask | null>(null);

    const handleStart = async (record: ITestTask) => {
        const result = await start(record.id);
        if (result.success) {
            fetchMyTasks();
        }
    };

    const handleComplete = async (record: ITestTask) => {
        const result = await complete(record.id);
        if (result.success) {
            fetchMyTasks();
        }
    };

    const handleTransferClick = (record: ITestTask) => {
        setCurrentTask(record);
        form.resetFields();
        setIsTransferModalOpen(true);
    };

    const handleTransferOk = () => {
        form.validateFields().then(values => {
            if (currentTask) {
                // 模拟转交：从当前列表移除
                const newData = dataSource.filter(item => item.id !== currentTask.id);
                setDataSource(newData);
                message.success(`任务已转交给 ${values.toPerson}`);
                setIsTransferModalOpen(false);
            }
        });
    };

    const handleViewDetail = (record: ITestTask) => {
        setDetailTask(record);
        setDetailVisible(true);
    };

    const columns: ColumnsType<ITestTask> = [
        {
            title: '任务编号',
            dataIndex: 'taskNo',
            key: 'taskNo',
            render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>,
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
        },
        {
            title: '任务类型',
            key: 'taskType',
            width: 120,
            render: (_, record) => (
                <>
                    {record.isOutsourced ? (
                        <Tag icon={<ExportOutlined />} color="blue">
                            委外
                        </Tag>
                    ) : (
                        <Tag color="green">内部</Tag>
                    )}
                    {record.isOutsourced && record.outsourceInfo && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {record.outsourceInfo.supplierName}
                        </div>
                    )}
                </>
            ),
        },
        {
            title: '检测参数',
            dataIndex: 'parameters',
            key: 'parameters',
            render: (params: string[]) => (
                <Space size={[0, 8]} wrap>
                    {params.map(p => <Tag key={p}>{p}</Tag>)}
                </Space>
            )
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => {
                const isOverdue = new Date(date) < new Date();
                return <span style={{ color: isOverdue ? 'red' : 'inherit' }}>{date}</span>;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap: Record<string, any> = {
                    '待开始': 'default',
                    '进行中': 'processing',
                    '已完成': 'success',
                };
                return <Badge status={statusMap[status]} text={status} />;
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="查看明细">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                        >
                            查看
                        </Button>
                    </Tooltip>
                    {record.status === '待开始' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleStart(record)}
                        >
                            开始
                        </Button>
                    )}
                    {record.status === '进行中' && (
                        <>
                            <Button
                                type="default"
                                size="small"
                                icon={<FormOutlined />}
                                onClick={() => navigate('/test-management/data-entry', { state: { taskNo: record.taskNo } })}
                            >
                                录入
                            </Button>
                            <Popconfirm title="确认完成任务?" onConfirm={() => handleComplete(record)}>
                                <Button
                                    type="primary"
                                    ghost
                                    size="small"
                                    icon={<CheckCircleOutlined />}
                                >
                                    完成
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {record.status !== '已完成' && (
                        <Button
                            type="text"
                            size="small"
                            icon={<SwapOutlined />}
                            onClick={() => handleTransferClick(record)}
                        >
                            转交
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="我的检测任务"
            bordered={false}
            extra={<span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>任务管理 - 查看、开始、完成和转交任务</span>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />

            <Modal
                title="转交任务"
                open={isTransferModalOpen}
                onOk={handleTransferOk}
                onCancel={() => setIsTransferModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="当前任务">
                        <span>{currentTask?.taskNo} - {currentTask?.sampleName}</span>
                    </Form.Item>
                    <Form.Item
                        name="toPerson"
                        label="转交给"
                        rules={[{ required: true, message: '请选择接收人' }]}
                    >
                        <PersonSelector
                            employees={employeeData.filter(e => e.name !== '当前用户').map(emp => ({
                                id: emp.id,
                                name: emp.name,
                                position: emp.position
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="reason" label="转交原因">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            <TaskDetailDrawer
                open={detailVisible}
                task={detailTask}
                onClose={() => setDetailVisible(false)}
            />
        </Card>
    );
};

export default MyTasks;
