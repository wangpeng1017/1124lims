import React, { useState } from 'react';
import { Table, Card, Tag, Row, Col, Statistic, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Drawer, Descriptions, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { deviceData } from '../../mock/devices';
import type { IDeviceInfo } from '../../mock/devices';

const DeviceInfo: React.FC = () => {
    const [dataSource, setDataSource] = useState<IDeviceInfo[]>(deviceData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IDeviceInfo | null>(null);
    const [viewingRecord, setViewingRecord] = useState<IDeviceInfo | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IDeviceInfo) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleView = (record: IDeviceInfo) => {
        setViewingRecord(record);
        setIsDrawerOpen(true);
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
                const newDevice = {
                    id: newId,
                    ...values,
                    createTime: new Date().toISOString(),
                    updateTime: new Date().toISOString()
                } as IDeviceInfo;
                setDataSource(prev => [newDevice, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<IDeviceInfo> = [
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
            width: 150,
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
                record.code.toLowerCase().includes((value as string).toLowerCase()),
        },
        {
            title: '资产类型',
            dataIndex: 'assetType',
            key: 'assetType',
            width: 120,
            filters: [
                { text: '精密仪器', value: 'instrument' },
                { text: '辅助设备', value: 'device' },
                { text: '玻璃量器', value: 'glassware' },
            ],
            onFilter: (value, record) => record.assetType === value,
            render: (type) => {
                const map: any = { instrument: '精密仪器', device: '辅助设备', glassware: '玻璃量器' };
                return <Tag color="blue">{map[type] || type}</Tag>;
            }
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => <a onClick={() => handleView(record)}>{text}</a>
        },
        {
            title: '型号',
            dataIndex: 'model',
            key: 'model',
            width: 150,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: [
                { text: '运行', value: 'Running' },
                { text: '维修', value: 'Maintenance' },
                { text: '闲置', value: 'Idle' },
                { text: '报废', value: 'Scrapped' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = 'green';
                if (status === 'Maintenance') color = 'red';
                if (status === 'Idle') color = 'orange';
                if (status === 'Scrapped') color = 'default';
                const textMap: any = { 'Running': '运行', 'Maintenance': '维修', 'Idle': '闲置', 'Scrapped': '报废' };
                return <Tag color={color}>{textMap[status] || status}</Tag>;
            },
        },
        {
            title: '存放区域',
            dataIndex: 'location',
            key: 'location',
            width: 120,
        },
        {
            title: '负责人',
            dataIndex: 'responsiblePerson',
            key: 'responsiblePerson',
            width: 100,
        },
        {
            title: '下次定检',
            dataIndex: 'nextCalibrationDate',
            key: 'nextCalibrationDate',
            width: 120,
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleView(record)}>详情</a>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const getDrawerItems = (record: IDeviceInfo) => {
        const items = [
            {
                key: '1',
                label: '基本信息',
                children: (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="资产类型">
                            {record.assetType === 'instrument' ? '精密仪器' :
                                record.assetType === 'device' ? '辅助设备' :
                                    record.assetType === 'glassware' ? '玻璃量器' : record.assetType}
                        </Descriptions.Item>
                        <Descriptions.Item label="设备编号">{record.code}</Descriptions.Item>
                        <Descriptions.Item label="设备名称">{record.name}</Descriptions.Item>
                        <Descriptions.Item label="规格型号">{record.model}</Descriptions.Item>
                        <Descriptions.Item label="制造商">{record.manufacturer}</Descriptions.Item>
                        <Descriptions.Item label="出厂编号">{record.serialNumber}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={record.status === 'Running' ? 'green' : 'red'}>{record.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="存放区域">{record.location}</Descriptions.Item>
                        <Descriptions.Item label="所属部门">{record.department}</Descriptions.Item>
                        <Descriptions.Item label="负责人">{record.responsiblePerson}</Descriptions.Item>
                        <Descriptions.Item label="采购日期">{record.purchaseDate}</Descriptions.Item>
                        <Descriptions.Item label="启用日期">{record.commissioningDate}</Descriptions.Item>
                        <Descriptions.Item label="下次定检">{record.nextCalibrationDate}</Descriptions.Item>
                        <Descriptions.Item label="备注">{record.remarks}</Descriptions.Item>
                    </Descriptions>
                )
            }
        ];

        if (record.assetType === 'device') {
            items.push({
                key: '2',
                label: '保养记录',
                children: <div>暂无记录</div>
            });
            items.push({
                key: '3',
                label: '维修记录',
                children: <div>暂无记录</div>
            });
        }

        if (record.assetType === 'instrument' || record.assetType === 'glassware') {
            items.push({
                key: '4',
                label: '定检/校准记录',
                children: <div>暂无记录</div>
            });
        }

        return items;
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}><Card><Statistic title="设备总数" value={dataSource.length} /></Card></Col>
                <Col span={6}><Card><Statistic title="运行中" value={dataSource.filter(d => d.status === 'Running').length} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                <Col span={6}><Card><Statistic title="维修中" value={dataSource.filter(d => d.status === 'Maintenance').length} valueStyle={{ color: '#cf1322' }} /></Card></Col>
                <Col span={6}><Card><Statistic title="平均利用率" value={dataSource.length ? (dataSource.reduce((acc, cur) => acc + cur.utilization, 0) / dataSource.length).toFixed(1) : 0} suffix="%" /></Card></Col>
            </Row>

            <Card title="设备档案列表" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增设备</Button>}>
                <Table columns={columns} dataSource={dataSource} rowKey="id" scroll={{ x: 1300 }} pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingRecord ? "编辑设备档案" : "新增设备档案"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={800}>
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="设备名称" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="model" label="规格型号" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="设备编号" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="assetType" label="资产类型" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="instrument">精密仪器</Select.Option>
                                    <Select.Option value="device">辅助设备</Select.Option>
                                    <Select.Option value="glassware">玻璃量器</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="serialNumber" label="出厂编号">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="manufacturer" label="制造商">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="Running">运行</Select.Option>
                                    <Select.Option value="Maintenance">维修</Select.Option>
                                    <Select.Option value="Idle">闲置</Select.Option>
                                    <Select.Option value="Scrapped">报废</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="location" label="存放区域">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="department" label="所属部门">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="responsiblePerson" label="负责人">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="utilization" label="利用率 (%)">
                                <InputNumber min={0} max={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="remarks" label="备注">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            <Drawer title="设备详情" placement="right" width={600} onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
                {viewingRecord && (
                    <Tabs defaultActiveKey="1" items={getDrawerItems(viewingRecord)} />
                )}
            </Drawer>
        </div>
    );
};

export default DeviceInfo;
