import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { supplierData } from '../../mock/supplier';
import type { ISupplier } from '../../mock/supplier';

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

    const handleDelete = (id: string) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleToggleStatus = (record: ISupplier) => {
        const newStatus = record.cooperationStatus === 'active' ? 'suspended' : 'active';
        setDataSource(dataSource.map(item =>
            item.id === record.id ? { ...item, cooperationStatus: newStatus } : item
        ));
        message.success(`已${newStatus === 'active' ? '启用' : '停用'}`);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values } : item
                ));
                message.success('更新成功');
            } else {
                const maxId = Math.max(...dataSource.map(item => parseInt(item.id.replace('SUP', '')) || 0), 0);
                const newId = `SUP${String(maxId + 1).padStart(3, '0')}`;

                setDataSource([...dataSource, {
                    id: newId,
                    code: newId, // Assuming code is same as ID for now
                    ...values,
                    cooperationStatus: 'active',
                    categories: [], // Default empty
                    certifications: [], // Default empty
                    cooperationStartDate: new Date().toISOString().split('T')[0],
                } as ISupplier]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ISupplier> = [
        { title: '供应商编号', dataIndex: 'code', key: 'code', width: 120 },
        { title: '供应商名称', dataIndex: 'name', key: 'name', width: 200 },
        {
            title: '等级',
            dataIndex: 'evaluationLevel',
            key: 'evaluationLevel',
            width: 80,
            render: (level) => {
                const colorMap: Record<string, string> = { A: 'gold', B: 'blue', C: 'default' };
                return <Tag color={colorMap[level]}>{level}级</Tag>;
            }
        },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
        { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
        {
            title: '资质证书',
            dataIndex: 'certifications',
            key: 'certifications',
            width: 120,
            render: (certs) => certs?.map((c: any) => c.number).join(', ')
        },
        {
            title: '能力范围',
            dataIndex: 'capabilities',
            key: 'capabilities',
            ellipsis: true,
            render: (caps) => caps?.map((c: any) => c.parameterName).join(', ')
        },
        {
            title: '状态',
            dataIndex: 'cooperationStatus',
            key: 'cooperationStatus',
            width: 80,
            fixed: 'right',
            render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? '启用' : '停用'}</Tag>
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
                        {record.cooperationStatus === 'active' ? '停用' : '启用'}
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
                    <Form.Item name="evaluationLevel" label="供应商等级" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="A">A级（优秀）</Select.Option>
                            <Select.Option value="B">B级（良好）</Select.Option>
                            <Select.Option value="C">C级（合格）</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="联系邮箱">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                        <Input />
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
