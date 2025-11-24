import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { supplierData, type ISupplier } from '../../mock/outsourcing';

const SupplierInfo: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISupplier[]>(supplierData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISupplier | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISupplier) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleToggleStatus = (record: ISupplier) => {
        const newStatus = record.status === '启用' ? '停用' : '启用';
        setDataSource(dataSource.map(item =>
            item.id === record.id ? { ...item, status: newStatus } : item
        ));
        message.success(`已${newStatus}`);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const supplierCode = `SUP${String(newId).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    supplierCode,
                    ...values,
                    status: '启用',
                    creator: '当前用户',
                    createTime: new Date().toISOString().split('T')[0]
                }]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ISupplier> = [
        { title: '供应商编号', dataIndex: 'supplierCode', key: 'supplierCode', width: 120 },
        { title: '供应商名称', dataIndex: 'name', key: 'name', width: 200 },
        {
            title: '等级',
            dataIndex: 'level',
            key: 'level',
            width: 80,
            render: (level) => {
                const colorMap: Record<string, string> = { A: 'gold', B: 'blue', C: 'default' };
                return <Tag color={colorMap[level]}>{level}级</Tag>;
            }
        },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
        { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
        { title: '资质证书', dataIndex: 'qualification', key: 'qualification', width: 120 },
        { title: '能力范围', dataIndex: 'capabilityScope', key: 'capabilityScope', ellipsis: true },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            fixed: 'right',
            render: (status) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleToggleStatus(record)}>
                        {record.status === '启用' ? '停用' : '启用'}
                    </a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="供应商信息管理"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建供应商</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingRecord ? "编辑供应商" : "新建供应商"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="供应商名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="level" label="供应商等级" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="A">A级（优秀）</Select.Option>
                            <Select.Option value="B">B级（良好）</Select.Option>
                            <Select.Option value="C">C级（合格）</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactEmail" label="联系邮箱">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="qualification" label="资质证书编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="capabilityScope" label="能力范围" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} placeholder="请描述供应商的检测能力范围" />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SupplierInfo;
