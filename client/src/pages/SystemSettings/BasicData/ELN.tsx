
import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { elnTemplatesData } from '../../../mock/basicParameters';
import type { ELNTemplate } from '../../../mock/basicParameters';

const ELN: React.FC = () => {
    const [dataSource, setDataSource] = useState<ELNTemplate[]>(elnTemplatesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ELNTemplate | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ELNTemplate) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                setDataSource([...dataSource, { id: newId, ...values, updateTime: new Date().toISOString().split('T')[0] }]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ELNTemplate> = [
        { title: '模板名称', dataIndex: 'name', key: 'name' },
        { title: '版本号', dataIndex: 'version', key: 'version' },
        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="电子试验记录本 (ELN)"
            extra={
                <Space>
                    <Upload>
                        <Button icon={<UploadOutlined />}>导入Excel模板</Button>
                    </Upload>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增记录</Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑模板" : "新增模板"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="version" label="版本号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ELN;
