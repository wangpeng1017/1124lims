import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { inspectionStandardsData } from '../../mock/basicParameters';
import type { InspectionStandard } from '../../mock/basicParameters';

const InspectionStandards: React.FC = () => {
    const [dataSource] = useState<InspectionStandard[]>(inspectionStandardsData);

    const columns: ColumnsType<InspectionStandard> = [
        { title: '标准/依据名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '编号', dataIndex: 'standardNo', key: 'standardNo', width: 150 },
        { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '有效性',
            dataIndex: 'validity',
            key: 'validity',
            render: (text) => <Tag color={text === '现行有效' ? 'success' : 'default'}>{text}</Tag>,
            width: 100
        },
        {
            title: '关联设备',
            dataIndex: 'devices',
            key: 'devices',
            render: (devices: string[]) => (
                <>
                    {devices.map(device => (
                        <Tag color="blue" key={device}>{device}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '检测参数/项目',
            dataIndex: 'parameters',
            key: 'parameters',
            render: (params: string[]) => (
                <>
                    {params.map(param => (
                        <Tag color="cyan" key={param}>{param}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '可检测人员',
            dataIndex: 'personnel',
            key: 'personnel',
            render: (people: string[]) => (
                <>
                    {people.map(person => (
                        <Tag color="purple" key={person}>{person}</Tag>
                    ))}
                </>
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
            width: 120
        },
    ];

    return (
        <Card title="检查标准/依据管理" extra={<Button type="primary" icon={<PlusOutlined />}>新增标准</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default InspectionStandards;
