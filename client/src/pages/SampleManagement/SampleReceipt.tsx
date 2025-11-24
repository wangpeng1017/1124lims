import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message, InputNumber, Descriptions, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { sampleReceiptData, type ISampleReceipt } from '../../mock/sample';
import { entrustmentData } from '../../mock/entrustment';
import { sampleData } from '../../mock/entrustment';

const SampleReceipt: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISampleReceipt[]>(sampleReceiptData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISampleReceipt | null>(null);
    const [selectedEntrustment, setSelectedEntrustment] = useState<string>('');
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedEntrustment('');
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISampleReceipt) => {
        setEditingRecord(record);
        setSelectedEntrustment(record.entrustmentId);
        form.setFieldsValue({
            ...record,
            receivedBy: record.receivedBy,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleEntrustmentChange = (entrustmentId: string) => {
        setSelectedEntrustment(entrustmentId);
        // 获取该委托单的样品列表
        // 实际应根据委托单ID筛选，此处模拟返回所有
        const relatedSamples = sampleData;

        // 自动设置样品编号和价格明细
        const sampleIds = relatedSamples.map(s => s.sampleNo);
        const priceDetails = relatedSamples.map(s => ({
            sampleNo: s.sampleNo,
            price: 0 // 待手动输入
        }));

        form.setFieldsValue({
            sampleIds,
            priceDetails
        });
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const totalPrice = values.priceDetails?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, totalPrice, entrustmentId: selectedEntrustment }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const receiptNo = `SY${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(newId).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    receiptNo,
                    ...values,
                    entrustmentId: selectedEntrustment,
                    totalPrice,
                    status: '待确认'
                }]);
                message.success('收样成功');
            }
            setIsModalOpen(false);
        });
    };

    const handleConfirm = (id: number) => {
        setDataSource(dataSource.map(item =>
            item.id === id ? { ...item, status: '已确认' } : item
        ));
        message.success('确认成功');
    };

    const columns: ColumnsType<ISampleReceipt> = [
        { title: '收样单号', dataIndex: 'receiptNo', key: 'receiptNo' },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        {
            title: '样品数量',
            key: 'sampleCount',
            render: (_, record) => record.sampleIds.length
        },
        { title: '收样日期', dataIndex: 'receiptDate', key: 'receiptDate' },
        { title: '收样人', dataIndex: 'receivedBy', key: 'receivedBy' },
        {
            title: '总计价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `¥${price.toLocaleString()}`
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === '已确认' ? 'green' : 'orange'}>{status}</Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>查看</a>
                    {record.status === '待确认' && (
                        <a onClick={() => handleConfirm(record.id)}>确认</a>
                    )}
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="收样/计价管理"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建收样单</Button>}
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "查看收样单" : "新建收样单"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
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
                                <Descriptions.Item label="委托单号">{selectedEntrustment}</Descriptions.Item>
                                <Descriptions.Item label="样品名称">
                                    {entrustmentData.find(e => e.entrustmentId === selectedEntrustment)?.sampleName}
                                </Descriptions.Item>
                            </Descriptions>

                            <Form.Item name="receivedBy" label="收样人" rules={[{ required: true }]}>
                                <Input placeholder="输入收样人姓名" />
                            </Form.Item>

                            <Form.Item name="receiptDate" label="收样日期" rules={[{ required: true }]}>
                                <Input type="date" />
                            </Form.Item>

                            <Form.List name="priceDetails">
                                {(fields) => (
                                    <>
                                        <div style={{ marginBottom: 8, fontWeight: 'bold' }}>价格明细</div>
                                        {fields.map((field) => (
                                            <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'sampleNo']}
                                                    style={{ marginBottom: 0, width: 200 }}
                                                >
                                                    <Input placeholder="样品编号" disabled />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: '请输入价格' }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <InputNumber
                                                        placeholder="价格"
                                                        min={0}
                                                        prefix="¥"
                                                        style={{ width: 150 }}
                                                    />
                                                </Form.Item>
                                            </Space>
                                        ))}
                                    </>
                                )}
                            </Form.List>

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

export default SampleReceipt;
