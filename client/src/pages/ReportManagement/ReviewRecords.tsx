import React, { useState } from 'react';
import { Card, Input, Timeline, Tag, Empty, Space, Select } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { reportReviewData } from '../../mock/report';

const ReviewRecords: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    const filteredData = reportReviewData.filter(item => {
        const matchSearch = item.reportNo.toLowerCase().includes(searchText.toLowerCase());
        const matchType = typeFilter ? item.reviewType === typeFilter : true;
        return matchSearch && matchType;
    });

    const getTimelineColor = (result: string) => {
        return result === '通过' ? 'green' : 'red';
    };

    const getIcon = (result: string) => {
        return result === '通过'
            ? <CheckCircleOutlined style={{ fontSize: 16 }} />
            : <CloseCircleOutlined style={{ fontSize: 16 }} />;
    };

    return (
        <Card
            title="报告审核记录"
            extra={
                <Space>
                    <Input
                        placeholder="搜索报告编号"
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="审核类型"
                        style={{ width: 120 }}
                        allowClear
                        onChange={setTypeFilter}
                    >
                        <Select.Option value="审核">审核</Select.Option>
                        <Select.Option value="批准">批准</Select.Option>
                    </Select>
                </Space>
            }
        >
            {filteredData.length > 0 ? (
                <Timeline mode="left">
                    {filteredData.map(record => (
                        <Timeline.Item
                            key={record.id}
                            color={getTimelineColor(record.reviewResult)}
                            dot={getIcon(record.reviewResult)}
                        >
                            <div style={{ padding: '10px 0' }}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Space>
                                        <Tag color="blue">{record.reportNo}</Tag>
                                        <Tag>{record.reviewType}</Tag>
                                        <Tag color={record.reviewResult === '通过' ? 'green' : 'red'}>
                                            {record.reviewResult}
                                        </Tag>
                                    </Space>
                                    <p style={{ margin: 0 }}>
                                        <ClockCircleOutlined /> {record.reviewDate} | 审核人: <strong>{record.reviewerName}</strong>
                                    </p>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '10px',
                                        borderRadius: 4,
                                        borderLeft: `3px solid ${record.reviewResult === '通过' ? '#52c41a' : '#ff4d4f'}`
                                    }}>
                                        <p style={{ margin: 0 }}><strong>审批意见:</strong></p>
                                        <p style={{ margin: '5px 0 0' }}>{record.comments}</p>
                                    </div>
                                    {record.dingTalkProcessId && (
                                        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#888' }}>
                                            钉钉流程ID: {record.dingTalkProcessId}
                                        </p>
                                    )}
                                </Space>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            ) : (
                <Empty description="暂无审核记录" />
            )}
        </Card>
    );
};

export default ReviewRecords;
