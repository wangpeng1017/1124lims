import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { employeeData } from '../../mock/personnel';
import type { Employee } from '../../mock/personnel';

const EmployeeList: React.FC = () => {
    const [dataSource] = useState<Employee[]>(employeeData);

    const columns: ColumnsType<Employee> = [
        { title: '工号', dataIndex: 'empId', key: 'empId' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '职务', dataIndex: 'position', key: 'position' },
        { title: '部门', dataIndex: 'department', key: 'department' },
        { title: '联系方式', dataIndex: 'contact', key: 'contact' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status === 'Active' ? '在职' : '离职'}
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
        <Card title="员工列表" extra={<Button type="primary" icon={<PlusOutlined />}>新增员工</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default EmployeeList;
