import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { calibrationPlanData, calibrationRecordData, deviceData } from '../../mock/devices';
import type { ICalibrationPlan, ICalibrationRecord } from '../../mock/devices';

const PlanList: React.FC = () => {
    const [dataSource, setDataSource] = useState<ICalibrationPlan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string | null>(null);

    // 初始化加载数据
    const fetchData = useCallback(() => {
        setDataSource(calibrationPlanData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ICalibrationPlan) => {
        setEditingId(record.id);
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

            if (editingId) {
                setDataSource(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = `CP${String(dataSource.length + 1).padStart(3, '0')}`;
                const device = deviceData.find(d => d.id === values.deviceId);
                const newPlan: ICalibrationPlan = {
                    id: newId,
                    ...values,
                    deviceName: device?.name || '',
                    status: 'active',
                    createTime: new Date().toISOString(),
                    updateTime: new Date().toISOString()
                };
                setDataSource(prev => [newPlan, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<ICalibrationPlan> = [
        { title: '计划编号', dataIndex: 'id', key: 'id', width: 100 },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
        { title: '计划名称', dataIndex: 'planName', key: 'planName', width: 150 },
        {
            title: '检定类型',
            dataIndex: 'calibrationType',
            key: 'calibrationType',
            width: 100,
            render: (type) => <Tag color={type === 'external' ? 'orange' : 'blue'}>{type === 'external' ? '外部检定' : '内部检定'}</Tag>
        },
        { title: '下次检定', dataIndex: 'nextCalibrationDate', key: 'nextCalibrationDate', width: 120 },
        { title: '负责人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '启用' : '停用'}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
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
        <>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建计划</Button>
            </div>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />

            <Modal title={editingId ? "编辑定检计划" : "新建定检计划"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="deviceId" label="选择设备" rules={[{ required: true }]}>
                        <Select showSearch optionFilterProp="children">
                            {deviceData.map(d => (
                                <Select.Option key={d.id} value={d.id}>{d.name} ({d.code})</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="planName" label="计划名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calibrationType" label="检定类型" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="internal">内部检定</Select.Option>
                            <Select.Option value="external">外部检定</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="calibrationCycle" label="检定周期(月)" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="calibrationStandard" label="检定标准" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="nextCalibrationDate" label="下次检定日期" rules={[{ required: true }]}>
                        <Input type="date" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="responsiblePerson" label="负责人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="reminderDays" label="提前提醒天数" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const RecordList: React.FC = () => {
    const [dataSource] = useState<ICalibrationRecord[]>(calibrationRecordData);

    const columns: ColumnsType<ICalibrationRecord> = [
        { title: '记录编号', dataIndex: 'id', key: 'id', width: 100 },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
        {
            title: '检定类型',
            dataIndex: 'calibrationType',
            key: 'calibrationType',
            width: 100,
            render: (type) => <Tag color={type === 'external' ? 'orange' : 'blue'}>{type === 'external' ? '外部检定' : '内部检定'}</Tag>
        },
        { title: '检定日期', dataIndex: 'calibrationDate', key: 'calibrationDate', width: 120 },
        { title: '检定机构', dataIndex: 'calibrationAgency', key: 'calibrationAgency', width: 150 },
        { title: '证书编号', dataIndex: 'certificateNumber', key: 'certificateNumber', width: 150 },
        {
            title: '结果',
            dataIndex: 'overallResult',
            key: 'overallResult',
            width: 100,
            render: (result) => <Tag color={result === 'pass' ? 'green' : 'red'}>{result === 'pass' ? '合格' : '不合格'}</Tag>
        },
        { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 120 },
    ];

    return (
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
    );
};

const CalibrationPlan: React.FC = () => {
    return (
        <Card title="仪器定检管理">
            <Tabs defaultActiveKey="1" items={[
                { label: '定检计划', key: '1', children: <PlanList /> },
                { label: '定检记录', key: '2', children: <RecordList /> }
            ]} />
        </Card>
    );
};

export default CalibrationPlan;
