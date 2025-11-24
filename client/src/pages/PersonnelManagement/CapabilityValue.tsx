import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { capabilityData, employeeData } from '../../mock/personnel';
import type { Capability } from '../../mock/personnel';
import { detectionParametersData } from '../../mock/basicParameters';

const CapabilityValue: React.FC = () => {
    const [dataSource, setDataSource] = useState<Capability[]>(capabilityData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Capability | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Capability) => {
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

    const columns: ColumnsType<Capability> = [
        { title: '员工姓名', dataIndex: 'name', key: 'name' },
        { title: '检测参数/项目', dataIndex: 'parameter', key: 'parameter' },
        { title: '证书/资质', dataIndex: 'certificate', key: 'certificate' },
        { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate' },
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
        <Card title="能力值" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增能力</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑能力" : "新增能力"}
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
                    <Form.Item name="parameter" label="检测参数/项目" rules={[{ required: true }]}>
                        <Select>
                            {detectionParametersData.map(param => (
                                <Select.Option key={param.id} value={param.name}>{param.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="certificate" label="证书/资质" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="expiryDate" label="有效期至" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default CapabilityValue;
