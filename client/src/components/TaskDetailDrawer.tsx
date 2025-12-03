import React from 'react';
import { Drawer, Descriptions, Tag, Badge, Timeline, Space, Divider } from 'antd';
import type { ITestTask } from '../mock/test';
import { ExportOutlined } from '@ant-design/icons';

interface TaskDetailDrawerProps {
    open: boolean;
    task: ITestTask | null;
    onClose: () => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ open, task, onClose }) => {
    if (!task) return null;

    const statusMap: Record<string, any> = {
        '待开始': 'default',
        '进行中': 'processing',
        '已完成': 'success',
        '已转交': 'warning',
    };

    return (
        <Drawer
            title="任务详情"
            placement="right"
            onClose={onClose}
            open={open}
            width={600}
        >
            <Descriptions title="基本信息" column={2} bordered size="small">
                <Descriptions.Item label="任务编号">{task.taskNo}</Descriptions.Item>
                <Descriptions.Item label="委托单号">{task.entrustmentId}</Descriptions.Item>
                <Descriptions.Item label="样品名称">{task.sampleName}</Descriptions.Item>
                <Descriptions.Item label="样品编号">{task.sampleNo}</Descriptions.Item>
                <Descriptions.Item label="创建日期">{task.createdDate}</Descriptions.Item>
                <Descriptions.Item label="截止日期">
                    <span style={{ color: new Date(task.dueDate) < new Date() ? 'red' : 'inherit' }}>
                        {task.dueDate}
                    </span>
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="任务状态" column={2} bordered size="small">
                <Descriptions.Item label="负责人">{task.assignedTo}</Descriptions.Item>
                <Descriptions.Item label="优先级">
                    <Tag color={task.priority === 'Urgent' ? 'red' : 'blue'}>
                        {task.priority === 'Urgent' ? '紧急' : '普通'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                    <Badge status={statusMap[task.status]} text={task.status} />
                </Descriptions.Item>
                <Descriptions.Item label="进度">{task.progress}%</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="检测内容" column={1} bordered size="small">
                <Descriptions.Item label="检测参数">
                    <Space size={[0, 8]} wrap>
                        {task.parameters.map(param => (
                            <Tag key={param}>{param}</Tag>
                        ))}
                    </Space>
                </Descriptions.Item>
            </Descriptions>

            {task.isOutsourced && task.outsourceInfo && (
                <>
                    <Divider />
                    <Descriptions title={
                        <Space>
                            <ExportOutlined />
                            <span>委外信息</span>
                        </Space>
                    } column={1} bordered size="small">
                        <Descriptions.Item label="委外单号">{task.outsourceInfo.outsourceNo}</Descriptions.Item>
                        <Descriptions.Item label="供应商">{task.outsourceInfo.supplierName}</Descriptions.Item>
                        <Descriptions.Item label="委外状态">{task.outsourceInfo.status}</Descriptions.Item>
                    </Descriptions>
                </>
            )}

            <Divider />

            <h3>操作记录</h3>
            <Timeline
                items={[
                    {
                        color: 'green',
                        children: `任务创建于 ${task.createdDate}`,
                    },
                    task.status !== '待开始' && {
                        color: 'blue',
                        children: '任务开始执行',
                    },
                    task.progress > 0 && {
                        color: 'blue',
                        children: `任务进度更新至 ${task.progress}%`,
                    },
                    task.status === '已完成' && {
                        color: 'green',
                        children: '任务已完成',
                    },
                ].filter(Boolean) as any[]}
            />
        </Drawer>
    );
};

export default TaskDetailDrawer;
