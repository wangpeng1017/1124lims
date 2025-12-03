import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Select, Input, message, Popconfirm, Badge, Row, Col, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlayCircleOutlined, FormOutlined, CheckCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { employeeData } from '../../mock/personnel';
import { deviceData } from '../../mock/devices';
import PersonSelector from '../../components/PersonSelector';
import dayjs from 'dayjs';

const MyTasks: React.FC = () => {
    const navigate = useNavigate();
    // 模拟只显示分配给"当前用户"的任务
    const [dataSource, setDataSource] = useState<ITestTask[]>(
        testTaskData.filter(t => t.assignedTo === '当前用户')
    );
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<ITestTask | null>(null);
    const [form] = Form.useForm();

    const handleStart = (record: ITestTask) => {
        const newData = dataSource.map(item =>
            item.id === record.id ? { ...item, status: '进行中' as const } : item
        );
        setDataSource(newData);
        message.success('任务已开始');
    };

    const handleComplete = (record: ITestTask) => {
        const newData = dataSource.map(item =>
            item.id === record.id ? { ...item, status: '已完成' as const, progress: 100 } : item
        );
        setDataSource(newData);
        message.success('任务已完成');
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

    const columns: ColumnsType<ITestTask> = [
        {
            title: '任务编号',
            dataIndex: 'taskNo',
            key: 'taskNo',
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
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
                            <Form.Item
                                name="deviceId"
                                label="使用设备"
                            >
                                <Select placeholder="选择设备" allowClear showSearch>
                                    {deviceData.map(device => (
                                        <Select.Option key={device.id} value={device.id}>
                                            {device.name} ({device.code})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="assignDate"
                                        label="改派时间"
                                        initialValue={dayjs()}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="deadline"
                                        label="截止时间"
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="reason"
                                label="转交原因"
                                rules={[{ required: true, message: '请填写原因' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            );
        };

    export default MyTasks;
