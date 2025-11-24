import React, { useState, useRef } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Tag, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, BarcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { sampleData } from '../../mock/entrustment';
import type { IEntrustmentSample } from '../../mock/entrustment';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';

const EntrustmentSample: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEntrustmentSample[]>(sampleData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEntrustmentSample | null>(null);
    const [currentLabelRecord, setCurrentLabelRecord] = useState<IEntrustmentSample | null>(null);
    const [form] = Form.useForm();
    const labelRef = useRef<HTMLDivElement>(null);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IEntrustmentSample) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleGenerateLabel = (record: IEntrustmentSample) => {
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

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                // Auto-generate sample number logic (mock)
                const sampleNo = `S${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${String(newId).padStart(2, '0')}`;
                setDataSource([...dataSource, { id: newId, sampleNo, ...values, status: '待检' }]);
                message.success('登记成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IEntrustmentSample> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo' },
        { title: '样品名称', dataIndex: 'name', key: 'name' },
        { title: '规格型号', dataIndex: 'spec', key: 'spec' },
        { title: '数量', dataIndex: 'quantity', key: 'quantity' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === '待检' ? 'orange' : 'green'}>{status}</Tag>
        },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleGenerateLabel(record)}><BarcodeOutlined /> 生成标签</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card title="委托样品管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>样品登记</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />

            {/* Edit/Add Modal */}
            <Modal
                title={editingRecord ? "编辑样品" : "样品登记"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="样品名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="spec" label="规格型号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="quantity" label="数量" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea />
                    </Form.Item>
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

export default EntrustmentSample;
