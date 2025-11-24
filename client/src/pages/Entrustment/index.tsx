import React, { useState } from 'react';
import { Table, Card, Tag, Space, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { entrustmentData } from '../../mock/entrustment';
import type { EntrustmentRecord } from '../../mock/entrustment';

const Entrustment: React.FC = () => {
    const [dataSource, setDataSource] = useState<EntrustmentRecord[]>(entrustmentData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EntrustmentRecord | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: EntrustmentRecord) => {
        setEditingRecord(record);
        // Convert date strings to dayjs objects if needed, but here we keep strings for simplicity in mock
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRecord) {
                setDataSource(prev => prev.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
                setDataSource(prev => [{ id: newId, ...values }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<EntrustmentRecord> = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 70 },
        { title: '委托编号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        { title: '检测报告编号', dataIndex: 'reportId', key: 'reportId' },
        { title: '送样时间', dataIndex: 'sampleDate', key: 'sampleDate' },
        { title: '样件名称', dataIndex: 'sampleName', key: 'sampleName' },
        { title: '试验项目', dataIndex: 'testItems', key: 'testItems', ellipsis: true },
        {
            title: '跟单人',
            dataIndex: 'follower',
            key: 'follower',
            filters: Array.from(new Set(dataSource.map(d => d.follower))).map(f => ({ text: f, value: f })),
            onFilter: (value, record) => record.follower === value,
            render: (text) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card title="委托信息管理" extra={<Button type="primary" onClick={handleAdd}>新建委托</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />

            <Modal title={editingRecord ? "编辑委托" : "新建委托"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="entrustmentId" label="委托编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="reportId" label="检测报告编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sampleDate" label="送样时间" rules={[{ required: true }]}>
                        <Input placeholder="YYYY.MM.DD" />
                    </Form.Item>
                    <Form.Item name="sampleName" label="样件名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="testItems" label="试验项目" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="follower" label="跟单人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Entrustment;
