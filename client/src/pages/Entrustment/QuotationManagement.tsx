import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, message, Popconfirm, Modal, Form, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, FileTextOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { quotationData, STATUS_MAP, CLIENT_STATUS_MAP, type Quotation } from '../../mock/quotationData';
import { ApprovalService } from '../../services/approvalService';
import QuotationForm from './QuotationForm';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QuotationPDF from '../../components/QuotationPDF';

const { Search } = Input;
const { Option } = Select;

const QuotationManagement: React.FC = () => {
    const [dataSource, setDataSource] = useState<Quotation[]>(quotationData);
    const [filteredData, setFilteredData] = useState<Quotation[]>(quotationData);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [clientStatusFilter, setClientStatusFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    // 表单状态
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);

    // 客户反馈Modal状态
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [feedbackQuotation, setFeedbackQuotation] = useState<Quotation | null>(null);
    const [feedbackType, setFeedbackType] = useState<'ok' | 'ng'>('ok');
    const [feedbackForm] = Form.useForm();

    // 筛选逻辑
    const applyFilters = (
        data: Quotation[],
        status: string,
        clientStatus: string,
        search: string
    ) => {
        let filtered = [...data];

        // 状态筛选
        if (status !== 'all') {
            filtered = filtered.filter(item => item.status === status);
        }

        // 客户反馈筛选
        if (clientStatus !== 'all') {
            filtered = filtered.filter(item => item.clientStatus === clientStatus);
        }

        // 搜索筛选
        if (search) {
            filtered = filtered.filter(item =>
                item.quotationNo.toLowerCase().includes(search.toLowerCase()) ||
                item.clientCompany.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        applyFilters(dataSource, value, clientStatusFilter, searchText);
    };

    const handleClientStatusFilterChange = (value: string) => {
        setClientStatusFilter(value);
        applyFilters(dataSource, statusFilter, value, searchText);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        applyFilters(dataSource, statusFilter, clientStatusFilter, value);
    };

    const handleAdd = () => {
        setEditingQuotation(null);
        setIsFormVisible(true);
    };

    const handleEdit = (record: Quotation) => {
        if (record.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以编辑');
            return;
        }
        setEditingQuotation(record);
        setIsFormVisible(true);
    };

    const handleDelete = (id: string) => {
        const item = dataSource.find(d => d.id === id);
        if (item && item.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以删除');
            return;
        }
        const newData = dataSource.filter(item => item.id !== id);
        setDataSource(newData);
        applyFilters(newData, statusFilter, clientStatusFilter, searchText);
        message.success('删除成功');
    };

    const handleSubmitApproval = (record: Quotation) => {
        if (record.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以提交审批');
            return;
        }

        // 提交审批
        const instance = ApprovalService.submitApproval(
            'quotation',
            record.id,
            record.quotationNo,
            record.createdBy
        );

        // 更新报价单状态
        const newData = dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: 'pending_sales' as const,  // 进入第一级审批
                    currentApprovalLevel: 1
                };
            }
            return item;
        });

        setDataSource(newData);
        applyFilters(newData, statusFilter, clientStatusFilter, searchText);
        message.success(`已提交审批,审批单号: ${instance.id}`);
    };

    const handleViewPDF = async (record: Quotation) => {
        try {
            message.loading({ content: '正在生成PDF...', key: 'pdf' });

            // 生成PDF
            const blob = await pdf(<QuotationPDF quotation={record} />).toBlob();

            // 下载PDF
            saveAs(blob, `${record.quotationNo}_报价单.pdf`);

            message.success({ content: 'PDF已生成并下载', key: 'pdf' });
        } catch (error) {
            console.error('PDF生成失败:', error);
            message.error({ content: 'PDF生成失败', key: 'pdf' });
        }
    };

    const handleClientFeedback = (record: Quotation, status: 'ok' | 'ng') => {
        if (record.status !== 'approved') {
            message.warning('只有已批准的报价单可以标记客户反馈');
            return;
        }
        setFeedbackQuotation(record);
        setFeedbackType(status);
        feedbackForm.resetFields();
        setIsFeedbackModalVisible(true);
    };

    const handleSaveQuotation = (values: Partial<Quotation>) => {
        if (editingQuotation) {
            // 编辑模式
            const newData = dataSource.map(item => {
                if (item.id === editingQuotation.id) {
                    return { ...item, ...values };
                }
                return item;
            });
            setDataSource(newData);
            message.success('报价单已创建');
        }
        setIsFormVisible(false);
    };

    const handleSubmitFeedback = () => {
        feedbackForm.validateFields().then(values => {
            if (!feedbackQuotation) return;

            const newData = dataSource.map(item => {
                if (item.id === feedbackQuotation.id) {
                    if (feedbackType === 'ok') {
                        return {
                            ...item,
                            clientStatus: 'ok' as const,
                            contractFile: values.contractFile || '/uploads/contracts/temp.pdf'
                        };
                    } else {
                        return {
                            ...item,
                            clientStatus: 'ng' as const,
                            ngReason: values.ngReason
                        };
                    }
                }
                return item;
            });

            setDataSource(newData);
            applyFilters(newData, statusFilter, clientStatusFilter, searchText);
            message.success(`已标记为${feedbackType.toUpperCase()}`);
            setIsFeedbackModalVisible(false);
        });
    };

    const columns: ColumnsType<Quotation> = [
        {
            title: '报价单号',
            dataIndex: 'quotationNo',
            key: 'quotationNo',
            width: 150,
            fixed: 'left',
            render: (text) => <a>{text}</a>
        },
        {
            title: '创建日期',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 120
        },
        {
            title: '委托方',
            dataIndex: 'clientCompany',
            key: 'clientCompany',
            width: 200,
            ellipsis: true
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            width: 150
        },
        {
            title: '优惠后合计',
            dataIndex: 'discountTotal',
            key: 'discountTotal',
            width: 120,
            render: (value) => `¥${value.toFixed(2)}`
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: Quotation['status']) => {
                const config = STATUS_MAP[status];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: '客户反馈',
            dataIndex: 'clientStatus',
            key: 'clientStatus',
            width: 100,
            render: (clientStatus: Quotation['clientStatus']) => {
                const config = CLIENT_STATUS_MAP[clientStatus];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100
        },
        {
            title: '操作',
            key: 'action',
            width: 280,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => message.info(`查看详情: ${record.quotationNo}`)}
                    >
                        查看
                    </Button>
                    {record.status === 'draft' && (
                        <>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                            >
                                编辑
                            </Button>
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => handleSubmitApproval(record)}
                            >
                                提交审批
                            </Button>
                            <Popconfirm
                                title="确定删除吗?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button size="small" danger icon={<DeleteOutlined />}>
                                    删除
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    {record.pdfUrl && (
                        <Button
                            size="small"
                            icon={<FileTextOutlined />}
                            onClick={() => handleViewPDF(record)}
                        >
                            PDF
                        </Button>
                    )}
                    {record.status === 'approved' && record.clientStatus === 'pending' && (
                        <>
                            <Button
                                size="small"
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleClientFeedback(record, 'ok')}
                            >
                                OK
                            </Button>
                            <Button
                                size="small"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleClientFeedback(record, 'ng')}
                            >
                                NG
                            </Button>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <Card
            title="报价单管理"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新建报价单
                </Button>
            }
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Search
                    placeholder="搜索报价单号或客户名称"
                    allowClear
                    style={{ width: 300 }}
                    onSearch={handleSearch}
                    prefix={<SearchOutlined />}
                />
                <Select
                    style={{ width: 180 }}
                    placeholder="审批状态"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                >
                    <Option value="all">全部状态</Option>
                    <Option value="draft">草稿</Option>
                    <Option value="pending_sales">待销售审批</Option>
                    <Option value="pending_finance">待财务审批</Option>
                    <Option value="pending_lab">待实验室审批</Option>
                    <Option value="approved">已批准</Option>
                    <Option value="rejected">已拒绝</Option>
                </Select>
                <Select
                    style={{ width: 150 }}
                    placeholder="客户反馈"
                    value={clientStatusFilter}
                    onChange={handleClientStatusFilterChange}
                >
                    <Option value="all">全部反馈</Option>
                    <Option value="pending">待反馈</Option>
                    <Option value="ok">OK</Option>
                    <Option value="ng">NG</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1500 }}
            />

            <QuotationForm
                visible={isFormVisible}
                quotation={editingQuotation}
                onCancel={() => setIsFormVisible(false)}
                onSave={handleSaveQuotation}
            />

            <Modal
                title={feedbackType === 'ok' ? '客户确认OK' : '客户拒绝(NG)'}
                open={isFeedbackModalVisible}
                onCancel={() => setIsFeedbackModalVisible(false)}
                onOk={handleSubmitFeedback}
                okText="确定"
                cancelText="取消"
            >
                {feedbackType === 'ok' ? (
                    <Form form={feedbackForm} layout="vertical">
                        <Form.Item
                            name="contractFile"
                            label="上传盖章合同"
                            rules={[{ required: true, message: '请上传盖章合同' }]}
                        >
                            <Upload
                                maxCount={1}
                                beforeUpload={() => false}
                                accept=".pdf,.jpg,.jpeg,.png"
                            >
                                <Button icon={<UploadOutlined />}>选择文件</Button>
                            </Upload>
                        </Form.Item>
                        <p style={{ color: '#666', fontSize: 12 }}>
                            支持格式: PDF, JPG, PNG
                        </p>
                    </Form>
                ) : (
                    <Form form={feedbackForm} layout="vertical">
                        <Form.Item
                            name="ngReason"
                            label="拒绝原因"
                            rules={[{ required: true, message: '请填写拒绝原因' }]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="请输入客户拒绝的原因..."
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Card>
    );
};

export default QuotationManagement;
