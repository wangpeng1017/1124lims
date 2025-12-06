import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Modal, Form, InputNumber, DatePicker, message, Popconfirm, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { outsourceTaskData, type IOutsourceTask } from '../../mock/outsourcing';
import { entrustmentData } from '../../mock/entrustment';
import { sampleDetailData } from '../../mock/sample';
import { employeeData } from '../../mock/personnel';
import PersonSelector from '../../components/PersonSelector';
import dayjs from 'dayjs';

const { Option } = Select;

const AllOutsourcing: React.FC = () => {
    const [dataSource, setDataSource] = useState<IOutsourceTask[]>(outsourceTaskData);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [approvalStatusFilter, setApprovalStatusFilter] = useState<string | null>(null);
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

    // 创建/编辑 Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<IOutsourceTask | null>(null);
    const [form] = Form.useForm();

    // 详情 Modal
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailTask, setDetailTask] = useState<IOutsourceTask | null>(null);

    // 行选择状态
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IOutsourceTask[]>([]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: IOutsourceTask[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };



    // 过滤数据
    const filteredData = dataSource.filter(item => {
        const matchSearch =
            item.outsourceNo.toLowerCase().includes(searchText.toLowerCase()) ||
            item.entrustmentId.toLowerCase().includes(searchText.toLowerCase()) ||
            item.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sampleNames.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = statusFilter ? item.status === statusFilter : true;
        const matchApprovalStatus = approvalStatusFilter ? item.approvalStatus === approvalStatusFilter : true;
        const matchSupplier = supplierFilter ? item.supplierName === supplierFilter : true;
        return matchSearch && matchStatus && matchApprovalStatus && matchSupplier;
    });

    // 创建委外任务
    const handleCreate = () => {
        setEditingTask(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // 编辑委外任务
    const handleEdit = (record: IOutsourceTask) => {
        setEditingTask(record);
        form.setFieldsValue({
            ...record,
            expectedReturnDate: record.expectedReturnDate ? dayjs(record.expectedReturnDate) : undefined,
        });
        setIsModalOpen(true);
    };

    // 提交表单
    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingTask) {
                // 编辑
                const newData = dataSource.map(item =>
                    item.id === editingTask.id
                        ? {
                            ...item,
                            ...values,
                            expectedReturnDate: values.expectedReturnDate ? values.expectedReturnDate.format('YYYY-MM-DD') : undefined,
                        }
                        : item
                );
                setDataSource(newData);
                message.success('委外任务已更新');
            } else {
                // 新建
                const newTask: IOutsourceTask = {
                    id: Math.max(...dataSource.map(t => t.id), 0) + 1,
                    outsourceNo: generateOutsourceNo(),
                    ...values,
                    createdBy: '当前用户',
                    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    expectedReturnDate: values.expectedReturnDate ? values.expectedReturnDate.format('YYYY-MM-DD') : undefined,
                    approvalStatus: '待审批' as const,
                    status: '待确认' as const,
                    progress: 0,
                    priority: values.priority || 'Normal',
                };
                setDataSource([newTask, ...dataSource]);
                message.success('委外任务已创建');
            }
            setIsModalOpen(false);
        });
    };

    // 生成委外单号
    const generateOutsourceNo = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `WW-${year}${month}${day}-${random}`;
    };

    // 删除
    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('委外任务已删除');
    };

    // 查看详情
    const handleViewDetail = (record: IOutsourceTask) => {
        setDetailTask(record);
        setIsDetailModalOpen(true);
    };

    // 提交审批
    const handleSubmitApproval = (record: IOutsourceTask) => {
        const newData = dataSource.map(item =>
            item.id === record.id
                ? { ...item, approvalStatus: '待审批' as const }
                : item
        );
        setDataSource(newData);
        message.success('已提交审批');
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
            fixed: 'left',
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
            width: 180,
        },
        {
            title: '样品',
            key: 'samples',
            width: 100,
            render: (_, record) => `${record.sampleCount}个样品`,
        },
        {
            title: '检测参数',
            dataIndex: 'parameters',
            key: 'parameters',
            width: 150,
            render: (params: string[]) => params.join(', '),
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
            title: '内部责任人',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            width: 100,
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
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    {record.status === '待确认' && (
                        <>
                            <Button
                                type="link"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                            >
                                编辑
                            </Button>
                            <Popconfirm
                                title="确定删除此委外任务吗?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                                    删除
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="全部委外任务"
            extra={
                <Space>
                    <Button
                        icon={<AuditOutlined />}
                        onClick={() => selectedRows[0] && handleSubmitApproval(selectedRows[0])}
                        disabled={selectedRows.length === 0 || selectedRows[0]?.approvalStatus !== '待审批' || selectedRows[0]?.status !== '待确认'}
                    >
                        提交审批
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        新建委外任务
                    </Button>
                </Space>
            }
        >
            {/* 搜索和筛选 */}
            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="搜索委外单号、委托单号、项目名称"
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 280 }}
                />
                <Select
                    placeholder="执行状态"
                    allowClear
                    style={{ width: 120 }}
                    onChange={setStatusFilter}
                >
                    <Option value="待确认">待确认</Option>
                    <Option value="已发送">已发送</Option>
                    <Option value="检测中">检测中</Option>
                    <Option value="已完成">已完成</Option>
                    <Option value="已终止">已终止</Option>
                </Select>
                <Select
                    placeholder="审批状态"
                    allowClear
                    style={{ width: 120 }}
                    onChange={setApprovalStatusFilter}
                >
                    <Option value="待审批">待审批</Option>
                    <Option value="已通过">已通过</Option>
                    <Option value="已拒绝">已拒绝</Option>
                </Select>
                <Select
                    placeholder="供应商"
                    allowClear
                    style={{ width: 200 }}
                    onChange={setSupplierFilter}
                >
                    <Option value="华测检测认证集团股份有限公司">华测检测认证集团股份有限公司</Option>
                    <Option value="中国检验认证集团">中国检验认证集团</Option>
                    <Option value="深圳市计量质量检测研究院">深圳市计量质量检测研究院</Option>
                </Select>
            </Space>

            {/* 表格 */}
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                rowSelection={rowSelection}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1800 }}
            />

            {/* 创建/编辑 Modal */}
            <Modal
                title={editingTask ? '编辑委外任务' : '新建委外任务'}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="委托单" name="entrustmentId" rules={[{ required: true, message: '请选择委托单' }]}>
                        <Select placeholder="选择委托单">
                            {entrustmentData.map(e => (
                                <Option key={e.id} value={e.entrustmentId}>
                                    {e.entrustmentId} - {e.sampleName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="项目名称" name="projectName" rules={[{ required: true }]}>
                        <Input placeholder="项目名称" />
                    </Form.Item>

                    <Form.Item label="样品编号" name="sampleIds" rules={[{ required: true, message: '请选择样品' }]}>
                        <Select mode="multiple" placeholder="选择样品">
                            {sampleDetailData.map(s => (
                                <Option key={s.id} value={s.sampleNo}>
                                    {s.sampleNo} - {s.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="样品数量" name="sampleCount" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="样品名称" name="sampleNames" rules={[{ required: true }]}>
                        <Input placeholder="样品名称(逗号分隔)" />
                    </Form.Item>

                    <Form.Item label="检测参数" name="parameters" rules={[{ required: true }]}>
                        <Select mode="tags" placeholder="输入检测参数" />
                    </Form.Item>

                    <Form.Item label="供应商" name="supplierName" rules={[{ required: true, message: '请选择供应商' }]}>
                        <Select placeholder="选择供应商">
                            <Option value="华测检测认证集团股份有限公司">华测检测认证集团股份有限公司</Option>
                            <Option value="中国检验认证集团">中国检验认证集团</Option>
                            <Option value="深圳市计量质量检测研究院">深圳市计量质量检测研究院</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="供应商ID" name="supplierId" rules={[{ required: true }]}>
                        <Input placeholder="供应商ID" />
                    </Form.Item>

                    <Form.Item label="单价" name="pricePerSample" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="单价" />
                    </Form.Item>

                    <Form.Item label="总金额" name="totalPrice" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="总金额" />
                    </Form.Item>

                    <Form.Item label="内部责任人" name="assignedTo" rules={[{ required: true, message: '请选择内部责任人' }]}>
                        <PersonSelector employees={employeeData} />
                    </Form.Item>

                    <Form.Item label="责任人ID" name="assignedToId" rules={[{ required: true }]}>
                        <Input placeholder="责任人ID" />
                    </Form.Item>

                    <Form.Item label="预计返回日期" name="expectedReturnDate">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="优先级" name="priority">
                        <Select placeholder="选择优先级">
                            <Option value="Normal">普通</Option>
                            <Option value="Urgent">紧急</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="备注" name="remark">
                        <Input.TextArea rows={3} placeholder="备注" />
                    </Form.Item>
                </Form>
            </Modal>

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
                        <Descriptions.Item label="内部责任人">{detailTask.assignedTo}</Descriptions.Item>
                        <Descriptions.Item label="创建人">{detailTask.createdBy}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{detailTask.createTime}</Descriptions.Item>
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

export default AllOutsourcing;
