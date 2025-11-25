import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { consumablesData, stockTransactionData, type IConsumableInfo, type IStockTransaction } from '../../mock/consumables';
import { employeeData, departmentData } from '../../mock/personnel';

const StockTransactions: React.FC = () => {
    const [consumables, setConsumables] = useState<IConsumableInfo[]>(consumablesData);
    const [transactions, setTransactions] = useState<IStockTransaction[]>(stockTransactionData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'入库' | '出库'>('出库');
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    // 过滤记录
    const filteredTransactions = transactions.filter(t =>
        t.consumableName.includes(searchText) ||
        t.transactionNo.includes(searchText) ||
        t.consumableCode.includes(searchText)
    );

    const handleTransaction = (type: '入库' | '出库') => {
        setTransactionType(type);
        form.resetFields();
        form.setFieldsValue({
            transactionDate: dayjs(),
            handlerName: '当前用户'
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const selectedConsumable = consumables.find(c => c.code === values.consumableCode);
            if (!selectedConsumable) return;

            // 检查库存（仅出库时）
            if (transactionType === '出库' && selectedConsumable.currentStock < values.quantity) {
                message.error(`库存不足! 当前库存: ${selectedConsumable.currentStock}`);
                return;
            }

            // 更新库存
            const newStock = transactionType === '入库'
                ? selectedConsumable.currentStock + values.quantity
                : selectedConsumable.currentStock - values.quantity;

            // 更新耗材列表中的库存
            const updatedConsumables = consumables.map(c =>
                c.code === values.consumableCode
                    ? {
                        ...c,
                        currentStock: newStock,
                        status: (newStock <= c.minStock) ? '预警' : '正常' as any
                    }
                    : c
            );
            setConsumables(updatedConsumables);

            // 创建新记录
            const newId = Math.max(...transactions.map(t => t.id), 0) + 1;
            const prefix = transactionType === '入库' ? 'IN' : 'OUT';
            const dateStr = dayjs().format('YYYYMMDD');
            const newTransaction: IStockTransaction = {
                id: newId,
                transactionNo: `${prefix}-${dateStr}-${String(newId).padStart(3, '0')}`,
                type: transactionType,
                consumableName: selectedConsumable.name,
                ...values,
                transactionDate: values.transactionDate.format('YYYY-MM-DD')
            };

            setTransactions([newTransaction, ...transactions]);

            message.success(`${transactionType}成功`);
            if (transactionType === '出库' && newStock <= selectedConsumable.minStock) {
                message.warning('注意: 库存已低于预警值!');
            }

            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IStockTransaction> = [
        { title: '单据编号', dataIndex: 'transactionNo', key: 'transactionNo' },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <Tag color={type === '入库' ? 'green' : 'orange'}>{type}</Tag>
        },
        { title: '耗材名称', dataIndex: 'consumableName', key: 'consumableName' },
        { title: '数量', dataIndex: 'quantity', key: 'quantity' },
        { title: '日期', dataIndex: 'transactionDate', key: 'transactionDate' },
        {
            title: '相关信息',
            key: 'info',
            render: (_, record) => (
                record.type === '出库'
                    ? <span>领用: {record.recipientName} ({record.department})</span>
                    : <span>供应商: {record.supplier}</span>
            )
        },
        { title: '经办人', dataIndex: 'handlerName', key: 'handlerName' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
    ];

    return (
        <Card
            title="出入库管理"
            extra={
                <Space>
                    <Input
                        placeholder="搜索记录..."
                        prefix={<SearchOutlined />}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleTransaction('入库')}>
                        入库
                    </Button>
                    <Button danger icon={<MinusOutlined />} onClick={() => handleTransaction('出库')}>
                        出库
                    </Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredTransactions}
                rowKey="id"
            />

            <Modal
                title={`${transactionType}操作`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="consumableCode"
                        label="选择耗材"
                        rules={[{ required: true, message: '请选择耗材' }]}
                    >
                        <Select
                            showSearch
                            placeholder="搜索耗材名称或编号"
                            optionFilterProp="children"
                        >
                            {consumables.map(c => (
                                <Select.Option key={c.code} value={c.code}>
                                    {c.name} ({c.specification}) - 库存: {c.currentStock} {c.unit}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label={`${transactionType}数量`}
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="transactionDate" label="日期" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    {transactionType === '出库' ? (
                        <>
                            <Form.Item name="department" label="领用部门" rules={[{ required: true }]}>
                                <Select>
                                    {departmentData.map(d => (
                                        <Select.Option key={d.id} value={d.name}>{d.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="recipientName" label="领用人" rules={[{ required: true }]}>
                                <Select showSearch>
                                    {employeeData.map(e => (
                                        <Select.Option key={e.id} value={e.name}>{e.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="purpose" label="用途">
                                <Input />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item name="supplier" label="供应商">
                                <Input />
                            </Form.Item>
                            <Form.Item name="batchNo" label="批号">
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item name="handlerName" label="经办人" rules={[{ required: true }]}>
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default StockTransactions;
