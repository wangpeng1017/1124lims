import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Select, Space, Table, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { deviceData } from '../../mock/devices';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DeviceUtilization: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string>('all');

    // 筛选数据
    const filteredData = useMemo(() => {
        if (selectedType === 'all') return deviceData;
        return deviceData.filter(d => d.assetType === selectedType);
    }, [selectedType]);

    // 设备利用率排行
    const utilizationOption = useMemo(() => {
        const sorted = [...filteredData].sort((a, b) => b.utilization - a.utilization).slice(0, 10);
        const names = sorted.map(d => d.name);
        const values = sorted.map(d => d.utilization);

        return {
            title: { text: '设备利用率排行（Top 10）', left: 'center' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
            xAxis: { type: 'value', name: '利用率(%)', max: 100 },
            yAxis: { type: 'category', data: names },
            series: [{
                name: '利用率',
                type: 'bar',
                data: values,
                itemStyle: {
                    color: (params: any) => {
                        const val = params.value;
                        if (val >= 70) return '#f5222d';
                        if (val >= 40) return '#faad14';
                        return '#52c41a';
                    }
                }
            }]
        };
    }, [filteredData]);

    // 设备状态分布
    const statusOption = useMemo(() => {
        const statusCount: Record<string, number> = {};

        filteredData.forEach(item => {
            statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        });

        const data = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

        return {
            title: { text: '设备状态分布', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            series: [{
                name: '状态', type: 'pie',
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

    // 利用率趋势（模拟数据）
    const trendOption = useMemo(() => {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
        const avgUtilization = months.map(() => {
            const sum = filteredData.reduce((acc, d) => acc + d.utilization, 0);
            return Math.floor(sum / filteredData.length + Math.random() * 10 - 5);
        });

        return {
            title: { text: '平均利用率趋势', left: 'center' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value', name: '平均利用率(%)', max: 100 },
            series: [{
                name: '平均利用率',
                type: 'line',
                data: avgUtilization,
                smooth: true,
                itemStyle: { color: '#1890ff' }
            }]
        };
    }, [filteredData]);

    const columns = [
        { title: '设备编号', dataIndex: 'code', key: 'code', width: 120 },
        { title: '设备名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '利用率', dataIndex: 'utilization', key: 'utilization', width: 100, render: (val: number) => `${val}%` },
        { title: '运行时长(h)', dataIndex: 'operatingHours', key: 'operatingHours', width: 120 },
        { title: '存放位置', dataIndex: 'location', key: 'location', width: 120 },
        { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="设备利用率报表" extra={
                <Space>
                    <RangePicker onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} />
                    <Select
                        style={{ width: 150 }}
                        placeholder="资产类型"
                        value={selectedType}
                        onChange={setSelectedType}
                    >
                        <Select.Option value="all">全部类型</Select.Option>
                        <Select.Option value="instrument">仪器</Select.Option>
                        <Select.Option value="device">设备</Select.Option>
                        <Select.Option value="glassware">玻璃器皿</Select.Option>
                    </Select>
                </Space>
            }>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <ReactECharts option={utilizationOption} style={{ height: 400 }} />
                        </Col>
                        <Col span={8}>
                            <ReactECharts option={statusOption} style={{ height: 400 }} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <ReactECharts option={trendOption} style={{ height: 400 }} />
                        </Col>
                    </Row>

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

export default DeviceUtilization;
