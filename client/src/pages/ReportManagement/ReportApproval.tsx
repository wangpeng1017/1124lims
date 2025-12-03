import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Radio, message, Tag, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { clientReportData, type IClientReport } from '../../mock/report';

const ReportApproval: React.FC = () => {
    const [dataSource, setDataSource] = useState<IClientReport[]>(
        clientReportData.filter(r => r.status === '待审核' || r.status === '待批准')
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReport, setCurrentReport] = useState<IClientReport | null>(null);
    const [form] = Form.useForm();

    const handleReview = (record: IClientReport) => {
        setCurrentReport(record);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleSubmitReview = () => {
        form.validateFields().then(values => {
            if (!currentReport) return;

            const isApprove = values.reviewResult === '通过';
            const isReviewStep = currentReport.status === '待审核';

            if (isApprove) {
                const newStatus = isReviewStep ? '待批准' : '已批准';
                const updatedData = dataSource.map(item =>
                    item.id === currentReport.id
                        ? {
                            ...item,
                            status: newStatus as any,
                            reviewer: isReviewStep ? '当前用户' : item.reviewer,
                            approver: isReviewStep ? undefined : '当前用户',
                            reviewedDate: isReviewStep ? new Date().toISOString().split('T')[0] : item.reviewedDate,
                            approvedDate: isReviewStep ? undefined : new Date().toISOString().split('T')[0]
                        }
                        : item
                );
                setDataSource(updatedData);
                message.success(`${isReviewStep ? '审核' : '批准'}通过`);
            } else {
                const updatedData = dataSource.map(item =>
                    item.id === currentReport.id
                        ? { ...item, status: '草稿' as any }
                        : item
                );
                setDataSource(updatedData);
                message.warning('报告已驳回');
            }

            console.log('钉钉审批流ID:', `DD-PROC-${Date.now()}`);
            console.log('审批意见:', values.comments);

            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<IClientReport> = [
        { title: '报告编号', dataIndex: 'reportNo', key: 'reportNo' },
        { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
        { title: '委托单位', dataIndex: 'clientName', key: 'clientName' },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待审核': 'processing',
                    '待批准': 'warning'
                };
                return <Badge status={colorMap[status] as any} text={status} />;
            }
        },
        {
            title: '待办类型',
            key: 'todoType',
            render: (_, record) => (
                <Tag color={record.status === '待审核' ? 'blue' : 'orange'}>
                    {record.status === '待审核' ? '待审核' : '待批准'}
                </Tag>
            )
        },
        { title: '编制人员', dataIndex: 'preparer', key: 'preparer' },
        { title: '生成日期', dataIndex: 'generatedDate', key: 'generatedDate' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleReview(record)}
                    >
                        {record.status === '待审核' ? '审核' : '批准'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card title="报告审批">
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />

            <Modal
                title={
                    <Space>
                        <FileTextOutlined />
                        {currentReport?.status === '待审核' ? '报告审核' : '报告批准'}
                        <Tag color="blue">钉钉审批</Tag>
                    </Space>
                }
                open={isModalOpen}
                onOk={handleSubmitReview}
                onCancel={() => setIsModalOpen(false)}
                okText="提交"
            >
                {currentReport && (
                    <>
                        <div style={{ marginBottom: 20, padding: 15, background: '#f5f5f5', borderRadius: 4 }}>
                            <p><strong>报告编号:</strong> {currentReport.reportNo}</p>
                            <p><strong>项目名称:</strong> {currentReport.projectName}</p>
                            <p><strong>委托单位:</strong> {currentReport.clientName}</p>
                            <p><strong>编制人员:</strong> {currentReport.preparer}</p>
                        </div>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="reviewResult"
                                label="审批结果"
                                rules={[{ required: true, message: '请选择审批结果' }]}
                            >
                                <Radio.Group>
                                    <Radio.Button value="通过">
                                        <CheckCircleOutlined /> 通过
                                    </Radio.Button>
                                    <Radio.Button value="驳回">
                                        <CloseCircleOutlined /> 驳回
                                    </Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                name="comments"
                                label="审批意见"
                                rules={[{ required: true, message: '请填写审批意见' }]}
                            >
                                <Input.TextArea rows={4} placeholder="请填写审批意见..." />
                            </Form.Item>

                            <div style={{ padding: 10, background: '#e6f7ff', borderRadius: 4, fontSize: 12 }}>
                                <p>💡 审批流程将同步到钉钉审批系统</p>
                            </div>
                        </Form>
                    </>
                )}
            </Modal>
        </Card>
    );
};

export default ReportApproval;
