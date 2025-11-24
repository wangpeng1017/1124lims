import React, { useState } from 'react';
import { Table, Card, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DingdingOutlined, EditOutlined } from '@ant-design/icons';
import { outsourceOrderData, outsourceParameterData, type IOutsourceOrder, type IOutsourceParameter } from '../../mock/outsourcing';

// 合并委托单和参数委外的统一类型
type OutsourceRecord = (IOutsourceOrder | IOutsourceParameter) & {
    type: '委托单' | '参数';
};

const OutsourceOrders: React.FC = () => {
    const [orderData, setOrderData] = useState<IOutsourceOrder[]>(outsourceOrderData);
    const [paramData, setParamData] = useState<IOutsourceParameter[]>(outsourceParameterData);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<OutsourceRecord | null>(null);
    const [statusForm] = Form.useForm();
    const [logisticsForm] = Form.useForm();

    // 合并两种委外单数据
    const mergedData: OutsourceRecord[] = [
        ...orderData.map(item => ({ ...item, type: '委托单' as const })),
        ...paramData.map(item => ({ ...item, type: '参数' as const }))
    ].sort((a, b) => b.id - a.id); // 按ID降序

    const handleUpdateStatus = (record: OutsourceRecord) => {
        setEditingRecord(record);
        statusForm.setFieldsValue({ status: record.status });
        setIsStatusModalOpen(true);
    };

    const handleStatusOk = () => {
        statusForm.validateFields().then(values => {
            if (!editingRecord) return;

            if (editingRecord.type === '委托单') {
                setOrderData(orderData.map(item =>
                    item.id === editingRecord.id ? { ...item, status: values.status } : item
                ));
            } else {
                setParamData(paramData.map(item =>
                    item.id === editingRecord.id ? { ...item, status: values.status } : item
                ));
            }
            message.success('状态更新成功');
            setIsStatusModalOpen(false);
        });
    };

    const handleEditLogistics = (record: OutsourceRecord) => {
        setEditingRecord(record);
        logisticsForm.setFieldsValue({
            sendDate: record.sendDate,
            trackingNo: record.trackingNo,
            receivedDate: record.receivedDate
        });
        setIsLogisticsModalOpen(true);
    };

    const handleLogisticsOk = () => {
        logisticsForm.validateFields().then(values => {
            if (!editingRecord) return;

            if (editingRecord.type === '委托单') {
                setOrderData(orderData.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
            } else {
                setParamData(paramData.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
            }
            message.success('物流信息更新成功');
            setIsLogisticsModalOpen(false);
        });
    };

    const handleTerminate = (record: OutsourceRecord) => {
        Modal.confirm({
            title: '确认终止',
            content: `确定终止委外单 ${record.outsourceNo} 吗？`,
            onOk: () => {
                if (record.type === '委托单') {
                    setOrderData(orderData.map(item =>
                        item.id === record.id ? { ...item, status: '已终止' } : item
                    ));
                } else {
                    setParamData(paramData.map(item =>
                        item.id === record.id ? { ...item, status: '已终止' } : item
                    ));
                }
                message.success('已终止');
            }
        });
    };

    const columns: ColumnsType<OutsourceRecord> = [
        { title: '委外单号', dataIndex: 'outsourceNo', key: 'outsourceNo', width: 150, fixed: 'left' },
        {
            title: '委外类型',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type) => <Tag color={type === '委托单' ? 'blue' : 'cyan'}>{type}</Tag>
        },
        {
            title: '关联信息',
            key: 'relation',
            width: 180,
            render: (_, record) => {
                if (record.type === '委托单') {
                    return `委托单: ${(record as IOutsourceOrder).entrustmentId}`;
                } else {
                    return `参数: ${(record as IOutsourceParameter).parameterName}`;
                }
            }
        },
        { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180, ellipsis: true },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (price) => `¥${price.toLocaleString()}`
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待审批': 'warning',
                    '已通过': 'success',
                    '已拒绝': 'error'
                };
                return <Tag color={colorMap[status]} icon={<DingdingOutlined />}>{status}</Tag>;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待确认': 'default',
                    '已发送': 'processing',
                    '检测中': 'blue',
                    '已完成': 'success',
                    '已终止': 'error'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        { title: '寄送日期', dataIndex: 'sendDate', key: 'sendDate', width: 120 },
        { title: '快递单号', dataIndex: 'trackingNo', key: 'trackingNo', width: 130 },
        { title: '分配日期', dataIndex: 'assignDate', key: 'assignDate', width: 120 },
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    {record.status !== '已完成' && record.status !== '已终止' && (
                        <a onClick={() => handleUpdateStatus(record)}>更新状态</a>
                    )}
                    <a onClick={() => handleEditLogistics(record)}><EditOutlined /> 物流</a>
                    {record.status !== '已完成' && record.status !== '已终止' && (
                        <a style={{ color: 'red' }} onClick={() => handleTerminate(record)}>终止</a>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card title="委外单信息总览">
            <Space style={{ marginBottom: 16 }}>
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    options={[
                        { value: 'all', label: '全部类型' },
                        { value: '委托单', label: '委托单' },
                        { value: '参数', label: '参数' }
                    ]}
                />
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    options={[
                        { value: 'all', label: '全部状态' },
                        { value: '待确认', label: '待确认' },
                        { value: '已发送', label: '已发送' },
                        { value: '检测中', label: '检测中' },
                        { value: '已完成', label: '已完成' }
                    ]}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={mergedData}
                rowKey={(record) => `${record.type}-${record.id}`}
                scroll={{ x: 1600 }}
                pagination={{ pageSize: 10 }}
            />

            {/* 状态更新弹窗 */}
            <Modal
                title="更新状态"
                open={isStatusModalOpen}
                onOk={handleStatusOk}
                onCancel={() => setIsStatusModalOpen(false)}
            >
                <Form form={statusForm} layout="vertical">
                    <Form.Item name="status" label="委外单状态" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="待确认">待确认</Select.Option>
                            <Select.Option value="已发送">已发送</Select.Option>
                            <Select.Option value="检测中">检测中</Select.Option>
                            <Select.Option value="已完成">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 物流信息编辑弹窗 */}
            <Modal
                title="编辑物流信息"
                open={isLogisticsModalOpen}
                onOk={handleLogisticsOk}
                onCancel={() => setIsLogisticsModalOpen(false)}
            >
                <Form form={logisticsForm} layout="vertical">
                    <Form.Item name="sendDate" label="寄送日期">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="trackingNo" label="快递单号">
                        <Input placeholder="输入快递单号" />
                    </Form.Item>
                    <Form.Item name="receivedDate" label="归还日期">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default OutsourceOrders;
