import React, { useState } from 'react';
import { Table, Card, Tag, Input, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { methodData } from '../../mock/methods';
import type { Method } from '../../mock/methods';

const MethodManagement: React.FC = () => {
    const [searchText, setSearchText] = useState('');

    const columns: ColumnsType<Method> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '标准名称',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.name.includes(value as string) ||
                record.standardNo.includes(value as string),
        },
        {
            title: '标准编号',
            dataIndex: 'standardNo',
            key: 'standardNo',
        },
        {
            title: '标准有效性',
            dataIndex: 'validity',
            key: 'validity',
            render: (text) => (
                <Tag color={text === '现行有效' ? 'success' : 'default'}>
                    {text}
                </Tag>
            ),
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (text) => text === 'CNAS' ? <Tag color="blue">{text}</Tag> : text,
        },
    ];

    return (
        <Card
            title="方法管理"
            extra={
                <Space>
                    <Input
                        placeholder="搜索标准名称或编号"
                        prefix={<SearchOutlined />}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary">新增标准</Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={methodData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default MethodManagement;
