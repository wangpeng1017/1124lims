import React, { useState } from 'react';
import { Card, Table, Tag, Progress, Space, Input, Select, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { employeeData } from '../../mock/personnel';
import { entrustmentData } from '../../mock/entrustment';

const { Option } = Select;

const TestTasks: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [personFilter, setPersonFilter] = useState<string | null>(null);

    // 过滤数据
    const filteredData = testTaskData.filter(item => {
        const matchSearch =
            item.taskNo.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sampleName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sampleNo.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = statusFilter ? item.status === statusFilter : true;
        const matchPerson = personFilter ? item.assignedTo === personFilter : true;
        return matchSearch && matchStatus && matchPerson;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case '待开始': return 'default';
            case '进行中': return 'processing';
            case '已完成': return 'success';
            case '已转交': return 'warning';
            default: return 'default';
        }
    };

    const columns: ColumnsType<ITestTask> = [
        {
            title: '任务编号',
            dataIndex: 'taskNo',
            key: 'taskNo',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <span>{text}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{record.sampleNo}</span>
                </Space>
            )
        },
        {
            title: '分配模式',
            key: 'assignmentMode',
            render: (_, record) => {
                const entrustment = entrustmentData.find(e => e.entrustmentId === record.entrustmentId);
                const mode = entrustment?.assignmentMode || 'manual';
                return (
                    <Tag color={mode === 'automatic' ? 'blue' : 'orange'}>
                        {mode === 'automatic' ? '自动分配' : '人工分配'}
                    </Tag>
                );
            }
        },
        {
            title: '检测参数',
            dataIndex: 'parameters',
            key: 'parameters',
            render: (params: string[]) => (
                <>
                    {params.map(p => (
                        <Tag key={p} style={{ marginBottom: 4 }}>{p}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '负责人',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag color={priority === 'Urgent' ? 'red' : 'green'}>
                    {priority === 'Urgent' ? '紧急' : '普通'}
                </Tag>
            )
        },
        {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            width: 150,
            render: (percent) => <Progress percent={percent} size="small" />
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="查看明细">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/test-management/task-details/${record.taskNo}`)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card title="检测任务总览" bordered={false}>
            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="搜索任务号/样品名称"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    onChange={e => setSearchText(e.target.value)}
                />
                <Select
                    placeholder="状态筛选"
                    style={{ width: 120 }}
                    allowClear
                    onChange={setStatusFilter}
                >
                    <Option value="待开始">待开始</Option>
                    <Option value="进行中">进行中</Option>
                    <Option value="已完成">已完成</Option>
                    <Option value="已转交">已转交</Option>
                </Select>
                <Select
                    placeholder="负责人筛选"
                    style={{ width: 120 }}
                    allowClear
                    onChange={setPersonFilter}
                >
                    <Option value="当前用户">当前用户</Option>
                    {employeeData.map(emp => (
                        <Option key={emp.id} value={emp.name}>{emp.name}</Option>
                    ))}
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default TestTasks;
