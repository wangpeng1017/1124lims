import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Descriptions, Divider, List } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { projectReportData, testReportData, type IProjectReport } from '../../mock/report';

const ProjectReports: React.FC = () => {
    const [previewReport, setPreviewReport] = useState<IProjectReport | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (record: IProjectReport) => {
        setPreviewReport(record);
        setIsPreviewOpen(true);
    };

    const handleDownload = (record: IProjectReport) => {
        // 模拟下载PDF
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateReportHTML(record));
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateReportHTML = (report: IProjectReport) => {
        const taskReports = testReportData.filter(t => report.taskReportNos.includes(t.reportNo));

        return `
            <html>
            <head>
                <title>${report.coverInfo.reportTitle}</title>
                <style>
                    body { font-family: SimSun, serif; margin: 40px; }
                    .cover-page { page-break-after: always; text-align: center; padding-top: 100px; }
                    .cover-page h1 { font-size: 36px; margin: 60px 0; }
                    .cover-info { text-align: left; margin: 40px auto; width: 500px; line-height: 2; }
                    .summary-page { page-break-after: always; }
                    h2 { text-align: center; margin: 40px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td, th { border: 1px solid #000; padding: 8px; }
                    .signature { margin-top: 60px; display: flex; justify-content: space-between; }
                    .task-section { page-break-before: always; }
                </style>
            </head>
            <body>
                <!-- 封面 -->
                <div class="cover-page">
                    <h1>${report.coverInfo.reportTitle}</h1>
                    <div class="cover-info">
                        <p><strong>委托单位：</strong>${report.coverInfo.clientName}</p>
                        <p><strong>报告编号：</strong>${report.coverInfo.reportNo}</p>
                        <p><strong>检测日期：</strong>${report.coverInfo.testDate}</p>
                        <p><strong>签发日期：</strong>${report.coverInfo.issueDate}</p>
                    </div>
                </div>

                <!-- 总结页 -->
                <div class="summary-page">
                    <h2>检测报告总结</h2>
                    <h3>项目信息</h3>
                    <p><strong>项目名称：</strong>${report.summaryInfo.projectName}</p>
                    <p><strong>样品信息：</strong>${report.summaryInfo.sampleInfo}</p>
                    <p><strong>检测标准：</strong>${report.summaryInfo.testStandard}</p>
                    
                    <h3>综合检测结果</h3>
                    <table>
                        <tr><th>任务编号</th><th>检测参数</th><th>检测结果</th><th>单位</th><th>结论</th></tr>
                        ${report.mergedTestResults.map(r =>
            `<tr>
                                <td>${r.taskNo}</td>
                                <td>${r.parameter}</td>
                                <td>${r.result}</td>
                                <td>${r.unit}</td>
                                <td>${r.conclusion}</td>
                            </tr>`
        ).join('')}
                    </table>
                    
                    <h3>综合判定结论</h3>
                    <p>${report.summaryInfo.conclusion}</p>
                    ${report.summaryInfo.remarks ? `<p><strong>备注：</strong>${report.summaryInfo.remarks}</p>` : ''}
                </div>

                <!-- 各任务详细报告 -->
                ${taskReports.map(task => `
                    <div class="task-section">
                        <h2>任务详细报告 - ${task.taskNo}</h2>
                        <h3>基本信息</h3>
                        <p><strong>任务编号：</strong>${task.taskNo}</p>
                        <p><strong>报告编号：</strong>${task.reportNo}</p>
                        <p><strong>样品编号：</strong>${task.sampleNo}</p>
                        <p><strong>样品名称：</strong>${task.sampleName}</p>
                        <p><strong>检测标准：</strong>${task.standardName}</p>
                        
                        <h3>检测结果</h3>
                        <table>
                            <tr><th>检测参数</th><th>检测结果</th><th>单位</th><th>结论</th></tr>
                            ${task.testResults.map(r =>
            `<tr>
                                    <td>${r.parameter}</td>
                                    <td>${r.result}</td>
                                    <td>${r.unit}</td>
                                    <td>${r.conclusion}</td>
                                </tr>`
        ).join('')}
                        </table>
                        
                        <div class="signature">
                            <span>检测: ${task.tester}</span>
                            <span>审核: ${task.reviewer || '______'}</span>
                            <span>批准: ${task.approver || '______'}</span>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'draft': 'default',
            'pending': 'processing',
            'approved': 'success',
            'issued': 'cyan'
        };
        return colorMap[status] || 'default';
    };

    const getStatusText = (status: string) => {
        const textMap: Record<string, string> = {
            'draft': '草稿',
            'pending': '待审批',
            'approved': '已批准',
            'issued': '已发布'
        };
        return textMap[status] || status;
    };

    const columns: ColumnsType<IProjectReport> = [
        {
            title: '项目报告编号',
            dataIndex: 'projectReportNo',
            key: 'projectReportNo',
            width: 180,
            render: (text) => <a>{text}</a>
        },
        {
            title: '委托单号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            width: 150
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 200
        },
        {
            title: '委托单位',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 200
        },
        {
            title: '包含任务',
            dataIndex: 'taskReportNos',
            key: 'taskReportNos',
            width: 120,
            render: (nos: string[]) => (
                <Tag color="blue">{nos.length} 个任务</Tag>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            )
        },
        {
            title: '生成日期',
            dataIndex: 'generatedDate',
            key: 'generatedDate',
            width: 120
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
        <Card title={<><FileTextOutlined /> 项目检测报告</>}>
            <Table
                columns={columns}
                dataSource={projectReportData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={<><FileTextOutlined /> 项目报告预览</>}
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewOpen(false)}>关闭</Button>,
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => previewReport && handleDownload(previewReport)}
                    >
                        下载PDF
                    </Button>
                ]}
                width={1000}
            >
                {previewReport && (
                    <div style={{ padding: '20px' }}>
                        {/* 封面信息 */}
                        <div style={{ textAlign: 'center', padding: '40px 0', borderBottom: '2px solid #1890ff' }}>
                            <h2 style={{ fontSize: '28px', margin: '20px 0' }}>
                                {previewReport.coverInfo.reportTitle}
                            </h2>
                            <Descriptions bordered column={1} style={{ marginTop: 40, textAlign: 'left' }}>
                                <Descriptions.Item label="委托单位">{previewReport.coverInfo.clientName}</Descriptions.Item>
                                <Descriptions.Item label="报告编号">{previewReport.coverInfo.reportNo}</Descriptions.Item>
                                <Descriptions.Item label="检测日期">{previewReport.coverInfo.testDate}</Descriptions.Item>
                                <Descriptions.Item label="签发日期">{previewReport.coverInfo.issueDate}</Descriptions.Item>
                            </Descriptions>
                        </div>

                        <Divider>检测报告总结</Divider>

                        {/* 总结信息 */}
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="项目名称">{previewReport.summaryInfo.projectName}</Descriptions.Item>
                            <Descriptions.Item label="样品信息">{previewReport.summaryInfo.sampleInfo}</Descriptions.Item>
                            <Descriptions.Item label="检测标准">{previewReport.summaryInfo.testStandard}</Descriptions.Item>
                        </Descriptions>

                        <Divider>综合检测结果</Divider>
                        <Table
                            dataSource={previewReport.mergedTestResults.map((r, idx) => ({ ...r, key: idx }))}
                            columns={[
                                { title: '任务编号', dataIndex: 'taskNo', width: 120 },
                                { title: '检测参数', dataIndex: 'parameter' },
                                { title: '检测结果', dataIndex: 'result' },
                                { title: '单位', dataIndex: 'unit', width: 80 },
                                {
                                    title: '结论',
                                    dataIndex: 'conclusion',
                                    width: 100,
                                    render: (text) => <Tag color={text === '合格' || text === '符合要求' ? 'green' : 'red'}>{text}</Tag>
                                }
                            ]}
                            pagination={false}
                            size="small"
                        />

                        <div style={{ margin: '20px 0', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                            <h4>综合判定结论</h4>
                            <p>{previewReport.summaryInfo.conclusion}</p>
                            {previewReport.summaryInfo.remarks && (
                                <p style={{ marginTop: 10, color: '#666' }}>
                                    <strong>备注：</strong>{previewReport.summaryInfo.remarks}
                                </p>
                            )}
                        </div>

                        <Divider>包含的任务报告</Divider>
                        <List
                            dataSource={previewReport.taskReportNos}
                            renderItem={(reportNo) => {
                                const task = testReportData.find(t => t.reportNo === reportNo);
                                return task ? (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={`${task.taskNo} - ${task.reportNo}`}
                                            description={`检测参数: ${task.testParameters.join(', ')} | 检测人: ${task.tester}`}
                                        />
                                    </List.Item>
                                ) : null;
                            }}
                        />
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default ProjectReports;
