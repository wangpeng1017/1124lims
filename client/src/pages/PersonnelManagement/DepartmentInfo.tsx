import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { departmentData } from '../../mock/personnel';
import type { Department } from '../../mock/personnel';

const DepartmentInfo: React.FC = () => {
    const [dataSource, setDataSource] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Department | null>(null);
    const [form] = Form.useForm();

    // 初始化加载数据
    const fetchData = useCallback(() => {
        setDataSource(departmentData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Department) => {
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

    const columns: ColumnsType<Department> = [
        { title: '部门名称', dataIndex: 'name', key: 'name' },
        { title: '负责人', dataIndex: 'manager', key: 'manager' },
        { title: '职能描述', dataIndex: 'description', key: 'description' },
        {
            title: '操作',
            key: 'action',
            render: (record) => (
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
        <Card title="部门信息" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增部门</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑部门" : "新增部门"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="部门名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="manager" label="负责人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="职能描述">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default DepartmentInfo;
