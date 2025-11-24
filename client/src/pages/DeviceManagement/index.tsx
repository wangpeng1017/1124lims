import React from 'react';
import { Table, Card, Tag, Row, Col, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { deviceData } from '../../mock/devices';
import type { Device } from '../../mock/devices';
import ReactECharts from 'echarts-for-react';

const DeviceManagement: React.FC = () => {
    const columns: ColumnsType<Device> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '名称及型号',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'green';
                if (status === 'Maintenance') color = 'red';
                if (status === 'Idle') color = 'orange';
                return (
                    <Tag color={color} key={status}>
                        {status === 'Running' ? '运行' : status}
                    </Tag>
                );
            },
        },
        {
            title: '利用率',
            dataIndex: 'utilization',
            key: 'utilization',
            render: (text) => `${text}%`,
            sorter: (a, b) => a.utilization - b.utilization,
        },
    ];

    const getChartOption = () => {
        return {
            title: {
                text: '设备利用率概览',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: deviceData.map(d => d.name.split(' ')[0]), // Shorten name for x-axis
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        width: 100,
                        overflow: 'truncate'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '利用率 (%)'
                }
            ],
            series: [
                {
                    name: '利用率',
                    type: 'bar',
                    barWidth: '60%',
                    data: deviceData.map(d => d.utilization),
                    itemStyle: {
                        color: '#1890ff'
                    }
                }
            ]
        };
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="设备总数" value={deviceData.length} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="运行中" value={deviceData.filter(d => d.status === 'Running').length} valueStyle={{ color: '#3f8600' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="平均利用率" value={(deviceData.reduce((acc, cur) => acc + cur.utilization, 0) / deviceData.length).toFixed(1)} suffix="%" />
                    </Card>
                </Col>
            </Row>

            <Card title="设备利用率分析" style={{ marginBottom: 24 }}>
                <ReactECharts option={getChartOption()} style={{ height: 400 }} />
            </Card>

            <Card title="设备列表">
                <Table columns={columns} dataSource={deviceData} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>
        </div>
    );
};

export default DeviceManagement;
