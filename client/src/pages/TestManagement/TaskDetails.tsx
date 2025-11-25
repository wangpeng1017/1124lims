import React from 'react';
import { Card, Descriptions, Table, Tag, Timeline, Empty, Tabs, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { testTaskData, testDataEntryData, testTaskTransferData } from '../../mock/test';

const TaskDetails: React.FC = () => {
    const { taskNo } = useParams<{ taskNo: string }>();
    const navigate = useNavigate();

    const task = testTaskData.find(t => t.taskNo === taskNo);
    const dataEntries = testDataEntryData.filter(d => d.taskNo === taskNo);
    const transfers = testTaskTransferData.filter(t => t.taskNo === taskNo);

    if (!task) {
        return <Empty description="未找到任务信息" />;
    }

    const parameterColumns = [
        { title: '检测参数', dataIndex: 'name', key: 'name' },
        {
            title: '检测状态',
            key: 'status',
            render: (name: string) => {
                const hasEntry = dataEntries.some(d => d.parameterName === name);
                return hasEntry ? <Tag color="success">已录入</Tag> : <Tag color="default">未录入</Tag>;
            }
        },
        {
            title: '检测结果',
            key: 'result',
            render: (name: string) => {
                const entry = dataEntries.find(d => d.parameterName === name);
                return entry ? `${entry.testData.result} ${entry.testData.unit}` : '-';
            }
        },
        {
            title: '判定',
            key: 'conclusion',
            render: (name: string) => {
                const entry = dataEntries.find(d => d.parameterName === name);
                return entry ? (
                    <Tag color={entry.testData.conclusion === '合格' ? 'green' : 'red'}>
                        {entry.testData.conclusion}
                    </Tag>
                ) : '-';
            }
        }
    ];

    const parameterData = task.parameters.map(p => ({ name: p }));

    return (
        <div style={{ padding: '24px' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            >
                返回
            </Button>

            <Card title={`任务详情 - ${task.taskNo}`} bordered={false} style={{ marginBottom: 24 }}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="样品名称">{task.sampleName}</Descriptions.Item>
                    <Descriptions.Item label="样品编号">{task.sampleNo}</Descriptions.Item>
                    <Descriptions.Item label="委托单号">{task.entrustmentId}</Descriptions.Item>
                    <Descriptions.Item label="负责人">{task.assignedTo}</Descriptions.Item>
                    <Descriptions.Item label="截止日期">{task.dueDate}</Descriptions.Item>
                    <Descriptions.Item label="状态">
                        <Tag color={task.status === '已完成' ? 'success' : 'processing'}>{task.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">
                        <Tag color={task.priority === 'Urgent' ? 'red' : 'green'}>{task.priority}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="创建日期">{task.createdDate}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card bordered={false}>
                <Tabs items={[
                    {
                        key: '1',
                        label: '检测参数明细',
                        children: <Table columns={parameterColumns} dataSource={parameterData} rowKey="name" pagination={false} />
                    },
                    {
                        key: '2',
                        label: '数据录入记录',
                        children: (
                            <div style={{ padding: '20px' }}>
                                {dataEntries.length > 0 ? (
                                    <Timeline>
                                        {dataEntries.map(entry => (
                                            <Timeline.Item key={entry.id} color="green">
                                                <p><strong>{entry.entryDate}</strong> - {entry.operator}</p>
                                                <p>录入参数: {entry.parameterName}</p>
                                                <p>结果: {entry.testData.result} {entry.testData.unit} ({entry.testData.conclusion})</p>
                                                <p>设备: {entry.deviceName} ({entry.deviceId})</p>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                ) : <Empty description="暂无录入记录" />}
                            </div>
                        )
                    },
                    {
                        key: '3',
                        label: '流转记录',
                        children: (
                            <div style={{ padding: '20px' }}>
                                {transfers.length > 0 ? (
                                    <Timeline>
                                        {transfers.map(t => (
                                            <Timeline.Item key={t.id} color="blue">
                                                <p><strong>{t.transferDate}</strong></p>
                                                <p>{t.fromPerson} 转交给 {t.toPerson}</p>
                                                <p>原因: {t.reason}</p>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                ) : <Empty description="暂无流转记录" />}
                            </div>
                        )
                    }
                ]} />
            </Card>
        </div>
    );
};

export default TaskDetails;
