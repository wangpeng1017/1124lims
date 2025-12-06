import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, InputNumber, message, Tag, Popconfirm, List, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { evaluationTemplateData, supplierCategoryData, type IEvaluationTemplate, type IEvaluationIndicator } from '../../mock/supplier';
import dayjs from 'dayjs';

const EvaluationTemplate: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEvaluationTemplate[]>(evaluationTemplateData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEvaluationTemplate | null>(null);
    const [form] = Form.useForm();
    const [indicators, setIndicators] = useState<IEvaluationIndicator[]>([]);

    const handleAdd = () => {
        setEditingRecord(null);
        setIndicators([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IEvaluationTemplate) => {
        setEditingRecord(record);
        setIndicators([...record.indicators]);
        form.setFieldsValue({
            name: record.name,
            categoryId: record.categoryId
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleToggleStatus = (record: IEvaluationTemplate) => {
        const newStatus = record.status === 'active' ? 'inactive' : 'active';
        setDataSource(dataSource.map(item =>
            item.id === record.id ? { ...item, status: newStatus } : item
        ));
        message.success(`已${newStatus === 'active' ? '启用' : '停用'}`);
    };

    const handleAddIndicator = () => {
        const newIndicator: IEvaluationIndicator = {
            id: `IND${Date.now()}`,
            name: '',
            weight: 0,
            maxScore: 0,
            description: '',
            order: indicators.length + 1
        };
        setIndicators([...indicators, newIndicator]);
    };

    const handleUpdateIndicator = (index: number, field: keyof IEvaluationIndicator, value: any) => {
        const newIndicators = [...indicators];
        newIndicators[index] = { ...newIndicators[index], [field]: value };
        setIndicators(newIndicators);
    };

    const handleRemoveIndicator = (index: number) => {
        setIndicators(indicators.filter((_, i) => i !== index));
    };

    const getTotalWeight = (): number => {
        return indicators.reduce((sum, ind) => sum + (ind.weight || 0), 0);
    };

    const getTotalScore = (): number => {
        return indicators.reduce((sum, ind) => sum + (ind.maxScore || 0), 0);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // 验证指标
            if (indicators.length === 0) {
                message.error('请至少添加一个评价指标');
                return;
            }

            const totalWeight = getTotalWeight();
            if (totalWeight !== 100) {
                message.error(`权重总和必须为100%，当前为${totalWeight}%`);
                return;
            }

            for (const ind of indicators) {
                if (!ind.name || ind.weight === 0 || ind.maxScore === 0) {
                    message.error('请完善所有指标的信息');
                    return;
                }
            }

            const category = supplierCategoryData.find(c => c.id === values.categoryId);
            const totalScore = getTotalScore();

            if (editingRecord) {
                setDataSource(dataSource.map(item =>
                    item.id === editingRecord.id
                        ? {
                            ...item,
                            ...values,
                            categoryName: category?.name || '',
                            indicators,
                            totalScore,
                            updateTime: new Date().toISOString()
                        }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = `TPL${String(dataSource.length + 1).padStart(3, '0')}`;
                setDataSource([...dataSource, {
                    id: newId,
                    ...values,
                    categoryName: category?.name || '',
                    indicators,
                    totalScore,
                    status: 'active',
                    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
                }]);
                message.success('新建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IEvaluationTemplate> = [
        { title: '模板编号', dataIndex: 'id', key: 'id', width: 120 },
        { title: '模板名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '适用类别', dataIndex: 'categoryName', key: 'categoryName', width: 150 },
        {
            title: '指标数量',
            key: 'indicatorCount',
            width: 100,
            render: (_, record) => <Tag color="blue">{record.indicators.length}项</Tag>
        },
        { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            fixed: 'right',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '启用' : '停用'}
                </Tag>
            )
        },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleToggleStatus(record)}>
                        {record.status === 'active' ? '停用' : '启用'}
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
            title={<><FormOutlined /> 评价模板管理</>}
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建模板</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1200 }}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingRecord ? "编辑评价模板" : "新建评价模板"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
                okText="保存"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
                        <Input placeholder="如: 外包供应商年度评价" />
                    </Form.Item>
                    <Form.Item name="categoryId" label="适用类别" rules={[{ required: true, message: '请选择适用类别' }]}>
                        <select className="ant-input" style={{ width: '100%', height: '32px' }}>
                            <option value="">请选择</option>
                            {supplierCategoryData.filter(c => c.status === 'active').map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </Form.Item>

                    <Divider>评价指标配置</Divider>

                    <div style={{ marginBottom: 16 }}>
                        <Button type="dashed" onClick={handleAddIndicator} icon={<PlusOutlined />} block>
                            添加指标
                        </Button>
                    </div>

                    <List
                        dataSource={indicators}
                        renderItem={(indicator, index) => (
                            <List.Item
                                key={indicator.id}
                                actions={[
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveIndicator(index)}
                                    >
                                        删除
                                    </Button>
                                ]}
                                style={{ background: '#fafafa', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Space style={{ width: '100%' }}>
                                            <Input
                                                placeholder="指标名称"
                                                value={indicator.name}
                                                onChange={(e) => handleUpdateIndicator(index, 'name', e.target.value)}
                                                style={{ width: 200 }}
                                            />
                                            <InputNumber
                                                placeholder="权重%"
                                                value={indicator.weight}
                                                onChange={(v) => handleUpdateIndicator(index, 'weight', v || 0)}
                                                min={0}
                                                max={100}
                                                style={{ width: 100 }}
                                                addonAfter="%"
                                            />
                                            <InputNumber
                                                placeholder="最高分"
                                                value={indicator.maxScore}
                                                onChange={(v) => handleUpdateIndicator(index, 'maxScore', v || 0)}
                                                min={0}
                                                style={{ width: 100 }}
                                            />
                                        </Space>
                                        <Input
                                            placeholder="指标说明"
                                            value={indicator.description}
                                            onChange={(e) => handleUpdateIndicator(index, 'description', e.target.value)}
                                        />
                                    </Space>
                                </div>
                            </List.Item>
                        )}
                    />

                    <div style={{ marginTop: 16, padding: '12px', background: '#e6f7ff', borderRadius: '4px' }}>
                        <Space size="large">
                            <span>权重总和: <strong style={{ color: getTotalWeight() === 100 ? '#52c41a' : '#ff4d4f' }}>{getTotalWeight()}%</strong></span>
                            <span>总分: <strong>{getTotalScore()}</strong></span>
                            <span>指标数: <strong>{indicators.length}</strong></span>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default EvaluationTemplate;
