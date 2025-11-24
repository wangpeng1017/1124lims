import React, { useState } from 'react';
import { Table, Card, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { departmentData } from '../../mock/personnel';
import type { Department } from '../../mock/personnel';

const DepartmentInfo: React.FC = () => {
    const [dataSource] = useState<Department[]>(departmentData);

    const columns: ColumnsType<Department> = [
        { title: '部门名称', dataIndex: 'name', key: 'name' },
        { title: '负责人', dataIndex: 'manager', key: 'manager' },
        { title: '职能描述', dataIndex: 'description', key: 'description' },
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
        <Card title="部门信息" extra={<Button type="primary" icon={<PlusOutlined />}>新增部门</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default DepartmentInfo;
