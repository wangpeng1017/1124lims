import React, { useState } from 'react';
import { Card, Timeline, Input, Select, Space, Tag, Empty } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { sampleTransferData, type ISampleTransfer } from '../../mock/sample';

const TransferRecords: React.FC = () => {
    const [dataSource] = useState<ISampleTransfer[]>(sampleTransferData);
    const [filteredData, setFilteredData] = useState<ISampleTransfer[]>(sampleTransferData);
    const [selectedSample, setSelectedSample] = useState<string>('all');

    const handleSampleFilter = (value: string) => {
        setSelectedSample(value);
        if (value === 'all') {
            setFilteredData(dataSource);
        } else {
            setFilteredData(dataSource.filter(item => item.sampleNo === value));
        }
    };

    const handleSearch = (value: string) => {
        if (!value) {
            setFilteredData(selectedSample === 'all' ? dataSource : dataSource.filter(item => item.sampleNo === selectedSample));
            return;
        }
        const filtered = dataSource.filter(item =>
            item.sampleNo.toLowerCase().includes(value.toLowerCase()) ||
            item.operator.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
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

    // 按样品分组
    const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.sampleNo]) {
            acc[item.sampleNo] = [];
        }
        acc[item.sampleNo].push(item);
        return acc;
    }, {} as Record<string, ISampleTransfer[]>);

    const uniqueSamples = Array.from(new Set(dataSource.map(item => item.sampleNo)));

    return (
        <Card
            title="样品流转记录"
            extra={
                <Space>
                    <Input
                        placeholder="搜索样品编号/操作人"
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Select
                        value={selectedSample}
                        style={{ width: 180 }}
                        onChange={handleSampleFilter}
                    >
                        <Select.Option value="all">全部样品</Select.Option>
                        {uniqueSamples.map(sampleNo => (
                            <Select.Option key={sampleNo} value={sampleNo}>{sampleNo}</Select.Option>
                        ))}
                    </Select>
                </Space>
            }
        >
            {Object.keys(groupedData).length === 0 ? (
                <Empty description="暂无流转记录" />
            ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {Object.entries(groupedData).map(([sampleNo, records]) => (
                        <div key={sampleNo} style={{ marginBottom: 32 }}>
                            <h3 style={{ marginBottom: 16 }}>
                                样品编号: <Tag color="blue">{sampleNo}</Tag>
                            </h3>
                            <Timeline
                                items={records.map(record => ({
                                    dot: record.toStatus.includes('完成') || record.toStatus.includes('归还')
                                        ? <CheckCircleOutlined style={{ fontSize: '16px' }} />
                                        : <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                                    color: getStatusColor(record.toStatus),
                                    children: (
                                        <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                <Tag color={getStatusColor(record.fromStatus)}>{record.fromStatus}</Tag>
                                                →
                                                <Tag color={getStatusColor(record.toStatus)}>{record.toStatus}</Tag>
                                            </div>
                                            <div style={{ color: '#666', fontSize: '13px' }}>
                                                <div>操作人: {record.operator}</div>
                                                <div>操作时间: {record.operateTime}</div>
                                                {record.remark && <div>备注: {record.remark}</div>}
                                            </div>
                                        </div>
                                    )
                                }))}
                            />
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TransferRecords;
