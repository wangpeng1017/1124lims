import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Tag, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import { sampleData } from '../../mock/entrustment';
import type { IEntrustmentSample } from '../../mock/entrustment';

const EntrustmentSample: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEntrustmentSample[]>(sampleData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEntrustmentSample | null>(null);
    const [form] = Form.useForm();

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

    const handlePrint = (record: IEntrustmentSample) => {
        message.success(`正在打印样品标签: ${record.sampleNo}`);
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
                    <a onClick={() => handlePrint(record)}><PrinterOutlined /> 打印标签</a>
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
        </Card>
    );
};

export default EntrustmentSample;
