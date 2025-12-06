import React from 'react';
import { Drawer, Descriptions, Tag, Button, Space, Table, Card, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { STATUS_MAP, CLIENT_STATUS_MAP, APPROVAL_LEVELS, type Quotation, type QuotationItem, type ApprovalRecord } from '../../mock/quotationData';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import QuotationPDF from '../../components/QuotationPDF';

interface QuotationDetailDrawerProps {
    visible: boolean;
    quotation: Quotation | null;
    onClose: () => void;
}

const QuotationDetailDrawer: React.FC<QuotationDetailDrawerProps> = ({
    visible,
    quotation,
    onClose
}) => {
    if (!quotation) return null;

    const handleDownloadPDF = async () => {
        try {
            const blob = await pdf(<QuotationPDF quotation={quotation} />).toBlob();
            saveAs(blob, `${quotation.quotationNo}_报价单.pdf`);
        } catch (error) {
            console.error('PDF生成失败:', error);
        }
    };

    const itemColumns: ColumnsType<QuotationItem> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center'
        },
        {
            title: '检测项目',
            dataIndex: 'serviceItem',
            key: 'serviceItem',
            width: 200
        },
        {
            title: '检测标准',
            dataIndex: 'methodStandard',
            key: 'methodStandard',
            width: 200
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            align: 'center'
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 100,
            align: 'right',
            render: (value) => `¥${value.toFixed(2)}`
        },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            align: 'right',
            render: (value) => `¥${value.toFixed(2)}`
        }
    ];

    const getApprovalLevelName = (level: number) => {
        const config = APPROVAL_LEVELS.find(l => l.level === level);
        return config ? config.name : '未知';
    };

    return (
        <Drawer
            title={`报价单详情 - ${quotation.quotationNo}`}
            placement="right"
            width={900}
            onClose={onClose}
            open={visible}
            extra={
                <Space>
                    {quotation.status === 'approved' && (
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadPDF}
                        >
                            下载PDF
                        </Button>
                    )}
                </Space>
            }
        >
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="报价单号">{quotation.quotationNo}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{quotation.createTime}</Descriptions.Item>
                    <Descriptions.Item label="审批状态">
                        <Tag color={STATUS_MAP[quotation.status].color}>
                            {STATUS_MAP[quotation.status].text}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="客户反馈">
                        <Tag color={CLIENT_STATUS_MAP[quotation.clientStatus].color}>
                            {CLIENT_STATUS_MAP[quotation.clientStatus].text}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人">{quotation.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{quotation.updatedAt}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 委托方信息 */}
            <Card title="委托方信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="公司名称" span={2}>{quotation.clientCompany}</Descriptions.Item>
                    <Descriptions.Item label="联系人">{quotation.clientContact}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{quotation.clientTel}</Descriptions.Item>
                    <Descriptions.Item label="邮箱" span={2}>{quotation.clientEmail}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={2}>{quotation.clientAddress}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 服务方信息 */}
            <Card title="服务方信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="公司名称" span={2}>{quotation.serviceCompany}</Descriptions.Item>
                    <Descriptions.Item label="联系人">{quotation.serviceContact}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{quotation.serviceTel}</Descriptions.Item>
                    <Descriptions.Item label="邮箱" span={2}>{quotation.serviceEmail}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={2}>{quotation.serviceAddress}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 样品和检测项目 */}
            <Card title="样品和检测项目" style={{ marginBottom: 16 }}>
                <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="样品名称">{quotation.sampleName}</Descriptions.Item>
                </Descriptions>
                <Table
                    columns={itemColumns}
                    dataSource={quotation.items}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    bordered
                />
            </Card>

            {/* 价格汇总 */}
            <Card title="价格汇总" style={{ marginBottom: 16 }}>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="报价合计">
                        <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                            ¥{quotation.subtotal.toFixed(2)}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="含税合计(6%)">
                        <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                            ¥{quotation.taxTotal.toFixed(2)}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="优惠后合计">
                        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                            ¥{quotation.discountTotal.toFixed(2)}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* 备注 */}
            {quotation.clientRemark && (
                <Card title="客户要求备注" style={{ marginBottom: 16 }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{quotation.clientRemark}</div>
                </Card>
            )}

            {/* 审批历史 */}
            {quotation.approvalHistory.length > 0 && (
                <Card title="审批历史">
                    <Timeline
                        items={quotation.approvalHistory.map((record: ApprovalRecord) => ({
                            color: record.action === 'approve' ? 'green' : 'red',
                            children: (
                                <div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Tag color={record.action === 'approve' ? 'success' : 'error'}>
                                            {getApprovalLevelName(record.level)}
                                        </Tag>
                                        <span style={{ color: '#999', fontSize: 12 }}>
                                            {record.timestamp} - {record.approver}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        {record.action === 'approve' ? '✓ 批准' : '✗ 拒绝'}
                                    </div>
                                    {record.comment && (
                                        <div style={{ color: '#666', fontSize: 12 }}>
                                            <FileTextOutlined /> 意见: {record.comment}
                                        </div>
                                    )}
                                </div>
                            )
                        }))}
                    />
                </Card>
            )}

            {/* 客户反馈详情 */}
            {quotation.clientStatus !== 'pending' && (
                <Card title="客户反馈详情" style={{ marginTop: 16 }}>
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="反馈状态">
                            <Tag color={CLIENT_STATUS_MAP[quotation.clientStatus].color}>
                                {CLIENT_STATUS_MAP[quotation.clientStatus].text}
                            </Tag>
                        </Descriptions.Item>
                        {quotation.clientFeedbackDate && (
                            <Descriptions.Item label="反馈日期">
                                {quotation.clientFeedbackDate}
                            </Descriptions.Item>
                        )}
                        {quotation.clientStatus === 'ok' && quotation.contractFileName && (
                            <Descriptions.Item label="盖章合同">
                                <a href={quotation.contractFile} target="_blank" rel="noopener noreferrer">
                                    <FileTextOutlined /> {quotation.contractFileName}
                                </a>
                            </Descriptions.Item>
                        )}
                        {quotation.clientStatus === 'ng' && quotation.ngReason && (
                            <Descriptions.Item label="拒绝原因">
                                <div style={{ color: '#ff4d4f' }}>{quotation.ngReason}</div>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
            )}
        </Drawer>
    );
};

export default QuotationDetailDrawer;
