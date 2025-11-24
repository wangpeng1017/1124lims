import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, Popconfirm, message, Tag, Badge, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { parameterTaskAssignmentData, type IParameterTaskAssignment, sampleDetailData } from '../../mock/sample';
import { employeeData, capabilityData, reviewData } from '../../mock/personnel';
import { detectionParametersData } from '../../mock/basicParams';

const ParameterTaskAssignment: React.FC = () => {
    const [dataSource, setDataSource] = useState<IParameterTaskAssignment[]>(parameterTaskAssignmentData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IParameterTaskAssignment | null>(null);
    const [selectedParameter, setSelectedParameter] = useState<number | null>(null);
    const [qualifiedPersonnel, setQualifiedPersonnel] = useState<string[]>([]);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedParameter(null);
        setQualifiedPersonnel([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IParameterTaskAssignment) => {
        setEditingRecord(record);
        setSelectedParameter(record.parameterId);
        setQualifiedPersonnel(record.qualifiedPersonnel);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleParameterChange = (parameterId: number) => {
        setSelectedParameter(parameterId);

        const parameter = detectionParametersData.find((p: any) => p.id === parameterId);
        if (!parameter) return;

        const qualified: string[] = [];
        employeeData.forEach(emp => {
            const hasCapability = capabilityData.some(cap =>
                cap.empName === emp.name && cap.parameter === parameter.name
            );
            const isReviewed = reviewData.some((review: any) =>
                review.empName === emp.name && review.examResult === 'Pass'
            );
            if (hasCapability && isReviewed) {
                qualified.push(emp.name);
            }
        });

        setQualifiedPersonnel(qualified);
        form.setFieldValue('qualifiedPersonnel', qualified);

        if (qualified.length === 0) {
            message.warning('该参数暂无合格人员，请先完成能力评审');
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const parameter = detectionParametersData.find((p: any) => p.id === values.parameterId);

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, parameterName: parameter?.name || '' }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const taskNo = `PTASK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(newId).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    taskNo,
                    ...values,
                    parameterName: parameter?.name || '',
                    assignedBy: '当前用户',
                    assignDate: new Date().toISOString().split('T')[0],
                    status: '待开始'
                }]);
                message.success('分配成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IParameterTaskAssignment> = [
        { title: '任务编号', dataIndex: 'taskNo', key: 'taskNo' },
        { title: '检测参数', dataIndex: 'parameterName', key: 'parameterName' },
        {
            title: '样品编号',
            dataIndex: 'sampleIds',
            key: 'sampleIds',
            render: (sampleIds: string[]) => (
                <div>{sampleIds.map(id => <Tag key={id}>{id}</Tag>)}</div>
            )
        },
        { title: '分配给', dataIndex: 'assignedTo', key: 'assignedTo' },
        {
            title: '有资质人员',
            dataIndex: 'qualifiedPersonnel',
            key: 'qualifiedPersonnel',
            render: (personnel: string[]) => (
                <Tooltip title={personnel.join(', ')}>
                    <Badge count={personnel.length} showZero>
                        <SafetyCertificateOutlined style={{ fontSize: 18 }} />
                    </Badge>
                </Tooltip>
            )
        },
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

    const availableSamples = sampleDetailData.filter(s => s.status === '已收样' || s.status === '已分配');

    return (
        <Card
            title="任务分配（参数）"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建任务</Button>}
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
                        name="parameterId"
                        label="检测参数/项目"
                        rules={[{ required: true, message: '请选择检测参数' }]}
                    >
                        <Select
                            placeholder="选择检测参数"
                            onChange={handleParameterChange}
                            disabled={!!editingRecord}
                        >
                            {detectionParametersData.map((param: any) => (
                                <Select.Option key={param.id} value={param.id}>
                                    {param.name} - {param.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedParameter && (
                        <>
                            <Form.Item label="有资质人员">
                                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                                    {qualifiedPersonnel.length > 0 ? (
                                        qualifiedPersonnel.map(name => (
                                            <Tag key={name} color="green" icon={<SafetyCertificateOutlined />}>
                                                {name}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Tag color="red">暂无合格人员</Tag>
                                    )}
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="sampleIds"
                                label="选择样品"
                                rules={[{ required: true, message: '请选择样品' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="选择待检测的样品"
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
                                <Select placeholder="选择有资质的检测人员">
                                    {qualifiedPersonnel.map(name => (
                                        <Select.Option key={name} value={name}>
                                            <SafetyCertificateOutlined style={{ color: 'green', marginRight: 4 }} />
                                            {name}
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

                            <Form.Item name="qualifiedPersonnel" hidden>
                                <Input />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </Card>
    );
};

export default ParameterTaskAssignment;
