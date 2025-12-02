import React, { useState } from 'react';
import { Card, Table, Tag, Progress, Space, Input, Select, Button, Tooltip, Modal, Form, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { employeeData } from '../../mock/personnel';
import dayjs from 'dayjs';


const { Option } = Select;

const AllTasks: React.FC = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<ITestTask[]>(testTaskData);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [personFilter, setPersonFilter] = useState<string | null>(null);
    const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<string | null>(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<ITestTask[]>([]);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningTask, setAssigningTask] = useState<ITestTask | null>(null);
    const [isBatchAssign, setIsBatchAssign] = useState(false);

    const [assignForm] = Form.useForm();

    // 过滤数据
    const filteredData = dataSource.filter(item => {
        const matchSearch =
            item.taskNo.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sampleName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sampleNo.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = statusFilter ? item.status === statusFilter : true;
        const matchPerson = personFilter ? item.assignedTo === personFilter : true;

        // 分配状态筛选
        let matchAssignmentStatus = true;
        if (assignmentStatusFilter === 'unassigned') {
            matchAssignmentStatus = !item.assignedTo || item.assignedTo === '';
        } else if (assignmentStatusFilter === 'assigned') {
            matchAssignmentStatus = !!item.assignedTo && item.assignedTo !== '';
        }

        return matchSearch && matchStatus && matchPerson && matchAssignmentStatus;
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

    const handleOpenAssign = (task?: ITestTask) => {
        if (task) {
            // 单个任务分配
            setAssigningTask(task);
            setIsBatchAssign(false);
            assignForm.setFieldsValue({
                assignedTo: task.assignedTo || undefined,
                dueDate: task.dueDate ? dayjs(task.dueDate) : dayjs().add(7, 'day')
            });
        } else {
            // 批量分配
            setIsBatchAssign(true);
            assignForm.resetFields();
            assignForm.setFieldsValue({
                dueDate: dayjs().add(7, 'day')
            });
        }
        setIsAssignModalOpen(true);
    };

    const handleAssignOk = () => {
        assignForm.validateFields().then(values => {
            const assignedTo = values.assignedTo;
            const dueDate = values.dueDate.format('YYYY-MM-DD');
            const remark = values.remark || '';

            if (isBatchAssign) {
                // 批量分配
                const taskIds = selectedTasks.map(t => t.id);
                setDataSource(dataSource.map(task =>
                    taskIds.includes(task.id)
                        ? { ...task, assignedTo, dueDate, status: '待开始', remark }
                        : task
                ));
                message.success(`成功分配 ${selectedTasks.length} 个任务给 ${assignedTo}`);
                setSelectedRowKeys([]);
                setSelectedTasks([]);
            } else if (assigningTask) {
                // 单个任务分配
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

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: ITestTask[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedTasks(selectedRows);
        },
        getCheckboxProps: (record: ITestTask) => ({
            disabled: record.status === '已完成', // 已完成的任务不能重新分配
        }),
    };

    const columns: ColumnsType<ITestTask> = [
        {
            title: '任务编号',
            dataIndex: 'taskNo',
            key: 'taskNo',
            width: 150,
            render: (text) => <a>{text}</a>,
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            width: 150,
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <span>{text}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{record.sampleNo}</span>
                </Space>
            )
        },
        {
            title: '检测参数',
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
            title: '负责人',
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
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
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
            width: 90,
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    {!record.assignedTo && (
                        <a onClick={() => handleOpenAssign(record)}>分配</a>
                    )}
                    {record.assignedTo && record.status !== '已完成' && (
                        <a onClick={() => handleOpenAssign(record)}>改派</a>
                    )}
                    <Tooltip title="查看明细">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/test-management/task-details/${record.taskNo}`)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const unassignedCount = dataSource.filter(t => !t.assignedTo).length;
    const inProgressCount = dataSource.filter(t => t.status === '进行中').length;
    const completedCount = dataSource.filter(t => t.status === '已完成').length;

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
                    placeholder="搜索任务号/样品名称"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
                <Select
                    placeholder="分配状态"
                    style={{ width: 120 }}
                    allowClear
                    onChange={setAssignmentStatusFilter}
                >
                    <Option value="unassigned">未分配</Option>
                    <Option value="assigned">已分配</Option>
                </Select>
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
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    disabled={selectedTasks.length === 0}
                    onClick={() => handleOpenAssign()}
                >
                    批量分配 ({selectedTasks.length})
                </Button>
            </Space>

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `共 ${total} 条任务`
                }}
            />

            {/* 任务分配对话框 */}
            <Modal
                title={isBatchAssign ? `批量分配任务 (${selectedTasks.length}个)` : '任务分配'}
                open={isAssignModalOpen}
                onOk={handleAssignOk}
                onCancel={() => {
                    setIsAssignModalOpen(false);
                    assignForm.resetFields();
                }}
                width={500}
            >
                {isBatchAssign && selectedTasks.length > 0 && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>待分配任务:</div>
                        {selectedTasks.map(task => (
                            <div key={task.id} style={{ fontSize: '12px', color: '#666' }}>
                                • {task.taskNo} - {task.sampleName}
                            </div>
                        ))}
                    </div>
                )}

                {!isBatchAssign && assigningTask && (
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
                        <Select placeholder="选择负责人" showSearch>
                            {employeeData.map(emp => (
                                <Option key={emp.id} value={emp.name}>
                                    {emp.name} - {emp.position}
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
        </Card>
    );
};

export default AllTasks;
