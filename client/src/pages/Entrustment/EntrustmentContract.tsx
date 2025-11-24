import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { contractData, clientData, entrustmentData } from '../../mock/entrustment';
import type { IEntrustmentContract } from '../../mock/entrustment';

const EntrustmentContract: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEntrustmentContract[]>(contractData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEntrustmentContract | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IEntrustmentContract) => {
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

    const columns: ColumnsType<IEntrustmentContract> = [
        { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
        { title: '合同名称', dataIndex: 'contractName', key: 'contractName' },
        {
            title: '委托单编号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            render: (text) => <a onClick={() => message.info(`跳转到委托单: ${text}`)}>{text}</a>
        },
        { title: '签订日期', dataIndex: 'signDate', key: 'signDate' },
        { title: '到期日期', dataIndex: 'expiryDate', key: 'expiryDate' },
        { title: '委托单位', dataIndex: 'clientUnit', key: 'clientUnit' },
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
        <Card title="委托合同管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增合同</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑合同" : "新增合同"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="contractNo" label="合同编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contractName" label="合同名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="entrustmentId" label="委托单编号" rules={[{ required: true }]}>
                        <Select>
                            {entrustmentData.map(e => (
                                <Select.Option key={e.id} value={e.entrustmentId}>{e.entrustmentId}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="signDate" label="签订日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="expiryDate" label="到期日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="clientUnit" label="委托单位" rules={[{ required: true }]}>
                        <Select>
                            {clientData.map(c => (
                                <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default EntrustmentContract;
