import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Select, Typography, Badge } from 'antd';
import { environmentData } from '../../mock/environment';

const { Option } = Select;
const { Title } = Typography;

const EnvironmentManagement: React.FC = () => {
    const [filterLocation, setFilterLocation] = useState<string>('All');

    const locations = Array.from(new Set(environmentData.map(d => d.location)));

    const filteredData = filterLocation === 'All'
        ? environmentData
        : environmentData.filter(d => d.location === filterLocation);

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>环境监控看板</Title>
                <Select defaultValue="All" style={{ width: 120 }} onChange={setFilterLocation}>
                    <Option value="All">全部区域</Option>
                    {locations.map(loc => (
                        <Option key={loc} value={loc}>{loc}</Option>
                    ))}
                </Select>
            </div>

            <Row gutter={[16, 16]}>
                {filteredData.map(item => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card
                            title={item.room}
                            extra={<Badge status="processing" text="正常" />}
                            hoverable
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title="温度"
                                        value={item.temperature}
                                        suffix="℃"
                                        valueStyle={{ color: item.temperature > 26 ? '#cf1322' : '#3f8600' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="湿度"
                                        value={item.humidity}
                                        suffix="%"
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Col>
                            </Row>
                            <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
                                位置: {item.location}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default EnvironmentManagement;
