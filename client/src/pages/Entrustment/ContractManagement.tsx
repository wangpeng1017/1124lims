import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Modal, Form, Input, DatePicker, message, Descriptions, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, FilePdfOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { contractData, type IContract, CONTRACT_STATUS_MAP } from '../../mock/contract';
import { quotationData, type Quotation } from '../../mock/quotationData';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ContractPDF from '../../components/ContractPDF';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const ContractManagement: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<IContract[]>(contractData);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [createForm] = Form.useForm();

    // 获取可生成合同的报价单（已批准且客户已接受）
    const availableQuotations = quotationData.filter(
        q => q.status === 'approved' && q.clientStatus === 'ok' && !q.contractId
    );

    // 检查是否从报价单跳转过来
    useEffect(() => {
        const state = location.state as { fromQuotation?: Quotation };
        if (state?.fromQuotation) {
            const quotation = state.fromQuotation;
            setSelectedQuotation(quotation);
            createForm.setFieldsValue({
                quotationId: quotation.id,
                contractName: `${quotation.sampleName}检测委托合同`,
                signDate: dayjs(),
                effectiveDate: dayjs(),
                expiryDate: dayjs().add(1, 'year'),
            });
            setIsCreateModalOpen(true);
            message.info(`正在为报价单 ${quotation.quotationNo} 创建合同`);
            // 清除 location state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleCreateContract = () => {
        if (availableQuotations.length === 0) {
            message.warning('暂无可生成合同的报价单');
            return;
        }
        createForm.resetFields();
        setSelectedQuotation(null);
        setIsCreateModalOpen(true);
    };

    const handleQuotationSelect = (quotationId: string) => {
        const quotation = quotationData.find(q => q.id === quotationId);
        if (quotation) {
            setSelectedQuotation(quotation);
            // 自动填充表单
            createForm.setFieldsValue({
                contractName: `${quotation.sampleName}检测委托合同`,
                signDate: dayjs(),
                effectiveDate: dayjs(),
                expiryDate: dayjs().add(1, 'year'),
            });
        }
    };

    const handleCreateOk = () => {
        createForm.validateFields().then(values => {
            if (!selectedQuotation) {
                message.error('请选择报价单');
                return;
            }

            const newId = (Math.max(...dataSource.map(item => parseInt(item.id)), 0) + 1).toString();
            const contractNo = `HT${dayjs().format('YYYYMMDD')}${newId.padStart(3, '0')}`;

            const newContract: IContract = {
                id: newId,
                contractNo,
                contractName: values.contractName,
                quotationId: selectedQuotation.id,
                quotationNo: selectedQuotation.quotationNo,
                partyA: {
                    company: selectedQuotation.clientCompany,
                    contact: selectedQuotation.clientContact,
                    tel: selectedQuotation.clientTel,
                    email: selectedQuotation.clientEmail,
                    address: selectedQuotation.clientAddress,
                },
                partyB: {
                    company: selectedQuotation.serviceCompany,
                    contact: selectedQuotation.serviceContact,
                    tel: selectedQuotation.serviceTel,
                    email: selectedQuotation.serviceEmail,
                    address: selectedQuotation.serviceAddress,
                },
                contractAmount: selectedQuotation.discountTotal,
                sampleName: selectedQuotation.sampleName,
                testItems: selectedQuotation.items,
                terms: {
                    paymentTerms: values.paymentTerms || '按照合同约定支付',
                    deliveryTerms: values.deliveryTerms || '按照合同约定交付',
                    qualityTerms: values.qualityTerms || '按照国家标准执行',
                    confidentialityTerms: values.confidentialityTerms || '双方应保守商业秘密',
                    liabilityTerms: values.liabilityTerms || '按照合同约定承担违约责任',
                    disputeResolution: values.disputeResolution || '协商解决，协商不成提起诉讼',
                },
                signDate: values.signDate.format('YYYY-MM-DD'),
                effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
                expiryDate: values.expiryDate.format('YYYY-MM-DD'),
                status: 'draft',
                attachments: [],
                createdBy: '当前用户',
                createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };

            setDataSource([...dataSource, newContract]);
            message.success('合同创建成功');
            setIsCreateModalOpen(false);
            createForm.resetFields();
        });
    };

    const handleViewDetail = (record: IContract) => {
        setSelectedContract(record);
        setIsDetailModalOpen(true);
    };

    const handlePreviewPDF = (record: IContract) => {
        setSelectedContract(record);
        setIsPDFPreviewOpen(true);
    };

    const handleSignContract = (record: IContract) => {
        Modal.confirm({
            title: '确认签订合同',
            content: `确认签订合同 ${record.contractNo}？`,
            onOk: () => {
                setDataSource(dataSource.map(item =>
                    item.id === record.id
                        ? { ...item, status: 'signed', updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
                        : item
                ));
                message.success('合同已签订');
            },
        });
    };

    const handleExecuteContract = (record: IContract) => {
        setDataSource(dataSource.map(item =>
            item.id === record.id
                ? { ...item, status: 'executing', updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
                : item
        ));
        message.success('合同已进入执行状态');
    };

    const columns: ColumnsType<IContract> = [
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            key: 'contractNo',
            width: 150,
            render: (text, record) => <a onClick={() => handleViewDetail(record)}>{text}</a>,
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            key: 'contractName',
            width: 200,
        },
        {
            title: '关联报价单',
            dataIndex: 'quotationNo',
            key: 'quotationNo',
            width: 150,
            render: (text) => (
                <a onClick={() => navigate('/entrustment/quotation')}>{text}</a>
            ),
        },
        {
            title: '甲方',
            dataIndex: ['partyA', 'company'],
            key: 'partyA',
            width: 200,
            ellipsis: true,
        },
        {
            title: '合同金额',
            dataIndex: 'contractAmount',
            key: 'contractAmount',
            width: 120,
            render: (amount) => `¥${amount.toFixed(2)}`,
        },
        {
            title: '签订日期',
            dataIndex: 'signDate',
            key: 'signDate',
            width: 120,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const statusInfo = CONTRACT_STATUS_MAP[status as IContract['status']];
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 200,
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
                    <Button
                        type="link"
                        size="small"
                        icon={<FilePdfOutlined />}
                        onClick={() => handlePreviewPDF(record)}
                    >
                        预览
                    </Button>
                    {record.status === 'draft' && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleSignContract(record)}
                        >
                            签订
                        </Button>
                    )}
                    {record.status === 'signed' && (
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleExecuteContract(record)}
                        >
                            执行
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="委托合同管理"
            bordered={false}
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateContract}
                >
                    生成合同
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1400 }}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `共 ${total} 条合同`,
                }}
            />

            {/* 创建合同对话框 */}
            <Modal
                title="生成委托合同"
                open={isCreateModalOpen}
                onOk={handleCreateOk}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    createForm.resetFields();
                }}
                width={800}
                okText="生成"
                cancelText="取消"
            >
                <Form form={createForm} layout="vertical">
                    <Form.Item
                        name="quotationId"
                        label="选择报价单"
                        rules={[{ required: true, message: '请选择报价单' }]}
                    >
                        <select
                            className="ant-input"
                            onChange={(e) => handleQuotationSelect(e.target.value)}
                            style={{ width: '100%', height: 32 }}
                        >
                            <option value="">请选择报价单</option>
                            {availableQuotations.map(q => (
                                <option key={q.id} value={q.id}>
                                    {q.quotationNo} - {q.clientCompany} - {q.sampleName} - ¥{q.discountTotal}
                                </option>
                            ))}
                        </select>
                    </Form.Item>

                    {selectedQuotation && (
                        <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                            <Descriptions column={2} size="small">
                                <Descriptions.Item label="客户">{selectedQuotation.clientCompany}</Descriptions.Item>
                                <Descriptions.Item label="样品">{selectedQuotation.sampleName}</Descriptions.Item>
                                <Descriptions.Item label="金额">¥{selectedQuotation.discountTotal}</Descriptions.Item>
                                <Descriptions.Item label="联系人">{selectedQuotation.clientContact}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    )}

                    <Form.Item
                        name="contractName"
                        label="合同名称"
                        rules={[{ required: true, message: '请输入合同名称' }]}
                    >
                        <Input placeholder="请输入合同名称" />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            name="signDate"
                            label="签订日期"
                            rules={[{ required: true, message: '请选择签订日期' }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="effectiveDate"
                            label="生效日期"
                            rules={[{ required: true, message: '请选择生效日期' }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="expiryDate"
                            label="到期日期"
                            rules={[{ required: true, message: '请选择到期日期' }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Space>

                    <Divider>合同条款（可选）</Divider>

                    <Form.Item name="paymentTerms" label="付款条款">
                        <Input.TextArea rows={2} placeholder="留空使用默认条款" />
                    </Form.Item>

                    <Form.Item name="deliveryTerms" label="交付条款">
                        <Input.TextArea rows={2} placeholder="留空使用默认条款" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 合同详情对话框 */}
            <Modal
                title="合同详情"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                width={900}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
                        关闭
                    </Button>,
                    selectedContract && (
                        <PDFDownloadLink
                            key="download"
                            document={<ContractPDF contract={selectedContract} />}
                            fileName={`${selectedContract.contractNo}.pdf`}
                        >
                            {({ loading }) => (
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    loading={loading}
                                >
                                    下载PDF
                                </Button>
                            )}
                        </PDFDownloadLink>
                    ),
                ]}
            >
                {selectedContract && (
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="合同编号" span={2}>{selectedContract.contractNo}</Descriptions.Item>
                        <Descriptions.Item label="合同名称" span={2}>{selectedContract.contractName}</Descriptions.Item>
                        <Descriptions.Item label="关联报价单">
                            <a onClick={() => navigate('/entrustment/quotation')}>{selectedContract.quotationNo}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="合同金额">¥{selectedContract.contractAmount.toFixed(2)}</Descriptions.Item>
                        <Descriptions.Item label="甲方" span={2}>{selectedContract.partyA.company}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{selectedContract.partyA.contact}</Descriptions.Item>
                        <Descriptions.Item label="联系电话">{selectedContract.partyA.tel}</Descriptions.Item>
                        <Descriptions.Item label="乙方" span={2}>{selectedContract.partyB.company}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{selectedContract.partyB.contact}</Descriptions.Item>
                        <Descriptions.Item label="联系电话">{selectedContract.partyB.tel}</Descriptions.Item>
                        <Descriptions.Item label="签订日期">{selectedContract.signDate}</Descriptions.Item>
                        <Descriptions.Item label="生效日期">{selectedContract.effectiveDate}</Descriptions.Item>
                        <Descriptions.Item label="到期日期">{selectedContract.expiryDate}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={CONTRACT_STATUS_MAP[selectedContract.status].color}>
                                {CONTRACT_STATUS_MAP[selectedContract.status].text}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            {/* PDF预览对话框 */}
            <Modal
                title="合同预览"
                open={isPDFPreviewOpen}
                onCancel={() => setIsPDFPreviewOpen(false)}
                width={900}
                footer={null}
                style={{ top: 20 }}
            >
                {selectedContract && (
                    <div style={{ height: '70vh' }}>
                        <PDFViewer width="100%" height="100%">
                            <ContractPDF contract={selectedContract} />
                        </PDFViewer>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default ContractManagement;
