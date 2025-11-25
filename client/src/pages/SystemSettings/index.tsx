import React from 'react';
import { Card, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, SafetyCertificateOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SystemSettings: React.FC = () => {
    const navigate = useNavigate();

    const settingsCards = [
        {
            title: '用户管理',
            icon: <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
            description: '管理系统用户、重置密码、分配角色',
            path: '/system-settings/users'
        },
        {
            title: '角色管理',
            icon: <TeamOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
            description: '定义角色、分配权限、角色维护',
            path: '/system-settings/roles'
        },
        {
            title: '权限配置',
            icon: <SafetyCertificateOutlined style={{ fontSize: 48, color: '#faad14' }} />,
            description: '系统权限树配置、功能开关',
            path: '/system-settings/permissions'
        },
        {
            title: '系统参数',
            icon: <SettingOutlined style={{ fontSize: 48, color: '#f5222d' }} />,
            description: '系统基础信息、编号规则配置',
            path: '/system-settings/params'
        },
        {
            title: '操作日志',
            icon: <FileTextOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
            description: '查看系统操作记录、审计追踪',
            path: '/system-settings/logs'
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: 24 }}>系统设置</h2>
            <Row gutter={[24, 24]}>
                {settingsCards.map((card, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            hoverable
                            onClick={() => navigate(card.path)}
                            style={{ textAlign: 'center', minHeight: 250 }}
                        >
                            <div style={{ marginBottom: 16 }}>{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p style={{ color: '#666', fontSize: 14 }}>{card.description}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SystemSettings;
