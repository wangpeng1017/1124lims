import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Progress, Badge, List, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    ExperimentOutlined,
    DollarOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import todoApi, { type ITodo, type ITodoStats, TODO_TYPE_MAP } from '../services/todoApi';
import { request } from '../services/api';

// Dashboard统计接口
interface DashboardStats {
    taskStats: {
        pending: number;
        in_progress: number;
        completed: number;
        total: number;
    };
    reportStats: {
        draft: number;
        pending_review: number;
        approved: number;
        issued: number;
        total: number;
    };
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [todoStats, setTodoStats] = useState<ITodoStats>({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        urgent: 0,
    });
    const [urgentTodos, setUrgentTodos] = useState<ITodo[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        taskStats: { pending: 0, in_progress: 0, completed: 0, total: 0 },
        reportStats: { draft: 0, pending_review: 0, approved: 0, issued: 0, total: 0 },
    });

    // 获取当前用户ID
    const getCurrentUserId = (): number => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id || 1;
            } catch {
                return 1;
            }
        }
        return 1;
    };

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const userId = getCurrentUserId();

                // 并行请求多个API
                const [todoStatsRes, myTodosRes, taskStatsRes, reportStatsRes] = await Promise.all([
                    todoApi.getStats(userId),
                    todoApi.myTodos({ userId, size: 5, status: 'pending' }),
                    request.get<Record<string, number>>('/dashboard/task-stats'),
                    request.get<Record<string, number>>('/dashboard/report-stats'),
                ]);

                // 处理待办统计
                if (todoStatsRes.code === 200 && todoStatsRes.data) {
                    setTodoStats(todoStatsRes.data);
                }

                // 处理紧急待办列表
                if (myTodosRes.code === 200 && myTodosRes.data?.records) {
                    // 按优先级排序，取前5条
                    const sortedTodos = [...myTodosRes.data.records]
                        .filter(t => t.status === 'pending' || t.status === 'in_progress')
                        .sort((a, b) => {
                            const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
                            return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
                        })
                        .slice(0, 5);
                    setUrgentTodos(sortedTodos);
                }

                // 处理任务统计
                if (taskStatsRes.code === 200 && taskStatsRes.data) {
                    const stats = taskStatsRes.data;
                    const total = (stats.pending || 0) + (stats.in_progress || 0) + (stats.completed || 0);
                    setDashboardStats(prev => ({
                        ...prev,
                        taskStats: {
                            pending: stats.pending || 0,
                            in_progress: stats.in_progress || 0,
                            completed: stats.completed || 0,
                            total,
                        },
                    }));
                }

                // 处理报告统计
                if (reportStatsRes.code === 200 && reportStatsRes.data) {
                    const stats = reportStatsRes.data;
                    const total = (stats.draft || 0) + (stats.pending_review || 0) +
                                  (stats.approved || 0) + (stats.issued || 0);
                    setDashboardStats(prev => ({
                        ...prev,
                        reportStats: {
                            draft: stats.draft || 0,
                            pending_review: stats.pending_review || 0,
                            approved: stats.approved || 0,
                            issued: stats.issued || 0,
                            total,
                        },
                    }));
                }
            } catch (error) {
                console.error('加载Dashboard数据失败:', error);
                message.error('加载数据失败，请刷新页面重试');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const todoColumns: ColumnsType<ITodo> = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => {
                const typeInfo = TODO_TYPE_MAP[type];
                if (typeInfo) {
                    return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
                }
                return <Tag>{type}</Tag>;
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 120,
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <a onClick={() => record.link && navigate(record.link)}>查看</a>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    const { taskStats, reportStats } = dashboardStats;

    return (
        <div style={{ padding: '24px' }}>
            {/* 顶部统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="待办事项"
                            value={todoStats.pending + todoStats.inProgress}
                            prefix={<ClockCircleOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    / {todoStats.total}
                                </span>
                            }
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Tag color="red">紧急: {todoStats.urgent}</Tag>
                            <Tag color="orange">逾期: {todoStats.overdue}</Tag>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="检测任务"
                            value={taskStats.in_progress}
                            prefix={<ExperimentOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    / {taskStats.total}
                                </span>
                            }
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Progress
                                percent={taskStats.total > 0
                                    ? Math.round((taskStats.completed / taskStats.total) * 100)
                                    : 0}
                                size="small"
                                status="active"
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="报告审核"
                            value={reportStats.pending_review}
                            prefix={<FileTextOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    待审核
                                </span>
                            }
                            valueStyle={{ color: '#faad14' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Tag color="success">已批准: {reportStats.approved}</Tag>
                            <Tag color="blue">已签发: {reportStats.issued}</Tag>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="任务统计"
                            value={taskStats.pending}
                            prefix={<DollarOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    待处理
                                </span>
                            }
                            valueStyle={{ color: '#722ed1' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Tag color="processing">进行中: {taskStats.in_progress}</Tag>
                            <Tag color="success">已完成: {taskStats.completed}</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 中间内容区 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <ExclamationCircleOutlined />
                                <span>紧急待办</span>
                                <Badge count={urgentTodos.length} />
                            </Space>
                        }
                        extra={<a onClick={() => navigate('/my-todos')}>查看全部</a>}
                    >
                        <Table
                            columns={todoColumns}
                            dataSource={urgentTodos}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: '暂无紧急待办' }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <RiseOutlined />
                                <span>快速入口</span>
                            </Space>
                        }
                    >
                        <List
                            grid={{ gutter: 16, column: 2 }}
                            dataSource={[
                                { title: '委托管理', icon: <FileTextOutlined />, link: '/entrustment/list', color: '#1890ff' },
                                { title: '合同管理', icon: <FileTextOutlined />, link: '/entrustment/contract', color: '#52c41a' },
                                { title: '任务管理', icon: <ExperimentOutlined />, link: '/task-management/all-tasks', color: '#faad14' },
                                { title: '样品管理', icon: <ExperimentOutlined />, link: '/sample-management/receipt', color: '#722ed1' },
                                { title: '报告管理', icon: <FileTextOutlined />, link: '/report-management/test-reports', color: '#13c2c2' },
                                { title: '审批中心', icon: <CheckCircleOutlined />, link: '/approval-center', color: '#eb2f96' },
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card
                                        hoverable
                                        onClick={() => navigate(item.link)}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <div style={{ fontSize: 32, color: item.color, marginBottom: 8 }}>
                                            {item.icon}
                                        </div>
                                        <div>{item.title}</div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
