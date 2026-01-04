import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, message, Popconfirm, Modal, Form, Upload, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, FileTextOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, UploadOutlined, FormOutlined } from '@ant-design/icons';
import { quotationData, STATUS_MAP, CLIENT_STATUS_MAP, type Quotation } from '../../mock/quotationData';
import { ApprovalService } from '../../services/approvalService';
import { quotationApi, type IQuotation } from '../../services/quotationApi';
import QuotationForm from './QuotationForm';
import QuotationDetailDrawer from './QuotationDetailDrawer';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QuotationPDF from '../../components/QuotationPDF';
import { useLocation, useNavigate } from 'react-router-dom';
import type { IConsultation } from '../../mock/consultation';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// API数据适配器：将后端数据转换为前端组件期望的格式
const adaptApiData = (apiQuotation: IQuotation): Quotation => {
    return {
        id: String(apiQuotation.id || ''),
        quotationNo: apiQuotation.quotationNo || '',
        createTime: apiQuotation.createTime || new Date().toISOString().replace('T', ' ').substring(0, 19),

        // 委托方信息
        clientCompany: apiQuotation.clientName || '',
        clientContact: apiQuotation.contactPerson || '',
        clientTel: apiQuotation.phone || '',
        clientEmail: '',
        clientAddress: '',

        // 服务方信息 (默认值)
        serviceCompany: '检测实验室',
        serviceContact: '张三',
        serviceTel: '400-123-4567',
        serviceEmail: 'service@lab.com',
        serviceAddress: '北京市朝阳区',

        // 样品和检测项目
        sampleName: apiQuotation.sampleName || '',
        items: apiQuotation.items ? JSON.parse(apiQuotation.items) : [],

        // 价格汇总
        subtotal: apiQuotation.totalAmount || 0,
        taxTotal: 0,
        discountTotal: apiQuotation.actualAmount || apiQuotation.totalAmount || 0,

        // 备注
        clientRemark: apiQuotation.remark || '',

        // 审批流程 - 三级审批
        status: (apiQuotation.status || 'draft') as Quotation['status'],
        currentApprovalLevel: 0,
        approvalHistory: [],

        // 客户反馈
        clientStatus: (apiQuotation.clientStatus as any) || 'pending',

        // 关联咨询单
        consultationId: apiQuotation.consultationId ? String(apiQuotation.consultationId) : undefined,
        consultationNo: apiQuotation.consultationNo,

        // 关联合同
        contractNo: (apiQuotation as any).contractNo,

        // PDF
        createdBy: apiQuotation.creator || '系统',

        // 其他字段
        ...apiQuotation,
    };
};

