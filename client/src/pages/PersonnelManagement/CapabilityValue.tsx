import React, { useState } from 'react';
import { Table, Card, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { capabilityData } from '../../mock/personnel';
import type { Capability } from '../../mock/personnel';

const CapabilityValue: React.FC = () => {
    const [dataSource] = useState<Capability[]>(capabilityData);

    const columns: ColumnsType<Capability> = [
        { title: '员工姓名', dataIndex: 'empName', key: 'empName' },
        { title: '检测参数', dataIndex: 'parameter', key: 'parameter' },
        { title: '证书/资质', dataIndex: 'certificate', key: 'certificate' },
        { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate' },
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
        <Card title="能力值管理" extra={<Button type="primary" icon={<PlusOutlined />}>新增能力</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default CapabilityValue;
