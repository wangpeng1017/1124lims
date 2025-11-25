import React, { useState } from 'react';
import { Card, Table, Input, Select, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import { paymentRecordData, type IPaymentRecord } from '../../mock/finance';

const PaymentRecords: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [methodFilter, setMethodFilter] = useState<string | null>(null);

    const filteredData = paymentRecordData.filter(item => {
        const matchSearch = item.receivableNo.toLowerCase().includes(searchText.toLowerCase()) ||
            item.recordNo.toLowerCase().includes(searchText.toLowerCase());
        const matchMethod = methodFilter ? item.paymentMethod === methodFilter : true;
        return matchSearch && matchMethod;
    });

    const getMethodColor = (method: string) => {
        const colorMap: Record<string, string> = {
            '现金': 'green',
            '银行转账': 'blue',
            '支票': 'orange',
            '其他': 'default'
        };
        return colorMap[method] || 'default';
    };

    const columns: ColumnsType<IPaymentRecord> = [
        { title: '收款记录编号', dataIndex: 'recordNo', key: 'recordNo' },
        { title: '应收账款编号', dataIndex: 'receivableNo', key: 'receivableNo' },
        {
            title: '收款金额',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            render: (val) => <strong style={{ color: '#52c41a', fontSize: 16 }}>¥{val.toFixed(2)}</strong>
        },
        { title: '收款日期', dataIndex: 'paymentDate', key: 'paymentDate' },
        {
            title: '收款方式',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => <Tag color={getMethodColor(method)}>{method}</Tag>
        },
        { title: '经办人', dataIndex: 'handlerName', key: 'handlerName' },
        { title: '银行名称', dataIndex: 'bankName', key: 'bankName' },
        { title: '交易流水号', dataIndex: 'transactionNo', key: 'transactionNo' },
        {
            title: '附件',
            dataIndex: 'attachments',
            key: 'attachments',
            render: (attachments?: string[]) => (
                attachments && attachments.length > 0 ? (
                    <Space>
                        {attachments.map((file, idx) => (
                            <Tag key={idx} icon={<FilePdfOutlined />} color="blue">
                                {file}
                            </Tag>
                        ))}
                    </Space>
                ) : '-'
            )
        },
        { title: '备注', dataIndex: 'remark', key: 'remark' }
    ];

    return (
        <Card
            title="收款记录"
            extra={
                <Space>
                    <Input
                        placeholder="搜索账款编号/记录编号"
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="收款方式"
                        style={{ width: 120 }}
                        allowClear
                        onChange={setMethodFilter}
                    >
                        <Select.Option value="现金">现金</Select.Option>
                        <Select.Option value="银行转账">银行转账</Select.Option>
                        <Select.Option value="支票">支票</Select.Option>
                        <Select.Option value="其他">其他</Select.Option>
                    </Select>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 1400 }}
            />
        </Card>
    );
};

export default PaymentRecords;
