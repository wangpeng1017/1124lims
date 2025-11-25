import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Select, Space, Table, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { entrustmentData, clientData } from '../../mock/entrustment';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const EntrustmentStats: React.FC = () => {
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedClient, setSelectedClient] = useState<string>('all');

    // 数据处理：添加状态字段（模拟）
    const enhancedData = useMemo(() => {
        return entrustmentData.map((item) => ({
            ...item,
            status: Math.random() > 0.3 ? '已完成' : (Math.random() > 0.5 ? '检测中' : '待检测'),
            client: clientData[Math.floor(Math.random() * clientData.length)]?.name || '未知客户'
        }));
    }, []);

    // 筛选数据
    const filteredData = useMemo(() => {
        let result = enhancedData;

        // 按日期筛选
        if (dateRange) {
            result = result.filter(item => {
                const itemDate = dayjs(item.sampleDate, 'YY.M.D');
                return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
            });
        }

        // 按客户筛选
        if (selectedClient !== 'all') {
            result = result.filter(item => item.client === selectedClient);
        }

        return result;
    }, [enhancedData, dateRange, selectedClient]);

    // 统计数量趋势（按月）
    const trendOption = useMemo(() => {
        const monthCount: Record<string, number> = {};

        filteredData.forEach(item => {
            const month = item.sampleDate.substring(0, 5); // 提取年月
            monthCount[month] = (monthCount[month] || 0) + 1;
        });

        const months = Object.keys(monthCount).sort();
        const counts = months.map(m => monthCount[m]);

        return {
            title: { text: '委托单数量趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value', name: '数量' },
            series: [{
                name: '委托单数量',
                type: 'line',
                data: counts,
                smooth: true,
                itemStyle: { color: '#1890ff' }
            }]
        };
    }, [filteredData]);

    // 状态分布
    const statusOption = useMemo(() => {
        const statusCount: Record<string, number> = {};

        filteredData.forEach(item => {
            statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        });

        const data = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

        return {
            title: { text: '委托单状态分布', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            series: [{
                name: '状态',
                type: 'pie',
                radius: '50%',
                data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }, [filteredData]);

    // 客户排行
    const clientOption = useMemo(() => {
        const clientCount: Record<string, number> = {};

        filteredData.forEach(item => {
            clientCount[item.client] = (clientCount[item.client] || 0) + 1;
        });

        const clients = Object.keys(clientCount).sort((a, b) => clientCount[b] - clientCount[a]).slice(0, 10);
        const counts = clients.map(c => clientCount[c]);

        return {
            title: { text: '客户委托量排行（Top 10）', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value', name: '委托单数' },
            yAxis: { type: 'category', data: clients },
            series: [{
                name: '委托单数',
                type: 'bar',
                data: counts,
                itemStyle: { color: '#52c41a' }
            }]
        };
    }, [filteredData]);

    const columns = [
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 120 },
        { title: '报告编号', dataIndex: 'reportId', key: 'reportId', width: 200 },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName', width: 150 },
        { title: '检测项目', dataIndex: 'testItems', key: 'testItems', width: 200, ellipsis: true },
        { title: '客户', dataIndex: 'client', key: 'client', width: 150 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '取样日期', dataIndex: 'sampleDate', key: 'sampleDate', width: 100 },
        { title: '跟单人', dataIndex: 'follower', key: 'follower', width: 100 },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="委托单统计报表" extra={
                <Space>
                    <RangePicker onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} />
                    <Select
                        style={{ width: 200 }}
                        placeholder="选择客户"
                        value={selectedClient}
                        onChange={setSelectedClient}
                    >
                        <Select.Option value="all">全部客户</Select.Option>
                        {clientData.map(client => (
                            <Select.Option key={client.id} value={client.name}>{client.name}</Select.Option>
                        ))}
                    </Select>
                </Space>
            }>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 图表区域 */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <ReactECharts option={trendOption} style={{ height: 400 }} />
                        </Col>
                        <Col span={12}>
                            <ReactECharts option={statusOption} style={{ height: 400 }} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <ReactECharts option={clientOption} style={{ height: 400 }} />
                        </Col>
                    </Row>

                    {/* 数据表格 */}
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1200 }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default EntrustmentStats;
