import React, { useState, useMemo } from 'react';
import { Card, Table, Tag, Progress, Space, Input, Select, Button, Tooltip, Modal, Form, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { testTaskData, type ITestTask } from '../../mock/test';
import { entrustmentData } from '../../mock/entrustment';
import { employeeData } from '../../mock/personnel';
import dayjs from 'dayjs';
import { deviceData } from '../../mock/devices';
import PersonSelector from '../../components/PersonSelector';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';

const { Option } = Select;

// 委托单分组数据类型
interface EntrustmentGroup {
    entrustmentId: string;
    clientName: string;
    sampleDate: string;
    follower: string;
    tasks: ITestTask[];
}

const AllTasks: React.FC = () => {
    const [dataSource, setDataSource] = useState<ITestTask[]>(testTaskData);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [personFilter, setPersonFilter] = useState<string | null>(null);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningTask, setAssigningTask] = useState<ITestTask | null>(null);

    const [assignForm] = Form.useForm();

    // 详情抽屉状态
    const [detailVisible, setDetailVisible] = useState(false);
    const [detailTask, setDetailTask] = useState<ITestTask | null>(null);

    // 按委托单分组任务（只显示内部任务）
    const groupedData = useMemo(() => {
        // 过滤出内部任务
        const internalTasks = dataSource.filter(t => !t.isOutsourced);

        // 按委托单ID分组
        const groups = new Map<string, EntrustmentGroup>();

        internalTasks.forEach(task => {
            const entrustmentId = task.entrustmentId;
            if (!groups.has(entrustmentId)) {
                // 查找对应的委托单信息
                const entrustment = entrustmentData.find(e => e.entrustmentId === entrustmentId);
                groups.set(entrustmentId, {
                    entrustmentId,
                    clientName: entrustment?.clientName || '未知客户',
                    sampleDate: entrustment?.sampleDate || '',
                    follower: entrustment?.follower || '',
                    tasks: []
                });
            }
            groups.get(entrustmentId)!.tasks.push(task);
        });

        return Array.from(groups.values());
    }, [dataSource]);

    // 应用筛选
    const filteredData = useMemo(() => {
        return groupedData.filter(group => {
            // 搜索筛选
            const matchSearch = searchText === '' ||
                group.entrustmentId.toLowerCase().includes(searchText.toLowerCase()) ||
                group.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
                group.tasks.some(t =>
                    t.taskNo.toLowerCase().includes(searchText.toLowerCase()) ||
                    t.sampleName.toLowerCase().includes(searchText.toLowerCase())
                );

            // 状态筛选
            const matchStatus = !statusFilter ||
                group.tasks.some(t => t.status === statusFilter);

            // 负责人筛选
            const matchPerson = !personFilter ||
                group.tasks.some(t => t.assignedTo === personFilter);

            return matchSearch && matchStatus && matchPerson;
        });
    }, [groupedData, searchText, statusFilter, personFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case '待开始': return 'default';
            case '进行中': return 'processing';
            case '已完成': return 'success';
            case '已转交': return 'warning';
            default: return 'default';
        }
    };

    const handleOpenAssign = (task: ITestTask) => {
        setAssigningTask(task);
        assignForm.setFieldsValue({
            assignedTo: task.assignedTo || undefined,
            dueDate: task.dueDate ? dayjs(task.dueDate) : dayjs().add(7, 'day')
        });
        setIsAssignModalOpen(true);
    };

    const handleAssignOk = () => {
        assignForm.validateFields().then(values => {
            const assignedTo = values.assignedTo;
            const dueDate = values.dueDate.format('YYYY-MM-DD');
            const remark = values.remark || '';

            if (assigningTask) {
                setDataSource(dataSource.map(task =>
                    task.id === assigningTask.id
                        ? { ...task, assignedTo, dueDate, status: '待开始', remark }
                        : task
                ));
                message.success(`任务已分配给 ${assignedTo}`);
            }

            setIsAssignModalOpen(false);
            assignForm.resetFields();
        });
    };

    const handleViewDetail = (record: ITestTask) => {
        setDetailTask(record);
        setDetailVisible(true);
    };

    // 子表格：任务列表
    const taskColumns: ColumnsType<ITestTask> = [
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
            title: '检测项目',
            dataIndex: 'parameters',
            key: 'parameters',
            width: 200,
            render: (params: string[]) => (
                <>
                    {params.map(p => (
                        <Tag key={p} style={{ marginBottom: 4 }}>{p}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 90,
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: '执行人',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            width: 100,
            render: (text) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">未分配</Tag>
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 110,
        },
        {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            width: 120,
            render: (percent) => <Progress percent={percent} size="small" />
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleOpenAssign(record)}>分配</a>
                    <Tooltip title="查看明细">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // 主表格：委托单列表
    const entrustmentColumns: ColumnsType<EntrustmentGroup> = [
        {
            title: '委托单号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            width: 150,
        },
        {
            title: '客户名称',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 200,
        },
        {
            title: '收样日期',
            dataIndex: 'sampleDate',
            key: 'sampleDate',
            width: 120,
        },
        {
            title: '跟进人',
            dataIndex: 'follower',
            key: 'follower',
            width: 100,
        },
        {
            title: '任务数',
            key: 'taskCount',
            width: 80,
            render: (_, record) => record.tasks.length,
        },
        {
            title: '完成情况',
            key: 'completion',
            width: 150,
            render: (_, record) => {
                const total = record.tasks.length;
                const completed = record.tasks.filter(t => t.status === '已完成').length;
                const inProgress = record.tasks.filter(t => t.status === '进行中').length;
                return (
                    <Space size={4}>
                        <Tag color="success">{completed}完成</Tag>
                        <Tag color="processing">{inProgress}进行中</Tag>
                    </Space>
                );
            }
        },
    ];

    // 展开行渲染
    const expandedRowRender = (record: EntrustmentGroup) => {
        return (
            <Table
                columns={taskColumns}
                dataSource={record.tasks}
                rowKey="id"
                pagination={false}
                size="small"
            />
        );
    };

    // 统计数据
    const allTasks = dataSource.filter(t => !t.isOutsourced);
    const unassignedCount = allTasks.filter(t => !t.assignedTo).length;
    const inProgressCount = allTasks.filter(t => t.status === '进行中').length;
    const completedCount = allTasks.filter(t => t.status === '已完成').length;

    return (
        <Card
            title="全部任务"
            bordered={false}
            extra={
                <Space>
                    <Tag color="orange">未分配: {unassignedCount}</Tag>
                    <Tag color="processing">进行中: {inProgressCount}</Tag>
                    <Tag color="success">已完成: {completedCount}</Tag>
                </Space>
            }
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="搜索委托单号/客户/任务号"
                    prefix={<SearchOutlined />}
                    style={{ width: 240 }}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
                <Select
                    placeholder="任务状态"
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
                columns={entrustmentColumns}
                dataSource={filteredData}
                rowKey="entrustmentId"
                expandable={{
                    expandedRowRender,
                    defaultExpandAllRows: false,
                }}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `共 ${total} 个委托单`
                }}
            />

            {/* 任务分配对话框 */}
            <Modal
                title="任务分配"
                open={isAssignModalOpen}
                onOk={handleAssignOk}
                onCancel={() => {
                    setIsAssignModalOpen(false);
                    assignForm.resetFields();
                }}
                width={500}
            >
                {assigningTask && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                        <div><strong>任务编号:</strong> {assigningTask.taskNo}</div>
                        <div><strong>样品名称:</strong> {assigningTask.sampleName}</div>
                        <div><strong>检测参数:</strong> {assigningTask.parameters.join(', ')}</div>
                    </div>
                )}

                <Form form={assignForm} layout="vertical">
                    <Form.Item
                        name="assignedTo"
                        label="分配给"
                        rules={[{ required: true, message: '请选择负责人' }]}
                    >
                        <PersonSelector
                            employees={employeeData.map(emp => ({
                                id: emp.id,
                                name: emp.name,
                                position: emp.position
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="deviceId"
                        label="使用设备"
                    >
                        <Select placeholder="选择设备" allowClear showSearch>
                            {deviceData.map(device => (
                                <Option key={device.id} value={device.id}>
                                    {device.name} ({device.code})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dueDate"
                        label="截止日期"
                        rules={[{ required: true, message: '请选择截止日期' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="remark" label="备注说明">
                        <Input.TextArea rows={3} placeholder="可选：添加任务说明或要求" />
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

export default AllTasks;
