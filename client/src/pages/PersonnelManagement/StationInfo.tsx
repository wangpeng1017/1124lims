import React, { useState } from 'react';
import { Table, Card, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { stationData } from '../../mock/personnel';
import type { Station } from '../../mock/personnel';

const StationInfo: React.FC = () => {
    const [dataSource] = useState<Station[]>(stationData);

    const columns: ColumnsType<Station> = [
        { title: '站点名称', dataIndex: 'name', key: 'name' },
        { title: '地址', dataIndex: 'address', key: 'address' },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson' },
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
        <Card title="站点信息" extra={<Button type="primary" icon={<PlusOutlined />}>新增站点</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default StationInfo;
