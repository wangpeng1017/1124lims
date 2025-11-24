import React, { useState } from 'react';
import { Table, Card, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { elnTemplatesData } from '../../mock/basicParameters';
import type { ELNTemplate } from '../../mock/basicParameters';

const ELN: React.FC = () => {
    const [dataSource] = useState<ELNTemplate[]>(elnTemplatesData);

    const handleImport = () => {
        message.success('模拟导入 Excel 模板成功');
    };

    const columns: ColumnsType<ELNTemplate> = [
        { title: '模板名称', dataIndex: 'name', key: 'name' },
        { title: '创建日期', dataIndex: 'createDate', key: 'createDate' },
        { title: '创建人', dataIndex: 'author', key: 'author' },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <a>预览</a>
                    <a>使用</a>
                    <a style={{ color: 'red' }}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="电子试验记录本 (ELN)"
            extra={
                <Space>
                    <Button icon={<UploadOutlined />} onClick={handleImport}>导入 Excel 模板</Button>
                    <Button type="primary" icon={<PlusOutlined />}>新增记录</Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </Card>
    );
};

export default ELN;
