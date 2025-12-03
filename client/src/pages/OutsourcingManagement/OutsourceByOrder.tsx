import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Descriptions, message, Tag, Popconfirm, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DingdingOutlined } from '@ant-design/icons';
import { outsourceOrderData, type IOutsourceOrder } from '../../mock/outsourcing';
import { supplierData } from '../../mock/supplier';
import { entrustmentData } from '../../mock/entrustment';
import { sampleDetailData } from '../../mock/sample';
import { employeeData } from '../../mock/personnel';
import PersonSelector from '../../components/PersonSelector';

const OutsourceByOrder: React.FC = () => {
    const [dataSource, setDataSource] = useState<IOutsourceOrder[]>(outsourceOrderData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IOutsourceOrder | null>(null);
    const [selectedEntrustment, setSelectedEntrustment] = useState<string>('');
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedEntrustment('');
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IOutsourceOrder) => {
        setEditingRecord(record);
        setSelectedEntrustment(record.entrustmentId);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleEntrustmentChange = (entrustmentId: string) => {
        setSelectedEntrustment(entrustmentId);
        // 获取该委托单的样品
        // In real app, filter by entrustmentId. Here we just take some mock data.
        const relatedSamples = sampleDetailData.slice(0, 2);
        const sampleIds = relatedSamples.map(s => s.sampleNo);
        form.setFieldsValue({
            sampleIds,
            sampleCount: sampleIds.length
        });
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const supplier = supplierData.find(s => s.id === values.supplierId);

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, supplierName: supplier?.name || '' }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const today = new Date();
                const outsourceNo = `WW-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(newId).padStart(3, '0')}`;

                // 获取内部责任人信息
                const internalManagerEmployee = employeeData.find(e => e.id === values.internalManagerId);

                setDataSource([...dataSource, {
                    id: newId,
                    outsourceNo,
                    ...values,
                    entrustmentId: selectedEntrustment,
                    supplierName: supplier?.name || '',
                    internalManager: internalManagerEmployee?.name || '',
                    approvalStatus: '待审批',
                    status: '待确认',
                    assignedBy: '当前用户',
                    assignDate: new Date().toISOString().split('T')[0]
                }]);
                message.success('提交成功，等待钉钉审批');
            }
            setIsModalOpen(false);
        });
    };

    const handleApprove = (record: IOutsourceOrder) => {
        // 模拟钉钉审批通过
        setDataSource(dataSource.map(item =>
            item.id === record.id
                ? { ...item, approvalStatus: '已通过', approvalId: `DD-${new Date().getTime()}`, status: '已发送' }
                : item
        ));
        message.success('审批通过');
    };

    const columns: ColumnsType<IOutsourceOrder> = [
        { title: '委外单号', dataIndex: 'outsourceNo', key: 'outsourceNo', width: 150 },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 130 },
        { title: '样品数量', dataIndex: 'sampleCount', key: 'sampleCount', width: 100 },
        { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180, ellipsis: true },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (price) => `¥${price.toLocaleString()}`
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待审批': 'warning',
                    '已通过': 'success',
                    '已拒绝': 'error'
                };
                return <Tag color={colorMap[status]} icon={<DingdingOutlined />}>{status}</Tag>;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待确认': 'default',
                    '已发送': 'processing',
                    '检测中': 'blue',
                    '已完成': 'success',
                    '已终止': 'error'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        { title: '分配日期', dataIndex: 'assignDate', key: 'assignDate', width: 120 },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>查看</a>
                    {record.approvalStatus === '待审批' && (
                        <a onClick={() => handleApprove(record)}>审批</a>
                    )}
                    {record.status === '待确认' && (
                        <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                            <a style={{ color: 'red' }}>删除</a>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const activeSuppliers = supplierData.filter(s => s.cooperationStatus === 'active');

    return (
        <Card
            title="委外分配（委托单）"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建委外单</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingRecord ? "查看委外单" : "新建委外单"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="entrustmentId"
                        label="委托单号"
                        rules={[{ required: true, message: '请选择委托单' }]}
                    >
                        <Select
                            placeholder="选择委托单"
                            onChange={handleEntrustmentChange}
                            disabled={!!editingRecord}
                        >
                            {entrustmentData.map(e => (
                                <Select.Option key={e.entrustmentId} value={e.entrustmentId}>
                                    {e.entrustmentId} - {e.sampleName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedEntrustment && (
                        <>
                            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
                                <Descriptions.Item label="样品数量">
                                    {form.getFieldValue('sampleCount')}
                                </Descriptions.Item>
                                <Descriptions.Item label="样品编号">
                                    {form.getFieldValue('sampleIds')?.join(', ')}
                                </Descriptions.Item>
                            </Descriptions>

                            <Form.Item
                                name="supplierId"
                                label="供应商"
                                rules={[{ required: true, message: '请选择供应商' }]}
                            >
                                <Select placeholder="选择供应商">
                                    {activeSuppliers.map(s => (
                                        <Select.Option key={s.id} value={s.id}>
                                            {s.name} ({s.evaluationLevel}级)
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="internalManagerId"
                                label="内部责任人"
                                rules={[{ required: true, message: '请选择内部责任人' }]}
                            >
                                <PersonSelector
                                    employees={employeeData.map(emp => ({
                                        id: emp.id,
                                        name: emp.name,
                                        position: emp.position
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item name="testItems" label="委外检测项目" rules={[{ required: true }]}>
                                <Select mode="tags" placeholder="输入或选择检测项目">
                                    <Select.Option value="成分分析">成分分析</Select.Option>
                                    <Select.Option value="特殊性能测试">特殊性能测试</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="remark" label="备注">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </Card>
    );
};

export default OutsourceByOrder;
