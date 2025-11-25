import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { reviewData, employeeData, capabilityData } from '../../mock/personnel';
import type { Review } from '../../mock/personnel';

const CapabilityReview: React.FC = () => {
    const [dataSource, setDataSource] = useState<Review[]>(reviewData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Review | null>(null);
    const [form] = Form.useForm();
    const [selectedEmpName, setSelectedEmpName] = useState<string | null>(null);

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedEmpName(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Review) => {
        setEditingRecord(record);
        setSelectedEmpName(record.empName);
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

    const handleEmpChange = (value: string) => {
        setSelectedEmpName(value);
        form.setFieldValue('capabilityId', undefined); // Reset capability selection
    };

    const filteredCapabilities = selectedEmpName
        ? capabilityData.filter(cap => cap.empName === selectedEmpName)
        : [];

    const columns: ColumnsType<Review> = [
        { title: '员工姓名', dataIndex: 'empName', key: 'empName' },
        {
            title: '关联能力',
            key: 'capabilityId',
            render: (_, record) => {
                const cap = capabilityData.find(c => c.id === record.capabilityId);
                return cap ? `${cap.parameter} (${cap.certificate})` : '-';
            }
        },
        { title: '培训/考核内容', dataIndex: 'trainingContent', key: 'trainingContent' },
        { title: '考核日期', dataIndex: 'date', key: 'date' },
        {
            title: '考核结果',
            dataIndex: 'examResult',
            key: 'examResult',
            render: (result) => <Tag color={result === 'Pass' ? 'green' : 'red'}>{result === 'Pass' ? '合格' : '不合格'}</Tag>
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
                    <Form.Item name="empName" label="员工姓名" rules={[{ required: true }]}>
                        <Select onChange={handleEmpChange}>
                            {employeeData.map(emp => (
                                <Select.Option key={emp.id} value={emp.name}>{emp.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="capabilityId" label="关联能力">
                        <Select placeholder="选择关联的能力（可选）" disabled={!selectedEmpName}>
                            {filteredCapabilities.map(cap => (
                                <Select.Option key={cap.id} value={cap.id}>
                                    {cap.parameter} - {cap.certificate}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="trainingContent" label="培训/考核内容" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="date" label="考核日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="examResult" label="考核结果" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Pass">合格</Select.Option>
                            <Select.Option value="Fail">不合格</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default CapabilityReview;
