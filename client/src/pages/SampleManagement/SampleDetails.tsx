import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Space, Tag, Button, Modal, Form, InputNumber, DatePicker, message, Statistic, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExportOutlined, UserAddOutlined, SendOutlined, HistoryOutlined } from '@ant-design/icons';
import { sampleCollectionData, sampleOutsourceData, type ISampleDetail, type ISampleCollection, type ISampleOutsource } from '../../mock/sample';
import { supplierData } from '../../mock/supplier';
import dayjs from 'dayjs';
import { useSampleService } from '../../services/useDataService';

const SampleDetails: React.FC = () => {
    // 使用API服务
    const { loading, data: apiData, fetchList } = useSampleService();
    const [dataSource, setDataSource] = useState<ISampleDetail[]>([]);
    const [filteredData, setFilteredData] = useState<ISampleDetail[]>([]);
    const [collectionRecords, setCollectionRecords] = useState<ISampleCollection[]>(sampleCollectionData);
    const [outsourceRecords, setOutsourceRecords] = useState<ISampleOutsource[]>(sampleOutsourceData);

    // 初始化加载数据
    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // 同步API数据
    useEffect(() => {
        if (apiData && apiData.length > 0) {
            setDataSource(apiData as any);
            setFilteredData(apiData as any);
        }
    }, [apiData]);

    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [isOutsourceModalOpen, setIsOutsourceModalOpen] = useState(false);
    const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
    const [selectedSample, setSelectedSample] = useState<ISampleDetail | null>(null);

    const [collectionForm] = Form.useForm();
    const [outsourceForm] = Form.useForm();

    const laboratories = ['物理实验室', '化学实验室', '材料实验室', '环境实验室'];
    const outsourcingSuppliers = supplierData.filter(s => s.categories.includes('CAT001'));

    const handleSearch = (value: string) => {
        const filtered = dataSource.filter(item =>
            item.sampleNo.toLowerCase().includes(value.toLowerCase()) ||
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.entrustmentId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleStatusFilter = (value: string) => {
        if (value === 'all') {
            setFilteredData(dataSource);
        } else {
            setFilteredData(dataSource.filter(item => item.status === value));
        }
    };

    const handleOpenCollection = (record: ISampleDetail) => {
        if (record.remainingQuantity <= 0) {
            message.warning('该样品已无可用数量');
            return;
        }
        setSelectedSample(record);
        collectionForm.resetFields();
        collectionForm.setFieldsValue({
            collectionDate: dayjs(),
            expectedReturnDate: dayjs().add(7, 'day')
        });
        setIsCollectionModalOpen(true);
    };

    const handleOpenOutsource = (record: ISampleDetail) => {
        if (record.remainingQuantity <= 0) {
            message.warning('该样品已无可用数量');
            return;
        }
        setSelectedSample(record);
        outsourceForm.resetFields();
        outsourceForm.setFieldsValue({
            assignDate: dayjs(),
            dueDate: dayjs().add(14, 'day')
        });
        setIsOutsourceModalOpen(true);
    };

    const handleCollectionOk = () => {
        collectionForm.validateFields().then(values => {
            if (!selectedSample) return;

            const collectionQuantity = values.collectionQuantity;
            if (collectionQuantity > selectedSample.remainingQuantity) {
                message.error(`领用数量不能超过可用数量(${selectedSample.remainingQuantity}${selectedSample.unit})`);
                return;
            }

            // 创建领用记录
            const newCollection: ISampleCollection = {
                id: `COL${Date.now()}`,
                sampleNo: selectedSample.sampleNo,
                sampleName: selectedSample.name,
                laboratory: values.laboratory,
                collectionPerson: '当前用户',
                collectionPersonId: 'E001',
                collectionDate: values.collectionDate.format('YYYY-MM-DD'),
                collectionQuantity: collectionQuantity,
                unit: selectedSample.unit,
                purpose: values.purpose,
                testItems: values.testItems,
                expectedReturnDate: values.expectedReturnDate.format('YYYY-MM-DD'),
                status: 'in_use',
                createTime: new Date().toISOString()
            };

            setCollectionRecords([...collectionRecords, newCollection]);

            // 更新样品状态
            const newRemainingQuantity = selectedSample.remainingQuantity - collectionQuantity;
            const newStatus = newRemainingQuantity === 0 ? '全部领用' : '部分领用';

            setDataSource(dataSource.map(item =>
                item.id === selectedSample.id
                    ? { ...item, remainingQuantity: newRemainingQuantity, status: newStatus }
                    : item
            ));
            setFilteredData(filteredData.map(item =>
                item.id === selectedSample.id
                    ? { ...item, remainingQuantity: newRemainingQuantity, status: newStatus }
                    : item
            ));

            message.success('领用成功');
            setIsCollectionModalOpen(false);
        });
    };

    const handleOutsourceOk = () => {
        outsourceForm.validateFields().then(values => {
            if (!selectedSample) return;

            const quantity = values.quantity;
            if (quantity > selectedSample.remainingQuantity) {
                message.error(`委外数量不能超过可用数量(${selectedSample.remainingQuantity}${selectedSample.unit})`);
                return;
            }

            const supplier = outsourcingSuppliers.find(s => s.id === values.supplierId);

            // 创建委外记录
            const newOutsource: ISampleOutsource = {
                id: `OUT${Date.now()}`,
                sampleNo: selectedSample.sampleNo,
                sampleName: selectedSample.name,
                supplierId: values.supplierId,
                supplierName: supplier?.name || '',
                quantity: quantity,
                unit: selectedSample.unit,
                testItems: values.testItems,
                assignedBy: '当前用户',
                assignedById: 'E001',
                assignDate: values.assignDate.format('YYYY-MM-DD'),
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                status: 'pending',
                remark: values.remark
            };

            setOutsourceRecords([...outsourceRecords, newOutsource]);

            // 更新样品状态
            setDataSource(dataSource.map(item =>
                item.id === selectedSample.id
                    ? {
                        ...item,
                        remainingQuantity: item.remainingQuantity - quantity,
                        status: '已外包',
                        outsourceStatus: 'outsourced',
                        outsourceSupplierId: values.supplierId,
                        outsourceSupplierName: supplier?.name,
                        outsourceDate: values.assignDate.format('YYYY-MM-DD')
                    }
                    : item
            ));
            setFilteredData(filteredData.map(item =>
                item.id === selectedSample.id
                    ? {
                        ...item,
                        remainingQuantity: item.remainingQuantity - quantity,
                        status: '已外包',
                        outsourceStatus: 'outsourced',
                        outsourceSupplierId: values.supplierId,
                        outsourceSupplierName: supplier?.name,
                        outsourceDate: values.assignDate.format('YYYY-MM-DD')
                    }
                    : item
            ));

            message.success('委外分配成功');
            setIsOutsourceModalOpen(false);
        });
    };

    const handleViewRecords = (record: ISampleDetail) => {
        setSelectedSample(record);
        setIsRecordsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            '待收样': 'default',
            '已收样': 'blue',
            '部分领用': 'cyan',
            '全部领用': 'purple',
            '检测中': 'processing',
            '已完成': 'success',
            '已外包': 'orange',
            '已归还': 'green',
            '已销毁': 'red'
        };
        return colorMap[status] || 'default';
    };

    const columns: ColumnsType<ISampleDetail> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo', fixed: 'left', width: 140 },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId', width: 140 },
        { title: '样品名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '规格型号', dataIndex: 'spec', key: 'spec', width: 120 },
        {
            title: '总量',
            key: 'totalQuantity',
            width: 100,
            render: (_, record) => `${record.totalQuantity}${record.unit}`
        },
        {
            title: '可用量',
            key: 'remainingQuantity',
            width: 100,
            render: (_, record) => (
                <span style={{ color: record.remainingQuantity === 0 ? 'red' : 'inherit', fontWeight: 'bold' }}>
                    {record.remainingQuantity}{record.unit}
                </span>
            )
        },
        { title: '收样日期', dataIndex: 'receiptDate', key: 'receiptDate', width: 110 },
        { title: '收样人', dataIndex: 'receiptPerson', key: 'receiptPerson', width: 100 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        {
            title: '委外状态',
            key: 'outsourceStatus',
            width: 120,
            render: (_, record) => {
                if (record.outsourceStatus === 'outsourced') {
                    return <Tag color="orange">{record.outsourceSupplierName}</Tag>;
                }
                return <Tag color="default">未委外</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleOpenCollection(record)}>内部领用</a>
                    <a onClick={() => handleOpenOutsource(record)}>外部委外</a>
                    <a onClick={() => handleViewRecords(record)}><HistoryOutlined /> 记录</a>
                </Space>
            ),
        },
    ];

    const collectionColumns: ColumnsType<ISampleCollection> = [
        { title: '实验室', dataIndex: 'laboratory', key: 'laboratory' },
        { title: '领用人', dataIndex: 'collectionPerson', key: 'collectionPerson' },
        { title: '领用数量', key: 'quantity', render: (_, record) => `${record.collectionQuantity}${record.unit}` },
        { title: '领用日期', dataIndex: 'collectionDate', key: 'collectionDate' },
        { title: '预计归还', dataIndex: 'expectedReturnDate', key: 'expectedReturnDate' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap: Record<string, { color: string; text: string }> = {
                    'in_use': { color: 'processing', text: '使用中' },
                    'partial_returned': { color: 'warning', text: '部分归还' },
                    'fully_returned': { color: 'success', text: '已归还' },
                    'consumed': { color: 'default', text: '已消耗' }
                };
                const s = statusMap[status] || { color: 'default', text: status };
                return <Tag color={s.color}>{s.text}</Tag>;
            }
        },
    ];

    const currentSampleRecords = collectionRecords.filter(r => r.sampleNo === selectedSample?.sampleNo);

    return (
        <Card
            title="样品明细台账"
            extra={
                <Space>
                    <Input
                        placeholder="搜索样品编号/名称/委托单号"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={handleStatusFilter}
                        options={[
                            { value: 'all', label: '全部状态' },
                            { value: '已收样', label: '已收样' },
                            { value: '部分领用', label: '部分领用' },
                            { value: '全部领用', label: '全部领用' },
                            { value: '检测中', label: '检测中' },
                            { value: '已完成', label: '已完成' },
                            { value: '已外包', label: '已外包' },
                        ]}
                    />
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => message.info('请选择样品进行内部领用')}>
                        内部领用
                    </Button>
                    <Button type="primary" icon={<SendOutlined />} style={{ background: '#fa8c16' }} onClick={() => message.info('请选择样品进行外部委外')}>
                        外部委外
                    </Button>
                    <ExportOutlined style={{ fontSize: 16, cursor: 'pointer' }} title="导出Excel" />
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 1600 }}
                pagination={{ pageSize: 10 }}
            />

            {/* 内部领用对话框 */}
            <Modal
                title="内部领用"
                open={isCollectionModalOpen}
                onOk={handleCollectionOk}
                onCancel={() => setIsCollectionModalOpen(false)}
                width={600}
            >
                {selectedSample && (
                    <>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Statistic title="样品名称" value={selectedSample.name} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="可用数量" value={`${selectedSample.remainingQuantity}${selectedSample.unit}`} valueStyle={{ color: '#3f8600' }} />
                            </Col>
                        </Row>
                        <Form form={collectionForm} layout="vertical">
                            <Form.Item name="laboratory" label="领用实验室" rules={[{ required: true, message: '请选择实验室' }]}>
                                <Select placeholder="选择实验室">
                                    {laboratories.map(lab => (
                                        <Select.Option key={lab} value={lab}>{lab}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="collectionQuantity" label="领用数量" rules={[{ required: true, message: '请输入领用数量' }]}>
                                <InputNumber min={1} max={selectedSample.remainingQuantity} style={{ width: '100%' }} addonAfter={selectedSample.unit} />
                            </Form.Item>
                            <Form.Item name="testItems" label="检测项目">
                                <Select mode="tags" placeholder="输入检测项目" />
                            </Form.Item>
                            <Form.Item name="purpose" label="用途说明" rules={[{ required: true, message: '请输入用途' }]}>
                                <Input.TextArea rows={2} />
                            </Form.Item>
                            <Form.Item name="collectionDate" label="领用日期" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="expectedReturnDate" label="预计归还日期" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>

            {/* 外部委外对话框 */}
            <Modal
                title="外部委外"
                open={isOutsourceModalOpen}
                onOk={handleOutsourceOk}
                onCancel={() => setIsOutsourceModalOpen(false)}
                width={600}
            >
                {selectedSample && (
                    <>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Statistic title="样品名称" value={selectedSample.name} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="可用数量" value={`${selectedSample.remainingQuantity}${selectedSample.unit}`} valueStyle={{ color: '#3f8600' }} />
                            </Col>
                        </Row>
                        <Form form={outsourceForm} layout="vertical">
                            <Form.Item name="supplierId" label="选择供应商" rules={[{ required: true, message: '请选择供应商' }]}>
                                <Select placeholder="选择委外供应商" showSearch optionFilterProp="children">
                                    {outsourcingSuppliers.map(supplier => (
                                        <Select.Option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="quantity" label="委外数量" rules={[{ required: true, message: '请输入委外数量' }]}>
                                <InputNumber min={1} max={selectedSample.remainingQuantity} style={{ width: '100%' }} addonAfter={selectedSample.unit} />
                            </Form.Item>
                            <Form.Item name="testItems" label="检测项目" rules={[{ required: true, message: '请选择检测项目' }]}>
                                <Select mode="tags" placeholder="输入检测项目" />
                            </Form.Item>
                            <Form.Item name="assignDate" label="分配日期" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="dueDate" label="截止日期" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="remark" label="备注">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>

            {/* 领用记录对话框 */}
            <Modal
                title={`领用记录 - ${selectedSample?.sampleNo}`}
                open={isRecordsModalOpen}
                onCancel={() => setIsRecordsModalOpen(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={collectionColumns}
                    dataSource={currentSampleRecords}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </Card>
    );
};

export default SampleDetails;
