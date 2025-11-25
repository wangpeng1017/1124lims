import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BarChartOutlined, PieChartOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { supplierData, supplierCategoryData, supplierEvaluationData } from '../../mock/supplier';

const SupplierStatistics: React.FC = () => {
    // 统计各类别供应商数量
    const categoryStats = useMemo(() => {
        return supplierCategoryData.map(category => ({
            category: category.name,
            count: supplierData.filter(s => s.categories.includes(category.id)).length,
            color: category.id === 'CAT001' ? '#1890ff' : '#52c41a'
        }));
    }, []);

    // 统计评价等级分布
    const levelStats = useMemo(() => {
        const levels = {
            excellent: { name: '优秀', count: 0, color: 'gold' },
            good: { name: '良好', count: 0, color: 'green' },
            qualified: { name: '合格', count: 0, color: 'blue' },
            unqualified: { name: '不合格', count: 0, color: 'red' },
            unevaluated: { name: '未评价', count: 0, color: 'default' }
        };

        supplierData.forEach(supplier => {
            if (supplier.evaluationLevel) {
                levels[supplier.evaluationLevel].count++;
            } else {
                levels.unevaluated.count++;
            }
        });

        return Object.values(levels);
    }, []);

    // TOP供应商排行（按评分）
    const topSuppliers = useMemo(() => {
        return supplierData
            .filter(s => s.overallScore !== undefined)
            .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
            .slice(0, 10)
            .map((supplier, index) => ({
                rank: index + 1,
                ...supplier
            }));
    }, []);

    // 合作状态统计
    const cooperationStats = useMemo(() => {
        const active = supplierData.filter(s => s.cooperationStatus === 'active').length;
        const suspended = supplierData.filter(s => s.cooperationStatus === 'suspended').length;
        const terminated = supplierData.filter(s => s.cooperationStatus === 'terminated').length;
        return { active, suspended, terminated, total: supplierData.length };
    }, []);

    const getLevelTag = (level?: string) => {
        if (!level) return <Tag>未评价</Tag>;
        const levelMap: Record<string, { color: string; text: string }> = {
            excellent: { color: 'gold', text: '优秀' },
            good: { color: 'green', text: '良好' },
            qualified: { color: 'blue', text: '合格' },
            unqualified: { color: 'red', text: '不合格' }
        };
        const config = levelMap[level];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const topSupplierColumns: ColumnsType<typeof topSuppliers[0]> = [
        {
            title: '排名',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank) => {
                const medalColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
                return (
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: medalColors[rank] || '#666'
                    }}>
                        {rank <= 3 ? `🏆 ${rank}` : rank}
                    </span>
                );
            }
        },
        { title: '供应商名称', dataIndex: 'name', key: 'name', width: 250 },
        {
            title: '类别',
            dataIndex: 'categories',
            key: 'categories',
            width: 150,
            render: (categories: string[]) => (
                <>
                    {categories.map(catId => {
                        const category = supplierCategoryData.find(c => c.id === catId);
                        return <Tag key={catId}>{category?.name || catId}</Tag>;
                    })}
                </>
            )
        },
        {
            title: '综合评分',
            dataIndex: 'overallScore',
            key: 'overallScore',
            width: 100,
            render: (score) => <Tag color="#52c41a" style={{ fontSize: '16px' }}>{score}</Tag>
        },
        {
            title: '评价等级',
            dataIndex: 'evaluationLevel',
            key: 'evaluationLevel',
            width: 100,
            render: (level) => getLevelTag(level)
        },
        { title: '最近评价', dataIndex: 'lastEvaluationDate', key: 'lastEvaluationDate', width: 120 }
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="供应商总数"
                            value={supplierData.length}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="合作中"
                            value={cooperationStats.active}
                            valueStyle={{ color: '#52c41a' }}
                            suffix={`/ ${cooperationStats.total}`}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="已评价"
                            value={supplierData.filter(s => s.evaluationLevel).length}
                            valueStyle={{ color: '#faad14' }}
                            suffix={`/ ${supplierData.length}`}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="评价记录"
                            value={supplierEvaluationData.length}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card title={<><PieChartOutlined /> 供应商类别分布</>}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {categoryStats.map(stat => (
                                <div key={stat.category}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>{stat.category}</span>
                                        <span style={{ fontWeight: 'bold' }}>{stat.count} 家</span>
                                    </div>
                                    <div style={{
                                        height: '20px',
                                        background: '#f0f0f0',
                                        borderRadius: '10px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(stat.count / supplierData.length) * 100}%`,
                                            height: '100%',
                                            background: stat.color,
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title={<><BarChartOutlined /> 评价等级分布</>}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {levelStats.map((stat, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <Tag color={stat.color}>{stat.name}</Tag>
                                        <span style={{ fontWeight: 'bold' }}>{stat.count} 家</span>
                                    </div>
                                    <div style={{
                                        height: '20px',
                                        background: '#f0f0f0',
                                        borderRadius: '10px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(stat.count / supplierData.length) * 100}%`,
                                            height: '100%',
                                            background: stat.color === 'default' ? '#d9d9d9' : stat.color === 'gold' ? '#faad14' : stat.color === 'green' ? '#52c41a' : stat.color === 'blue' ? '#1890ff' : '#f5222d',
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card title={<><TrophyOutlined /> TOP 供应商排行榜</>}>
                <Table
                    columns={topSupplierColumns}
                    dataSource={topSuppliers}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default SupplierStatistics;
