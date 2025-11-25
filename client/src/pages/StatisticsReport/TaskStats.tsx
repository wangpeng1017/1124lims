import React, { useMemo } from 'react';
import { Card, DatePicker, Space, Table, Row, Col, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import { testTaskData as taskData } from '../../mock/test';
import dayjs from 'dayjs';


const TaskStats: React.FC = () => {

    // 计算完成率
    const completionStats = useMemo(() => {
        const total = taskData.length;
        const completed = taskData.filter(t => t.status === '已完成').length;
        const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

        return { total, completed, rate };
    }, []);

    // 任务完成趋势
    const trendOption = useMemo(() => {
        const monthCount: Record<string, { total: number, completed: number }> = {};

        taskData.forEach(item => {
            const month = item.createdDate ? item.createdDate.substring(0, 7) : '2023-11';
            if (!monthCount[month]) {
                monthCount[month] = { total: 0, completed: 0 };
            }
            monthCount[month].total += 1;
            if (item.status === '已完成') {
                monthCount[month].completed += 1;
            }
        });

        const months = Object.keys(monthCount).sort();
        const totalCounts = months.map(m => monthCount[m].total);
        const completedCounts = months.map(m => monthCount[m].completed);

        return {
            title: { text: '任务完成趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { data: ['总任务数', '已完成'], top: 30 },
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value', name: '任务数' },
            series: [
                {
                    name: '总任务数',
                    type: 'line',
                    data: totalCounts,
                    smooth: true,
                    itemStyle: { color: '#1890ff' }
                },
                {
                    name: '已完成',
                    type: 'line',
                    data: completedCounts,
                    smooth: true,
                    itemStyle: { color: '#52c41a' }
                }
            ]
        };
    }, []);

    // 完成率仪表盘
    const gaugeOption = useMemo(() => {
        return {
            title: { text: '总体完成率', left: 'center' },
            series: [{
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                itemStyle: {
                    color: '#52c41a'
                },
                progress: {
                    show: true,
                    width: 18
                },
                axisLine: {
                    lineStyle: {
                        width: 18
                    }
                },
                axisTick: { show: false },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 25,
                    color: '#999',
                    fontSize: 14
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    color: 'inherit',
                    fontSize: 24,
                    offsetCenter: [0, '80%']
                },
                data: [{ value: parseFloat(completionStats.rate) }]
            }]
        };
    }, [completionStats]);

    // 人员任务分布
    const personOption = useMemo(() => {
        const personCount: Record<string, number> = {};

        taskData.forEach(item => {
            const person = item.assignedTo || '未分配';
            personCount[person] = (personCount[person] || 0) + 1;
        });

        const persons = Object.keys(personCount).sort((a, b) => personCount[b] - personCount[a]).slice(0, 10);
        const counts = persons.map(p => personCount[p]);

        return {
            title: { text: '人员任务分布（Top 10）', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value', name: '任务数' },
            yAxis: { type: 'category', data: persons },
            series: [{
                name: '任务数',
                type: 'bar',
                data: counts,
                itemStyle: { color: '#faad14' }
            }]
        };
    }, []);

    const columns = [
        { title: '任务编号', dataIndex: 'taskCode', key: 'taskCode', width: 120 },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 120 },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName', width: 150 },
        { title: '检测参数', dataIndex: 'testParams', key: 'testParams', width: 150 },
        { title: '负责人', dataIndex: 'assignedTo', key: 'assignedTo', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '完成进度', dataIndex: 'progress', key: 'progress', width: 100, render: (val: number) => `${val}%` },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="任务完成率报表">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 统计数据 */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title="总任务数" value={completionStats.total} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="已完成" value={completionStats.completed} valueStyle={{ color: '#52c41a' }} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="完成率" value={completionStats.rate} suffix="%" valueStyle={{ color: '#1890ff' }} />
                        </Col>
                    </Row>

                    {/* 图表区域 */}
                    <Row gutter={16}>
                        <Col span={16}>
                            <ReactECharts option={trendOption} style={{ height: 400 }} />
                        </Col>
                        <Col span={8}>
                            <ReactECharts option={gaugeOption} style={{ height: 400 }} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <ReactECharts option={personOption} style={{ height: 400 }} />
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={taskData}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1000 }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default TaskStats;
