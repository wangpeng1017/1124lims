import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag, Drawer, Descriptions, Timeline, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
import { supplierData, supplierCategoryData, supplierEvaluationData, type ISupplier } from '../../mock/supplier';

const SupplierInfo: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISupplier[]>(supplierData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISupplier | null>(null);
    const [viewingRecord, setViewingRecord] = useState<ISupplier | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISupplier) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            categoryIds: record.categories // 用于表单回显
        });
        setIsModalOpen(true);
    };

    const handleView = (record: ISupplier) => {
        setViewingRecord(record);
        setIsDetailDrawerOpen(true);
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
        message.success(`已${newStatus === 'active' ? '恢复合作' : '暂停合作'}`);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const categoryIds = values.categoryIds || [];
            delete values.categoryIds;

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? { ...item, ...values, categories: categoryIds, updateTime: new Date().toISOString() }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = `SUP${String(dataSource.length + 1).padStart(3, '0')}`;
                const newCode = `SUP${String(dataSource.length + 1).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    code: newCode,
                    ...values,
                    categories: categoryIds,
                    certifications: [],
                    cooperationStatus: 'active',
                    remark: values.remark || '',
                    createTime: new Date().toISOString().split('T')[0],
                    updateTime: new Date().toISOString()
                }]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    // 获取评价等级的显示
    const getEvaluationLevelTag = (level?: string) => {
        const levelMap: Record<string, { color: string; text: string }> = {
            excellent: { color: 'gold', text: '优秀' },
            good: { color: 'green', text: '良好' },
            qualified: { color: 'blue', text: '合格' },
            unqualified: { color: 'red', text: '不合格' }
        };
        if (!level) return <Tag>未评价</Tag>;
        const config = levelMap[level];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // 获取合作状态的显示
    const getCooperationStatusTag = (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
            active: { color: 'green', text: '合作中' },
            suspended: { color: 'orange', text: '暂停' },
            terminated: { color: 'red', text: '终止' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // 筛选数据
    const filteredData = categoryFilter === 'all'
        ? dataSource
        : dataSource.filter(item => item.categories.includes(categoryFilter));

    const columns: ColumnsType<ISupplier> = [
        { title: '供应商编码', dataIndex: 'code', key: 'code', width: 120 },
        {
            title: '供应商名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <a onClick={() => handleView(record)}>{text}</a>
            )
        },
        {
            title: '类别',
            dataIndex: 'categories',
            key: 'categories',
            width: 150,
            render: (categories: string[]) => (
                <>
                    {categories.map(catId => {
                        const category = supplierCategoryData.find(c => c.id === catId);
                        return <Tag key={catId}>{category?.name || catId}</Tag>;
                    })}
                </>
            )
        },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson', width: 100 },
        { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
        {
            title: '综合评分',
            dataIndex: 'overallScore',
            key: 'overallScore',
            width: 100,
            sorter: (a, b) => (a.overallScore || 0) - (b.overallScore || 0),
            render: (score) => score ? <Badge count={score} color="#52c41a" /> : '-'
        },
        {
            title: '评价等级',
            dataIndex: 'evaluationLevel',
            key: 'evaluationLevel',
            width: 100,
            render: (level) => getEvaluationLevelTag(level)
        },
        {
            title: '合作状态',
            dataIndex: 'cooperationStatus',
            key: 'cooperationStatus',
            width: 100,
            fixed: 'right',
            render: (status) => getCooperationStatusTag(status)
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleView(record)}>详情</a>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleToggleStatus(record)}>
                        {record.cooperationStatus === 'active' ? '暂停' : '恢复'}
                    </a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 获取供应商的评价历史
    const getEvaluationHistory = (supplierId: string) => {
        return supplierEvaluationData
            .filter(e => e.supplierId === supplierId)
            .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
    };

    return (
        <Card
            title={<><UserOutlined /> 供应商信息管理</>}
            extra={
                <Space>
                    <Select
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        style={{ width: 150 }}
                    >
                        <Select.Option value="all">全部分类</Select.Option>
                        {supplierCategoryData.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                        ))}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建供应商</Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 1600 }}
                pagination={{ pageSize: 10 }}
            />

            {/* 新建/编辑模态框 */}
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
                    <Form.Item name="categoryIds" label="供应商类别" rules={[{ required: true, message: '请选择至少一个类别' }]}>
                        <Select mode="multiple" placeholder="选择供应商类别">
                            {supplierCategoryData.filter(c => c.status === 'active').map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="联系邮箱" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="cooperationStartDate" label="合作开始日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 详情抽屉 */}
            <Drawer
                title={<><StarOutlined /> 供应商详情</>}
                placement="right"
                width={720}
                open={isDetailDrawerOpen}
                onClose={() => setIsDetailDrawerOpen(false)}
            >
                {viewingRecord && (
                    <>
                        <Descriptions title="基本信息" bordered column={2} size="small">
                            <Descriptions.Item label="供应商编码">{viewingRecord.code}</Descriptions.Item>
                            <Descriptions.Item label="供应商名称">{viewingRecord.name}</Descriptions.Item>
                            <Descriptions.Item label="类别" span={2}>
                                {viewingRecord.categories.map(catId => {
                                    const category = supplierCategoryData.find(c => c.id === catId);
                                    return <Tag key={catId}>{category?.name || catId}</Tag>;
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="联系人">{viewingRecord.contactPerson}</Descriptions.Item>
                            <Descriptions.Item label="联系电话">{viewingRecord.phone}</Descriptions.Item>
                            <Descriptions.Item label="联系邮箱" span={2}>{viewingRecord.email}</Descriptions.Item>
                            <Descriptions.Item label="地址" span={2}>{viewingRecord.address}</Descriptions.Item>
                            <Descriptions.Item label="合作开始日期">{viewingRecord.cooperationStartDate}</Descriptions.Item>
                            <Descriptions.Item label="合作状态">{getCooperationStatusTag(viewingRecord.cooperationStatus)}</Descriptions.Item>
                            <Descriptions.Item label="备注" span={2}>{viewingRecord.remark || '-'}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="评价信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                            <Descriptions.Item label="综合评分">
                                {viewingRecord.overallScore ? <Badge count={viewingRecord.overallScore} color="#52c41a" /> : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="评价等级">
                                {getEvaluationLevelTag(viewingRecord.evaluationLevel)}
                            </Descriptions.Item>
                            <Descriptions.Item label="最近评价日期" span={2}>
                                {viewingRecord.lastEvaluationDate || '-'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 24 }}>
                            <h3>评价历史</h3>
                            <Timeline
                                items={getEvaluationHistory(viewingRecord.id).map(eva => ({
                                    color: eva.level === 'excellent' ? 'green' : eva.level === 'good' ? 'blue' : 'gray',
                                    children: (
                                        <div>
                                            <div><strong>{eva.evaluationPeriod}</strong> - {eva.evaluationDate}</div>
                                            <div>评价模板: {eva.templateName}</div>
                                            <div>
                                                总分: <Badge count={eva.totalScore} color="#52c41a" /> &nbsp;
                                                等级: {getEvaluationLevelTag(eva.level)}
                                            </div>
                                            <div>评价人: {eva.evaluator}</div>
                                            {eva.suggestions && <div style={{ color: '#888' }}>建议: {eva.suggestions}</div>}
                                        </div>
                                    )
                                }))}
                            />
                            {getEvaluationHistory(viewingRecord.id).length === 0 && (
                                <div style={{ textAlign: 'center', color: '#ccc', padding: '20px 0' }}>暂无评价记录</div>
                            )}
                        </div>
                    </>
                )}
            </Drawer>
        </Card>
    );
};

export default SupplierInfo;
