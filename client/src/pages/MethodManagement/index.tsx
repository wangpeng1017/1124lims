import React, { useState } from 'react';
import { Table, Card, Tag, Input, Space, Button, Modal, Form, Popconfirm, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { methodData } from '../../mock/methods';
import type { Method } from '../../mock/methods';

const MethodManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<Method[]>(methodData);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Method | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Method) => {
        setEditingRecord(record);
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

    const columns: ColumnsType<Method> = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
        {
            title: '标准名称',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            onFilter: (value, record) => record.name.includes(value as string) || record.standardNo.includes(value as string),
        },
        { title: '标准编号', dataIndex: 'standardNo', key: 'standardNo' },
        {
            title: '标准有效性',
            dataIndex: 'validity',
            key: 'validity',
            filters: [
                { text: '现行有效', value: '现行有效' },
                { text: '废止', value: '废止' },
            ],
            onFilter: (value, record) => record.validity === value,
            render: (text) => <Tag color={text === '现行有效' ? 'success' : 'default'}>{text}</Tag>,
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (text) => text === 'CNAS' ? <Tag color="blue">{text}</Tag> : text,
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
        <Card
            title="方法管理"
            extra={
                <Space>
                    <Input
                        placeholder="搜索标准名称或编号"
                        prefix={<SearchOutlined />}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" onClick={handleAdd}>新增标准</Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />

            <Modal title={editingRecord ? "编辑标准" : "新增标准"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="标准名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="standardNo" label="标准编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="validity" label="有效性" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="现行有效">现行有效</Select.Option>
                            <Select.Option value="废止">废止</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="remarks" label="备注">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default MethodManagement;
