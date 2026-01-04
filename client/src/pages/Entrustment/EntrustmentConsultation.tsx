import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, message, Popconfirm, DatePicker, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { consultationData, CONSULTATION_STATUS_MAP, URGENCY_LEVEL_MAP, type IConsultation } from '../../mock/consultation';
import { canEdit, canDelete, canClose, canGenerateQuotation } from '../../config/consultationPermissions';
import ConsultationForm from './ConsultationForm';
import ConsultationDetailDrawer from './ConsultationDetailDrawer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EntrustmentConsultation: React.FC = () => {
    const navigate = useNavigate();
    const { canDelete: canDeleteByRole } = useAuth();
    const [dataSource, setDataSource] = useState<IConsultation[]>(consultationData);
    const [filteredData, setFilteredData] = useState<IConsultation[]>(consultationData);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
    const [followerFilter, setFollowerFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    // 表单状态
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingConsultation, setEditingConsultation] = useState<IConsultation | null>(null);

    // 详情抽屉状态
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailConsultation, setDetailConsultation] = useState<IConsultation | null>(null);

    // 行选择状态
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IConsultation[]>([]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: IConsultation[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };

    // 获取所有跟进人列表
    const followers = Array.from(new Set(dataSource.map(item => item.follower)));

    // 筛选逻辑
    const applyFilters = (
        data: IConsultation[],
        status: string,
        urgency: string,
        follower: string,
        search: string,
        dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    ) => {
        let filtered = [...data];

        // 状态筛选
        if (status !== 'all') {
            filtered = filtered.filter(item => item.status === status);
        }

        // 跟进人筛选（移除紧急程度筛选）

        // 跟进人筛选
        if (follower !== 'all') {
            filtered = filtered.filter(item => item.follower === follower);
        }

        // 日期范围筛选
        if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
            const startDate = dateRangeValue[0].format('YYYY-MM-DD');
            const endDate = dateRangeValue[1].format('YYYY-MM-DD');
            filtered = filtered.filter(item =>
                item.createTime >= startDate && item.createTime <= endDate
            );
        }

        // 搜索筛选
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

    const handleEdit = (record: IConsultation) => {
        // 使用统一的权限检查
        if (!canEdit(record.status)) {
            message.warning('只有待跟进和跟进中状态的咨询可以编辑');
            return;
        }
        setEditingConsultation(record);
        setIsFormVisible(true);
    };

    const handleDelete = (id: string) => {
        const item = dataSource.find(d => d.id === id);
        if (!item) return;

        // 使用统一的权限检查
        if (!canDelete(item.status)) {
            message.warning('只有待跟进状态的咨询可以删除');
            return;
        }
        const newData = dataSource.filter(item => item.id !== id);
        setDataSource(newData);
        applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
        message.success('删除成功');
    };

    const handleViewDetail = (record: IConsultation) => {
        setDetailConsultation(record);
        setIsDetailVisible(true);
    };

    const handleCloseConsultation = (record: IConsultation) => {
        // 使用统一的权限检查
        if (!canClose(record.status)) {
            message.warning('只有待跟进和跟进中状态的咨询可以关闭');
            return;
        }
        const newData = dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: 'closed' as const,
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });
        setDataSource(newData);
        applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
        message.success('咨询已关闭');
    };

    const handleGenerateQuotation = (record: IConsultation) => {
        // 使用统一的权限检查
        if (!canGenerateQuotation(record.status, !!record.quotationNo)) {
            if (record.quotationNo) {
                message.warning(`该咨询单已关联报价单 ${record.quotationNo}，不能重复生成`);
            } else {
                message.warning('只有跟进中状态的咨询单才能生成报价单');
            }
            return;
        }

        // 3. 生成报价单号
        const quotationNo = `BJ${dayjs().format('YYYYMMDD')}${String(Date.now()).slice(-3)}`;

        // 4. 更新咨询单状态和关联信息
        const newData = dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    status: 'quoted' as const,
                    quotationNo: quotationNo,  // 回写报价单号
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });
        setDataSource(newData);
        applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);

        // 5. 跳转到报价单页面并传递咨询单数据
        navigate('/entrustment/quotation', {
            state: {
                fromConsultation: { ...record, quotationNo },
                preGeneratedQuotationNo: quotationNo
            }
        });

        message.success(`正在为咨询单 ${record.consultationNo} 创建报价单`);
    };

    const handleSaveConsultation = (values: Partial<IConsultation>) => {
        if (editingConsultation) {
            // 编辑模式
            const newData = dataSource.map(item => {
                if (item.id === editingConsultation.id) {
                    return {
                        ...item,
                        ...values,
                        updatedAt: new Date().toISOString()
                    };
                }
                return item;
            });
            setDataSource(newData);
            applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
            message.success('咨询已更新');
        } else {
            // 新建模式
            const newConsultation: IConsultation = {
                id: String(dataSource.length + 1),
                consultationNo: `ZX${dayjs().format('YYYYMMDD')}${String(dataSource.length + 1).padStart(3, '0')}`,
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status: 'pending',
                followUpRecords: [],
                createdBy: '当前用户',
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                ...values
            } as IConsultation;
            const newData = [newConsultation, ...dataSource];
            setDataSource(newData);
            applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
            message.success('咨询已创建');
        }
        setIsFormVisible(false);
    };

    const handleDetailUpdate = (updatedConsultation: IConsultation) => {
        const newData = dataSource.map(item => {
            if (item.id === updatedConsultation.id) {
                return updatedConsultation;
            }
            return item;
        });
        setDataSource(newData);
        applyFilters(newData, statusFilter, urgencyFilter, followerFilter, searchText, dateRange);
    };

    const columns: ColumnsType<IConsultation> = [
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
            render: (status: IConsultation['status']) => {
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

                // 查看详情 - 所有状态都可以查看
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

                // 使用统一的权限检查 - 编辑按钮
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

                // 使用统一的权限检查 - 删除按钮（需管理员权限）
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
                    <Option value="pending">待跟进</Option>
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
