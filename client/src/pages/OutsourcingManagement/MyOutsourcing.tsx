import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Modal, Form, Input, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, PlayCircleOutlined, FormOutlined, CheckCircleOutlined, SwapOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { employeeData } from '../../mock/personnel';
import PersonSelector from '../../components/PersonSelector';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';

const MyOutsourcing: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = '当前用户'; // 从全局状态获取

    // 使用 ITestTask,筛选委外任务
    const [dataSource, setDataSource] = useState<ITestTask[]>(
        testTaskData.filter(t => t.isOutsourced && t.assignedTo === currentUser)
    );

    // 转交 Modal
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<ITestTask | null>(null);
    const [form] = Form.useForm();

    // 详情抽屉状态
    const [detailVisible, setDetailVisible] = useState(false);
    const [detailTask, setDetailTask] = useState<ITestTask | null>(null);

    // 统计
    const stats = {
        pending: dataSource.filter(t => t.status === '待开始').length,
        inProgress: dataSource.filter(t => t.status === '进行中').length,
        completed: dataSource.filter(t => t.status === '已完成').length,
    };

    // 开始任务
    const handleStart = (record: ITestTask) => {
        const newData = dataSource.map(item =>
            item.id === record.id ? { ...item, status: '进行中' as const } : item
        );
        setDataSource(newData);
        message.success('任务已开始');
    };

    // 完成任务
    const handleComplete = (record: ITestTask) => {
        const newData = dataSource.map(item =>
            item.id === record.id ? { ...item, status: '已完成' as const, progress: 100 } : item
        );
        setDataSource(newData);
        message.success('任务已完成');
    };

    // 转交任务
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

    // 查看详情
    const handleViewDetail = (record: ITestTask) => {
        setDetailTask(record);
        setDetailVisible(true);
    };

    // 数据录入
    const handleDataEntry = (record: ITestTask) => {
        navigate('/test-management/data-entry', { state: { task: record } });
    };

    // 获取状态颜色
    const getStatusColor = (status: ITestTask['status']) => {
        const colorMap = {
            '待开始': 'default',
            '进行中': 'processing',
            '已完成': 'success',
            '已转交': 'warning',
        };
        return colorMap[status];
    };

    // 列定义
    const columns: ColumnsType<ITestTask> = [
        {
            title: '任务编号',
            dataIndex: 'taskNo',
            key: 'taskNo',
            width: 150,
            render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>,
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            width: 150,
        },
        {
            title: '检测参数',
            dataIndex: 'parameters',
            key: 'parameters',
            width: 200,
            render: (params: string[]) => params.join(', '),
        },
        {
            title: '委外供应商',
            key: 'supplier',
            width: 200,
            render: (_, record) => (
                <div>
                    <Tag icon={<ExportOutlined />} color="blue">委外</Tag>
                    {record.outsourceInfo && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {record.outsourceInfo.supplierName}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: ITestTask['status']) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 110,
        },
        {
            title: '操作',
            key: 'action',
            width: 280,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        详情
                    </Button>
                    {record.status === '待开始' && (
                        <Button
                            type="link"
                            size="small"
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleStart(record)}
                        >
                            开始
                        </Button>
                    )}
                    {(record.status === '待开始' || record.status === '进行中') && (
                        <Button
                            type="link"
                            size="small"
                            icon={<FormOutlined />}
                            onClick={() => handleDataEntry(record)}
                        >
                            录入
                        </Button>
                    )}
                    {record.status === '进行中' && (
                        <Popconfirm
                            title="确定完成此任务吗?"
                            onConfirm={() => handleComplete(record)}
                        >
                            <Button
                                type="link"
                                size="small"
                                icon={<CheckCircleOutlined />}
                            >
                                完成
                            </Button>
                        </Popconfirm>
                    )}
                    {(record.status === '待开始' || record.status === '进行中') && (
                        <Button
                            type="link"
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
        <Card title="我的委外任务">
            {/* 统计面板 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="待开始"
                            value={stats.pending}
                            valueStyle={{ color: '#1890ff' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="进行中"
                            value={stats.inProgress}
                            valueStyle={{ color: '#faad14' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="已完成"
                            value={stats.completed}
                            valueStyle={{ color: '#52c41a' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
            </Row>

            {/* 表格 */}
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            {/* 转交 Modal */}
            <Modal
                title="转交任务"
                open={isTransferModalOpen}
                onOk={handleTransferOk}
                onCancel={() => setIsTransferModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="转交给"
                        name="toPerson"
                        rules={[{ required: true, message: '请选择转交对象' }]}
                    >
                        <PersonSelector employees={employeeData} />
                    </Form.Item>
                    <Form.Item
                        label="转交原因"
                        name="reason"
                        rules={[{ required: true, message: '请输入转交原因' }]}
                    >
                        <Input.TextArea rows={3} placeholder="请输入转交原因" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 详情抽屉 */}
            <TaskDetailDrawer
                open={detailVisible}
                task={detailTask}
                onClose={() => setDetailVisible(false)}
            />
        </Card>
    );
};

export default MyOutsourcing;
