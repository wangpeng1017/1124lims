import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { clientData } from '../../mock/entrustment';
import type { IClientUnit } from '../../mock/entrustment';

const ClientUnit: React.FC = () => {
    const [dataSource, setDataSource] = useState<IClientUnit[]>(clientData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IClientUnit | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IClientUnit) => {
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
                const newItem = {
                    id: newId,
                    ...values,
                    creator: 'Admin',
                    createTime: new Date().toISOString().split('T')[0]
                };
                setDataSource([...dataSource, newItem]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IClientUnit> = [
        { title: '单位名称', dataIndex: 'name', key: 'name' },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson' },
        { title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone' },
        { title: '委托信息', dataIndex: 'entrustmentInfo', key: 'entrustmentInfo' },
        { title: '地址', dataIndex: 'address', key: 'address' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '创建人', dataIndex: 'creator', key: 'creator' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
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
        <Card title="委托单位管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增单位</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑单位" : "新增单位"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="单位名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactPhone" label="联系方式" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="entrustmentInfo" label="委托信息">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="address" label="地址">
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ClientUnit;
