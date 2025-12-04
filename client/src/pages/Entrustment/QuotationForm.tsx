import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { type Quotation, type QuotationItem, DEFAULT_SERVICE_INFO } from '../../mock/quotationData';

const { TextArea } = Input;

interface QuotationFormProps {
    visible: boolean;
    quotation: Quotation | null;
    fromConsultation?: any; // IConsultation类型
    onCancel: () => void;
    onSave: (values: Partial<Quotation>) => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ visible, quotation, fromConsultation, onCancel, onSave }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState<QuotationItem[]>([]);

    useEffect(() => {
        if (visible && quotation) {
            // 编辑模式
            form.setFieldsValue({
                clientCompany: quotation.clientCompany,
                clientContact: quotation.clientContact,
                clientTel: quotation.clientTel,
                clientEmail: quotation.clientEmail,
                clientAddress: quotation.clientAddress,
                sampleName: quotation.sampleName,
                clientRemark: quotation.clientRemark
            });
            setItems(quotation.items);
        } else if (visible && fromConsultation) {
            // 从咨询单创建报价单
            form.setFieldsValue({
                clientCompany: fromConsultation.clientCompany,
                clientContact: fromConsultation.clientContact,
                clientTel: fromConsultation.clientTel,
                clientEmail: fromConsultation.clientEmail || '',
                clientAddress: fromConsultation.clientAddress || '',
                sampleName: fromConsultation.sampleName,
                clientRemark: fromConsultation.clientRequirements || ''
            });
            // 根据检测项目自动生成报价项
            const autoItems: QuotationItem[] = fromConsultation.testItems.map((item: string, index: number) => ({
                id: index + 1,
                serviceItem: item,
                methodStandard: '',
                quantity: fromConsultation.estimatedQuantity || 1,
                unitPrice: 0,
                totalPrice: 0
            }));
            setItems(autoItems.length > 0 ? autoItems : [{
                id: 1,
                serviceItem: '',
                methodStandard: '',
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0
            }]);
        } else if (visible) {
            // 新建模式
            form.resetFields();
            setItems([{
                id: 1,
                serviceItem: '',
                methodStandard: '',
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0
            }]);
        }
    }, [visible, quotation, fromConsultation, form]);

    const calculatePrices = (currentItems: QuotationItem[]) => {
        const subtotal = currentItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const taxTotal = subtotal * 1.06; // 6% 税
        return { subtotal, taxTotal, discountTotal: taxTotal };
    };

    const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // 自动计算总价
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
        }

        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, {
            id: items.length + 1,
            serviceItem: '',
            methodStandard: '',
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0
        }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length === 1) {
            message.warning('至少保留一个检测项目');
            return;
        }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            // 验证检测项目
            if (items.length === 0) {
                message.error('请至少添加一个检测项目');
                return;
            }

            const hasEmptyItem = items.some(item => !item.serviceItem || !item.methodStandard);
            if (hasEmptyItem) {
                message.error('请完善所有检测项目信息');
                return;
            }

            const prices = calculatePrices(items);

            const quotationData: Partial<Quotation> = {
                ...values,
                ...DEFAULT_SERVICE_INFO,
                items,
                ...prices,
                createDate: quotation?.createDate || new Date().toISOString().split('T')[0],
                status: quotation?.status || 'draft',
                currentApprovalLevel: quotation?.currentApprovalLevel || 0,
                approvalHistory: quotation?.approvalHistory || [],
                clientStatus: quotation?.clientStatus || 'pending',
                createdBy: quotation?.createdBy || '张馨',
                updatedAt: new Date().toISOString()
            };

            onSave(quotationData);
        });
    };

    const prices = calculatePrices(items);

    return (
        <Modal
            title={quotation ? '编辑报价单' : '新建报价单'}
            open={visible}
            onCancel={onCancel}
            width={1000}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    保存
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <div style={{ marginBottom: 16 }}>
                    <h3>委托方信息</h3>
                </div>
                <Form.Item
                    name="clientCompany"
                    label="委托方公司"
                    rules={[{ required: true, message: '请输入委托方公司' }]}
                >
                    <Input placeholder="请输入委托方公司名称" />
                </Form.Item>

                <Space style={{ width: '100%' }} size="large">
                    <Form.Item
                        name="clientContact"
                        label="联系人"
                        rules={[{ required: true, message: '请输入联系人' }]}
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        <Input placeholder="请输入联系人" />
                    </Form.Item>

                    <Form.Item
                        name="clientTel"
                        label="联系电话"
                        rules={[{ required: true, message: '请输入联系电话' }]}
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        <Input placeholder="请输入联系电话" />
                    </Form.Item>
                </Space>

                <Space style={{ width: '100%' }} size="large">
                    <Form.Item
                        name="clientEmail"
                        label="邮箱"
                        rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="clientAddress"
                        label="地址"
                        style={{ flex: 1, minWidth: 200 }}
                    >
                        <Input placeholder="请输入地址" />
                    </Form.Item>
                </Space>

                <div style={{ marginTop: 24, marginBottom: 16 }}>
                    <h3>样品和检测项目</h3>
                </div>

                <Form.Item
                    name="sampleName"
                    label="样品名称"
                    rules={[{ required: true, message: '请输入样品名称' }]}
                >
                    <Input placeholder="请输入样品名称" />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                    <Space style={{ marginBottom: 8 }}>
                        <strong>检测项目</strong>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={handleAddItem}
                            size="small"
                        >
                            添加项目
                        </Button>
                    </Space>

                    {items.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12, padding: 12, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <Space style={{ width: '100%' }}>
                                    <Input
                                        placeholder="检测项目"
                                        value={item.serviceItem}
                                        onChange={(e) => handleItemChange(index, 'serviceItem', e.target.value)}
                                        style={{ width: 200 }}
                                    />
                                    <Input
                                        placeholder="检测标准"
                                        value={item.methodStandard}
                                        onChange={(e) => handleItemChange(index, 'methodStandard', e.target.value)}
                                        style={{ width: 200 }}
                                    />
                                    <InputNumber
                                        placeholder="数量"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(value) => handleItemChange(index, 'quantity', value || 1)}
                                        style={{ width: 100 }}
                                    />
                                    <InputNumber
                                        placeholder="单价"
                                        min={0}
                                        precision={2}
                                        value={item.unitPrice}
                                        onChange={(value) => handleItemChange(index, 'unitPrice', value || 0)}
                                        style={{ width: 120 }}
                                        prefix="¥"
                                    />
                                    <span style={{ width: 120 }}>
                                        总价: ¥{item.totalPrice.toFixed(2)}
                                    </span>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveItem(index)}
                                        size="small"
                                    >
                                        删除
                                    </Button>
                                </Space>
                            </Space>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div><strong>报价合计:</strong> ¥{prices.subtotal.toFixed(2)}</div>
                        <div><strong>含税合计(6%):</strong> ¥{prices.taxTotal.toFixed(2)}</div>
                        <div><strong>优惠后合计:</strong> ¥{prices.discountTotal.toFixed(2)}</div>
                    </Space>
                </div>

                <Form.Item
                    name="clientRemark"
                    label="客户要求备注"
                    style={{ marginTop: 16 }}
                >
                    <TextArea rows={3} placeholder="请输入客户要求备注" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuotationForm;
