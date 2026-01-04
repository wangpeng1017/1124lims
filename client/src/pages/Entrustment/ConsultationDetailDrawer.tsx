import React, { useState } from 'react';
import { Drawer, Descriptions, Tag, Button, Space, Timeline, Card, Form, Select, InputNumber, Input, message, Modal } from 'antd';
import { PhoneOutlined, MailOutlined, UserOutlined, CalendarOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';
import {
    CONSULTATION_STATUS_MAP,
    TEST_PURPOSE_MAP,
    FOLLOW_UP_TYPE_MAP,
    FEASIBILITY_MAP,
    type IConsultation,
    type FollowUpRecord
} from '../../mock/consultation';
import FollowUpModal from './FollowUpModal';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

interface ConsultationDetailDrawerProps {
    visible: boolean;
    consultation: IConsultation | null;
    onClose: () => void;
    onUpdate: (consultation: IConsultation) => void;
}

const ConsultationDetailDrawer: React.FC<ConsultationDetailDrawerProps> = ({
    visible,
    consultation,
    onClose,
    onUpdate
}) => {
    const navigate = useNavigate();
    const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
    const [isFeasibilityEditing, setIsFeasibilityEditing] = useState(false);
    const [feasibilityForm] = Form.useForm();

    if (!consultation) return null;

    const handleAddFollowUp = () => {
        setIsFollowUpModalVisible(true);
    };

    const handleSaveFollowUp = (followUpRecord: Omit<FollowUpRecord, 'id'>) => {
        const newRecord: FollowUpRecord = {
            ...followUpRecord,
            id: `F${Date.now()}`
        };

        const updatedConsultation: IConsultation = {
            ...consultation,
            followUpRecords: [...consultation.followUpRecords, newRecord],
            status: consultation.status === 'pending' ? 'following' : consultation.status,
            updatedAt: new Date().toISOString()
        };

        onUpdate(updatedConsultation);
        message.success('跟进记录已添加');
        setIsFollowUpModalVisible(false);
    };

    const handleEditFeasibility = () => {
        feasibilityForm.setFieldsValue({
            feasibility: consultation.feasibility,
            feasibilityNote: consultation.feasibilityNote,
            estimatedPrice: consultation.estimatedPrice
        });
        setIsFeasibilityEditing(true);
    };

    const handleSaveFeasibility = () => {
        feasibilityForm.validateFields().then(values => {
            const updatedConsultation: IConsultation = {
                ...consultation,
                ...values,
                updatedAt: new Date().toISOString()
            };
            onUpdate(updatedConsultation);
            message.success('可行性评估已更新');
            setIsFeasibilityEditing(false);
        });
    };

    const handleGenerateQuotation = () => {
        // 1. 检查是否已转化（防止重复生成）
        if (consultation.quotationNo) {
            message.warning(`该咨询单已关联报价单 ${consultation.quotationNo}，不能重复生成`);
            return;
        }

        // 2. 检查状态是否允许转化
        if (consultation.status !== 'following') {
            message.warning('只有跟进中状态的咨询单才能生成报价单');
            return;
        }

        Modal.confirm({
            title: '生成报价单',
            content: '确定要为此咨询生成报价单吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                // 3. 生成报价单号
                const quotationNo = `BJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`;

                // 4. 更新咨询状态和关联信息
                const updatedConsultation: IConsultation = {
                    ...consultation,
                    status: 'quoted',
                    quotationNo: quotationNo,  // 回写报价单号
                    updatedAt: new Date().toISOString()
                };
                onUpdate(updatedConsultation);
                message.success('报价单已生成，正在跳转...');

                // 5. 跳转到报价单页面（携带咨询信息和预生成的报价单号）
                setTimeout(() => {
                    navigate('/entrustment/quotation', {
                        state: {
                            fromConsultation: updatedConsultation,
                            preGeneratedQuotationNo: quotationNo
                        }
                    });
                    onClose();
                }, 1000);
            }
        });
    };

    const handleCloseConsultation = () => {
        Modal.confirm({
            title: '关闭咨询',
            content: '确定要关闭此咨询吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                const updatedConsultation: IConsultation = {
                    ...consultation,
                    status: 'closed',
                    updatedAt: new Date().toISOString()
                };
                onUpdate(updatedConsultation);
                message.success('咨询已关闭');
                onClose();
            }
        });
    };

    const getTimelineIcon = (type: FollowUpRecord['type']) => {
        switch (type) {
            case 'phone':
                return <PhoneOutlined />;
            case 'email':
                return <MailOutlined />;
            case 'visit':
                return <UserOutlined />;
            default:
                return <CalendarOutlined />;
        }
    };

    return (
        <>
            <Drawer
                title={`咨询详情 - ${consultation.consultationNo}`}
                placement="right"
                width={800}
                onClose={onClose}
                open={visible}
                extra={
                    <Space>
                        {(consultation.status === 'pending' || consultation.status === 'following') && (
                            <>
                                <Button onClick={handleCloseConsultation}>关闭咨询</Button>
                                <Button type="primary" onClick={handleGenerateQuotation}>
                                    生成报价单
                                </Button>
                            </>
                        )}
                    </Space>
                }
            >
                {/* 基本信息 */}
                <Card title="基本信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="咨询单号">{consultation.consultationNo}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{consultation.createTime}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={CONSULTATION_STATUS_MAP[consultation.status].color}>
                                {CONSULTATION_STATUS_MAP[consultation.status].text}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="跟进人">{consultation.follower}</Descriptions.Item>
                        <Descriptions.Item label="创建人">{consultation.createdBy}</Descriptions.Item>
                        {consultation.quotationNo && (
                            <Descriptions.Item label="关联报价单" span={2}>
                                <a>{consultation.quotationNo}</a>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* 客户信息 */}
                <Card title="客户信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="客户公司" span={2}>{consultation.clientCompany}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{consultation.clientContact}</Descriptions.Item>
                        <Descriptions.Item label="联系电话">{consultation.clientTel}</Descriptions.Item>
                        {consultation.clientEmail && (
                            <Descriptions.Item label="邮箱" span={2}>{consultation.clientEmail}</Descriptions.Item>
                        )}
                        {consultation.clientAddress && (
                            <Descriptions.Item label="地址" span={2}>{consultation.clientAddress}</Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* 样品信息 */}
                <Card title="样品信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="样品名称">{consultation.sampleName}</Descriptions.Item>
                        <Descriptions.Item label="样品型号">{consultation.sampleModel || '-'}</Descriptions.Item>
                        <Descriptions.Item label="样品材质">{consultation.sampleMaterial || '-'}</Descriptions.Item>
                        <Descriptions.Item label="预计数量">{consultation.estimatedQuantity || '-'}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 检测需求 */}
                <Card title="检测需求" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="检测项目" span={2}>
                            {consultation.testItems.map((item, index) => (
                                <Tag key={index} color="blue">{item}</Tag>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="检测目的">
                            {TEST_PURPOSE_MAP[consultation.testPurpose]}
                        </Descriptions.Item>
                        <Descriptions.Item label="期望完成时间">
                            {consultation.expectedDeadline || '-'}
                        </Descriptions.Item>
                        {consultation.budgetRange && (
                            <Descriptions.Item label="预算范围" span={2}>{consultation.budgetRange}</Descriptions.Item>
                        )}
                        {consultation.clientRequirements && (
                            <Descriptions.Item label="客户特殊要求" span={2}>
                                {consultation.clientRequirements}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* 可行性评估 */}
                <Card
                    title="可行性评估"
                    style={{ marginBottom: 16 }}
                    extra={
                        !isFeasibilityEditing && (
                            <Button size="small" icon={<EditOutlined />} onClick={handleEditFeasibility}>
                                编辑
                            </Button>
                        )
                    }
                >
                    {isFeasibilityEditing ? (
                        <Form form={feasibilityForm} layout="vertical">
                            <Form.Item
                                name="feasibility"
                                label="可行性评估"
                                rules={[{ required: true, message: '请选择可行性评估' }]}
                            >
                                <Select placeholder="请选择可行性评估">
                                    <Select.Option value="feasible">可行</Select.Option>
                                    <Select.Option value="difficult">困难</Select.Option>
                                    <Select.Option value="infeasible">不可行</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="feasibilityNote"
                                label="评估说明"
                            >
                                <TextArea rows={3} placeholder="请输入评估说明" />
                            </Form.Item>
                            <Form.Item
                                name="estimatedPrice"
                                label="预估价格"
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入预估价格"
                                    style={{ width: '100%' }}
                                    prefix="¥"
                                />
                            </Form.Item>
                            <Space>
                                <Button type="primary" onClick={handleSaveFeasibility}>保存</Button>
                                <Button onClick={() => setIsFeasibilityEditing(false)}>取消</Button>
                            </Space>
                        </Form>
                    ) : (
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="可行性评估">
                                {consultation.feasibility ? (
                                    <Tag color={FEASIBILITY_MAP[consultation.feasibility].color}>
                                        {FEASIBILITY_MAP[consultation.feasibility].text}
                                    </Tag>
                                ) : (
                                    '-'
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="评估说明">
                                {consultation.feasibilityNote || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="预估价格">
                                {consultation.estimatedPrice ? `¥${consultation.estimatedPrice}` : '-'}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Card>

                {/* 跟进记录 */}
                <Card
                    title="跟进记录"
                    extra={
                        (consultation.status === 'pending' || consultation.status === 'following') && (
                            <Button type="primary" size="small" onClick={handleAddFollowUp}>
                                添加跟进
                            </Button>
                        )
                    }
                >
                    {consultation.followUpRecords.length > 0 ? (
                        <Timeline
                            items={consultation.followUpRecords.map(record => ({
                                dot: getTimelineIcon(record.type),
                                children: (
                                    <div>
                                        <div style={{ marginBottom: 8 }}>
                                            <Tag color="blue">{FOLLOW_UP_TYPE_MAP[record.type]}</Tag>
                                            <span style={{ color: '#999', fontSize: 12 }}>
                                                {record.date} - {record.operator}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: 8 }}>{record.content}</div>
                                        {record.nextAction && (
                                            <div style={{ color: '#1890ff', fontSize: 12 }}>
                                                <FileTextOutlined /> 下一步行动: {record.nextAction}
                                            </div>
                                        )}
                                    </div>
                                )
                            }))}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                            暂无跟进记录
                        </div>
                    )}
                </Card>
            </Drawer>

            <FollowUpModal
                visible={isFollowUpModalVisible}
                onCancel={() => setIsFollowUpModalVisible(false)}
                onSave={handleSaveFollowUp}
            />
        </>
    );
};

export default ConsultationDetailDrawer;
