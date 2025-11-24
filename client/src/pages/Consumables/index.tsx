import React, { useState } from 'react';
import { Table, Card, Tag, Statistic, Row, Col, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { consumablesData } from '../../mock/consumables';
import type { Consumable } from '../../mock/consumables';

const Consumables: React.FC = () => {
    const [dataSource, setDataSource] = useState<Consumable[]>(consumablesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Consumable | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Consumable) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRecord) {
                setDataSource(prev => prev.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                // Simple ID generation for demo
                const newId = String(Date.now());
                setDataSource(prev => [{ id: newId, ...values, totalIn: 0, totalOut: 0 }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<Consumable> = [
        { title: '物料编号', dataIndex: 'id', key: 'id' },
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '规格型号', dataIndex: 'spec', key: 'spec' },
        { title: '单位', dataIndex: 'unit', key: 'unit' },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <span style={{ color: stock <= 2 ? 'red' : 'inherit', fontWeight: stock <= 2 ? 'bold' : 'normal' }}>
                    {stock}
                </span>
            ),
            sorter: (a, b) => a.stock - b.stock,
        },
        { title: '库位', dataIndex: 'location', key: 'location' },
        { title: '类别', dataIndex: 'category', key: 'category', render: (text) => <Tag>{text}</Tag> },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}><Card><Statistic title="总物料种类" value={dataSource.length} /></Card></Col>
                <Col span={8}><Card><Statistic title="库存预警" value={dataSource.filter(c => c.stock <= 2).length} valueStyle={{ color: '#cf1322' }} /></Card></Col>
            </Row>

            <Card title="易耗品库存管理" extra={<Button type="primary" onClick={handleAdd}>新增物料</Button>}>
                <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingRecord ? "编辑物料" : "新增物料"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="spec" label="规格型号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="stock" label="当前库存" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="location" label="库位">
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="类别" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Consumables;
