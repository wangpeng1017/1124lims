import React, { useState } from 'react';
import { Table, Card, Tag, Row, Col, Statistic, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { deviceData } from '../../mock/devices';
import type { Device } from '../../mock/devices';


const DeviceManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<Device[]>(deviceData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Device | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Device) => {
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
                const maxId = dataSource.length > 0 ? Math.max(...dataSource.map(d => parseInt(d.id) || 0)) : 0;
                const newId = (maxId + 1).toString();
                setDataSource(prev => [{ id: newId, ...values } as Device, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<Device> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0),
        },
        {
            title: '名称及型号',
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
            title: '编号',
            dataIndex: 'code',
            key: 'code',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索编号"
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
                record.code
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: '运行', value: 'Running' },
                { text: '维修', value: 'Maintenance' },
                { text: '闲置', value: 'Idle' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = 'green';
                if (status === 'Maintenance') color = 'red';
                if (status === 'Idle') color = 'orange';
                return (
                    <Tag color={color} key={status}>
                        {status === 'Running' ? '运行' : status === 'Maintenance' ? '维修' : '闲置'}
                    </Tag>
                );
            },
        },
        {
            title: '利用率',
            dataIndex: 'utilization',
            key: 'utilization',
            render: (text) => `${text}%`,
            sorter: (a, b) => a.utilization - b.utilization,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}><Card><Statistic title="设备总数" value={dataSource.length} /></Card></Col>
                <Col span={8}><Card><Statistic title="运行中" value={dataSource.filter(d => d.status === 'Running').length} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                <Col span={8}><Card><Statistic title="平均利用率" value={dataSource.length ? (dataSource.reduce((acc, cur) => acc + cur.utilization, 0) / dataSource.length).toFixed(1) : 0} suffix="%" /></Card></Col>
            </Row>

            <Card title="设备列表" extra={<Button type="primary" onClick={handleAdd}>新增设备</Button>}>
                <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingRecord ? "编辑设备" : "新增设备"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="名称及型号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Running">运行</Select.Option>
                            <Select.Option value="Maintenance">维修</Select.Option>
                            <Select.Option value="Idle">闲置</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="utilization" label="利用率 (%)" rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DeviceManagement;
