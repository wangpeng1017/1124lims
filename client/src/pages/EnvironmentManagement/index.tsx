import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Select, Typography, Badge, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { environmentData } from '../../mock/environment';
import type { EnvironmentRecord } from '../../mock/environment';

const { Option } = Select;
const { Title } = Typography;

const EnvironmentManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<EnvironmentRecord[]>(environmentData);
    const [filterLocation, setFilterLocation] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EnvironmentRecord | null>(null);
    const [form] = Form.useForm();

    const locations = Array.from(new Set(dataSource.map(d => d.location)));
    const filteredData = filterLocation === 'All' ? dataSource : dataSource.filter(d => d.location === filterLocation);

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

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>环境监控看板</Title>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Select defaultValue="All" style={{ width: 120 }} onChange={setFilterLocation}>
                        <Option value="All">全部区域</Option>
                        {locations.map(loc => <Option key={loc} value={loc}>{loc}</Option>)}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增监控点</Button>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {filteredData.map(item => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card
                            title={item.room}
                            extra={<Badge status="processing" text="正常" />}
                            hoverable
                            actions={[
                                <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
                                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(item.id)}>
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>
                            ]}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="温度" value={item.temperature} suffix="℃" valueStyle={{ color: item.temperature > 26 ? '#cf1322' : '#3f8600' }} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="湿度" value={item.humidity} suffix="%" valueStyle={{ color: '#3f8600' }} />
                                </Col>
                            </Row>
                            <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>位置: {item.location}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

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