const QuotationManagement: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { canDelete } = useAuth();

    // 数据状态
    const [dataSource, setDataSource] = useState<Quotation[]>([]);
    const [filteredData, setFilteredData] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(false);

    // 筛选状态
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [clientStatusFilter, setClientStatusFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    // 表单状态
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
    const [fromConsultation, setFromConsultation] = useState<IConsultation | null>(null);

    // 详情抽屉状态
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailQuotation, setDetailQuotation] = useState<Quotation | null>(null);

    // 客户反馈Modal状态
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [feedbackQuotation, setFeedbackQuotation] = useState<Quotation | null>(null);
    const [feedbackType, setFeedbackType] = useState<'ok' | 'ng'>('ok');
    const [feedbackForm] = Form.useForm();
    const [contractFileList, setContractFileList] = useState<any[]>([]);

    // 归档Modal状态
    const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
    const [archivingQuotation, setArchivingQuotation] = useState<Quotation | null>(null);
    const [archiveForm] = Form.useForm();
    const [archiveFileList, setArchiveFileList] = useState<any[]>([]);

    // 行选择状态
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<Quotation[]>([]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: Quotation[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };

    // 加载数据
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await quotationApi.page({
                current: 1,
                size: 100,
            });
            if (response.code === 200 && response.data) {
                const adaptedData = response.data.records.map(adaptApiData);
                setDataSource(adaptedData);
                setFilteredData(adaptedData);
            } else {
                // 如果API调用失败，使用mock数据作为fallback
                console.warn('API调用失败，使用mock数据');
                setDataSource(quotationData);
                setFilteredData(quotationData);
            }
        } catch (error) {
            console.error('加载报价单数据失败:', error);
            // 出错时使用mock数据
            setDataSource(quotationData);
            setFilteredData(quotationData);
        } finally {
            setLoading(false);
        }
    }, []);

    // 初始化加载数据
    useEffect(() => {
        loadData();
    }, [loadData]);

    // 检查是否从咨询单跳转过来
    useEffect(() => {
        const state = location.state as { fromConsultation?: IConsultation; preGeneratedQuotationNo?: string };
        if (state?.fromConsultation) {
            setFromConsultation(state.fromConsultation);
            setEditingQuotation(null);
            setIsFormVisible(true);
            message.info(`正在为咨询单 ${state.fromConsultation.consultationNo} 创建报价单`);
        }
    }, [location]);

    // 筛选逻辑
    const applyFilters = (
        data: Quotation[],
        status: string,
        clientStatus: string,
        search: string
    ) => {
        let filtered = [...data];

        if (status !== 'all') {
            filtered = filtered.filter(item => item.status === status);
        }

        if (clientStatus !== 'all') {
            filtered = filtered.filter(item => item.clientStatus === clientStatus);
        }

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
        setFromConsultation(null);
        setIsFormVisible(true);
    };

    const handleViewDetail = (record: Quotation) => {
        setDetailQuotation(record);
        setIsDetailVisible(true);
    };

    const handleEdit = (record: Quotation) => {
        if (record.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以编辑');
            return;
        }
        setEditingQuotation(record);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: string) => {
        const item = dataSource.find(d => d.id === id);
        if (item && item.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以删除');
            return;
        }

        try {
            await quotationApi.delete(Number(id));
            message.success('删除成功');
            loadData(); // 重新加载数据
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleSubmitApproval = (record: Quotation) => {
        if (record.status !== 'draft') {
            message.warning('只有草稿状态的报价单可以提交审批');
            return;
        }

        const instance = ApprovalService.submitApproval(
            'quotation',
            record.id,
            record.quotationNo,
            record.createdBy,
            {
                clientCompany: record.clientCompany,
                sampleName: record.sampleName,
                discountTotal: record.discountTotal,
                clientContact: record.clientContact
            }
        );

        // 更新本地状态
        const newData = dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: 'pending_sales' as const,
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
            const blob = await pdf(<QuotationPDF quotation={record} />).toBlob();
            saveAs(blob, `${record.quotationNo}_报价单.pdf`);
            message.success({ content: 'PDF已生成并下载', key: 'pdf' });
        } catch (error) {
            console.error('PDF生成失败:', error);
            message.error({ content: 'PDF生成失败', key: 'pdf' });
        }
    };

    const handleClientFeedback = (record: Quotation) => {
        setFeedbackQuotation(record);
        setFeedbackType('ok');
        feedbackForm.resetFields();
        setContractFileList([]);
        setIsFeedbackModalVisible(true);
    };

    const handleTopClientFeedback = () => {
        if (selectedRows.length !== 1) {
            message.warning('请选择一个报价单');
            return;
        }
        handleClientFeedback(selectedRows[0]);
    };

    const handleSaveQuotation = async (values: Partial<Quotation>) => {
        try {
            if (editingQuotation) {
                // 编辑模式 - 调用API更新
                const apiData: Partial<IQuotation> = {
                    id: Number(editingQuotation.id),
                    clientName: values.clientCompany,
                    contactPerson: values.clientContact,
                    phone: values.clientTel,
                    totalAmount: values.subtotal,
                    actualAmount: values.discountTotal,
                    items: values.items ? JSON.stringify(values.items) : '[]',
                    remark: values.clientRemark,
                    sampleName: values.sampleName,
                };
                await quotationApi.update(apiData);
                message.success('报价单已更新');
            } else {
                // 新建模式 - 调用API创建
                const apiData: Partial<IQuotation> = {
                    clientName: values.clientCompany,
                    contactPerson: values.clientContact,
                    phone: values.clientTel,
                    totalAmount: values.subtotal,
                    actualAmount: values.discountTotal,
                    items: values.items ? JSON.stringify(values.items) : '[]',
                    remark: values.clientRemark,
                    sampleName: values.sampleName,
                    consultationId: fromConsultation?.id ? Number(fromConsultation.id) : undefined,
                    consultationNo: fromConsultation?.consultationNo,
                };
                await quotationApi.create(apiData);
                message.success('报价单已创建');
            }

            setIsFormVisible(false);
            setFromConsultation(null);
            loadData(); // 重新加载数据
        } catch (error) {
            message.error('保存失败');
        }
    };

    const handleSubmitFeedback = () => {
        feedbackForm.validateFields().then(values => {
            if (!feedbackQuotation) return;

            const now = new Date().toISOString().split('T')[0];
            const newData = dataSource.map(item => {
                if (item.id === feedbackQuotation.id) {
                    if (feedbackType === 'ok') {
                        const contractFile = contractFileList[0];
                        return {
                            ...item,
                            clientStatus: 'ok' as const,
                            clientFeedbackDate: now,
                            contractFile: contractFile ? `/uploads/contracts/${contractFile.name}` : undefined,
                            contractFileName: contractFile?.name
                        };
                    } else {
                        return {
                            ...item,
                            clientStatus: 'ng' as const,
                            clientFeedbackDate: now,
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
            setContractFileList([]);
        });
    };

    const handleArchive = (record: Quotation) => {
        if (record.status !== 'approved' || record.clientStatus !== 'ok') {
            message.warning('只有已批准且客户反馈OK的报价单可以归档');
            return;
        }
        setArchivingQuotation(record);
        archiveForm.resetFields();
        setArchiveFileList([]);
        setIsArchiveModalVisible(true);
    };

    const handleSubmitArchive = () => {
        archiveForm.validateFields().then(() => {
            if (!archivingQuotation) return;

            const contractFile = archiveFileList[0];
            if (!contractFile) {
                message.error('请上传盖章合同文件');
                return;
            }

            const now = new Date().toISOString();
            const newData = dataSource.map(item => {
                if (item.id === archivingQuotation.id) {
                    return {
                        ...item,
                        status: 'archived' as const,
                        isArchived: true,
                        archivedAt: now,
                        archivedBy: '当前用户',
                        archivedContractFile: `/uploads/contracts/archived/${contractFile.name}`,
                        archivedContractFileName: contractFile.name,
                        updatedAt: now
                    };
                }
                return item;
            });

            setDataSource(newData);
            applyFilters(newData, statusFilter, clientStatusFilter, searchText);
            message.success('报价单已归档');
            setIsArchiveModalVisible(false);
            setArchiveFileList([]);
        });
    };

    const handleGenerateContract = () => {
        if (selectedRows.length !== 1) {
            message.warning('请选择一个报价单');
            return;
        }
        const quotation = selectedRows[0];

        if (quotation.contractNo) {
            message.warning(`该报价单已关联合同 ${quotation.contractNo}，不能重复生成`);
            return;
        }

        if (quotation.status !== 'approved') {
            message.warning('只有已批准的报价单才能生成合同');
            return;
        }
        if (quotation.clientStatus !== 'ok') {
            message.warning('客户反馈确认后才能生成合同');
            return;
        }

        const contractNo = `HT${dayjs().format('YYYYMMDD')}${String(Date.now()).slice(-3)}`;

        const newData = dataSource.map(item => {
            if (item.id === quotation.id) {
                return {
                    ...item,
                    contractNo: contractNo,
                    status: 'archived' as const
                };
            }
            return item;
        });
        setDataSource(newData);

        navigate('/entrustment/contract', {
            state: {
                fromQuotation: { ...quotation, contractNo },
                preGeneratedContractNo: contractNo
            }
        });
        message.success(`正在为报价单 ${quotation.quotationNo} 创建合同`);
    };

    const columns: ColumnsType<Quotation> = [
        {
            title: '报价单号',
            dataIndex: 'quotationNo',
            key: 'quotationNo',
            width: 150,
            fixed: 'left',
            render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>
        },
        {
            title: '咨询单号',
            dataIndex: 'consultationNo',
            key: 'consultationNo',
            width: 150,
            render: (text) => text ? (
                <a onClick={() => navigate('/entrustment/consultation')}>{text}</a>
            ) : '-'
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
            render: (value) => `¥${(value || 0).toFixed(2)}`
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
            width: 200,
            render: (_: any, record: Quotation) => {
                const config = CLIENT_STATUS_MAP[record.clientStatus];
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={config.color}>{config.text}</Tag>
                        {record.clientStatus === 'ok' && record.contractFileName && (
                            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                <FileTextOutlined /> {record.contractFileName}
                            </div>
                        )}
                        {record.clientStatus === 'ng' && record.ngReason && (
                            <div style={{ fontSize: 12, color: '#ff4d4f', marginTop: 4 }}>
                                <CloseCircleOutlined /> {record.ngReason.length > 10 ? `${record.ngReason.substring(0, 10)}...` : record.ngReason}
                            </div>
                        )}
                    </Space>
                );
            }
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => {
                const actions = [];

                actions.push(
                    <Button
                        key="view"
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                );

                if (record.status === 'draft' || record.status === 'rejected') {
                    actions.push(
                        <Button
                            key="edit"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        >
                            编辑
                        </Button>
                    );
                }

                if (canDelete && record.status === 'draft') {
                    actions.push(
                        <Popconfirm
                            key="delete"
                            title="确定删除吗?"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button size="small" danger icon={<DeleteOutlined />}>
                                删除
                            </Button>
                        </Popconfirm>
                    );
                }

                return <Space size="small">{actions}</Space>;
            }
        }
    ];

    return (
        <Card
            title="报价单管理"
            extra={
                <Space>
                    <Button
                        onClick={() => selectedRows[0] && handleSubmitApproval(selectedRows[0])}
                        disabled={selectedRows.length === 0 || selectedRows[0]?.status !== 'draft'}
                    >
                        提交审批
                    </Button>
                    <Button
                        icon={<FileTextOutlined />}
                        onClick={() => selectedRows[0] && handleViewPDF(selectedRows[0])}
                        disabled={selectedRows.length === 0 || selectedRows[0]?.status !== 'approved'}
                    >
                        生成PDF
                    </Button>
                    <Button
                        icon={<UploadOutlined />}
                        onClick={() => selectedRows[0] && handleArchive(selectedRows[0])}
                        disabled={selectedRows.length === 0 || selectedRows[0]?.status !== 'approved' || selectedRows[0]?.clientStatus !== 'ok'}
                    >
                        归档
                    </Button>
                    <Button
                        icon={<FileTextOutlined />}
                        onClick={handleGenerateContract}
                        disabled={
                            selectedRows.length === 0 ||
                            selectedRows[0]?.status !== 'approved' ||
                            selectedRows[0]?.clientStatus !== 'ok' ||
                            !!selectedRows[0]?.contractNo
                        }
                    >
                        生成合同
                    </Button>
                    <Button
                        icon={<FormOutlined />}
                        onClick={handleTopClientFeedback}
                        disabled={selectedRows.length === 0}
                    >
                        客户反馈
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新建报价单
                    </Button>
                </Space>
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
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <QuotationForm
                visible={isFormVisible}
                quotation={editingQuotation}
                fromConsultation={fromConsultation}
                onCancel={() => {
                    setIsFormVisible(false);
                    setFromConsultation(null);
                }}
                onSave={handleSaveQuotation}
            />

            <QuotationDetailDrawer
                visible={isDetailVisible}
                quotation={detailQuotation}
                onClose={() => setIsDetailVisible(false)}
            />

            <Modal
                title="客户反馈处理"
                open={isFeedbackModalVisible}
                onCancel={() => setIsFeedbackModalVisible(false)}
                onOk={handleSubmitFeedback}
                okText="确定"
                cancelText="取消"
                width={600}
            >
                <Form form={feedbackForm} layout="vertical">
                    <Form.Item label="反馈结果" required>
                        <Radio.Group
                            value={feedbackType}
                            onChange={e => {
                                setFeedbackType(e.target.value);
                                setContractFileList([]);
                                feedbackForm.resetFields(['contractFile', 'ngReason']);
                            }}
                        >
                            <Radio value="ok">客户确认OK</Radio>
                            <Radio value="ng">客户拒绝(NG)</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {feedbackType === 'ok' ? (
                        <Form.Item
                            label="上传盖章合同"
                            required
                            tooltip="请上传客户签字盖章后的合同文件"
                        >
                            <Upload
                                fileList={contractFileList}
                                beforeUpload={(file) => {
                                    const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
                                    if (!isValidType) {
                                        message.error('只支持 PDF/JPG/PNG 格式文件!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        message.error('文件大小不能超过 10MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    setContractFileList([file]);
                                    return false;
                                }}
                                onRemove={() => setContractFileList([])}
                                maxCount={1}
                                accept=".pdf,.jpg,.jpeg,.png"
                            >
                                <Button icon={<UploadOutlined />}>选择合同文件</Button>
                            </Upload>
                            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                                支持 PDF、JPG、PNG 格式, 文件大小不超过 10MB
                            </div>
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name="ngReason"
                            label="拒绝原因"
                            rules={[
                                { required: true, message: '请填写拒绝原因' },
                                { min: 10, message: '原因描述不能少于10个字' },
                                { max: 500, message: '原因描述不能超过500个字' }
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="请详细说明客户拒绝的原因,以便后续改进..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            <Modal
                title="归档报价单"
                open={isArchiveModalVisible}
                onCancel={() => {
                    setIsArchiveModalVisible(false);
                    setArchiveFileList([]);
                }}
                onOk={handleSubmitArchive}
                okText="确定归档"
                cancelText="取消"
                width={600}
            >
                {archivingQuotation && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                        <div><strong>报价单号:</strong> {archivingQuotation.quotationNo}</div>
                        <div><strong>客户公司:</strong> {archivingQuotation.clientCompany}</div>
                        <div><strong>合同金额:</strong> ¥{archivingQuotation.discountTotal.toFixed(2)}</div>
                    </div>
                )}

                <Form form={archiveForm} layout="vertical">
                    <Form.Item
                        label="上传盖章合同"
                        required
                        tooltip="请上传客户签字盖章后的合同文件，归档后报价单将不可修改"
                    >
                        <Upload
                            fileList={archiveFileList}
                            beforeUpload={(file) => {
                                const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
                                if (!isValidType) {
                                    message.error('只支持 PDF/JPG/PNG 格式文件!');
                                    return Upload.LIST_IGNORE;
                                }
                                const isLt10M = file.size / 1024 / 1024 < 10;
                                if (!isLt10M) {
                                    message.error('文件大小不能超过 10MB!');
                                    return Upload.LIST_IGNORE;
                                }
                                setArchiveFileList([file]);
                                return false;
                            }}
                            onRemove={() => setArchiveFileList([])}
                            maxCount={1}
                            accept=".pdf,.jpg,.jpeg,.png"
                        >
                            <Button icon={<UploadOutlined />}>选择合同文件</Button>
                        </Upload>
                        <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                            支持 PDF、JPG、PNG 格式, 文件大小不超过 10MB
                        </div>
                    </Form.Item>

                    <div style={{ padding: 12, background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 4 }}>
                        <div style={{ color: '#fa8c16', marginBottom: 8 }}>
                            <strong>归档说明：</strong>
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            1. 归档后报价单状态将变更为"已归档"<br />
                            2. 归档后可以生成委托合同<br />
                            3. 归档操作不可撤销，请确认无误后操作
                        </div>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};

export default QuotationManagement;
