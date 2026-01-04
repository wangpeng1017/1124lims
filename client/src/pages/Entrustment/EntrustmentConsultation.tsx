import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, message, Popconfirm, DatePicker, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { consultationData, CONSULTATION_STATUS_MAP, URGENCY_LEVEL_MAP, type IConsultation as MockIConsultation } from '../../mock/consultation';
import { consultationApi, type IConsultation } from '../../services/consultationApi';
import { canEdit, canDelete, canClose, canGenerateQuotation } from '../../config/consultationPermissions';
import ConsultationForm from './ConsultationForm';
import ConsultationDetailDrawer from './ConsultationDetailDrawer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// API数据适配器：将后端数据转换为前端组件期望的格式
const adaptApiData = (apiConsultation: IConsultation): MockIConsultation => {
    return {
        id: String(apiConsultation.id || ''),
        consultationNo: apiConsultation.consultationNo || '',
        createTime: apiConsultation.createTime ? apiConsultation.createTime.replace('T', ' ').substring(0, 19) : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: apiConsultation.updateTime ? apiConsultation.updateTime.replace('T', ' ').substring(0, 19) : dayjs().format('YYYY-MM-DD HH:mm:ss'),

        // 客户信息
        clientCompany: apiConsultation.clientCompany || '',
        clientContact: apiConsultation.clientContact || '',
        clientTel: apiConsultation.clientTel || '',
        clientEmail: apiConsultation.clientEmail,
        clientAddress: apiConsultation.clientAddress,

        // 咨询内容
        sampleName: apiConsultation.sampleName || '',
        sampleModel: apiConsultation.sampleModel,
        sampleMaterial: apiConsultation.sampleMaterial,
        estimatedQuantity: apiConsultation.estimatedQuantity,

        testItems: apiConsultation.testItems || [],
        testPurpose: apiConsultation.testPurpose || 'other',
        urgencyLevel: apiConsultation.urgencyLevel || 'normal',
        expectedDeadline: apiConsultation.expectedDeadline,

        // 客户需求
        clientRequirements: apiConsultation.clientRequirements,
        budgetRange: apiConsultation.budgetRange,

        // 跟进信息
        status: apiConsultation.status || 'following',
        follower: apiConsultation.follower || '',
        followUpRecords: apiConsultation.followUpRecords || [],

        // 评估信息
        feasibility: apiConsultation.feasibility,
        feasibilityNote: apiConsultation.feasibilityNote,
        estimatedPrice: apiConsultation.estimatedPrice,

        // 转化信息
        quotationId: apiConsultation.quotationId ? String(apiConsultation.quotationId) : undefined,
        quotationNo: apiConsultation.quotationNo,

        // 元数据
        createdBy: apiConsultation.createdBy || '系统',
    };
};

// 反向适配器：将前端表单数据转换为API期望的格式
const adaptFormToApi = (formConsultation: Partial<MockIConsultation>): Partial<IConsultation> => {
    return {
        id: formConsultation.id ? Number(formConsultation.id) : undefined,
        consultationNo: formConsultation.consultationNo,

        // 客户信息
        clientCompany: formConsultation.clientCompany || '',
        clientContact: formConsultation.clientContact || '',
        clientTel: formConsultation.clientTel || '',
        clientEmail: formConsultation.clientEmail,
        clientAddress: formConsultation.clientAddress,

        // 咨询内容
        sampleName: formConsultation.sampleName || '',
        sampleModel: formConsultation.sampleModel,
        sampleMaterial: formConsultation.sampleMaterial,
        estimatedQuantity: formConsultation.estimatedQuantity,

        testItems: formConsultation.testItems || [],
        testPurpose: formConsultation.testPurpose,
        urgencyLevel: formConsultation.urgencyLevel,
        expectedDeadline: formConsultation.expectedDeadline,

        // 客户需求
        clientRequirements: formConsultation.clientRequirements,
        budgetRange: formConsultation.budgetRange,

        // 跟进信息
        status: formConsultation.status,
        follower: formConsultation.follower,
        followUpRecords: formConsultation.followUpRecords,

        // 评估信息
        feasibility: formConsultation.feasibility,
        feasibilityNote: formConsultation.feasibilityNote,
        estimatedPrice: formConsultation.estimatedPrice,

        // 转化信息
        quotationId: formConsultation.quotationId ? Number(formConsultation.quotationId) : undefined,
        quotationNo: formConsultation.quotationNo,

        // 元数据
        createdBy: formConsultation.createdBy,
    };
};

