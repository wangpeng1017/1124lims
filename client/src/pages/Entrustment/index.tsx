import React from 'react';
import { Table, Card, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { entrustmentData } from '../../mock/entrustment';
import type { EntrustmentRecord } from '../../mock/entrustment';

const Entrustment: React.FC = () => {
    const columns: ColumnsType<EntrustmentRecord> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: '委托编号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
        },
        {
            title: '检测报告编号',
            dataIndex: 'reportId',
            key: 'reportId',
        },
        {
            title: '送样时间',
            dataIndex: 'sampleDate',
            key: 'sampleDate',
        },
        {
            title: '样件名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
        },
        {
            title: '试验项目',
            dataIndex: 'testItems',
            key: 'testItems',
            ellipsis: true,
        },
        {
            title: '跟单人',
            dataIndex: 'follower',
            key: 'follower',
            filters: Array.from(new Set(entrustmentData.map(d => d.follower))).map(f => ({ text: f, value: f })),
            onFilter: (value, record) => record.follower === value,
            render: (text) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => console.log('View', record)}>查看</a>
                    <a onClick={() => console.log('Edit', record)}>编辑</a>
                </Space>
            ),
        },
    ];

    return (
        <Card title="委托信息管理" extra={<Button type="primary">新建委托</Button>}>
            <Table
                columns={columns}
                dataSource={entrustmentData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default Entrustment;
