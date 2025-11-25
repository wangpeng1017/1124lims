import React, { useState } from 'react';
import { Table, Card, Tag, Statistic, Row, Col, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { consumablesData } from '../../mock/consumables';
import type { IConsumableInfo } from '../../mock/consumables';

const Consumables: React.FC = () => {
    const [dataSource, setDataSource] = useState<IConsumableInfo[]>(consumablesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IConsumableInfo | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IConsumableInfo) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
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
                const newId = Date.now();
                setDataSource(prev => [{ id: newId, ...values, totalInQuantity: 0, totalOutQuantity: 0, status: '正常' as const }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };



    // ... (inside component)

    const columns: ColumnsType<IConsumableInfo> = [
        { title: '物料编号', dataIndex: 'id', key: 'id' },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索名称"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={() => clearFilters && clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.name
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
        },
        {
            title: '规格型号',
            dataIndex: 'spec',
            key: 'spec',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索规格"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={() => clearFilters && clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.specification
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
        },
        { title: '单位', dataIndex: 'unit', key: 'unit' },
        {
            title: '库存',
            dataIndex: 'currentStock',
            key: 'currentStock',
            render: (currentStock, record) => (
                <span style={{ color: currentStock <= record.minStock ? 'red' : 'inherit', fontWeight: currentStock <= record.minStock ? 'bold' : 'normal' }}>
                    {currentStock}
                </span>
            ),
            sorter: (a, b) => a.currentStock - b.currentStock,
        },
        { title: '库位', dataIndex: 'location', key: 'location' },
        {
            title: '类别',
            dataIndex: 'category',
            key: 'category',
            filters: Array.from(new Set(consumablesData.map(c => c.category))).map(c => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
            render: (text) => <Tag>{text}</Tag>
        },
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
                <Col span={8}><Card><Statistic title="库存预警" value={dataSource.filter(c => c.currentStock <= c.minStock).length} valueStyle={{ color: '#cf1322' }} /></Card></Col>
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
