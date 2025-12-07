import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, Space, Typography, Divider, Tag } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { roleData, getRoleById, getDepartmentById } from '../../mock/auth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, user, availableUsers, switchUser, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // 如果已登录，跳转到首页
    useEffect(() => {
        if (isLoggedIn && user) {
            // 不自动跳转，让用户可以切换账号
        }
    }, [isLoggedIn, user]);

    const handleLogin = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const success = await login(values.username, values.password);
            if (success) {
                message.success('登录成功');
                navigate('/dashboard');
            } else {
                message.error('用户名或密码错误');
            }
        } catch (error) {
            message.error('登录失败');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (userId: string) => {
        switchUser(userId);
        message.success('已切换用户');
        navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <Card
                style={{
                    width: 450,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0, color: '#333' }}>
                        🔬 LIMS 系统
                    </Title>
                    <Text type="secondary">实验室信息管理系统</Text>
                </div>

                {/* 当前用户状态 */}
                {isLoggedIn && user && (
                    <div style={{
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 16,
                    }}>
                        <Text>当前登录：</Text>
                        <Tag color="green">{user.name}</Tag>
                        <Tag color="blue">{getRoleById(user.roleIds?.[0] || '')?.name}</Tag>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => navigate('/dashboard')}
                        >
                            进入系统
                        </Button>
                    </div>
                )}

                <Form
                    form={form}
                    onFinish={handleLogin}
                    layout="vertical"
                    initialValues={{ username: 'admin', password: '123456' }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<LoginOutlined />}
                            size="large"
                            block
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>快速切换用户（开发模式）</Divider>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {availableUsers.map(u => {
                        const role = getRoleById(u.roleIds?.[0] || '');
                        const dept = getDepartmentById(u.departmentId);
                        const isCurrentUser = user?.id === u.id;
                        const colorMap: Record<string, string> = {
                            admin: '#f5222d',
                            lab_director: '#722ed1',
                            sales_manager: '#1890ff',
                            test_engineer: '#52c41a',
                            sample_admin: '#fa8c16',
                            finance: '#13c2c2',
                            user: '#8c8c8c',
                        };
                        return (
                            <Button
                                key={u.id}
                                size="small"
                                type={isCurrentUser ? 'primary' : 'default'}
                                style={{
                                    borderColor: colorMap[role?.code || 'user'],
                                    color: isCurrentUser ? '#fff' : colorMap[role?.code || 'user'],
                                    background: isCurrentUser ? colorMap[role?.code || 'user'] : 'transparent',
                                }}
                                onClick={() => handleQuickLogin(u.id)}
                            >
                                {u.name}
                                <Text type="secondary" style={{ fontSize: 10, marginLeft: 4 }}>
                                    {role?.name}
                                </Text>
                            </Button>
                        );
                    })}
                </div>

                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        默认密码: 123456
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default Login;
