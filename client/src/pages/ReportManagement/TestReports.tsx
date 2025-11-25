import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Modal, Descriptions, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { testReportData, type ITestReport } from '../../mock/report';

const { Option } = Select;

const TestReports: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [previewReport, setPreviewReport] = useState<ITestReport | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const filteredData = testReportData.filter(item =>
        statusFilter ? item.status === statusFilter : true
    );

    const handlePreview = (record: ITestReport) => {
        setPreviewReport(record);
        setIsPreviewOpen(true);
    };

    const handleDownload = (record: ITestReport) => {
        // 模拟下载：使用浏览器打印功能
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateReportHTML(record));
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateReportHTML = (report: ITestReport) => {
        return `
            <html>
            <head>
                <title>${report.reportNo}</title>
                <style>
                    body { font-family: SimSun, serif; margin: 40px; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td, th { border: 1px solid #000; padding: 8px; }
                    .signature { margin-top: 60px; display: flex; justify-content: space-between; }
                </style>
            </head>
            <body>
                <h1>检测报告</h1>
                <p><strong>报告编号:</strong> ${report.reportNo}</p>
                <p><strong>委托单位:</strong> ${report.clientName}</p>
                <p><strong>样品名称:</strong> ${report.sampleName} (${report.sampleNo})</p>
                <p><strong>检测标准:</strong> ${report.standardName}</p>
                <h3>检测结果</h3>
                <table>
                    <tr><th>检测参数</th><th>检测结果</th><th>单位</th><th>结论</th></tr>
                    ${report.testResults.map(r =>
            `<tr><td>${r.parameter}</td><td>${r.result}</td><td>${r.unit}</td><td>${r.conclusion}</td></tr>`
        ).join('')}
                </table>
                <div class="signature">
                    <span>检测: ${report.tester}</span>
                    <span>审核: ${report.reviewer || '______'}</span>
                    <span>批准: ${report.approver || '______'}</span>
                </div>
                <p style="margin-top: 40px;"><strong>签发日期:</strong> ${report.approvedDate || '______'}</p>
            </body>
            </html>
        `;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            '草稿': 'default',
            '待审核': 'processing',
            '已审核': 'warning',
            '已批准': 'success',
            '已发布': 'cyan'
        };
        return colorMap[status] || 'default';
    };

    const columns: ColumnsType<ITestReport> = [
        { title: '报告编号', dataIndex: 'reportNo', key: 'reportNo' },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        { title: '委托单位', dataIndex: 'clientName', key: 'clientName', width: 150 },
        { title: '样品名称', dataIndex: 'sampleName', key: 'sampleName' },
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo' },
        { title: '报告类型', dataIndex: 'reportType', key: 'reportType' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
        { title: '生成日期', dataIndex: 'generatedDate', key: 'generatedDate' },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(record)}
                    >
                        预览
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(record)}
                    >
                        下载
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="样品检测报告"
            extra={
                <Select
                    placeholder="状态筛选"
                    style={{ width: 120 }}
                    allowClear
                    onChange={setStatusFilter}
                >
                    <Option value="草稿">草稿</Option>
                    <Option value="待审核">待审核</Option>
                    <Option value="已审核">已审核</Option>
                    <Option value="已批准">已批准</Option>
                    <Option value="已发布">已发布</Option>
                </Select>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={<><FileTextOutlined /> 报告预览</>}
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewOpen(false)}>关闭</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => previewReport && handleDownload(previewReport)}>
                        下载PDF
                    </Button>
                ]}
                width={900}
            >
                {previewReport && (
                    <div style={{ padding: '20px', border: '1px solid #ddd', background: '#fff' }}>
                        <h2 style={{ textAlign: 'center' }}>检测报告</h2>
                        <Divider />
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="报告编号">{previewReport.reportNo}</Descriptions.Item>
                            <Descriptions.Item label="生成日期">{previewReport.generatedDate}</Descriptions.Item>
                            <Descriptions.Item label="委托单位">{previewReport.clientName}</Descriptions.Item>
                            <Descriptions.Item label="委托单号">{previewReport.entrustmentId}</Descriptions.Item>
                            <Descriptions.Item label="样品名称">{previewReport.sampleName}</Descriptions.Item>
                            <Descriptions.Item label="样品编号">{previewReport.sampleNo}</Descriptions.Item>
                            <Descriptions.Item label="检测标准" span={2}>{previewReport.standardName}</Descriptions.Item>
                        </Descriptions>

                        <Divider>检测结果</Divider>
                        <Table
                            dataSource={previewReport.testResults.map((r, idx) => ({ ...r, key: idx }))}
                            columns={[
                                { title: '检测参数', dataIndex: 'parameter' },
                                { title: '检测结果', dataIndex: 'result' },
                                { title: '单位', dataIndex: 'unit' },
                                {
                                    title: '结论',
                                    dataIndex: 'conclusion',
                                    render: (text) => <Tag color={text === '合格' ? 'green' : 'red'}>{text}</Tag>
                                }
                            ]}
                            pagination={false}
                            size="small"
                        />

                        <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between' }}>
                            <span>检测: {previewReport.tester}</span>
                            <span>审核: {previewReport.reviewer || '______'}</span>
                            <span>批准: {previewReport.approver || '______'}</span>
                        </div>

                        {previewReport.approvedDate && (
                            <p style={{ marginTop: 20 }}><strong>签发日期:</strong> {previewReport.approvedDate}</p>
                        )}
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default TestReports;
