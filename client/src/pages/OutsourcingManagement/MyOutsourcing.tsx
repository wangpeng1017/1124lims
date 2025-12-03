import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Descriptions, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import { outsourceTaskData, type IOutsourceTask } from '../../mock/outsourcing';

const MyOutsourcing: React.FC = () => {
    const currentUser = '当前用户'; // 从全局状态获取

    // 只显示我负责的委外任务
    const [dataSource] = useState<IOutsourceTask[]>(
        outsourceTaskData.filter(t => t.assignedTo === currentUser)
    );

    // 详情 Modal
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailTask, setDetailTask] = useState<IOutsourceTask | null>(null);

    // 统计
    const stats = {
        pending: dataSource.filter(t => t.status === '待确认').length,
        inProgress: dataSource.filter(t => t.status === '检测中').length,
        completed: dataSource.filter(t => t.status === '已完成').length,
    };

    // 查看详情
    const handleViewDetail = (record: IOutsourceTask) => {
        setDetailTask(record);
        setIsDetailModalOpen(true);
    };

    // 获取状态颜色
    const getStatusColor = (status: IOutsourceTask['status']) => {
        const colorMap = {
            '待确认': 'default',
            '已发送': 'processing',
            '检测中': 'warning',
            '已完成': 'success',
            '已终止': 'error',
        };
        return colorMap[status];
    };

    // 获取审批状态颜色
    const getApprovalStatusColor = (status: IOutsourceTask['approvalStatus']) => {
        const colorMap = {
            '待审批': 'processing',
            '已通过': 'success',
            '已拒绝': 'error',
        };
        return colorMap[status];
    };

    // 列定义
    const columns: ColumnsType<IOutsourceTask> = [
        {
            title: '委外单号',
            dataIndex: 'outsourceNo',
            key: 'outsourceNo',
            width: 150,
        },
        {
            title: '委托单号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            width: 130,
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 200,
        },
        {
            title: '样品',
            key: 'samples',
            width: 100,
            render: (_, record) => `${record.sampleCount}个`,
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: 180,
        },
        {
            title: '总金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (price: number) => `¥${price}`,
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 100,
            render: (status: IOutsourceTask['approvalStatus']) => (
                <Tag color={getApprovalStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: '执行状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: IOutsourceTask['status']) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: '预计返回',
            dataIndex: 'expectedReturnDate',
            key: 'expectedReturnDate',
            width: 110,
            render: (date?: string) => date || '-',
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        详情
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card title="我的委外任务">
            {/* 统计面板 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="待确认"
                            value={stats.pending}
                            valueStyle={{ color: '#1890ff' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="检测中"
                            value={stats.inProgress}
                            valueStyle={{ color: '#faad14' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="已完成"
                            value={stats.completed}
                            valueStyle={{ color: '#52c41a' }}
                            suffix="个"
                        />
                    </Card>
                </Col>
            </Row>

            {/* 表格 */}
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            {/* 详情 Modal */}
            <Modal
                title="委外任务详情"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
                        关闭
                    </Button>,
                ]}
                width={800}
            >
                {detailTask && (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="委外单号">{detailTask.outsourceNo}</Descriptions.Item>
                        <Descriptions.Item label="委托单号">{detailTask.entrustmentId}</Descriptions.Item>
                        <Descriptions.Item label="项目名称" span={2}>{detailTask.projectName}</Descriptions.Item>
                        <Descriptions.Item label="样品数量">{detailTask.sampleCount}个</Descriptions.Item>
                        <Descriptions.Item label="样品编号">{detailTask.sampleIds.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="样品名称" span={2}>{detailTask.sampleNames}</Descriptions.Item>
                        <Descriptions.Item label="检测参数" span={2}>{detailTask.parameters.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="供应商" span={2}>{detailTask.supplierName}</Descriptions.Item>
                        <Descriptions.Item label="单价">¥{detailTask.pricePerSample}</Descriptions.Item>
                        <Descriptions.Item label="总金额">¥{detailTask.totalPrice}</Descriptions.Item>
                        <Descriptions.Item label="创建人">{detailTask.createdBy}</Descriptions.Item>
                        <Descriptions.Item label="创建日期">{detailTask.createdDate}</Descriptions.Item>
                        <Descriptions.Item label="预计返回日期">{detailTask.expectedReturnDate || '-'}</Descriptions.Item>
                        <Descriptions.Item label="发送日期">{detailTask.sendDate || '-'}</Descriptions.Item>
                        <Descriptions.Item label="物流单号">{detailTask.trackingNo || '-'}</Descriptions.Item>
                        <Descriptions.Item label="接收日期">{detailTask.receivedDate || '-'}</Descriptions.Item>
                        <Descriptions.Item label="优先级">{detailTask.priority === 'Urgent' ? '紧急' : '普通'}</Descriptions.Item>
                        <Descriptions.Item label="审批状态">
                            <Tag color={getApprovalStatusColor(detailTask.approvalStatus)}>{detailTask.approvalStatus}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="执行状态">
                            <Tag color={getStatusColor(detailTask.status)}>{detailTask.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="完成进度">{detailTask.progress}%</Descriptions.Item>
                        <Descriptions.Item label="备注" span={2}>{detailTask.remark || '-'}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </Card>
    );
};

export default MyOutsourcing;
