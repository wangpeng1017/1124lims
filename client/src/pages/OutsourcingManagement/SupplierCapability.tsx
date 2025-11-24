import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, Popconfirm, message, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { supplierCapabilityData, type ISupplierCapability, supplierData } from '../../mock/outsourcing';
import { detectionParametersData } from '../../mock/basicParams';

const SupplierCapability: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISupplierCapability[]>(supplierCapabilityData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISupplierCapability | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISupplierCapability) => {
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
            const supplier = supplierData.find(s => s.id === values.supplierId);
            const parameter = detectionParametersData.find((p: any) => p.id === values.parameterId);

            // 检查有效期
            const isExpired = new Date(values.validTo) < new Date();
            const status = isExpired ? '过期' : '有效';

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, supplierName: supplier?.name || '', parameterName: parameter?.name || '', status }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                setDataSource([...dataSource, {
                    id: newId,
                    ...values,
                    supplierName: supplier?.name || '',
                    parameterName: parameter?.name || '',
                    status
                }]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ISupplierCapability> = [
        { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 200 },
        { title: '检测参数', dataIndex: 'parameterName', key: 'parameterName', width: 150 },
        { title: '证书编号', dataIndex: 'certificateNo', key: 'certificateNo', width: 150 },
        { title: '有效期起', dataIndex: 'validFrom', key: 'validFrom', width: 120 },
        { title: '有效期至', dataIndex: 'validTo', key: 'validTo', width: 120 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Badge
                    status={status === '有效' ? 'success' : 'error'}
                    text={status}
                />
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 获取启用的供应商
    const activeSuppliers = supplierData.filter(s => s.status === '启用');

    return (
        <Card
            title={<><SafetyCertificateOutlined /> 供应商能力值管理</>}
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建能力认证</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingRecord ? "编辑能力认证" : "新建能力认证"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="supplierId"
                        label="供应商"
                        rules={[{ required: true, message: '请选择供应商' }]}
                    >
                        <Select placeholder="选择供应商" disabled={!!editingRecord}>
                            {activeSuppliers.map(supplier => (
                                <Select.Option key={supplier.id} value={supplier.id}>
                                    {supplier.name} ({supplier.level}级)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="parameterId"
                        label="检测参数"
                        rules={[{ required: true, message: '请选择检测参数' }]}
                    >
                        <Select placeholder="选择检测参数" disabled={!!editingRecord}>
                            {detectionParametersData.map((param: any) => (
                                <Select.Option key={param.id} value={param.id}>
                                    {param.name} - {param.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="certificateNo"
                        label="证书编号"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="输入资质证书编号" />
                    </Form.Item>
                    <Form.Item
                        name="validFrom"
                        label="有效期起"
                        rules={[{ required: true }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        name="validTo"
                        label="有效期至"
                        rules={[{ required: true }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SupplierCapability;
