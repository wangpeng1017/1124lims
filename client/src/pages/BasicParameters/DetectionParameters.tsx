import React, { useState } from 'react';
import { Table, Card, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { detectionParametersData } from '../../mock/basicParameters';
import type { DetectionParameter } from '../../mock/basicParameters';

const DetectionParameters: React.FC = () => {
    const [dataSource] = useState<DetectionParameter[]>(detectionParametersData);

    const columns: ColumnsType<DetectionParameter> = [
        { title: '参数/项目名称', dataIndex: 'name', key: 'name' },
        { title: '检测标准/依据', dataIndex: 'standard', key: 'standard' },
        { title: '标准值', dataIndex: 'value', key: 'value' },
        { title: '检测要求', dataIndex: 'requirements', key: 'requirements' },
        { title: '检测用料', dataIndex: 'materials', key: 'materials' },
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
        <Card title="检测参数/项目管理" extra={<Button type="primary" icon={<PlusOutlined />}>新增参数</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default DetectionParameters;