const EntrustmentConsultation: React.FC = () => {
    const navigate = useNavigate();
    const { canDelete: canDeleteByRole } = useAuth();

    // 数据状态
    const [dataSource, setDataSource] = useState<MockIConsultation[]>([]);
    const [filteredData, setFilteredData] = useState<MockIConsultation[]>([]);
    const [loading, setLoading] = useState(false);

    // 筛选状态
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
    const [followerFilter, setFollowerFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    // 表单状态
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingConsultation, setEditingConsultation] = useState<MockIConsultation | null>(null);

    // 详情抽屉状态
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailConsultation, setDetailConsultation] = useState<MockIConsultation | null>(null);

    // 行选择状态
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<MockIConsultation[]>([]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: MockIConsultation[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };

    // 获取所有跟进人列表
    const followers = Array.from(new Set(dataSource.map(item => item.follower)));

    // 加载数据
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await consultationApi.page({
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
                setDataSource(consultationData);
                setFilteredData(consultationData);
            }
        } catch (error) {
            console.error('加载咨询数据失败:', error);
            // 出错时使用mock数据
            setDataSource(consultationData);
            setFilteredData(consultationData);
        } finally {
            setLoading(false);
        }
    }, []);

    // 初始化加载数据
    useEffect(() => {
        loadData();
    }, [loadData]);

    // 筛选逻辑
    const applyFilters = (
        data: MockIConsultation[],
        status: string,
        urgency: string,
        follower: string,
        search: string,
        dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    ) => {
        let filtered = [...data];

        if (status !== 'all') {
            filtered = filtered.filter(item => item.status === status);
        }

        if (follower !== 'all') {
            filtered = filtered.filter(item => item.follower === follower);
        }

        if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
            const startDate = dateRangeValue[0].format('YYYY-MM-DD');
            const endDate = dateRangeValue[1].format('YYYY-MM-DD');
            filtered = filtered.filter(item =>
                item.createTime >= startDate && item.createTime <= endDate
            );
        }

        if (search) {
            filtered = filtered.filter(item =>
                item.consultationNo.toLowerCase().includes(search.toLowerCase()) ||
                item.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
                item.clientContact.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        applyFilters(dataSource, value, urgencyFilter, followerFilter, searchText, dateRange);
    };

    const handleUrgencyFilterChange = (value: string) => {
        setUrgencyFilter(value);
        applyFilters(dataSource, statusFilter, value, followerFilter, searchText, dateRange);
    };

    const handleFollowerFilterChange = (value: string) => {
        setFollowerFilter(value);
        applyFilters(dataSource, statusFilter, urgencyFilter, value, searchText, dateRange);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        applyFilters(dataSource, statusFilter, urgencyFilter, followerFilter, value, dateRange);
    };

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setDateRange(dates);
        applyFilters(dataSource, statusFilter, urgencyFilter, followerFilter, searchText, dates);
    };

    const handleAdd = () => {
        setEditingConsultation(null);
        setIsFormVisible(true);
    };

    const handleEdit = (record: MockIConsultation) => {
        if (!canEdit(record.status)) {
            message.warning('只有跟进中状态的咨询可以编辑');
            return;
        }
        setEditingConsultation(record);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: string) => {
        const item = dataSource.find(d => d.id === id);
        if (!item) return;

        if (!canDelete(item.status)) {
            message.warning('该状态不允许删除');
            return;
        }

        try {
            await consultationApi.delete(Number(id));
            message.success('删除成功');
            loadData(); // 重新加载数据
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleViewDetail = (record: MockIConsultation) => {
        setDetailConsultation(record);
        setIsDetailVisible(true);
    };

    const handleCloseConsultation = async (record: MockIConsultation) => {
        if (!canClose(record.status)) {
            message.warning('只有跟进中状态的咨询可以关闭');
            return;
        }

        try {
            await consultationApi.close(Number(record.id));
            message.success('咨询已关闭');
            loadData(); // 重新加载数据
        } catch (error) {
            message.error('关闭失败');
        }
    };

    const handleGenerateQuotation = (record: MockIConsultation) => {
        if (!canGenerateQuotation(record.status, !!record.quotationNo)) {
            if (record.quotationNo) {
                message.warning(`该咨询单已关联报价单 ${record.quotationNo}，不能重复生成`);
            } else {
                message.warning('只有跟进中状态的咨询单才能生成报价单');
            }
            return;
        }

        const quotationNo = `BJ${dayjs().format('YYYYMMDD')}${String(Date.now()).slice(-3)}`;

        // 更新本地状态
        const newData = dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: 'quoted' as const,
                    quotationNo: quotationNo,
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });
        setDataSource(newData);
        applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);

        // 跳转到报价单页面
        navigate('/entrustment/quotation', {
            state: {
                fromConsultation: { ...record, quotationNo },
                preGeneratedQuotationNo: quotationNo
            }
        });

        message.success(`正在为咨询单 ${record.consultationNo} 创建报价单`);
    };

    const handleSaveConsultation = async (values: Partial<MockIConsultation>) => {
        try {
            if (editingConsultation) {
                // 编辑模式
                const apiData = adaptFormToApi(values);
                await consultationApi.update(apiData as IConsultation);
                message.success('咨询已更新');
            } else {
                // 新建模式
                const apiData = adaptFormToApi(values);
                await consultationApi.create(apiData as IConsultation);
                message.success('咨询已创建');
            }

            setIsFormVisible(false);
            loadData(); // 重新加载数据
        } catch (error) {
            message.error('保存失败');
        }
    };

    const handleDetailUpdate = async (updatedConsultation: MockIConsultation) => {
        try {
            const apiData = adaptFormToApi(updatedConsultation);
            await consultationApi.update(apiData as IConsultation);

            // 更新本地状态
            const newData = dataSource.map(item => {
                if (item.id === updatedConsultation.id) {
                    return updatedConsultation;
                }
                return item;
            });
            setDataSource(newData);
            applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
        } catch (error) {
            message.error('更新失败');
        }
    };

    const columns: ColumnsType<MockIConsultation> = [
        {
            title: '咨询单号',
            dataIndex: 'consultationNo',
            key: 'consultationNo',
            width: 150,
            fixed: 'left',
            render: (text, record) => (
                <a onClick={() => handleViewDetail(record)}>{text}</a>
            )
        },
        {
            title: '客户公司',
            dataIndex: 'clientCompany',
            key: 'clientCompany',
            width: 200,
            ellipsis: true
        },
        {
            title: '联系人/电话',
            key: 'contact',
            width: 150,
            render: (_, record) => (
                <div>
                    <div>{record.clientContact}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{record.clientTel}</div>
                </div>
            )
        },
        {
            title: '样品名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            width: 150,
            ellipsis: true
        },
        {
            title: '检测项目',
            dataIndex: 'testItems',
            key: 'testItems',
            width: 200,
            render: (items: string[]) => {
                const displayItems = items.slice(0, 2);
                const remainingCount = items.length - 2;
                return (
                    <Tooltip title={items.join('、')}>
                        <div>
                            {displayItems.join('、')}
                            {remainingCount > 0 && <span style={{ color: '#1890ff' }}> 等{items.length}项</span>}
                        </div>
                    </Tooltip>
                );
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: MockIConsultation['status']) => {
                const config = CONSULTATION_STATUS_MAP[status];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: '跟进人',
            dataIndex: 'follower',
            key: 'follower',
            width: 100
        },
        {
            title: '关联报价单',
            dataIndex: 'quotationNo',
            key: 'quotationNo',
            width: 140,
            render: (text) => text ? (
                <a onClick={() => navigate('/entrustment/quotation')}>{text}</a>
            ) : '-'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
            sorter: (a, b) => a.createTime.localeCompare(b.createTime)
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
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                );

                if (canEdit(record.status)) {
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

                if (canDeleteByRole && canDelete(record.status)) {
                    actions.push(
                        <Popconfirm
                            key="delete"
                            title="删除后数据将永久移除，无法恢复。确定删除吗?"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button size="small" danger icon={<DeleteOutlined />}>
                                删除
                            </Button>
                        </Popconfirm>
                    );
                }

                return <Space size="small" wrap>{actions}</Space>;
            }
        }
    ];

    return (
        <Card
            title="委托咨询"
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<FileAddOutlined />}
                        onClick={() => selectedRows[0] && handleGenerateQuotation(selectedRows[0])}
                        disabled={selectedRows.length === 0 || !canGenerateQuotation(selectedRows[0]?.status, !!selectedRows[0]?.quotationNo)}
                    >
                        生成报价单
                    </Button>
                    <Popconfirm
                        title="确定关闭此咨询吗?"
                        onConfirm={() => selectedRows[0] && handleCloseConsultation(selectedRows[0])}
                        disabled={selectedRows.length === 0 || !canClose(selectedRows[0]?.status)}
                    >
                        <Button
                            icon={<CloseCircleOutlined />}
                            disabled={selectedRows.length === 0 || !canClose(selectedRows[0]?.status)}
                        >
                            关闭咨询
                        </Button>
                    </Popconfirm>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新建咨询
                    </Button>
                </Space>
            }
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Search
                    placeholder="搜索咨询单号/客户名称/联系人"
                    allowClear
                    style={{ width: 300 }}
                    onSearch={handleSearch}
                    prefix={<SearchOutlined />}
                />
                <Select
                    style={{ width: 150 }}
                    placeholder="状态"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                >
                    <Option value="all">全部状态</Option>
                    <Option value="following">跟进中</Option>
                    <Option value="quoted">已报价</Option>
                    <Option value="rejected">已拒绝</Option>
                    <Option value="closed">已关闭</Option>
                </Select>
                <Select
                    style={{ width: 150 }}
                    placeholder="跟进人"
                    value={followerFilter}
                    onChange={handleFollowerFilterChange}
                >
                    <Option value="all">全部跟进人</Option>
                    {followers.map(follower => (
                        <Option key={follower} value={follower}>{follower}</Option>
                    ))}
                </Select>
                <RangePicker
                    style={{ width: 240 }}
                    placeholder={['开始日期', '结束日期']}
                    onChange={handleDateRangeChange}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                loading={loading}
                rowSelection={rowSelection}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <ConsultationForm
                visible={isFormVisible}
                consultation={editingConsultation}
                onCancel={() => setIsFormVisible(false)}
                onSave={handleSaveConsultation}
            />

            <ConsultationDetailDrawer
                visible={isDetailVisible}
                consultation={detailConsultation}
                onClose={() => setIsDetailVisible(false)}
                onUpdate={handleDetailUpdate}
            />

            <style>{`
                .urgent-row {
                    background-color: #fff1f0;
                }
            `}</style>
        </Card>
    );
};

export default EntrustmentConsultation;
