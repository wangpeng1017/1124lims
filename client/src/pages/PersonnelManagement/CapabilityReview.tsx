import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { reviewData } from '../../mock/personnel';
import type { Review } from '../../mock/personnel';

const CapabilityReview: React.FC = () => {
    const [dataSource] = useState<Review[]>(reviewData);

    const columns: ColumnsType<Review> = [
        { title: '员工姓名', dataIndex: 'empName', key: 'empName' },
        { title: '培训/考核内容', dataIndex: 'trainingContent', key: 'trainingContent' },
        { title: '考核日期', dataIndex: 'date', key: 'date' },
        {
            title: '考核结果',
            dataIndex: 'examResult',
            key: 'examResult',
            render: (result) => (
                <Tag color={result === 'Pass' ? 'green' : 'red'}>
                    {result === 'Pass' ? '通过' : '未通过'}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a>编辑</a>
                    <a style={{ color: 'red' }}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <Card title="能力评审" extra={<Button type="primary" icon={<PlusOutlined />}>新增记录</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default CapabilityReview;
