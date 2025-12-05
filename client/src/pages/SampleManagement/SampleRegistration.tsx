import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message, InputNumber, Descriptions, Tag, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, BarcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { type ISampleDetail } from '../../mock/sample';
import { entrustmentData } from '../../mock/entrustment';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import { useSampleService } from '../../services/useDataService';

const SampleRegistration: React.FC = () => {
    // 使用API服务
    const { loading, data: apiData, fetchList, create, update, remove } = useSampleService();
    const [dataSource, setDataSource] = useState<ISampleDetail[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISampleDetail | null>(null);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [currentLabelRecord, setCurrentLabelRecord] = useState<ISampleDetail | null>(null);
    const [selectedEntrustment, setSelectedEntrustment] = useState<string>('');
    const [form] = Form.useForm();
    const labelRef = useRef<HTMLDivElement>(null);

    // 初始化加载数据
    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // 同步API数据
    useEffect(() => {
        if (apiData && apiData.length > 0) {
            setDataSource(apiData as any);
        }
    }, [apiData]);

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedEntrustment('');
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISampleDetail) => {
        setEditingRecord(record);
        setSelectedEntrustment(record.entrustmentId);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await remove(id);
        if (result.success) {
            fetchList();
        }
    };

    const handleGenerateLabel = (record: ISampleDetail) => {
        setCurrentLabelRecord(record);
        setIsLabelModalOpen(true);
    };

    const handleDownloadLabel = async () => {
        if (labelRef.current) {
            try {
                const canvas = await html2canvas(labelRef.current);
                const link = document.createElement('a');
                link.download = `Label_${currentLabelRecord?.sampleNo}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                message.success('标签下载成功');
            } catch (error) {
                message.error('标签生成失败');
                console.error(error);
            }
        }
    };

    const handleEntrustmentChange = (entrustmentId: string) => {
        setSelectedEntrustment(entrustmentId);
        const entrustment = entrustmentData.find(e => e.entrustmentId === entrustmentId);
        if (entrustment) {
            form.setFieldsValue({
                name: entrustment.sampleName,
            });
        }
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
                // Auto-generate sample number
                const sampleNo = `S${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(newId).padStart(3, '0')}`;
                const receiptDate = new Date().toISOString().split('T')[0];

                setDataSource([...dataSource, {
                    id: newId,
                    sampleNo,
                    receiptId: newId,
                    entrustmentId: selectedEntrustment,
                    receiptDate,
                    receiptPerson: '当前用户',
                    name: values.name,
                    spec: values.spec,
                    quantity: values.quantity,
                    totalQuantity: values.quantity,
                    unit: values.unit,
                    remainingQuantity: values.quantity,
                    status: '已收样'
                }]);
                message.success('收样登记成功');
            }
            setIsModalOpen(false);
        });
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            '待收样': 'default',
            '已收样': 'processing',
            '已分配': 'blue',
            '检测中': 'orange',
            '已完成': 'green',
            '已归还': 'purple',
            '已销毁': 'red'
        };
        return colorMap[status] || 'default';
    };

    const columns: ColumnsType<ISampleDetail> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo', width: 150 },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 150 },
        { title: '样品名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '规格型号', dataIndex: 'spec', key: 'spec', width: 120 },
        { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
        { title: '收样日期', dataIndex: 'receiptDate', key: 'receiptDate', width: 110 },
        { title: '收样人', dataIndex: 'receiptPerson', key: 'receiptPerson', width: 100 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            width: 250,
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleGenerateLabel(record)}><BarcodeOutlined /> 标签</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="收样登记"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建收样</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />

            {/* Add/Edit Modal */}
            <Modal
                title={editingRecord ? "编辑样品" : "收样登记"}
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
                                <Descriptions.Item label="委托单号">{selectedEntrustment}</Descriptions.Item>
                                <Descriptions.Item label="样品名称">
                                    {entrustmentData.find(e => e.entrustmentId === selectedEntrustment)?.sampleName}
                                </Descriptions.Item>
                            </Descriptions>

                            <Tabs
                                defaultActiveKey="1"
                                items={[
                                    {
                                        key: '1',
                                        label: '样品信息',
                                        children: (
                                            <>
                                                <Form.Item name="name" label="样品名称" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="spec" label="规格型号" rules={[{ required: true }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="quantity" label="样品总量" rules={[{ required: true }]}>
                                                    <InputNumber min={1} style={{ width: '100%' }} />
                                                </Form.Item>
                                                <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请选择单位' }]} initialValue="个">
                                                    <Select placeholder="选择单位">
                                                        <Select.Option value="个">个</Select.Option>
                                                        <Select.Option value="件">件</Select.Option>
                                                        <Select.Option value="批">批</Select.Option>
                                                        <Select.Option value="kg">kg</Select.Option>
                                                        <Select.Option value="g">g</Select.Option>
                                                        <Select.Option value="L">L</Select.Option>
                                                        <Select.Option value="mL">mL</Select.Option>
                                                        <Select.Option value="m">m</Select.Option>
                                                        <Select.Option value="m²">m²</Select.Option>
                                                        <Select.Option value="m³">m³</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </>
                    )}
                </Form>
            </Modal>

            {/* Label Generation Modal */}
            <Modal
                title="样品标签生成"
                open={isLabelModalOpen}
                onCancel={() => setIsLabelModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsLabelModalOpen(false)}>关闭</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadLabel}>下载标签</Button>
                ]}
                width={400}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        background: '#fff',
                        border: '1px solid #f0f0f0'
                    }}
                >
                    <div ref={labelRef} style={{ padding: '20px', background: 'white', textAlign: 'center' }}>
                        {currentLabelRecord && (
                            <>
                                <Barcode value={currentLabelRecord.sampleNo} width={2} height={60} fontSize={14} />
                                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                                    <div>样品编号: {currentLabelRecord.sampleNo}</div>
                                    <div>样品名称: {currentLabelRecord.name}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default SampleRegistration;
