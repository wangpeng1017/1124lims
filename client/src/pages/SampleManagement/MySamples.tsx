import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, InputNumber, message, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { mySampleData, type IMySample } from '../../mock/sample';

const MySamples: React.FC = () => {
    const [dataSource, setDataSource] = useState<IMySample[]>(mySampleData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returningRecord, setReturningRecord] = useState<IMySample | null>(null);
    const [form] = Form.useForm();

    const handleCollect = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleReturn = (record: IMySample) => {
        setReturningRecord(record);
        setIsReturnModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
            const isOverdue = new Date(values.expectedReturnDate) < new Date();
            setDataSource([...dataSource, {
                id: newId,
                ...values,
                collectionPerson: '当前用户', // 实际应从登录信息获取
                status: isOverdue ? '逾期' : '领用中'
            }]);
            message.success('领用成功');
            setIsModalOpen(false);
        });
    };

    const handleReturnOk = () => {
        if (returningRecord) {
            setDataSource(dataSource.map(item =>
                item.id === returningRecord.id
                    ? { ...item, actualReturnDate: new Date().toISOString().split('T')[0], status: '已归还' }
                    : item
            ));
            message.success('归还成功');
            setIsReturnModalOpen(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { status: any; text: string }> = {
            '领用中': { status: 'processing', text: '领用中' },
            '已归还': { status: 'success', text: '已归还' },
            '逾期': { status: 'error', text: '逾期' }
        };
        return statusMap[status] || { status: 'default', text: status };
    };

    const columns: ColumnsType<IMySample> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo' },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName' },
        { title: '领用数量', dataIndex: 'quantity', key: 'quantity' },
        { title: '用途', dataIndex: 'purpose', key: 'purpose' },
        { title: '领用日期', dataIndex: 'collectionDate', key: 'collectionDate' },
        { title: '预计归还', dataIndex: 'expectedReturnDate', key: 'expectedReturnDate' },
        { title: '实际归还', dataIndex: 'actualReturnDate', key: 'actualReturnDate' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const badge = getStatusBadge(status);
                return <Badge status={badge.status} text={badge.text} />;
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === '领用中' && (
                        <a onClick={() => handleReturn(record)}>归还</a>
                    )}
                    {record.status === '逾期' && (
                        <a onClick={() => handleReturn(record)} style={{ color: 'red' }}>立即归还</a>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="我的样品"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCollect}>新建领用</Button>}
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" />

            {/* Collection Modal */}
            <Modal
                title="新建领用"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="sampleNo" label="样品编号" rules={[{ required: true }]}>
                        <Input placeholder="扫描或输入样品编号" />
                    </Form.Item>
                    <Form.Item name="sampleName" label="样品名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="quantity" label="领用数量" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="purpose" label="用途" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="collectionDate" label="领用日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="expectedReturnDate" label="预计归还日期" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Return Modal */}
            <Modal
                title="确认归还样品"
                open={isReturnModalOpen}
                onOk={handleReturnOk}
                onCancel={() => setIsReturnModalOpen(false)}
            >
                <p>确认归还样品: <strong>{returningRecord?.sampleNo}</strong> ?</p>
                <p>归还日期: <strong>{new Date().toISOString().split('T')[0]}</strong></p>
            </Modal>
        </Card>
    );
};

export default MySamples;
