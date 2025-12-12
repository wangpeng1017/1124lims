import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Select, Input, Badge, Statistic, Row, Col, Modal, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    FilterOutlined,
} from '@ant-design/icons';
import todoApi, { type ITodo, type ITodoStats, TODO_TYPE_MAP, PRIORITY_MAP, TODO_STATUS_MAP } from '../services/todoApi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const MyTodos: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ITodo[]>([]);
    const [stats, setStats] = useState<ITodoStats>({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, urgent: 0 });
    const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>();
    const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    const getCurrentUserId = (): number => {
        const userStr = localStorage.getItem('user');
        if (userStr) { try { return JSON.parse(userStr).id || 1; } catch { return 1; } }
        return 1;
    };

    const loadData = async (params: { current?: number; size?: number } = {}) => {
        setLoading(true);
        try {
            const userId = getCurrentUserId();
            const [listRes, statsRes] = await Promise.all([
                todoApi.myTodos({ current: params.current || pagination.current, size: params.size || pagination.pageSize, userId, status: statusFilter }),
                todoApi.getStats(userId),
            ]);
            if (listRes.code === 200 && listRes.data) {
                setDataSource(listRes.data.records || []);
                setPagination(prev => ({ ...prev, current: listRes.data?.current || 1, total: listRes.data?.total || 0 }));
            }
            if (statsRes.code === 200 && statsRes.data) { setStats(statsRes.data); }
        } catch (error) {
            console.error('加载待办失败:', error);
            message.error('加载数据失败');
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, [statusFilter]);

    // 过滤数据
    const filteredData = dataSource.filter(item => {
        const matchSearch =
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.relatedNo && item.relatedNo.toLowerCase().includes(searchText.toLowerCase()));
        const matchType = typeFilter ? item.type === typeFilter : true;
        const matchPriority = priorityFilter ? item.priority === priorityFilter : true;
        const matchStatus = statusFilter ? item.status === statusFilter : true;

        return matchSearch && matchType && matchPriority && matchStatus;
    });


    const handleComplete = (record: ITodo) => {
        Modal.confirm({
            title: '确认完成',
            content: `确认完成待办事项：${record.title}？`,
            onOk: () => {
                setDataSource(dataSource.map(item =>
                    item.id === record.id
                        ? { ...item, status: 'completed' as const }
                        : item
                ));
                message.success('待办事项已完成');
            },
        });
    };

    const handleProcess = (record: ITodo) => {
        setDataSource(dataSource.map(item =>
            item.id === record.id
                ? { ...item, status: 'in_progress' as const }
                : item
        ));
        message.success('已开始处理');
    };

    const handleView = (record: ITodo) => {
        if (record.link) {
            navigate(record.link);
        } else {
            message.info('暂无关联页面');
        }
    };

    const columns: ColumnsType<ITodo> = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type) => {
                const typeInfo = TODO_TYPE_MAP[type as keyof typeof TODO_TYPE_MAP];
                return (
                    <Tag color={typeInfo.color}>
                        {typeInfo.icon} {typeInfo.text}
                    </Tag>
                );
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <a onClick={() => handleView(record)}>{text}</a>
                    {record.relatedNo && (
                        <span style={{ fontSize: '12px', color: '#888' }}>
                            关联编号: {record.relatedNo}
                        </span>
                    )}
                </Space>
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 90,
            render: (priority) => {
                const priorityInfo = PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP];
                return <Tag color={priorityInfo.color}>{priorityInfo.text}</Tag>;
            },
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 120,
            render: (date, record) => {
                const isOverdue = dayjs(date).isBefore(dayjs(), 'day');
                const isToday = dayjs(date).isSame(dayjs(), 'day');
                return (
                    <span style={{
                        color: isOverdue ? '#ff4d4f' : isToday ? '#faad14' : undefined,
                        fontWeight: (isOverdue || isToday) ? 'bold' : undefined
                    }}>
                        {date}
                        {isOverdue && ' (已逾期)'}
                        {isToday && ' (今天)'}
                    </span>
                );
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const statusInfo = TODO_STATUS_MAP[status as keyof typeof TODO_STATUS_MAP];
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleView(record)}
                    >
                        查看
                    </Button>
                    {record.status === 'pending' && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleProcess(record)}
                        >
                            开始处理
                        </Button>
                    )}
                    {(record.status === 'pending' || record.status === 'in_progress') && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleComplete(record)}
                        >
                            完成
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="全部待办"
                            value={stats.total}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="待处理"
                            value={stats.pending}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="处理中"
                            value={stats.inProgress}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="已完成"
                            value={stats.completed}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="已逾期"
                            value={stats.overdue}
                            valueStyle={{ color: '#ff4d4f' }}
                            prefix={<ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="紧急"
                            value={stats.urgent}
                            valueStyle={{ color: '#ff4d4f' }}
                            prefix={<ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 待办列表 */}
            <Card
                title={
                    <Space>
                        <span>我的待办</span>
                        <Badge count={stats.pending + stats.inProgress} />
                    </Space>
                }
                bordered={false}
            >
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input
                        placeholder="搜索标题/描述/编号"
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        onChange={e => setSearchText(e.target.value)}
                        allowClear
                    />
                    <Select
                        placeholder="待办类型"
                        style={{ width: 150 }}
                        allowClear
                        onChange={setTypeFilter}
                        suffixIcon={<FilterOutlined />}
                    >
                        {Object.entries(TODO_TYPE_MAP).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value.icon} {value.text}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="优先级"
                        style={{ width: 120 }}
                        allowClear
                        onChange={setPriorityFilter}
                        suffixIcon={<FilterOutlined />}
                    >
                        {Object.entries(PRIORITY_MAP).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value.text}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="状态"
                        style={{ width: 120 }}
                        allowClear
                        onChange={setStatusFilter}
                        suffixIcon={<FilterOutlined />}
                    >
                        {Object.entries(TODO_STATUS_MAP).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value.text}
                            </Option>
                        ))}
                    </Select>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条待办`,
                    }}
                    rowClassName={(record) => {
                        if (record.status === 'overdue') return 'row-overdue';
                        if (record.priority === 'urgent') return 'row-urgent';
                        return '';
                    }}
                />
            </Card>

            <style>{`
                .row-overdue {
                    background-color: #fff1f0;
                }
                .row-urgent {
                    background-color: #fff7e6;
                }
            `}</style>
        </div>
    );
};

export default MyTodos;
