import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Result, Descriptions, Tag, Space, Typography, Spin, message, Alert } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import publicApi, { type IPublicReport } from '../../services/publicApi';

const { Title, Text } = Typography;

const PublicReportQuery: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        data?: IPublicReport;
    } | null>(null);

    // 从URL参数自动填充并查询
    useEffect(() => {
        const reportNo = searchParams.get('reportNo');
        const code = searchParams.get('code');

        if (reportNo && code) {
            form.setFieldsValue({ reportNo, code });
            handleVerify({ reportNo, code });
        }
    }, [searchParams]);

    // 验证报告
    const handleVerify = async (values: { reportNo: string; code: string }) => {
        setLoading(true);
        setResult(null);

        try {
            const res = await publicApi.verifyReport(values.reportNo, values.code);

            if (res.code === 200 && res.data) {
                setResult({
                    success: true,
                    message: res.msg || '验证成功',
                    data: res.data,
                });
            } else {
                setResult({
                    success: false,
                    message: res.msg || '验证失败',
                });
            }
        } catch (error) {
            console.error('验证失败:', error);
            setResult({
                success: false,
                message: '网络错误，请稍后重试',
            });
        } finally {
            setLoading(false);
        }
    };

    // 渲染验证结果
    const renderResult = () => {
        if (!result) return null;

        if (result.success && result.data) {
            const report = result.data;
            return (
                <Card style={{ marginTop: 24 }}>
                    <Result
                        status="success"
                        icon={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
                        title="报告验证通过"
                        subTitle={result.message}
                    />
                    <Alert
                        message="报告真实有效"
                        description="该检测报告已通过真伪验证，为本实验室正式出具的有效报告。"
                        type="success"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <Descriptions
                        title="报告信息"
                        bordered
                        column={{ xs: 1, sm: 2 }}
                        size="middle"
                    >
                        <Descriptions.Item label="报告编号">
                            <Text strong>{report.reportNo}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {report.valid ? (
                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                    {report.statusText || '已发布'}
                                </Tag>
                            ) : (
                                <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                                    {report.statusText || report.status}
                                </Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="样品名称">{report.sampleName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="委托单位">{report.clientName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="检测项目" span={2}>
                            {report.testItems || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="检测结论" span={2}>
                            <Text type={report.conclusion?.includes('合格') ? 'success' : 'warning'}>
                                {report.conclusion || '-'}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="检测员">{report.tester || '-'}</Descriptions.Item>
                        <Descriptions.Item label="审核员">{report.reviewer || '-'}</Descriptions.Item>
                        <Descriptions.Item label="批准人">{report.approver || '-'}</Descriptions.Item>
                        <Descriptions.Item label="发布日期">{report.issuedDate || '-'}</Descriptions.Item>
                    </Descriptions>
                </Card>
            );
        } else {
            return (
                <Card style={{ marginTop: 24 }}>
                    <Result
                        status="error"
                        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                        title="验证失败"
                        subTitle={result.message}
                        extra={
                            <Alert
                                message="警告"
                                description="该报告验证未通过，可能为伪造报告。请核实报告编号和验证码是否正确，或联系本实验室确认。"
                                type="error"
                                showIcon
                            />
                        }
                    />
                </Card>
            );
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 20px',
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* 标题区 */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <SafetyCertificateOutlined style={{ fontSize: 64, color: '#fff' }} />
                    <Title level={2} style={{ color: '#fff', marginTop: 16 }}>
                        检测报告真伪查询
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                        扫描报告二维码或输入报告编号和验证码，即可验证报告真伪
                    </Text>
                </div>

                {/* 查询表单 */}
                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleVerify}
                        size="large"
                    >
                        <Form.Item
                            name="reportNo"
                            label="报告编号"
                            rules={[{ required: true, message: '请输入报告编号' }]}
                        >
                            <Input
                                placeholder="请输入报告编号，如：R20231201001"
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            label="验证码"
                            rules={[{ required: true, message: '请输入验证码' }]}
                            extra="验证码位于报告二维码下方或报告封面"
                        >
                            <Input
                                placeholder="请输入32位验证码"
                                prefix={<SafetyCertificateOutlined />}
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                                loading={loading}
                                block
                                size="large"
                            >
                                验证报告
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* 验证结果 */}
                <Spin spinning={loading}>
                    {renderResult()}
                </Spin>

                {/* 底部说明 */}
                <Card style={{ marginTop: 24 }}>
                    <Title level={5}>使用说明</Title>
                    <Space direction="vertical" size="small">
                        <Text type="secondary">
                            1. 扫描检测报告上的二维码，将自动跳转至本页面并填入验证信息
                        </Text>
                        <Text type="secondary">
                            2. 也可手动输入报告编号和验证码进行查询
                        </Text>
                        <Text type="secondary">
                            3. 验证码区分大小写，请确保输入正确
                        </Text>
                        <Text type="secondary">
                            4. 如有疑问，请联系本实验室工作人员
                        </Text>
                    </Space>
                </Card>

                {/* 版权信息 */}
                <div style={{ textAlign: 'center', marginTop: 40, color: 'rgba(255,255,255,0.65)' }}>
                    <Text style={{ color: 'inherit' }}>
                        江苏国轻检测技术有限公司 &copy; {new Date().getFullYear()}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default PublicReportQuery;
