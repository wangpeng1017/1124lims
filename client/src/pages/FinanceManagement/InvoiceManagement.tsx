import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, message, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { invoiceData, receivableData, type IInvoice } from '../../mock/finance';

const InvoiceManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState(invoiceData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<IInvoice | null>(null);
    const [form] = Form.useForm();
    const [taxRate, setTaxRate] = useState<number>(13);

    // 只显示已收款的应收账款
    const availableReceivables = receivableData.filter(r => r.status === '已收款');

    const handleCreate = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleReceivableChange = (receivableNo: string) => {
        const receivable = availableReceivables.find(r => r.receivableNo === receivableNo);
        if (receivable) {
            form.setFieldsValue({
                entrustmentId: receivable.entrustmentId,
                clientName: receivable.clientName,
                invoiceAmount: (receivable.totalAmount / (1 + taxRate / 100)).toFixed(2)
            });
            calculateTax();
        }
    };

    const calculateTax = () => {
        const invoiceAmount = form.getFieldValue('invoiceAmount');
        const currentTaxRate = form.getFieldValue('taxRate') || taxRate;

        if (invoiceAmount) {
            const taxAmount = (invoiceAmount * currentTaxRate / 100).toFixed(2);
            const totalAmount = (parseFloat(invoiceAmount) + parseFloat(taxAmount)).toFixed(2);

            form.setFieldsValue({
                taxAmount: parseFloat(taxAmount),
                totalAmount: parseFloat(totalAmount)
            });
        }
    };

    const handleTaxRateChange = (rate: number) => {
        setTaxRate(rate);
        calculateTax();
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newId = Math.max(...dataSource.map(i => i.id), 0) + 1;
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const seq = String(newId).padStart(3, '0');

            const newInvoice: IInvoice = {
                id: newId,
                invoiceNo: `INV-${today}-${seq}`,
                ...values,
                invoiceDate: new Date().toISOString().split('T')[0],
                status: '已开票' as const,
                items: [
                    {
                        itemName: '检测服务费',
                        specification: '样品检测服务',
                        unit: '项',
                        quantity: 1,
                        unitPrice: values.invoiceAmount,
                        amount: values.invoiceAmount
                    }
                ]
            };

            setDataSource([...dataSource, newInvoice]);
            message.success('开票成功');
            setIsModalOpen(false);
        });
    };

    const handlePreview = (record: IInvoice) => {
        setPreviewInvoice(record);
        setIsPreviewOpen(true);
    };

    const handlePrint = (invoice: IInvoice) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateInvoiceHTML(invoice));
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateInvoiceHTML = (invoice: IInvoice) => {
        return `
            <html>
            <head>
                <title>${invoice.invoiceType} - ${invoice.invoiceNo}</title>
                <style>
                    body { font-family: SimSun, serif; margin: 40px; }
                    h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .info { margin: 20px 0; }
                    .info p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td, th { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    .summary { margin-top: 20px; text-align: right; }
                </style>
            </head>
            <body>
                <h1>${invoice.invoiceType}</h1>
                <p style="text-align: center;">发票号码: ${invoice.invoiceNo}</p>
                
                <div class="info">
                    <p><strong>购买方信息:</strong></p>
                    <p>名称: ${invoice.clientName}</p>
                    <p>纳税人识别号: ${invoice.clientTaxNo}</p>
                    ${invoice.clientAddress ? `<p>地址: ${invoice.clientAddress}</p>` : ''}
                    ${invoice.clientPhone ? `<p>电话: ${invoice.clientPhone}</p>` : ''}
                    ${invoice.clientBank && invoice.clientBankAccount ?
                `<p>开户行及账号: ${invoice.clientBank} ${invoice.clientBankAccount}</p>` : ''}
                </div>
                
                <table>
                    <tr>
                        <th>项目名称</th>
                        <th>规格型号</th>
                        <th>单位</th>
                        <th>数量</th>
                        <th>单价</th>
                        <th>金额</th>
                    </tr>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.itemName}</td>
                            <td>${item.specification}</td>
                            <td>${item.unit}</td>
                            <td>${item.quantity}</td>
                            <td>¥${item.unitPrice.toFixed(2)}</td>
                            <td>¥${item.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <div class="summary">
                    <p>金额合计: ¥${invoice.invoiceAmount.toFixed(2)}</p>
                    <p>税率: ${invoice.taxRate}%</p>
                    <p>税额: ¥${invoice.taxAmount.toFixed(2)}</p>
                    <p><strong>价税合计(大写): ${numberToChinese(invoice.totalAmount)}</strong></p>
                    <p><strong>价税合计(小写): ¥${invoice.totalAmount.toFixed(2)}</strong></p>
                </div>
                
                <p style="margin-top: 60px;">开票日期: ${invoice.invoiceDate}</p>
            </body>
            </html>
        `;
    };

    const numberToChinese = (num: number): string => {
        // 简化版数字转大写
        return `${num.toFixed(2)}元`;
    };

    const columns: ColumnsType<IInvoice> = [
        { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo' },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        { title: '客户单位', dataIndex: 'clientName', key: 'clientName', width: 150 },
        {
            title: '发票类型',
            dataIndex: 'invoiceType',
            key: 'invoiceType',
            render: (type) => <Tag color="blue">{type}</Tag>
        },
        {
            title: '开票金额',
            dataIndex: 'invoiceAmount',
            key: 'invoiceAmount',
            render: (val) => `¥${val.toFixed(2)}`
        },
        {
            title: '税率',
            dataIndex: 'taxRate',
            key: 'taxRate',
            render: (val) => `${val}%`
        },
        {
            title: '价税合计',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => <strong style={{ color: '#1890ff' }}>¥{val.toFixed(2)}</strong>
        },
        { title: '开票日期', dataIndex: 'invoiceDate', key: 'invoiceDate' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === '已开票' ? 'success' : 'processing'}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(record)}
                    >
                        预览
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handlePrint(record)}
                    >
                        打印
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="开票管理"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增开票</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1300 }}
            />

            {/* 新增开票Modal */}
            <Modal
                title={<><FileTextOutlined /> 开票申请</>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
                okText="确认开票"
            >
                <Form form={form} layout="vertical" onValuesChange={calculateTax}>
                    <Form.Item
                        name="receivableNo"
                        label="选择应收账款"
                        rules={[{ required: true, message: '请选择应收账款' }]}
                    >
                        <Select placeholder="选择已收款的应收账款" onChange={handleReceivableChange}>
                            {availableReceivables.map(r => (
                                <Select.Option key={r.id} value={r.receivableNo}>
                                    {r.receivableNo} - {r.clientName} (¥{r.totalAmount})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="entrustmentId" label="委托单号">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name="clientName" label="购买方单位" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="clientTaxNo" label="纳税人识别号" rules={[{ required: true }]}>
                        <Input placeholder="请输入纳税人识别号" />
                    </Form.Item>

                    <Form.Item name="clientAddress" label="地址">
                        <Input />
                    </Form.Item>

                    <Form.Item name="clientPhone" label="电话">
                        <Input />
                    </Form.Item>

                    <Form.Item name="clientBank" label="开户行">
                        <Input />
                    </Form.Item>

                    <Form.Item name="clientBankAccount" label="账号">
                        <Input />
                    </Form.Item>

                    <Form.Item name="invoiceType" label="发票类型" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="增值税普通发票">增值税普通发票</Select.Option>
                            <Select.Option value="增值税专用发票">增值税专用发票</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="invoiceAmount" label="开票金额" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            addonBefore="¥"
                        />
                    </Form.Item>

                    <Form.Item name="taxRate" label="税率" rules={[{ required: true }]}>
                        <Select onChange={handleTaxRateChange}>
                            <Select.Option value={6}>6%</Select.Option>
                            <Select.Option value={13}>13%</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="taxAmount" label="税额">
                        <InputNumber
                            style={{ width: '100%' }}
                            disabled
                            precision={2}
                            addonBefore="¥"
                        />
                    </Form.Item>

                    <Form.Item name="totalAmount" label="价税合计">
                        <InputNumber
                            style={{ width: '100%' }}
                            disabled
                            precision={2}
                            addonBefore="¥"
                        />
                    </Form.Item>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 预览Modal */}
            <Modal
                title="发票预览"
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewOpen(false)}>关闭</Button>,
                    <Button key="print" type="primary" onClick={() => previewInvoice && handlePrint(previewInvoice)}>
                        打印
                    </Button>
                ]}
                width={900}
            >
                {previewInvoice && (
                    <div style={{ padding: 20, border: '2px solid #000' }}>
                        <h2 style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: 10 }}>
                            {previewInvoice.invoiceType}
                        </h2>
                        <p style={{ textAlign: 'center' }}>发票号码: {previewInvoice.invoiceNo}</p>

                        <Descriptions bordered column={2} style={{ marginTop: 20 }}>
                            <Descriptions.Item label="购买方" span={2}>{previewInvoice.clientName}</Descriptions.Item>
                            <Descriptions.Item label="纳税人识别号" span={2}>{previewInvoice.clientTaxNo}</Descriptions.Item>
                            {previewInvoice.clientAddress && (
                                <Descriptions.Item label="地址" span={2}>{previewInvoice.clientAddress}</Descriptions.Item>
                            )}
                            {previewInvoice.clientPhone && (
                                <Descriptions.Item label="电话" span={2}>{previewInvoice.clientPhone}</Descriptions.Item>
                            )}
                        </Descriptions>

                        <Table
                            dataSource={previewInvoice.items.map((item, idx) => ({ ...item, key: idx }))}
                            columns={[
                                { title: '项目名称', dataIndex: 'itemName' },
                                { title: '规格型号', dataIndex: 'specification' },
                                { title: '单位', dataIndex: 'unit' },
                                { title: '数量', dataIndex: 'quantity' },
                                { title: '单价', dataIndex: 'unitPrice', render: (val) => `¥${val.toFixed(2)}` },
                                { title: '金额', dataIndex: 'amount', render: (val) => `¥${val.toFixed(2)}` }
                            ]}
                            pagination={false}
                            size="small"
                            style={{ marginTop: 20 }}
                        />

                        <div style={{ marginTop: 20, textAlign: 'right', fontSize: 16 }}>
                            <p>金额合计: ¥{previewInvoice.invoiceAmount.toFixed(2)}</p>
                            <p>税率: {previewInvoice.taxRate}%</p>
                            <p>税额: ¥{previewInvoice.taxAmount.toFixed(2)}</p>
                            <p><strong>价税合计: ¥{previewInvoice.totalAmount.toFixed(2)}</strong></p>
                        </div>

                        <p style={{ marginTop: 40 }}>开票日期: {previewInvoice.invoiceDate}</p>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default InvoiceManagement;
