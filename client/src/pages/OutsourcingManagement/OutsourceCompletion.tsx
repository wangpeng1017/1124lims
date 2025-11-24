import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Select, Input, message, Tag, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { outsourceResultData, type IOutsourceResult, outsourceOrderData, outsourceParameterData } from '../../mock/outsourcing';

const { TabPane } = Tabs;

const OutsourceCompletion: React.FC = () => {
    const [dataSource, setDataSource] = useState<IOutsourceResult[]>(outsourceResultData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IOutsourceResult | null>(null);
    const [selectedOutsource, setSelectedOutsource] = useState<string>('');
    const [form] = Form.useForm();
    const [reviewForm] = Form.useForm();

    const handleAdd = () => {
        form.resetFields();
        setSelectedOutsource('');
        setIsModalOpen(true);
    };

    const handleReview = (record: IOutsourceResult) => {
        setEditingRecord(record);
        reviewForm.resetFields();
        setIsReviewModalOpen(true);
    };

    const handleOutsourceChange = (outsourceNo: string) => {
        setSelectedOutsource(outsourceNo);
        // 根据委外单号获取样品和参数信息
        const order = outsourceOrderData.find(o => o.outsourceNo === outsourceNo);
        const param = outsourceParameterData.find(p => p.outsourceNo === outsourceNo);

        if (order) {
            form.setFieldValue('outsourceType', '委托单');
        } else if (param) {
            form.setFieldValue('outsourceType', '参数');
            form.setFieldValue('parameterName', param.parameterName);
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
            setDataSource([...dataSource, {
                id: newId,
                ...values,
                reviewStatus: '待审核',
                createBy: '当前用户',
                createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }]);
            message.success('数据录入成功，等待审核');
            setIsModalOpen(false);
        });
    };

    const handleReviewOk = () => {
        reviewForm.validateFields().then(values => {
            if (!editingRecord) return;

            setDataSource(dataSource.map(item =>
                item.id === editingRecord.id
                    ? {
                        ...item,
                        reviewStatus: values.reviewStatus,
                        reviewer: '当前用户',
                        reviewDate: new Date().toISOString().split('T')[0],
                        reviewRemark: values.reviewRemark
                    }
                    : item
            ));
            message.success(`审核${values.reviewStatus === '已通过' ? '通过' : '拒绝'}`);
            setIsReviewModalOpen(false);
        });
    };

    const columns: ColumnsType<IOutsourceResult> = [
        { title: '委外单号', dataIndex: 'outsourceNo', key: 'outsourceNo', width: 150 },
        {
            title: '委外类型',
            dataIndex: 'outsourceType',
            key: 'outsourceType',
            width: 100,
            render: (type) => <Tag color={type === '委托单' ? 'blue' : 'cyan'}>{type}</Tag>
        },
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo', width: 130 },
        { title: '检测参数', dataIndex: 'parameterName', key: 'parameterName', width: 120 },
        { title: '检测值', dataIndex: 'testValue', key: 'testValue', width: 200 },
        { title: '检测日期', dataIndex: 'testDate', key: 'testDate', width: 120 },
        { title: '检测人', dataIndex: 'testPerson', key: 'testPerson', width: 100 },
        {
            title: '审核状态',
            dataIndex: 'reviewStatus',
            key: 'reviewStatus',
            width: 100,
            render: (status) => {
                const colorMap: Record<string, string> = {
                    '待审核': 'warning',
                    '已通过': 'success',
                    '已拒绝': 'error'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        { title: '审核人', dataIndex: 'reviewer', key: 'reviewer', width: 100 },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    {record.reviewStatus === '待审核' && (
                        <a onClick={() => handleReview(record)}>审核</a>
                    )}
                    {record.reviewStatus === '已通过' && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>已通过</Tag>
                    )}
                    {record.reviewStatus === '已拒绝' && (
                        <Tag color="error" icon={<CloseCircleOutlined />}>已拒绝</Tag>
                    )}
                </Space>
            ),
        },
    ];

    const pendingData = dataSource.filter(item => item.reviewStatus === '待审核');
    const reviewedData = dataSource.filter(item => item.reviewStatus !== '待审核');

    // 合并委外单列表
    const allOutsources = [
        ...outsourceOrderData.map(o => ({ no: o.outsourceNo, type: '委托单' })),
        ...outsourceParameterData.map(p => ({ no: p.outsourceNo, type: '参数' }))
    ];

    return (
        <Card
            title="委外任务完成"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>录入检测数据</Button>}
        >
            <Tabs defaultActiveKey="pending">
                <TabPane tab={`待审核 (${pendingData.length})`} key="pending">
                    <Table
                        columns={columns}
                        dataSource={pendingData}
                        rowKey="id"
                        scroll={{ x: 1400 }}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab={`已审核 (${reviewedData.length})`} key="reviewed">
                    <Table
                        columns={columns}
                        dataSource={reviewedData}
                        rowKey="id"
                        scroll={{ x: 1400 }}
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
            </Tabs>

            {/* 数据录入弹窗 */}
            <Modal
                title="录入委外检测数据"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="outsourceNo"
                        label="委外单号"
                        rules={[{ required: true, message: '请选择委外单' }]}
                    >
                        <Select placeholder="选择委外单" onChange={handleOutsourceChange}>
                            {allOutsources.map(o => (
                                <Select.Option key={o.no} value={o.no}>
                                    {o.no} ({o.type})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedOutsource && (
                        <>
                            <Form.Item name="outsourceType" hidden>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="sampleNo"
                                label="样品编号"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="输入样品编号" />
                            </Form.Item>

                            <Form.Item
                                name="parameterName"
                                label="检测参数"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="输入检测参数名称" />
                            </Form.Item>

                            <Form.Item
                                name="testValue"
                                label="检测值/结果"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea rows={3} placeholder="输入检测结果" />
                            </Form.Item>

                            <Form.Item
                                name="testDate"
                                label="检测日期"
                                rules={[{ required: true }]}
                            >
                                <Input type="date" />
                            </Form.Item>

                            <Form.Item
                                name="testPerson"
                                label="供应商检测人"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="输入检测人姓名" />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            {/* 审核弹窗 */}
            <Modal
                title="审核委外数据"
                open={isReviewModalOpen}
                onOk={handleReviewOk}
                onCancel={() => setIsReviewModalOpen(false)}
            >
                <Form form={reviewForm} layout="vertical">
                    <Form.Item label="数据明细">
                        <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                            <p><strong>样品编号：</strong>{editingRecord?.sampleNo}</p>
                            <p><strong>检测参数：</strong>{editingRecord?.parameterName}</p>
                            <p><strong>检测值：</strong>{editingRecord?.testValue}</p>
                            <p><strong>检测日期：</strong>{editingRecord?.testDate}</p>
                            <p><strong>检测人：</strong>{editingRecord?.testPerson}</p>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="reviewStatus"
                        label="审核结果"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="已通过">通过</Select.Option>
                            <Select.Option value="已拒绝">拒绝</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="reviewRemark" label="审核意见">
                        <Input.TextArea rows={3} placeholder="填写审核意见（可选）" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default OutsourceCompletion;
