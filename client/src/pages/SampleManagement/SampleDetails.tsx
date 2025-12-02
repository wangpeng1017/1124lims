import React, { useState } from 'react';
import { Table, Card, Input, Select, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { sampleDetailData, type ISampleDetail } from '../../mock/sample';

const SampleDetails: React.FC = () => {
    const [dataSource] = useState<ISampleDetail[]>(sampleDetailData);
    const [filteredData, setFilteredData] = useState<ISampleDetail[]>(sampleDetailData);

    const handleSearch = (value: string) => {
        const filtered = dataSource.filter(item =>
            item.sampleNo.toLowerCase().includes(value.toLowerCase()) ||
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.entrustmentId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleStatusFilter = (value: string) => {
        if (value === 'all') {
            setFilteredData(dataSource);
        } else {
            setFilteredData(dataSource.filter(item => item.status === value));
        }
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            '待收样': 'default',
            '已收样': 'blue',
            '已分配': 'cyan',
            '检测中': 'processing',
            '已完成': 'success',
            '已归还': 'green',
            '已销毁': 'red'
        };
        return colorMap[status] || 'default';
    };

    const columns: ColumnsType<ISampleDetail> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo', fixed: 'left', width: 140 },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 140 },
        { title: '样品名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '规格型号', dataIndex: 'spec', key: 'spec', width: 120 },
        { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
        { title: '收样日期', dataIndex: 'receiptDate', key: 'receiptDate', width: 110 },
        { title: '收样人', dataIndex: 'receiptPerson', key: 'receiptPerson', width: 100 },
        { title: '领样日期', dataIndex: 'collectionDate', key: 'collectionDate', width: 110 },
        { title: '领样人', dataIndex: 'collectionPerson', key: 'collectionPerson', width: 100 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            fixed: 'right',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
    ];

    return (
        <Card
            title="样品明细台账"
            extra={
                <Space>
                    <Input
                        placeholder="搜索样品编号/名称/委托单号"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={handleStatusFilter}
                        options={[
                            { value: 'all', label: '全部状态' },
                            { value: '已收样', label: '已收样' },
                            { value: '已分配', label: '已分配' },
                            { value: '检测中', label: '检测中' },
                            { value: '已完成', label: '已完成' },
                        ]}
                    />
                    <ExportOutlined style={{ fontSize: 16, cursor: 'pointer' }} title="导出Excel" />
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default SampleDetails;
