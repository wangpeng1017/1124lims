import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Descriptions, Divider, List, Form, Input, Select, DatePicker, message, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, DownloadOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { clientReportData, testReportData } from '../../mock/report';
import type { IClientReport } from '../../mock/report';
import dayjs from 'dayjs';

const ClientReports: React.FC = () => {
    const [dataSource, setDataSource] = useState<IClientReport[]>(clientReportData);
    const [previewReport, setPreviewReport] = useState<IClientReport | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm();

    const handlePreview = (record: IClientReport) => {
        setPreviewReport(record);
        setIsPreviewOpen(true);
    };

    const handleDownload = (record: IClientReport) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateReportHTML(record));
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateReportHTML = (report: IClientReport) => {
        const taskReports = testReportData.filter(t => report.taskReportNos.includes(t.reportNo));

        return `
            <html>
            <head>
                <title>${report.projectName} - 检测报告</title>
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
                    <h1>检测报告</h1>
                    <div class="cover-info">
                        <p><strong>委托单位：</strong>${report.clientName}</p>
                        <p><strong>报告编号：</strong>${report.reportNo}</p>
                        <p><strong>检测日期：</strong>${report.testDateRange.start} 至 ${report.testDateRange.end}</p>
                        <p><strong>签发日期：</strong>${report.issuedDate || '-'}</p>
                    </div>
                </div>

                <!-- 总结页 -->
                <div class="summary-page">
                    <h2>检测报告详情</h2>
                    <h3>基本信息</h3>
                    <p><strong>项目名称：</strong>${report.projectName}</p>
                    <p><strong>样品名称：</strong>${report.sampleName}</p>
                    <p><strong>样品编号：</strong>${report.sampleNo}</p>
                    <p><strong>检测标准：</strong>${report.testStandards.join(', ')}</p>
                    
                    <h3>综合判定结论</h3>
                    <p>${report.overallConclusion || '暂无结论'}</p>
                    ${report.remarks ? `<p><strong>备注：</strong>${report.remarks}</p>` : ''}
                    
                    <div class="signature">
                        <span>编制: ${report.preparer}</span>
                        <span>审核: ${report.reviewer || '______'}</span>
                        <span>批准: ${report.approver || '______'}</span>
                    </div>
                </div>

                <!-- 各任务详细报告 -->
                ${taskReports.map(task => `
                    <div class="task-section">
                        <h2>任务详细报告 - ${task.taskNo}</h2>
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
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            '草稿': 'default',
            '待审核': 'processing',
            '待批准': 'warning',
            '已批准': 'success',
            '已发布': 'cyan'
        };
        return colorMap[status] || 'default';
    };

    const handleCreate = () => {
        createForm.resetFields();

        // Auto-generate report number
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const reportNo = `ALTC-TC-${year}${month}-${random}`;

        createForm.setFieldsValue({
            reportNo: reportNo,
            generatedDate: dayjs()
        });

        setIsCreateModalOpen(true);
    };

    const handleTaskSelectionChange = (taskReportNos: string[]) => {
        const selected = testReportData.filter(t => taskReportNos.includes(t.reportNo));

        if (selected.length > 0) {
            const first = selected[0];
            // Combine test items and standards
            const allItems = Array.from(new Set(selected.flatMap(t => t.testParameters)));
            const allStandards = Array.from(new Set(selected.map(t => t.standardName)));

            createForm.setFieldsValue({
                entrustmentId: first.entrustmentId,
                projectId: first.projectId,
                projectName: first.projectName,
                clientName: first.clientName,
                sampleName: first.sampleName,
                sampleNo: first.sampleNo,
                testItems: allItems,
                testStandards: allStandards,
                testDateStart: dayjs(),
                testDateEnd: dayjs(),
            });
        }
    };

    const handleCreateSubmit = () => {
        createForm.validateFields().then(values => {
            const newReport: IClientReport = {
                id: Math.max(...dataSource.map(r => r.id), 0) + 1,
                reportNo: values.reportNo,
                entrustmentId: values.entrustmentId,
                projectId: values.projectId,
                projectName: values.projectName,
                clientName: values.clientName,
                clientAddress: values.clientAddress,
                sampleName: values.sampleName,
                sampleNo: values.sampleNo,
                specification: values.specification,
                sampleQuantity: values.sampleQuantity,
                sampleStatus: values.sampleStatus,
                receivedDate: values.receivedDate ? values.receivedDate.format('YYYY-MM-DD') : undefined,
                testCategory: values.testCategory,
                taskReportNos: values.taskReportNos,
                testItems: values.testItems || [],
                testStandards: values.testStandards || [],
                testDateRange: {
                    start: values.testDateStart ? values.testDateStart.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    end: values.testDateEnd ? values.testDateEnd.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                },
                overallConclusion: values.overallConclusion,
                remarks: values.remarks,
                preparer: '当前用户',
                status: '草稿',
                generatedDate: values.generatedDate.format('YYYY-MM-DD'),
                templateId: 1
            };

            setDataSource([newReport, ...dataSource]);
            setIsCreateModalOpen(false);
            message.success('客户报告已生成');
        });
    };

    const columns: ColumnsType<IClientReport> = [
        {
            title: '报告编号',
            dataIndex: 'reportNo',
            key: 'reportNo',
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
                <Tag color={getStatusColor(status)}>{status}</Tag>
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
        <Card
            title={<><FileTextOutlined /> 客户检测报告</>}
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    生成客户报告
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={<><FileTextOutlined /> 客户报告预览</>}
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
                        <div style={{ textAlign: 'center', padding: '40px 0', borderBottom: '2px solid #1890ff' }}>
                            <h2 style={{ fontSize: '28px', margin: '20px 0' }}>
                                检测报告
                            </h2>
                            <Descriptions bordered column={1} style={{ marginTop: 40, textAlign: 'left' }}>
                                <Descriptions.Item label="委托单位">{previewReport.clientName}</Descriptions.Item>
                                <Descriptions.Item label="报告编号">{previewReport.reportNo}</Descriptions.Item>
                                <Descriptions.Item label="检测日期">{previewReport.testDateRange.start} 至 {previewReport.testDateRange.end}</Descriptions.Item>
                                <Descriptions.Item label="签发日期">{previewReport.issuedDate || '-'}</Descriptions.Item>
                            </Descriptions>
                        </div>

                        <Divider>报告详情</Divider>

                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="项目名称">{previewReport.projectName}</Descriptions.Item>
                            <Descriptions.Item label="样品名称">{previewReport.sampleName}</Descriptions.Item>
                            <Descriptions.Item label="样品编号">{previewReport.sampleNo}</Descriptions.Item>
                            <Descriptions.Item label="检测标准">{previewReport.testStandards.join(', ')}</Descriptions.Item>
                        </Descriptions>

                        <div style={{ margin: '20px 0', padding: '16px', background: '#f0f2f5', borderRadius: '4px' }}>
                            <h4>综合判定结论</h4>
                            <p>{previewReport.overallConclusion || '暂无结论'}</p>
                            {previewReport.remarks && (
                                <p style={{ marginTop: 10, color: '#666' }}>
                                    <strong>备注：</strong>{previewReport.remarks}
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

            <Modal
                title="生成客户报告"
                open={isCreateModalOpen}
                onOk={handleCreateSubmit}
                onCancel={() => setIsCreateModalOpen(false)}
                width={800}
            >
                <Form form={createForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="报告编号" name="reportNo" rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="生成日期" name="generatedDate" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="选择任务报告" name="taskReportNos" rules={[{ required: true, message: '请至少选择一个任务报告' }]}>
                        <Select
                            mode="multiple"
                            placeholder="请选择要合并的任务报告"
                            onChange={handleTaskSelectionChange}
                        >
                            {testReportData.filter(t => t.status === '已批准').map(t => (
                                <Select.Option key={t.reportNo} value={t.reportNo}>
                                    {t.reportNo} - {t.projectName} ({t.testParameters.join(',')})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="委托单号" name="entrustmentId">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="项目名称" name="projectName">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="委托单位" name="clientName">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="单位地址" name="clientAddress">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="样品名称" name="sampleName">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="样品编号" name="sampleNo">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="规格型号" name="specification">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="检测项目" name="testItems">
                        <Select mode="tags" />
                    </Form.Item>

                    <Form.Item label="检测标准" name="testStandards">
                        <Select mode="tags" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="检测开始日期" name="testDateStart">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="检测结束日期" name="testDateEnd">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="综合判定结论" name="overallConclusion">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="备注" name="remarks">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ClientReports;
