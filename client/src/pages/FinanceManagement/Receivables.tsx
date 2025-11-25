import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, InputNumber, Select, Input, Upload, message, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { receivableData, type IReceivable } from '../../mock/finance';
import { employeeData } from '../../mock/personnel';

const Receivables: React.FC = () => {
    const [dataSource, setDataSource] = useState(receivableData);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentReceivable, setCurrentReceivable] = useState<IReceivable | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePayment = (record: IReceivable) => {
        setCurrentReceivable(record);
        form.setFieldsValue({
            paymentAmount: record.remainingAmount,
            paymentMethod: '银行转账'
        });
        setFileList([]);
        setIsPaymentModalOpen(true);
    };

    const handleViewDetail = (record: IReceivable) => {
        setCurrentReceivable(record);
        setIsDetailModalOpen(true);
    };

    const handleSubmitPayment = () => {
        form.validateFields().then(values => {
            if (!currentReceivable) return;

            if (fileList.length === 0) {
                message.warning('请上传收款凭证');
                return;
            }

            // 更新应收账款状态
            const updatedData = dataSource.map(item =>
                item.id === currentReceivable.id
                    ? {
                        ...item,
                        receivedAmount: currentReceivable.totalAmount,
                        remainingAmount: 0,
                        status: '已收款' as const
                    }
                    : item
            );
            setDataSource(updatedData);

            message.success('收款成功');
            console.log('收款信息:', values);
            console.log('上传附件:', fileList.map(f => f.name));

            setIsPaymentModalOpen(false);
        });
    };

    const getStatusColor = (status: string) => {
        return status === '已收款' ? 'success' : 'warning';
    };

    const columns: ColumnsType<IReceivable> = [
        { title: '应收账款编号', dataIndex: 'receivableNo', key: 'receivableNo' },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        { title: '客户单位', dataIndex: 'clientName', key: 'clientName', width: 150 },
        {
            title: '应收总额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => `¥${val.toFixed(2)}`
        },
        {
            title: '已收金额',
            dataIndex: 'receivedAmount',
            key: 'receivedAmount',
            render: (val) => `¥${val.toFixed(2)}`
        },
        {
            title: '待收金额',
            dataIndex: 'remainingAmount',
            key: 'remainingAmount',
            render: (val) => <strong style={{ color: val > 0 ? '#ff4d4f' : '#52c41a' }}>¥{val.toFixed(2)}</strong>
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        { title: '创建日期', dataIndex: 'createDate', key: 'createDate' },
        { title: '应收日期', dataIndex: 'dueDate', key: 'dueDate' },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    {record.status === '未收款' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<DollarOutlined />}
                            onClick={() => handlePayment(record)}
                        >
                            收款
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card title="委托应收">
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1200 }}
            />

            {/* 收款Modal */}
            <Modal
                title={<><DollarOutlined /> 收款操作</>}
                open={isPaymentModalOpen}
                onOk={handleSubmitPayment}
                onCancel={() => setIsPaymentModalOpen(false)}
                okText="确认收款"
                width={600}
            >
                {currentReceivable && (
                    <>
                        <div style={{ marginBottom: 20, padding: 15, background: '#f5f5f5', borderRadius: 4 }}>
                            <p><strong>应收账款编号:</strong> {currentReceivable.receivableNo}</p>
                            <p><strong>客户单位:</strong> {currentReceivable.clientName}</p>
                            <p><strong>应收总额:</strong> <span style={{ fontSize: 18, color: '#1890ff' }}>¥{currentReceivable.totalAmount.toFixed(2)}</span></p>
                        </div>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="paymentAmount"
                                label="收款金额"
                                rules={[{ required: true, message: '请输入收款金额' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={currentReceivable.remainingAmount}
                                    precision={2}
                                    addonBefore="¥"
                                />
                            </Form.Item>

                            <Form.Item
                                name="paymentMethod"
                                label="收款方式"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="现金">现金</Select.Option>
                                    <Select.Option value="银行转账">银行转账</Select.Option>
                                    <Select.Option value="支票">支票</Select.Option>
                                    <Select.Option value="其他">其他</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="handlerName"
                                label="经办人"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="选择经办人" showSearch>
                                    {employeeData.map(emp => (
                                        <Select.Option key={emp.id} value={emp.name}>
                                            {emp.name} ({emp.position})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="bankName" label="银行名称">
                                <Input placeholder="如: 中国工商银行" />
                            </Form.Item>

                            <Form.Item name="transactionNo" label="交易流水号">
                                <Input placeholder="银行转账流水号" />
                            </Form.Item>

                            <Form.Item label="收款凭证" required>
                                <Upload
                                    fileList={fileList}
                                    onChange={({ fileList }) => setFileList(fileList)}
                                    beforeUpload={() => false}
                                    maxCount={5}
                                >
                                    <Button icon={<UploadOutlined />}>上传凭证</Button>
                                </Upload>
                                <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                                    支持PDF、JPG、PNG格式,最多上传5个文件
                                </div>
                            </Form.Item>

                            <Form.Item name="remark" label="备注">
                                <Input.TextArea rows={3} placeholder="备注信息..." />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>

            {/* 详情Modal */}
            <Modal
                title="应收账款详情"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[<Button key="close" onClick={() => setIsDetailModalOpen(false)}>关闭</Button>]}
                width={800}
            >
                {currentReceivable && (
                    <>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="应收账款编号">{currentReceivable.receivableNo}</Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Tag color={getStatusColor(currentReceivable.status)}>{currentReceivable.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="委托单号">{currentReceivable.entrustmentId}</Descriptions.Item>
                            <Descriptions.Item label="客户单位">{currentReceivable.clientName}</Descriptions.Item>
                            <Descriptions.Item label="创建日期">{currentReceivable.createDate}</Descriptions.Item>
                            <Descriptions.Item label="应收日期">{currentReceivable.dueDate}</Descriptions.Item>
                            <Descriptions.Item label="应收总额">
                                ¥{currentReceivable.totalAmount.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="已收金额">
                                ¥{currentReceivable.receivedAmount.toFixed(2)}
                            </Descriptions.Item>
                            <Descriptions.Item label="待收金额" span={2}>
                                <strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                                    ¥{currentReceivable.remainingAmount.toFixed(2)}
                                </strong>
                            </Descriptions.Item>
                        </Descriptions>

                        <h3 style={{ marginTop: 20 }}>样品明细</h3>
                        <Table
                            dataSource={currentReceivable.samples.map((s, idx) => ({ ...s, key: idx }))}
                            columns={[
                                { title: '样品编号', dataIndex: 'sampleNo' },
                                { title: '样品名称', dataIndex: 'sampleName' },
                                {
                                    title: '检测项目',
                                    dataIndex: 'testItems',
                                    render: (items: string[]) => items.join(', ')
                                },
                                { title: '单价', dataIndex: 'unitPrice', render: (val) => `¥${val}` },
                                { title: '数量', dataIndex: 'quantity' },
                                { title: '小计', dataIndex: 'subtotal', render: (val) => `¥${val}` }
                            ]}
                            pagination={false}
                            size="small"
                        />
                    </>
                )}
            </Modal>
        </Card>
    );
};

export default Receivables;
