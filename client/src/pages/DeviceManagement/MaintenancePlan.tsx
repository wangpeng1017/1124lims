import React, { useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, Space, Popconfirm, message, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { maintenancePlanData, maintenanceRecordData, deviceData } from '../../mock/devices';
import type { IMaintenancePlan, IMaintenanceRecord } from '../../mock/devices';

const PlanList: React.FC = () => {
    const [dataSource, setDataSource] = useState<IMaintenancePlan[]>(maintenancePlanData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IMaintenancePlan) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            maintenanceItems: record.maintenanceItems.join('\n')
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const maintenanceItems = values.maintenanceItems.split('\n').filter((item: string) => item.trim());

            if (editingId) {
                setDataSource(prev => prev.map(item => item.id === editingId ? { ...item, ...values, maintenanceItems } : item));
                message.success('更新成功');
            } else {
                const newId = `MP${String(dataSource.length + 1).padStart(3, '0')}`;
                const device = deviceData.find(d => d.id === values.deviceId);
                const newPlan: IMaintenancePlan = {
                    id: newId,
                    ...values,
                    deviceName: device?.name || '',
                    maintenanceItems,
                    status: 'active',
                    createTime: new Date().toISOString()
                };
                setDataSource(prev => [newPlan, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<IMaintenancePlan> = [
        { title: '计划编号', dataIndex: 'id', key: 'id', width: 100 },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
        { title: '计划名称', dataIndex: 'planName', key: 'planName', width: 150 },
        {
            title: '周期类型',
            dataIndex: 'planType',
            key: 'planType',
            width: 100,
            render: (type) => {
                const map: any = { daily: '日常', weekly: '周度', monthly: '月度', quarterly: '季度', annual: '年度' };
                return <Tag color="blue">{map[type]}</Tag>;
            }
        },
        { title: '下次保养', dataIndex: 'nextMaintenanceDate', key: 'nextMaintenanceDate', width: 120 },
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

            <Modal title={editingId ? "编辑保养计划" : "新建保养计划"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
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
                    <Form.Item name="planType" label="周期类型" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="daily">日常</Select.Option>
                            <Select.Option value="weekly">周度</Select.Option>
                            <Select.Option value="monthly">月度</Select.Option>
                            <Select.Option value="quarterly">季度</Select.Option>
                            <Select.Option value="annual">年度</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="interval" label="间隔天数" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="nextMaintenanceDate" label="下次保养日期" rules={[{ required: true }]}>
                        <Input type="date" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="responsiblePerson" label="负责人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="maintenanceItems" label="保养项目 (每行一项)" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="清洁&#13;&#10;润滑&#13;&#10;检查" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const RecordList: React.FC = () => {
    const [dataSource] = useState<IMaintenanceRecord[]>(maintenanceRecordData);

    const columns: ColumnsType<IMaintenanceRecord> = [
        { title: '记录编号', dataIndex: 'id', key: 'id', width: 100 },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
        {
            title: '保养类型',
            dataIndex: 'maintenanceType',
            key: 'maintenanceType',
            width: 100,
            render: (type) => {
                const map: any = { routine: '例行', preventive: '预防', emergency: '应急' };
                return <Tag color="blue">{map[type]}</Tag>;
            }
        },
        { title: '保养日期', dataIndex: 'maintenanceDate', key: 'maintenanceDate', width: 120 },
        { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
        { title: '耗时(小时)', dataIndex: 'duration', key: 'duration', width: 100 },
        {
            title: '结果',
            dataIndex: 'result',
            key: 'result',
            width: 100,
            render: (result) => <Tag color={result === 'normal' ? 'green' : 'red'}>{result === 'normal' ? '正常' : '异常'}</Tag>
        },
    ];

    return (
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
    );
};

const MaintenancePlan: React.FC = () => {
    return (
        <Card title="设备保养管理">
            <Tabs defaultActiveKey="1" items={[
                { label: '保养计划', key: '1', children: <PlanList /> },
                { label: '保养记录', key: '2', children: <RecordList /> }
            ]} />
        </Card>
    );
};

export default MaintenancePlan;
