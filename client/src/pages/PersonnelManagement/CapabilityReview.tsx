import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { reviewData, employeeData } from '../../mock/personnel';
import type { Review } from '../../mock/personnel';

const CapabilityReview: React.FC = () => {
    const [dataSource, setDataSource] = useState<Review[]>(reviewData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Review | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Review) => {
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
                setDataSource([...dataSource, { id: newId, ...values }]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<Review> = [
        { title: '员工姓名', dataIndex: 'name', key: 'name' },
        { title: '培训/考核内容', dataIndex: 'content', key: 'content' },
        { title: '考核日期', dataIndex: 'date', key: 'date' },
        {
            title: '考核结果',
            dataIndex: 'result',
            key: 'result',
            render: (result) => <Tag color={result === '合格' ? 'green' : 'red'}>{result}</Tag>
        },
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
        <Card title="能力评审" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增评审</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑评审" : "新增评审"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="员工姓名" rules={[{ required: true }]}>
                        <Select>
                            {employeeData.map(emp => (
                                <Select.Option key={emp.id} value={emp.name}>{emp.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="content" label="培训/考核内容" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="date" label="考核日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="result" label="考核结果" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="合格">合格</Select.Option>
                            <Select.Option value="不合格">不合格</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default CapabilityReview;
