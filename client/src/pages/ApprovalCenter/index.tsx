import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Tag, Space, Steps, Tabs, Statistic, Row, Col, Select, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import {
    ApprovalService,
    type ApprovalInstance,
    type ApprovalRole,
    type BusinessType,
    APPROVAL_WORKFLOW_CONFIG,
    BUSINESS_TYPE_MAP
} from '../../services/approvalService';

const { TextArea } = Input;
const { Option } = Select;

const ApprovalCenter: React.FC = () => {
    // 模拟当前用户角色(实际应从用户登录信息获取)
    const [currentUserRole, setCurrentUserRole] = useState<ApprovalRole>('sales_manager');
    const [currentUserName] = useState('王经理'); // 模拟当前用户名

    const [pendingApprovals, setPendingApprovals] = useState<ApprovalInstance[]>([]);
    const [completedApprovals, setCompletedApprovals] = useState<ApprovalInstance[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<ApprovalInstance | null>(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('pending');
    const [businessTypeFilter, setBusinessTypeFilter] = useState<BusinessType | undefined>(undefined);

    useEffect(() => {
        loadApprovals();
    }, [currentUserRole, businessTypeFilter]);

    const loadApprovals = () => {
        const pending = ApprovalService.getPendingApprovals(currentUserRole, businessTypeFilter);
        const completed = ApprovalService.getCompletedApprovals(businessTypeFilter);
        setPendingApprovals(pending);
        setCompletedApprovals(completed);
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
                loadApprovals();
            } else {
                message.error(result.message);
            }
        });
    };

    const renderApprovalProgress = (instance: ApprovalInstance) => {
        const progress = ApprovalService.getApprovalProgress(instance.id);
        if (!progress) return null;

        const config = APPROVAL_WORKFLOW_CONFIG[instance.businessType];
        const currentStep = instance.status === 'pending' ? instance.currentLevel - 1 : config.levels.length;

        return (
            <Steps
                size="small"
                current={currentStep}
                status={instance.status === 'rejected' ? 'error' : undefined}
                items={config.levels.map((level, index) => {
                    const record = instance.approvalRecords.find(r => r.level === level.level);
                    return {
                        title: level.name,
                        description: record?.approver || '待审批',
                        status: record
                            ? record.action === 'approve'
                                ? 'finish'
                                : 'error'
                            : index === currentStep
                                ? 'process'
                                : 'wait'
                    };
                })}
            />
        );
    };

    const renderBusinessData = (instance: ApprovalInstance) => {
        if (!instance.businessData) return null;

        switch (instance.businessType) {
            case 'quotation':
                return (
                    <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item label="客户">{instance.businessData.clientCompany}</Descriptions.Item>
                        <Descriptions.Item label="样品">{instance.businessData.sampleName}</Descriptions.Item>
                        <Descriptions.Item label="金额">¥{instance.businessData.discountTotal}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{instance.businessData.clientContact}</Descriptions.Item>
                    </Descriptions>
                );
            case 'report':
                return (
                    <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item label="报告编号">{instance.businessData.reportNo}</Descriptions.Item>
                        <Descriptions.Item label="样品名称">{instance.businessData.sampleName}</Descriptions.Item>
                        <Descriptions.Item label="检测项目">{instance.businessData.testItems?.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="检测人">{instance.businessData.tester}</Descriptions.Item>
                    </Descriptions>
                );
            default:
                return null;
        }
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
            render: (type: BusinessType) => {
                const typeInfo = BUSINESS_TYPE_MAP[type];
                return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
            }
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
                if (record.status !== 'pending') {
                    return (
                        <Tag color={record.status === 'approved' ? 'success' : 'error'}>
                            {record.status === 'approved' ? '已批准' : '已拒绝'}
                        </Tag>
                    );
                }
                const config = APPROVAL_WORKFLOW_CONFIG[record.businessType];
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
                    {activeTab === 'pending' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleApprove(record)}
                        >
                            审批
                        </Button>
                    )}
                    {activeTab === 'completed' && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                setSelectedInstance(record);
                                setIsModalOpen(true);
                            }}
                        >
                            查看
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    const stats = ApprovalService.getApprovalStatistics(currentUserRole);

    return (
        <div style={{ padding: '24px' }}>
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="待审批"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="已批准"
                            value={stats.approved}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="已拒绝"
                            value={stats.rejected}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总计"
                            value={stats.total}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="审批中心">
                <Space style={{ marginBottom: 16 }} wrap>
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
                    <Button
                        type={currentUserRole === 'technical_director' ? 'primary' : 'default'}
                        onClick={() => setCurrentUserRole('technical_director')}
                    >
                        技术负责人
                    </Button>
                    <Button
                        type={currentUserRole === 'quality_manager' ? 'primary' : 'default'}
                        onClick={() => setCurrentUserRole('quality_manager')}
                    >
                        质量负责人
                    </Button>

                    <Select
                        placeholder="业务类型"
                        style={{ width: 150 }}
                        allowClear
                        value={businessTypeFilter}
                        onChange={setBusinessTypeFilter}
                    >
                        {Object.entries(BUSINESS_TYPE_MAP).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value.text}
                            </Option>
                        ))}
                    </Select>
                </Space>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'pending',
                            label: `待审批 (${pendingApprovals.length})`,
                            children: (
                                <Table
                                    columns={columns}
                                    dataSource={pendingApprovals}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: 1400 }}
                                />
                            )
                        },
                        {
                            key: 'completed',
                            label: `已完成 (${completedApprovals.length})`,
                            children: (
                                <Table
                                    columns={columns}
                                    dataSource={completedApprovals}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: 1400 }}
                                />
                            )
                        }
                    ]}
                />
            </Card>

            <Modal
                title={activeTab === 'pending' ? '审批' : '审批详情'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                width={800}
                footer={
                    activeTab === 'pending'
                        ? [
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
                        ]
                        : [
                            <Button key="close" onClick={() => setIsModalOpen(false)}>
                                关闭
                            </Button>
                        ]
                }
            >
                {selectedInstance && (
                    <div>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="业务类型">
                                <Tag color={BUSINESS_TYPE_MAP[selectedInstance.businessType].color}>
                                    {BUSINESS_TYPE_MAP[selectedInstance.businessType].text}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="业务单号">{selectedInstance.businessNo}</Descriptions.Item>
                            <Descriptions.Item label="提交人">{selectedInstance.submittedBy}</Descriptions.Item>
                            <Descriptions.Item label="提交时间">
                                {new Date(selectedInstance.submittedAt).toLocaleString('zh-CN')}
                            </Descriptions.Item>
                        </Descriptions>

                        {selectedInstance.businessData && (
                            <div style={{ marginTop: 16 }}>
                                <strong>业务详情:</strong>
                                <div style={{ marginTop: 8 }}>
                                    {renderBusinessData(selectedInstance)}
                                </div>
                            </div>
                        )}

                        <div style={{ margin: '16px 0' }}>
                            <strong>审批进度:</strong>
                            <div style={{ marginTop: 8 }}>
                                {renderApprovalProgress(selectedInstance)}
                            </div>
                        </div>

                        {selectedInstance.approvalRecords.length > 0 && (
                            <div style={{ margin: '16px 0' }}>
                                <strong>审批历史:</strong>
                                {selectedInstance.approvalRecords.map((record, index) => {
                                    const config = APPROVAL_WORKFLOW_CONFIG[selectedInstance.businessType];
                                    const levelName = config.levels.find(l => l.level === record.level)?.name;
                                    return (
                                        <div key={index} style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                                            <div>
                                                <Tag color={record.action === 'approve' ? 'success' : 'error'}>
                                                    {record.action === 'approve' ? '批准' : '拒绝'}
                                                </Tag>
                                                <span>{record.approver} ({levelName})</span>
                                            </div>
                                            <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                                                {new Date(record.timestamp).toLocaleString('zh-CN')}
                                            </div>
                                            {record.comment && (
                                                <div style={{ marginTop: 4 }}>意见: {record.comment}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'pending' && (
                            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                                <Form.Item
                                    name="comment"
                                    label="审批意见"
                                    rules={[{ required: true, message: '请填写审批意见' }]}
                                >
                                    <TextArea rows={4} placeholder="请输入审批意见..." />
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ApprovalCenter;
