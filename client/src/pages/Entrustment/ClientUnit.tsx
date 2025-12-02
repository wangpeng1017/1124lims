import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { clientData } from '../../mock/entrustment';
import type { IClientUnit } from '../../mock/entrustment';

const ClientUnit: React.FC = () => {
    const [dataSource, setDataSource] = useState<IClientUnit[]>(clientData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IClientUnit | null>(null);
    const [form] = Form.useForm();

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IClientUnit) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    // Approval Actions
    const handleSubmitApproval = (id: number) => {
        setDataSource(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'pending' } : item
        ));
        message.success('已提交审批');
    };

    const handleApprove = (id: number) => {
        setDataSource(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'approved', approvalComment: undefined } : item
        ));
        message.success('审批通过');
    };

    const handleRejectClick = (id: number) => {
        setRejectingId(id);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = () => {
        if (!rejectingId) return;
        if (!rejectReason.trim()) {
            message.warning('请输入拒绝原因');
            return;
        }
        setDataSource(prev => prev.map(item =>
            item.id === rejectingId ? { ...item, status: 'rejected', approvalComment: rejectReason } : item
        ));
        setIsRejectModalOpen(false);
        message.success('已拒绝');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                // Edit: Reset status to draft
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id ? { ...item, ...values, status: 'draft' } : item
                ));
                message.success('更新成功，状态已重置为草稿');
            } else {
                // Create: Status is draft
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                const newItem: IClientUnit = {
                    id: newId,
                    ...values,
                    creator: 'Admin',
                    createTime: new Date().toISOString().split('T')[0],
                    status: 'draft'
                };
                setDataSource([...dataSource, newItem]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IClientUnit> = [
        { title: '单位名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
        { title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone', width: 120 },
        { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
        {
            title: '开票信息',
            key: 'invoice',
            width: 250,
            render: (_, record) => (
                <div style={{ fontSize: 12 }}>
                    <div>税号: {record.taxId || '-'}</div>
                    <div>银行: {record.bankName || '-'}</div>
                    <div>账号: {record.bankAccount || '-'}</div>
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string, record) => {
                let color = 'default';
                let text = '草稿';
                if (status === 'pending') { color = 'processing'; text = '待审批'; }
                else if (status === 'approved') { color = 'success'; text = '已批准'; }
                else if (status === 'rejected') { color = 'error'; text = '已拒绝'; }

                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color}>{text}</Tag>
                        {status === 'rejected' && record.approvalComment && (
                            <div style={{ fontSize: 12, color: 'red' }}>{record.approvalComment}</div>
                        )}
                    </Space>
                );
            }
        },
        { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            render: (_, record) => {
                const actions = [];

                // Draft/Rejected: Edit, Delete, Submit
                if (record.status === 'draft' || record.status === 'rejected') {
                    actions.push(<a key="edit" onClick={() => handleEdit(record)}>编辑</a>);
                    actions.push(
                        <Popconfirm key="del" title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                            <a style={{ color: 'red' }}>删除</a>
                        </Popconfirm>
                    );
                    actions.push(<a key="submit" onClick={() => handleSubmitApproval(record.id)}>提交</a>);
                }

                // Pending: Approve, Reject
                else if (record.status === 'pending') {
                    actions.push(<a key="approve" onClick={() => handleApprove(record.id)}>通过</a>);
                    actions.push(<a key="reject" style={{ color: 'red' }} onClick={() => handleRejectClick(record.id)}>拒绝</a>);
                }

                // Approved: Edit (will reset to draft)
                else if (record.status === 'approved') {
                    actions.push(
                        <Popconfirm
                            key="edit"
                            title="修改将重置状态为草稿，确定修改吗？"
                            onConfirm={() => handleEdit(record)}
                        >
                            <a>变更</a>
                        </Popconfirm>
                    );
                }

                return <Space size="middle">{actions}</Space>;
            },
        },
    ];

    return (
        <Card title="委托单位管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增单位</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" scroll={{ x: 1300 }} />
            <Modal
                title={editingRecord ? "编辑单位" : "新增单位"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="name" label="单位名称" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="contactPhone" label="联系方式" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="address" label="地址">
                            <Input />
                        </Form.Item>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>开票信息</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="taxId" label="纳税人识别号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="invoicePhone" label="开票电话">
                            <Input />
                        </Form.Item>
                        <Form.Item name="bankName" label="开户银行">
                            <Input />
                        </Form.Item>
                        <Form.Item name="bankAccount" label="银行账号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="invoiceAddress" label="开票地址" style={{ gridColumn: 'span 2' }}>
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                title="拒绝审批"
                open={isRejectModalOpen}
                onOk={handleConfirmReject}
                onCancel={() => setIsRejectModalOpen(false)}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="请输入拒绝原因"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                />
            </Modal>
        </Card>
    );
};

export default ClientUnit;
