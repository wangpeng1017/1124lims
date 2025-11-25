import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, AlertOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { consumablesData, type IConsumableInfo } from '../../mock/consumables';

const ConsumableInfo: React.FC = () => {
    const [dataSource, setDataSource] = useState<IConsumableInfo[]>(consumablesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IConsumableInfo | null>(null);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [form] = Form.useForm();

    // 统计数据
    const totalItems = dataSource.length;
    const lowStockItems = dataSource.filter(item => item.status === '预警').length;
    const expiredItems = dataSource.filter(item => item.status === '过期').length;

    // 筛选数据
    const filteredData = dataSource.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.code.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = categoryFilter ? item.category === categoryFilter : true;
        return matchSearch && matchCategory;
    });

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        // 设置默认值
        form.setFieldsValue({
            purchaseDate: dayjs(),
            minStock: 10,
            status: '正常'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (record: IConsumableInfo) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            purchaseDate: record.purchaseDate ? dayjs(record.purchaseDate) : undefined,
            expiryDate: record.expiryDate ? dayjs(record.expiryDate) : undefined,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const processedValues = {
                ...values,
                purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : undefined,
                expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : undefined,
                // 自动计算状态
                status: (values.currentStock <= values.minStock) ? '预警' : '正常'
            };

            if (editingRecord) {
                setDataSource(prev => prev.map(item => item.id === editingRecord.id ? { ...item, ...processedValues } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(i => i.id), 0) + 1;
                const newCode = `C${String(newId).padStart(5, '0')}`;
                setDataSource(prev => [{
                    id: newId,
                    code: newCode,
                    totalInQuantity: values.purchaseQuantity || 0,
                    totalOutQuantity: 0,
                    maxStock: (values.purchaseQuantity || 0) * 2,
                    ...processedValues
                }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        });
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case '正常': return <Tag color="success">正常</Tag>;
            case '预警': return <Tag color="error" icon={<AlertOutlined />}>库存预警</Tag>;
            case '过期': return <Tag color="default">已过期</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const columns: ColumnsType<IConsumableInfo> = [
        { title: '编号', dataIndex: 'code', key: 'code', width: 100 },
        { title: '名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '规格', dataIndex: 'specification', key: 'specification' },
        { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '当前库存',
            dataIndex: 'currentStock',
            key: 'currentStock',
            render: (val, record) => (
                <span style={{
                    color: val <= record.minStock ? '#ff4d4f' : 'inherit',
                    fontWeight: val <= record.minStock ? 'bold' : 'normal'
                }}>
                    {val}
                </span>
            ),
            sorter: (a, b) => a.currentStock - b.currentStock
        },
        { title: '最小库存', dataIndex: 'minStock', key: 'minStock', width: 100 },
        { title: '存放位置', dataIndex: 'storageLocation', key: 'storageLocation' },
        { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="耗材总数" value={totalItems} prefix={<SearchOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="库存预警"
                            value={lowStockItems}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<AlertOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="已过期"
                            value={expiredItems}
                            valueStyle={{ color: '#8c8c8c' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="耗材信息管理"
                extra={
                    <Space>
                        <Input
                            placeholder="搜索编号/名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Select
                            placeholder="全部分类"
                            style={{ width: 150 }}
                            allowClear
                            onChange={setCategoryFilter}
                        >
                            <Select.Option value="试剂">试剂</Select.Option>
                            <Select.Option value="标样">标样</Select.Option>
                            <Select.Option value="对照品">对照品</Select.Option>
                            <Select.Option value="标准品">标准品</Select.Option>
                            <Select.Option value="备件耗材">备件耗材</Select.Option>
                            <Select.Option value="危险品">危险品</Select.Option>
                            <Select.Option value="易制毒品">易制毒品</Select.Option>
                        </Select>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            新增耗材
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 1300 }}
                />
            </Card>

            <Modal
                title={editingRecord ? "编辑耗材" : "新增耗材"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="耗材名称" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="试剂">试剂</Select.Option>
                                    <Select.Option value="标样">标样</Select.Option>
                                    <Select.Option value="对照品">对照品</Select.Option>
                                    <Select.Option value="标准品">标准品</Select.Option>
                                    <Select.Option value="备件耗材">备件耗材</Select.Option>
                                    <Select.Option value="危险品">危险品</Select.Option>
                                    <Select.Option value="易制毒品">易制毒品</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="specification" label="规格型号" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="currentStock" label="当前库存" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="minStock" label="最小库存(预警)" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="storageLocation" label="存放位置" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="purchaseQuantity" label="购置数量">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="purchaseDate" label="购置日期">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="storageCondition" label="存储条件">
                                <Input placeholder="如: 常温、避光、冷藏" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="expiryDate" label="有效期">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ConsumableInfo;
