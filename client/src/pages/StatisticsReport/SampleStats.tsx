import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Select, Space, Table, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { sampleData as rawSampleData } from '../../mock/entrustment';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SampleStats: React.FC = () => {
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedType, setSelectedType] = useState<string>('all');

    // 数据处理：添加模拟字段
    const enhancedData = useMemo(() => {
        return rawSampleData.map(item => ({
            ...item,
            receivedDate: '2023-11-' + (Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0'),
            sampleType: ['金属', '塑料', '橡胶', '建材'][Math.floor(Math.random() * 4)],
            testParameters: ['抗拉强度', '屈服强度', '伸长率', '硬度', '冲击功'][Math.floor(Math.random() * 5)]
        }));
    }, []);

    // 筛选数据
    const filteredData = useMemo(() => {
        let result = enhancedData;

        if (dateRange) {
            result = result.filter(item => {
                const itemDate = dayjs(item.receivedDate);
                return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
            });
        }

        if (selectedType !== 'all') {
            result = result.filter(item => item.sampleType === selectedType);
        }

        return result;
    }, [enhancedData, dateRange, selectedType]);

    // 样品趋势
    const trendOption = useMemo(() => {
        const monthCount: Record<string, number> = {};

        filteredData.forEach(item => {
            const month = item.receivedDate ? item.receivedDate.substring(0, 7) : '2023-11';
            monthCount[month] = (monthCount[month] || 0) + 1;
        });

        const months = Object.keys(monthCount).sort();
        const counts = months.map(m => monthCount[m]);

        return {
            title: { text: '样品数量趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value', name: '数量' },
            series: [{
                name: '样品数量',
                type: 'line',
                data: counts,
                smooth: true,
                itemStyle: { color: '#52c41a' }
            }]
        };
    }, [filteredData]);

    // 样品类型分布
    const typeOption = useMemo(() => {
        const typeCount: Record<string, number> = {};

        filteredData.forEach(item => {
            const type = item.sampleType || '其他';
            typeCount[type] = (typeCount[type] || 0) + 1;
        });

        const data = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

        return {
            title: { text: '样品类型分布', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            series: [{
                name: '类型',
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

    // 检测项目统计
    const projectOption = useMemo(() => {
        const projectCount: Record<string, number> = {};

        filteredData.forEach(item => {
            const projects = item.testParameters?.split(',') || ['未知项目'];
            projects.forEach(p => {
                const project = p.trim();
                projectCount[project] = (projectCount[project] || 0) + 1;
            });
        });

        const projects = Object.keys(projectCount).sort((a, b) => projectCount[b] - projectCount[a]).slice(0, 10);
        const counts = projects.map(p => projectCount[p]);

        return {
            title: { text: '检测项目统计（Top 10）', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value', name: '样品数' },
            yAxis: { type: 'category', data: projects },
            series: [{
                name: '样品数',
                type: 'bar',
                data: counts,
                itemStyle: { color: '#faad14' }
            }]
        };
    }, [filteredData]);

    const columns = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo', width: 120 },
        { title: '样品名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '样品类型', dataIndex: 'sampleType', key: 'sampleType', width: 100 },
        { title: '检测参数', dataIndex: 'testParameters', key: 'testParameters', width: 200, ellipsis: true },
        { title: '收样日期', dataIndex: 'receivedDate', key: 'receivedDate', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="样品统计报表" extra={
                <Space>
                    <RangePicker onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} />
                    <Select
                        style={{ width: 150 }}
                        placeholder="样品类型"
                        value={selectedType}
                        onChange={setSelectedType}
                    >
                        <Select.Option value="all">全部类型</Select.Option>
                        <Select.Option value="金属">金属</Select.Option>
                        <Select.Option value="塑料">塑料</Select.Option>
                        <Select.Option value="橡胶">橡胶</Select.Option>
                    </Select>
                </Space>
            }>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <ReactECharts option={trendOption} style={{ height: 400 }} />
                        </Col>
                        <Col span={12}>
                            <ReactECharts option={typeOption} style={{ height: 400 }} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <ReactECharts option={projectOption} style={{ height: 400 }} />
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default SampleStats;
