import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { sampleTaskAssignmentData, type ISampleTaskAssignment, sampleDetailData } from '../../mock/sample';
import { employeeData } from '../../mock/personnel';

const SampleTaskAssignment: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISampleTaskAssignment[]>(sampleTaskAssignmentData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISampleTaskAssignment | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISampleTaskAssignment) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };



    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const taskNo = `TASK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(newId).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    taskNo,
                    ...values,
                    assignedBy: '当前用户', // 实际应从登录信息获取
                    assignDate: new Date().toISOString().split('T')[0],
                    status: '待开始'
                }]);
                message.success('分配成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ISampleTaskAssignment> = [
        { title: '任务编号', dataIndex: 'taskNo', key: 'taskNo' },
        {
            title: '样品编号',
            dataIndex: 'sampleIds',
            key: 'sampleIds',
            render: (sampleIds: string[]) => (
                <div>{sampleIds.map(id => <Tag key={id}>{id}</Tag>)}</div>
            )
        },
        { title: '分配给', dataIndex: 'assignedTo', key: 'assignedTo' },
        { title: '分配人', dataIndex: 'assignedBy', key: 'assignedBy' },
        { title: '分配日期', dataIndex: 'assignDate', key: 'assignDate' },
        { title: '截止日期', dataIndex: 'dueDate', key: 'dueDate' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待开始': 'default',
                    '进行中': 'processing',
                    '已完成': 'success'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>查看</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 获取待分配的样品（已收样但未分配）
    const availableSamples = sampleDetailData.filter(s => s.status === '已收样');

    return (
        <Card
            title="任务分配（样品）"
            extra={
                <Space>

                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建任务</Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "查看任务" : "新建任务"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="sampleIds"
                        label="选择样品"
                        rules={[{ required: true, message: '请选择样品' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="选择待分配的样品"
                            disabled={!!editingRecord}
                        >
                            {availableSamples.map(sample => (
                                <Select.Option key={sample.sampleNo} value={sample.sampleNo}>
                                    {sample.sampleNo} - {sample.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="assignedTo"
                        label="分配给"
                        rules={[{ required: true, message: '请选择人员' }]}
                    >
                        <Select placeholder="选择检测人员">
                            {employeeData.map(emp => (
                                <Select.Option key={emp.id} value={emp.name}>
                                    {emp.name} - {emp.position}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dueDate"
                        label="截止日期"
                        rules={[{ required: true }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SampleTaskAssignment;
