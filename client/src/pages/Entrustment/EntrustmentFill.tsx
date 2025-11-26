import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Steps, Result } from 'antd';
import { useParams } from 'react-router-dom';
import { CheckCircleOutlined, SolutionOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const EntrustmentFill: React.FC = () => {
    const { entrustmentId } = useParams<{ entrustmentId: string }>();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
        // In a real app, this would submit to the backend
        setSubmitted(true);
        setCurrentStep(2);
        message.success('委托信息提交成功！');
    };

    if (submitted) {
        return (
            <div style={{ maxWidth: 800, margin: '50px auto', padding: '0 20px' }}>
                <Result
                    status="success"
                    title="委托信息提交成功"
                    subTitle={`委托编号: ${entrustmentId}。我们已收到您的委托申请，工作人员将尽快与您联系。`}
                    extra={[
                        <Button type="primary" key="console" onClick={() => window.close()}>
                            关闭页面
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '40px 20px' }}>
            <Card style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2}>LIMS 委托单填写</Title>
                    <Paragraph type="secondary">请填写以下信息以完成委托申请 (编号: {entrustmentId})</Paragraph>
                </div>

                <Steps
                    current={currentStep}
                    items={[
                        { title: '基本信息', icon: <SolutionOutlined /> },
                        { title: '样品信息', icon: <FileTextOutlined /> },
                        { title: '完成', icon: <CheckCircleOutlined /> },
                    ]}
                    style={{ marginBottom: 40 }}
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        entrustmentId: entrustmentId
                    }}
                >
                    {/* Step 1: Client Info */}
                    <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                        <Form.Item
                            label="委托单位名称"
                            name="clientName"
                            rules={[{ required: true, message: '请输入委托单位名称' }]}
                        >
                            <Input placeholder="请输入公司全称" size="large" />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <Form.Item
                                label="联系人"
                                name="contactPerson"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: '请输入联系人姓名' }]}
                            >
                                <Input placeholder="姓名" size="large" />
                            </Form.Item>
                            <Form.Item
                                label="联系电话"
                                name="contactPhone"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: '请输入联系电话' }]}
                            >
                                <Input placeholder="手机号或座机" size="large" />
                            </Form.Item>
                        </div>

                        <Form.Item label="通讯地址" name="address">
                            <Input placeholder="请输入详细地址" size="large" />
                        </Form.Item>

                        <Button type="primary" onClick={() => setCurrentStep(1)} block size="large" style={{ marginTop: 20 }}>
                            下一步
                        </Button>
                    </div>

                    {/* Step 2: Sample Info */}
                    <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                        <Form.Item
                            label="样品名称"
                            name="sampleName"
                            rules={[{ required: true, message: '请输入样品名称' }]}
                        >
                            <Input placeholder="例如：热轧钢板" size="large" />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <Form.Item
                                label="样品数量"
                                name="quantity"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: '请输入样品数量' }]}
                            >
                                <Input placeholder="例如：3件" size="large" />
                            </Form.Item>
                            <Form.Item
                                label="规格型号"
                                name="spec"
                                style={{ flex: 1 }}
                            >
                                <Input placeholder="例如：Q235B" size="large" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="检测项目/要求"
                            name="testItems"
                            rules={[{ required: true, message: '请输入检测项目' }]}
                        >
                            <TextArea rows={4} placeholder="请输入具体的检测项目或标准要求，例如：拉伸试验、弯曲试验..." />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                            <Button onClick={() => setCurrentStep(0)} size="large" style={{ flex: 1 }}>
                                上一步
                            </Button>
                            <Button type="primary" htmlType="submit" size="large" style={{ flex: 1 }}>
                                提交委托
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
            <div style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
                LIMS Laboratory Information Management System ©{new Date().getFullYear()}
            </div>
        </div>
    );
};

export default EntrustmentFill;
