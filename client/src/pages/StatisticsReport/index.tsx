import React from 'react';
import { Card, Row, Col } from 'antd';
import { BarChartOutlined, FileTextOutlined, CheckCircleOutlined, ToolOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const StatisticsReport: React.FC = () => {
    const navigate = useNavigate();

    const reportCards = [
        {
            title: '委托单统计',
            icon: <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
            description: '委托单数量趋势、状态分布、客户排行',
            path: '/statistics-report/entrustment'
        },
        {
            title: '样品统计',
            icon: <BarChartOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
            description: '样品数量趋势、类型分布、检测项目统计',
            path: '/statistics-report/sample'
        },
        {
            title: '任务完成率',
            icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />,
            description: '任务完成趋势、人员工作量统计',
            path: '/statistics-report/task'
        },
        {
            title: '设备利用率',
            icon: <ToolOutlined style={{ fontSize: 48, color: '#f5222d' }} />,
            description: '设备利用率排行、状态分布、使用趋势',
            path: '/statistics-report/device'
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: 24 }}>数据统计报表</h2>
            <Row gutter={[24, 24]}>
                {reportCards.map((card, index) => (
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

export default StatisticsReport;
