import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, InputNumber, message, Tag, Drawer, Descriptions, List, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, AuditOutlined, StarOutlined } from '@ant-design/icons';
import { supplierEvaluationData, supplierData, evaluationTemplateData, type ISupplierEvaluation } from '../../mock/supplier';
import dayjs from 'dayjs';

const PerformanceEvaluation: React.FC = () => {
    const [dataSource, setDataSource] = useState<ISupplierEvaluation[]>(supplierEvaluationData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<ISupplierEvaluation | null>(null);
    const [form] = Form.useForm();
    const [selectedTemplate, setSelectedTemplate] = useState<typeof evaluationTemplateData[0] | null>(null);
    const [scores, setScores] = useState<{ indicatorId: string; score: number; comments: string }[]>([]);

    const handleAdd = () => {
        form.resetFields();
        setSelectedTemplate(null);
        setScores([]);
        setIsModalOpen(true);
    };

    const handleView = (record: ISupplierEvaluation) => {
        setViewingRecord(record);
        setIsDetailDrawerOpen(true);
    };

    // 当选择供应商时，自动加载对应的评价模板
    const handleSupplierChange = (supplierId: string) => {
        const supplier = supplierData.find(s => s.id === supplierId);
        if (supplier && supplier.categories.length > 0) {
            const categoryId = supplier.categories[0];
            const template = evaluationTemplateData.find(t => t.categoryId === categoryId && t.status === 'active');
            if (template) {
                setSelectedTemplate(template);
                form.setFieldsValue({ templateId: template.id });
                // 初始化评分
                const initialScores = template.indicators.map(ind => ({
                    indicatorId: ind.id,
                    score: 0,
                    comments: ''
                }));
                setScores(initialScores);
            } else {
                message.warning('该供应商类别暂无可用的评价模板');
                setSelectedTemplate(null);
                setScores([]);
            }
        }
    };

    const handleScoreChange = (indicatorId: string, field: 'score' | 'comments', value: any) => {
        setScores(scores.map(s =>
            s.indicatorId === indicatorId ? { ...s, [field]: value } : s
        ));
    };

    const calculateTotalScore = (): number => {
        if (!selectedTemplate) return 0;
        return scores.reduce((sum, s) => sum + (s.score || 0), 0);
    };

    const getEvaluationLevel = (totalScore: number): 'excellent' | 'good' | 'qualified' | 'unqualified' => {
        if (totalScore >= 90) return 'excellent';
        if (totalScore >= 80) return 'good';
        if (totalScore >= 60) return 'qualified';
        return 'unqualified';
    };

    const getLevelTag = (level: string) => {
        const levelMap: Record<string, { color: string; text: string }> = {
            excellent: { color: 'gold', text: '优秀' },
            good: { color: 'green', text: '良好' },
            qualified: { color: 'blue', text: '合格' },
            unqualified: { color: 'red', text: '不合格' }
        };
        const config = levelMap[level];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (!selectedTemplate) {
                message.error('请选择评价模板');
                return;
            }

            // 验证所有指标都已评分
            const hasInvalidScore = scores.some(s => s.score === 0 || !s.comments);
            if (hasInvalidScore) {
                message.error('请完成所有指标的评分和评价说明');
                return;
            }

            const totalScore = calculateTotalScore();
            const level = getEvaluationLevel(totalScore);
            const supplier = supplierData.find(s => s.id === values.supplierId);

            const evaluationScores = scores.map(s => {
                const indicator = selectedTemplate.indicators.find(ind => ind.id === s.indicatorId);
                return {
                    indicatorId: s.indicatorId,
                    indicatorName: indicator?.name || '',
                    score: s.score,
                    maxScore: indicator?.maxScore || 0,
                    comments: s.comments
                };
            });

            const newId = `EVA${String(dataSource.length + 1).padStart(3, '0')}`;
            const newEvaluation: ISupplierEvaluation = {
                id: newId,
                supplierId: values.supplierId,
                supplierName: supplier?.name || '',
                templateId: selectedTemplate.id,
                templateName: selectedTemplate.name,
                evaluationDate: values.evaluationDate.format('YYYY-MM-DD'),
                evaluationPeriod: values.evaluationPeriod,
                scores: evaluationScores,
                totalScore,
                level,
                evaluator: '当前用户', // 实际应从登录信息获取
                evaluatorId: 'CurrentUser',
                suggestions: values.suggestions || '',
                attachments: [],
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            };

            setDataSource([newEvaluation, ...dataSource]);

            // 更新供应商的评价信息
            const supplierIndex = supplierData.findIndex(s => s.id === values.supplierId);
            if (supplierIndex !== -1) {
                supplierData[supplierIndex].overallScore = totalScore;
                supplierData[supplierIndex].lastEvaluationDate = values.evaluationDate.format('YYYY-MM-DD');
                supplierData[supplierIndex].evaluationLevel = level;
            }

            message.success('评价提交成功');
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<ISupplierEvaluation> = [
        { title: '评价编号', dataIndex: 'id', key: 'id', width: 120 },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: 200,
            render: (text, record) => <a onClick={() => handleView(record)}>{text}</a>
        },
        { title: '评价模板', dataIndex: 'templateName', key: 'templateName', width: 200 },
        { title: '评价周期', dataIndex: 'evaluationPeriod', key: 'evaluationPeriod', width: 150 },
        { title: '评价日期', dataIndex: 'evaluationDate', key: 'evaluationDate', width: 120 },
        {
            title: '总分',
            dataIndex: 'totalScore',
            key: 'totalScore',
            width: 80,
            sorter: (a, b) => a.totalScore - b.totalScore,
            render: (score) => <Tag color="#52c41a">{score}</Tag>
        },
        {
            title: '评价等级',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (level) => getLevelTag(level)
        },
        { title: '评价人', dataIndex: 'evaluator', key: 'evaluator', width: 100 },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
        {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <a onClick={() => handleView(record)}>详情</a>
            ),
        },
    ];

    return (
        <Card
            title={<><AuditOutlined /> 供应商绩效评价</>}
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建评价</Button>}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
            />

            {/* 新建评价模态框 */}
            <Modal
                title="新建供应商评价"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={900}
                okText="提交评价"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="supplierId" label="选择供应商" rules={[{ required: true }]}>
                        <Select
                            placeholder="请选择供应商"
                            onChange={handleSupplierChange}
                            showSearch
                            optionFilterProp="children"
                        >
                            {supplierData.filter(s => s.cooperationStatus === 'active').map(supplier => (
                                <Select.Option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="templateId" label="评价模板">
                        <Input disabled value={selectedTemplate?.name || '请先选择供应商'} />
                    </Form.Item>

                    <Form.Item name="evaluationPeriod" label="评价周期" rules={[{ required: true }]}>
                        <Input placeholder="如: 2024年第三季度 或 2024年度" />
                    </Form.Item>

                    <Form.Item name="evaluationDate" label="评价日期" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    {selectedTemplate && (
                        <div style={{ marginTop: 24 }}>
                            <h4>评价指标</h4>
                            <List
                                dataSource={selectedTemplate.indicators}
                                renderItem={(indicator) => {
                                    const currentScore = scores.find(s => s.indicatorId === indicator.id);
                                    return (
                                        <List.Item key={indicator.id} style={{ background: '#fafafa', padding: '16px', marginBottom: '8px', borderRadius: '4px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ marginBottom: 8 }}>
                                                    <strong>{indicator.name}</strong>
                                                    <span style={{ marginLeft: 12, color: '#888' }}>
                                                        权重: {indicator.weight}% | 最高分: {indicator.maxScore}分
                                                    </span>
                                                </div>
                                                <div style={{ color: '#666', marginBottom: 8 }}>{indicator.description}</div>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Space>
                                                        <span>得分:</span>
                                                        <InputNumber
                                                            value={currentScore?.score || 0}
                                                            onChange={(v) => handleScoreChange(indicator.id, 'score', v || 0)}
                                                            min={0}
                                                            max={indicator.maxScore}
                                                            style={{ width: 100 }}
                                                        />
                                                        <span style={{ color: '#888' }}>/ {indicator.maxScore}分</span>
                                                    </Space>
                                                    <Input
                                                        placeholder="评价说明（必填）"
                                                        value={currentScore?.comments || ''}
                                                        onChange={(e) => handleScoreChange(indicator.id, 'comments', e.target.value)}
                                                    />
                                                </Space>
                                            </div>
                                        </List.Item>
                                    );
                                }}
                            />

                            <div style={{ marginTop: 16, padding: '16px', background: '#e6f7ff', borderRadius: '4px' }}>
                                <Space size="large">
                                    <span>总分: <strong style={{ fontSize: '20px', color: '#1890ff' }}>{calculateTotalScore()}</strong> / {selectedTemplate.totalScore}</span>
                                    <span>预计等级: {getLevelTag(getEvaluationLevel(calculateTotalScore()))}</span>
                                </Space>
                            </div>
                        </div>
                    )}

                    <Form.Item name="suggestions" label="改进建议" style={{ marginTop: 16 }}>
                        <Input.TextArea rows={3} placeholder="对供应商的改进建议（选填）" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 评价详情抽屉 */}
            <Drawer
                title={<><StarOutlined /> 评价详情</>}
                placement="right"
                width={720}
                open={isDetailDrawerOpen}
                onClose={() => setIsDetailDrawerOpen(false)}
            >
                {viewingRecord && (
                    <>
                        <Descriptions title="基本信息" bordered column={2} size="small">
                            <Descriptions.Item label="评价编号">{viewingRecord.id}</Descriptions.Item>
                            <Descriptions.Item label="供应商">{viewingRecord.supplierName}</Descriptions.Item>
                            <Descriptions.Item label="评价模板" span={2}>{viewingRecord.templateName}</Descriptions.Item>
                            <Descriptions.Item label="评价周期">{viewingRecord.evaluationPeriod}</Descriptions.Item>
                            <Descriptions.Item label="评价日期">{viewingRecord.evaluationDate}</Descriptions.Item>
                            <Descriptions.Item label="评价人">{viewingRecord.evaluator}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{viewingRecord.createTime.split('T')[0]}</Descriptions.Item>
                            <Descriptions.Item label="总分" span={2}>
                                <Tag color="#52c41a" style={{ fontSize: '16px', padding: '4px 12px' }}>{viewingRecord.totalScore}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="评价等级" span={2}>
                                {getLevelTag(viewingRecord.level)}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 24 }}>
                            <h3>评价明细</h3>
                            <List
                                dataSource={viewingRecord.scores}
                                renderItem={(score) => (
                                    <List.Item key={score.indicatorId} style={{ background: '#fafafa', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: 8 }}>
                                                <strong>{score.indicatorName}</strong>
                                                <span style={{ float: 'right' }}>
                                                    <Tag color="green">{score.score}</Tag> / {score.maxScore}分
                                                </span>
                                            </div>
                                            <div style={{ color: '#666' }}>{score.comments}</div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>

                        {viewingRecord.suggestions && (
                            <div style={{ marginTop: 24 }}>
                                <h3>改进建议</h3>
                                <div style={{ padding: '12px', background: '#fff7e6', borderRadius: '4px', border: '1px solid #ffd591' }}>
                                    {viewingRecord.suggestions}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Drawer>
        </Card>
    );
};

export default PerformanceEvaluation;
