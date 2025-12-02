import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Tag, Space, Steps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ApprovalService, type ApprovalInstance, APPROVAL_WORKFLOW_CONFIG } from '../../services/approvalService';

const { TextArea } = Input;

const ApprovalCenter: React.FC = () => {
    // 模拟当前用户角色(实际应从用户登录信息获取)
    const [currentUserRole, setCurrentUserRole] = useState<'sales_manager' | 'finance' | 'lab_director'>('sales_manager');
    const [currentUserName] = useState('王经理'); // 模拟当前用户名

    const [pendingApprovals, setPendingApprovals] = useState<ApprovalInstance[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<ApprovalInstance | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadPendingApprovals();
    }, [currentUserRole]);

    const loadPendingApprovals = () => {
        const approvals = ApprovalService.getPendingApprovals(currentUserRole);
        setPendingApprovals(approvals);
    };

    const handleApprove = (instance: ApprovalInstance) => {
        setSelectedInstance(instance);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleSubmitApproval = (action: 'approve' | 'reject') => {
        form.validateFields().then(values => {
            if (!selectedInstance) return;

            const result = ApprovalService.executeApproval(
                selectedInstance.id,
                currentUserName,
                action,
                values.comment || ''
            );

            if (result.success) {
                message.success(result.message);
                setIsModalOpen(false);
                loadPendingApprovals();
            } else {
                message.error(result.message);
            }
        });
    };

    const renderApprovalProgress = (instance: ApprovalInstance) => {
        const progress = ApprovalService.getApprovalProgress(instance.id);
        if (!progress) return null;

        const config = APPROVAL_WORKFLOW_CONFIG.quotation;
        const currentStep = instance.currentLevel - 1;

        return (
            <Steps
                size="small"
                current={currentStep}
                items={config.levels.map((level, index) => ({
                    title: level.name,
                    description: instance.approvalRecords.find(r => r.level === level.level)?.approver || '待审批',
                    status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'
                }))}
            />
        );
    };

    const columns: ColumnsType<ApprovalInstance> = [
        {
            title: '业务单号',
            dataIndex: 'businessNo',
            key: 'businessNo',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '业务类型',
            dataIndex: 'businessType',
            key: 'businessType',
            width: 100,
            render: () => <Tag color="blue">报价单</Tag>
        },
        {
            title: '提交人',
            dataIndex: 'submittedBy',
            key: 'submittedBy',
            width: 100
        },
        {
            title: '提交时间',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            width: 180,
            render: (text) => new Date(text).toLocaleString('zh-CN')
        },
        {
            title: '当前审批级别',
            key: 'currentLevel',
            width: 120,
            render: (_, record) => {
                const config = APPROVAL_WORKFLOW_CONFIG.quotation;
                const levelConfig = config.levels.find(l => l.level === record.currentLevel);
                return <Tag color="processing">{levelConfig?.name}</Tag>;
            }
        },
        {
            title: '审批进度',
            key: 'progress',
            width: 400,
            render: (_, record) => renderApprovalProgress(record)
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record)}
                    >
                        审批
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Card title="审批中心">
            <Space style={{ marginBottom: 16 }}>
                <span>当前角色:</span>
                <Button
                    type={currentUserRole === 'sales_manager' ? 'primary' : 'default'}
                    onClick={() => setCurrentUserRole('sales_manager')}
                >
                    销售经理
                </Button>
                <Button
                    type={currentUserRole === 'finance' ? 'primary' : 'default'}
                    onClick={() => setCurrentUserRole('finance')}
                >
                    财务
                </Button>
                <Button
                    type={currentUserRole === 'lab_director' ? 'primary' : 'default'}
                    onClick={() => setCurrentUserRole('lab_director')}
                >
                    实验室负责人
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={pendingApprovals}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1400 }}
            />

            <Modal
                title="审批"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        取消
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleSubmitApproval('reject')}
                    >
                        拒绝
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleSubmitApproval('approve')}
                    >
                        批准
                    </Button>
                ]}
            >
                {selectedInstance && (
                    <div>
                        <p><strong>业务单号:</strong> {selectedInstance.businessNo}</p>
                        <p><strong>提交人:</strong> {selectedInstance.submittedBy}</p>
                        <p><strong>提交时间:</strong> {new Date(selectedInstance.submittedAt).toLocaleString('zh-CN')}</p>

                        <div style={{ margin: '16px 0' }}>
                            <strong>审批进度:</strong>
                            {renderApprovalProgress(selectedInstance)}
                        </div>

                        {selectedInstance.approvalRecords.length > 0 && (
                            <div style={{ margin: '16px 0' }}>
                                <strong>审批历史:</strong>
                                {selectedInstance.approvalRecords.map((record, index) => (
                                    <div key={index} style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                                        <div>
                                            <Tag color={record.action === 'approve' ? 'success' : 'error'}>
                                                {record.action === 'approve' ? '批准' : '拒绝'}
                                            </Tag>
                                            <span>{record.approver} ({APPROVAL_WORKFLOW_CONFIG.quotation.levels.find(l => l.level === record.level)?.name})</span>
                                        </div>
                                        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                                            {new Date(record.timestamp).toLocaleString('zh-CN')}
                                        </div>
                                        {record.comment && (
                                            <div style={{ marginTop: 4 }}>意见: {record.comment}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                            <Form.Item
                                name="comment"
                                label="审批意见"
                                rules={[{ required: true, message: '请填写审批意见' }]}
                            >
                                <TextArea rows={4} placeholder="请输入审批意见..." />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default ApprovalCenter;
