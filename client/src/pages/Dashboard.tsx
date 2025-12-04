import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Progress, Badge, List } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    TeamOutlined,
    ExperimentOutlined,
    DollarOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { todoData, getTodoStats, TODO_TYPE_MAP, type ITodo } from '../mock/todo';
import { testTaskData } from '../mock/test';
import { quotationData } from '../mock/quotationData';
import { contractData } from '../mock/contract';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const todoStats = getTodoStats(todoData);

    // 任务统计
    const taskStats = {
        total: testTaskData.length,
        pending: testTaskData.filter(t => t.status === '待开始').length,
        inProgress: testTaskData.filter(t => t.status === '进行中').length,
        completed: testTaskData.filter(t => t.status === '已完成').length,
    };

    // 报价单统计
    const quotationStats = {
        total: quotationData.length,
        pending: quotationData.filter(q => q.status.includes('pending')).length,
        approved: quotationData.filter(q => q.status === 'approved').length,
        rejected: quotationData.filter(q => q.status === 'rejected').length,
    };

    // 合同统计
    const contractStats = {
        total: contractData.length,
        draft: contractData.filter(c => c.status === 'draft').length,
        signed: contractData.filter(c => c.status === 'signed').length,
        executing: contractData.filter(c => c.status === 'executing').length,
    };

    // 待办事项列表（只显示前5条）
    const urgentTodos = todoData
        .filter(t => t.status === 'pending' || t.status === 'in_progress')
        .sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 5);

    // 任务进度图表
    const taskProgressOption = {
        title: {
            text: '任务进度统计',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '任务状态',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: taskStats.pending, name: '待开始' },
                    { value: taskStats.inProgress, name: '进行中' },
                    { value: taskStats.completed, name: '已完成' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    // 报价单趋势图表
    const quotationTrendOption = {
        title: {
            text: '报价单审批趋势',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ['12-01', '12-02', '12-03', '12-04', '12-05'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '新增报价单',
                type: 'line',
                data: [2, 3, 1, 2, 1],
                smooth: true,
            },
            {
                name: '已批准',
                type: 'line',
                data: [1, 2, 1, 1, 2],
                smooth: true,
            },
        ],
    };

    const todoColumns: ColumnsType<ITodo> = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type) => {
                const typeInfo = TODO_TYPE_MAP[type];
                return <Tag color={typeInfo.color}>{typeInfo.icon} {typeInfo.text}</Tag>;
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
                            value={taskStats.inProgress}
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
                                percent={Math.round((taskStats.completed / taskStats.total) * 100)}
                                size="small"
                                status="active"
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="报价单"
                            value={quotationStats.pending}
                            prefix={<FileTextOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    待审批
                                </span>
                            }
                            valueStyle={{ color: '#faad14' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Tag color="success">已批准: {quotationStats.approved}</Tag>
                            <Tag color="error">已拒绝: {quotationStats.rejected}</Tag>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="委托合同"
                            value={contractStats.executing}
                            prefix={<DollarOutlined />}
                            suffix={
                                <span style={{ fontSize: 14, color: '#999' }}>
                                    执行中
                                </span>
                            }
                            valueStyle={{ color: '#722ed1' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Tag color="default">草稿: {contractStats.draft}</Tag>
                            <Tag color="success">已签订: {contractStats.signed}</Tag>
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
                                { title: '报价管理', icon: <FileTextOutlined />, link: '/entrustment/quotation', color: '#1890ff' },
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

            {/* 底部图表区 */}
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <ReactECharts option={taskProgressOption} style={{ height: 300 }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <ReactECharts option={quotationTrendOption} style={{ height: 300 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
