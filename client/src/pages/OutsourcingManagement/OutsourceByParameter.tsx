import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, InputNumber, message, Tag, Popconfirm, Badge, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SafetyCertificateOutlined, DingdingOutlined } from '@ant-design/icons';
import { outsourceParameterData, type IOutsourceParameter } from '../../mock/outsourcing';
import { supplierData } from '../../mock/supplier';
import type { ISupplier, ISupplierCapability } from '../../mock/supplier';
import { sampleDetailData } from '../../mock/sample';
import { detectionParametersData } from '../../mock/basicParameters';

const OutsourceByParameter: React.FC = () => {
    const [dataSource, setDataSource] = useState<IOutsourceParameter[]>(outsourceParameterData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IOutsourceParameter | null>(null);
    const [selectedParameter, setSelectedParameter] = useState<number | null>(null);
    const [qualifiedSuppliers, setQualifiedSuppliers] = useState<string[]>([]);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        setSelectedParameter(null);
        setQualifiedSuppliers([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IOutsourceParameter) => {
        setEditingRecord(record);
        setSelectedParameter(record.parameterId);
        setQualifiedSuppliers(record.qualifiedSuppliers);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleParameterChange = (parameterId: number) => {
        setSelectedParameter(parameterId);

        // 获取具备该参数能力的供应商
        const qualified = supplierData
            .filter((supplier: ISupplier) =>
                supplier.cooperationStatus === 'active' &&
                supplier.capabilities?.some((cap: ISupplierCapability) => cap.parameterId === parameterId && cap.status === 'active')
            )
            .map((supplier: ISupplier) => supplier.id);

        setQualifiedSuppliers(qualified);

        if (qualified.length === 0) {
            message.warning('该参数暂无合格供应商，请先维护供应商能力值');
        }
    };

    const handlePriceChange = () => {
        const pricePerSample = form.getFieldValue('pricePerSample') || 0;
        const sampleIds = form.getFieldValue('sampleIds') || [];
        form.setFieldValue('totalPrice', pricePerSample * sampleIds.length);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const supplier = supplierData.find(s => s.id === values.supplierId);
            const parameter = detectionParametersData.find((p: any) => p.id === values.parameterId);

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, supplierName: supplier?.name || '', parameterName: parameter?.name || '', qualifiedSuppliers }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const today = new Date();
                const outsourceNo = `WW-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(newId).padStart(3, '0')}`;

                setDataSource([...dataSource, {
                    id: newId,
                    outsourceNo,
                    ...values,
                    parameterName: parameter?.name || '',
                    supplierName: supplier?.name || '',
                    qualifiedSuppliers,
                    approvalStatus: '待审批',
                    status: '待确认',
                    assignedBy: '当前用户',
                    assignDate: new Date().toISOString().split('T')[0]
                }]);
                message.success('提交成功，等待钉钉审批');
            }
            setIsModalOpen(false);
        });
    };

    const handleApprove = (record: IOutsourceParameter) => {
        setDataSource(dataSource.map(item =>
            item.id === record.id
                ? { ...item, approvalStatus: '已通过', approvalId: `DD-${new Date().getTime()}`, status: '已发送' }
                : item
        ));
        message.success('审批通过');
    };

    const columns: ColumnsType<IOutsourceParameter> = [
        { title: '委外单号', dataIndex: 'outsourceNo', key: 'outsourceNo', width: 150 },
        { title: '检测参数', dataIndex: 'parameterName', key: 'parameterName', width: 130 },
        {
            title: '样品编号',
            dataIndex: 'sampleIds',
            key: 'sampleIds',
            width: 150,
            render: (sampleIds: string[]) => (
                <Tooltip title={sampleIds.join(', ')}>
                    <Badge count={sampleIds.length} showZero>
                        <span>{sampleIds[0]}...</span>
                    </Badge>
                </Tooltip>
            )
        },
        { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180, ellipsis: true },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (price) => `¥${price.toLocaleString()}`
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待审批': 'warning',
                    '已通过': 'success',
                    '已拒绝': 'error'
                };
                return <Tag color={colorMap[status]} icon={<DingdingOutlined />}>{status}</Tag>;
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待确认': 'default',
                    '已发送': 'processing',
                    '检测中': 'blue',
                    '已完成': 'success',
                    '已终止': 'error'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        { title: '分配日期', dataIndex: 'assignDate', key: 'assignDate', width: 120 },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>查看</a>
                    {record.approvalStatus === '待审批' && (
                        <a onClick={() => handleApprove(record)}>审批</a>
                    )}
                    {record.status === '待确认' && (
                        <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                            <a style={{ color: 'red' }}>删除</a>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const availableSamples = sampleDetailData.filter(s => s.status === '已收样' || s.status === '已分配');

    return (
        <Card
            title="委外分配（参数）"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建委外单</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={editingRecord ? "查看委外单" : "新建委外单"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="parameterId"
                        label="检测参数/项目"
                        rules={[{ required: true, message: '请选择检测参数' }]}
                    >
                        <Select
                            placeholder="选择检测参数"
                            onChange={handleParameterChange}
                            disabled={!!editingRecord}
                        >
                            {detectionParametersData.map((param: any) => (
                                <Select.Option key={param.id} value={param.id}>
                                    {param.name} - {param.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedParameter && (
                        <>
                            <Form.Item label="有资质供应商">
                                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                                    {qualifiedSuppliers.length > 0 ? (
                                        qualifiedSuppliers.map(supplierId => {
                                            const supplier = supplierData.find(s => s.id === supplierId);
                                            return (
                                                <Tag key={supplierId} color="green" icon={<SafetyCertificateOutlined />}>
                                                    {supplier?.name}
                                                </Tag>
                                            );
                                        })
                                    ) : (
                                        <Tag color="red">暂无合格供应商</Tag>
                                    )}
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="supplierId"
                                label="选择供应商"
                                rules={[{ required: true, message: '请选择供应商' }]}
                            >
                                <Select placeholder="选择有资质的供应商">
                                    {qualifiedSuppliers.map(supplierId => {
                                        const supplier = supplierData.find(s => s.id === supplierId);
                                        return (
                                            <Select.Option key={supplierId} value={supplierId}>
                                                <SafetyCertificateOutlined style={{ color: 'green', marginRight: 4 }} />
                                                {supplier?.name} ({supplier?.evaluationLevel}级)
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="sampleIds"
                                label="选择样品"
                                rules={[{ required: true, message: '请选择样品' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="选择待检测的样品"
                                    disabled={!!editingRecord}
                                    onChange={handlePriceChange}
                                >
                                    {availableSamples.map(sample => (
                                        <Select.Option key={sample.sampleNo} value={sample.sampleNo}>
                                            {sample.sampleNo} - {sample.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="pricePerSample"
                                label="单样品价格（元）"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    onChange={handlePriceChange}
                                />
                            </Form.Item>

                            <Form.Item name="totalPrice" label="总价（元）">
                                <InputNumber disabled style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item name="sendDate" label="寄送日期">
                                <Input type="date" />
                            </Form.Item>

                            <Form.Item name="trackingNo" label="快递单号">
                                <Input placeholder="选填" />
                            </Form.Item>

                            <Form.Item name="remark" label="备注">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </Card>
    );
};

export default OutsourceByParameter;
