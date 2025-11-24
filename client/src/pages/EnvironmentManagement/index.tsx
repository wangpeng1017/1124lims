import React, { useState } from 'react';
import { Card, Select, Typography, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Table, Badge, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { environmentData } from '../../mock/environment';
import type { EnvironmentRecord } from '../../mock/environment';

const { Option } = Select;
const { Title } = Typography;

const EnvironmentManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<EnvironmentRecord[]>(environmentData);
    const [filterLocation, setFilterLocation] = useState<string>('All');
    const [searchText, setSearchText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EnvironmentRecord | null>(null);
    const [form] = Form.useForm();

    const locations = Array.from(new Set(dataSource.map(d => d.location)));
    const filteredData = dataSource.filter(d => {
        const matchLocation = filterLocation === 'All' || d.location === filterLocation;
        const matchName = d.room.toLowerCase().includes(searchText.toLowerCase());
        return matchLocation && matchName;
    });

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: EnvironmentRecord) => {
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
                const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
                setDataSource(prev => [{ id: newId, ...values }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<EnvironmentRecord> = [
        { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
        { title: '房间名称', dataIndex: 'room', key: 'room' },
        {
            title: '温度 (℃)',
            dataIndex: 'temperature',
            key: 'temperature',
            render: (temp) => <span style={{ color: temp > 26 ? '#cf1322' : '#3f8600' }}>{temp}</span>,
            sorter: (a, b) => a.temperature - b.temperature,
        },
        {
            title: '湿度 (%)',
            dataIndex: 'humidity',
            key: 'humidity',
            render: (hum) => <span style={{ color: '#3f8600' }}>{hum}</span>,
            sorter: (a, b) => a.humidity - b.humidity,
        },
        {
            title: '状态',
            key: 'status',
            render: () => <Badge status="processing" text="正常" />
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
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>环境监控列表</Title>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="搜索房间名称"
                        style={{ width: 200 }}
                        prefix={<SearchOutlined />}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Select defaultValue="All" style={{ width: 120 }} onChange={setFilterLocation}>
                        <Option value="All">全部区域</Option>
                        {locations.map(loc => <Option key={loc} value={loc}>{loc}</Option>)}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增监控点</Button>
                </div>
            </div>

            <Card>
                <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingRecord ? "编辑监控点" : "新增监控点"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="location" label="位置" rules={[{ required: true }]}>
                        <Select>
                            <Option value="一层">一层</Option>
                            <Option value="二层">二层</Option>
                            <Option value="三层">三层</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="room" label="房间名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="temperature" label="温度 (℃)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="humidity" label="湿度 (%)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EnvironmentManagement;
