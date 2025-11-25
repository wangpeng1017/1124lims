import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Descriptions, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FileTextOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import { rawRecordData, type IRawRecord } from '../../mock/report';

const RawRecords: React.FC = () => {
    const [dataSource, setDataSource] = useState(rawRecordData);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewRecord, setPreviewRecord] = useState<IRawRecord | null>(null);

    const handlePreview = (record: IRawRecord) => {
        setPreviewRecord(record);
        setIsPreviewOpen(true);
    };

    const handlePrint = (record: IRawRecord) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generateRawRecordHTML(record));
            printWindow.document.close();
            printWindow.print();
        }
    };

    const generateRawRecordHTML = (record: IRawRecord) => {
        return `
            <html>
            <head>
                <title>${record.recordNo}</title>
                <style>
                    body { font-family: SimSun, serif; margin: 40px; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td, th { border: 1px solid #000; padding: 8px; }
                </style>
            </head>
            <body>
                <h1>原始记录（委托单维度）</h1>
                <p><strong>记录编号:</strong> ${record.recordNo}</p>
                <p><strong>委托单号:</strong> ${record.entrustmentId}</p>
                <p><strong>委托单位:</strong> ${record.clientName}</p>
                <h3>样品清单</h3>
                <table>
                    <tr><th>样品编号</th><th>样品名称</th><th>检测参数</th></tr>
                    ${record.samples.map(s =>
            `<tr><td>${s.sampleNo}</td><td>${s.sampleName}</td><td>${s.parameters.join(', ')}</td></tr>`
        ).join('')}
                </table>
                <h3>检测数据汇总</h3>
                <table>
                    <tr><th>样品编号</th><th>检测参数</th><th>观测值1</th><th>观测值2</th><th>结果</th><th>单位</th></tr>
                    ${record.testDataSummary.map(d =>
            `<tr><td>${d.sampleNo}</td><td>${d.parameter}</td><td>${d.value1}</td><td>${d.value2 || '-'}</td><td>${d.result}</td><td>${d.unit}</td></tr>`
        ).join('')}
                </table>
                <p style="margin-top: 40px;"><strong>生成日期:</strong> ${record.generatedDate}</p>
            </body>
            </html>
        `;
    };

    const columns: ColumnsType<IRawRecord> = [
        { title: '记录编号', dataIndex: 'recordNo', key: 'recordNo' },
        { title: '委托单号', dataIndex: 'entrustmentId', key: 'entrustmentId' },
        { title: '委托单位', dataIndex: 'clientName', key: 'clientName' },
        {
            title: '样品数量',
            key: 'sampleCount',
            render: (_, record) => <Tag color="blue">{record.samples.length} 个</Tag>
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
                        icon={<FileTextOutlined />}
                        onClick={() => handlePreview(record)}
                    >
                        预览
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<PrinterOutlined />}
                        onClick={() => handlePrint(record)}
                    >
                        打印
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="原始记录（委托单维度）"
            extra={
                <Button type="primary" icon={<PlusOutlined />} disabled>
                    生成原始记录
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />

            <Modal
                title={<><FileTextOutlined /> 原始记录预览</>}
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewOpen(false)}>关闭</Button>,
                    <Button
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={() => previewRecord && handlePrint(previewRecord)}
                    >
                        打印
                    </Button>
                ]}
                width={900}
            >
                {previewRecord && (
                    <div style={{ padding: '20px', border: '1px solid #ddd' }}>
                        <h2 style={{ textAlign: 'center' }}>原始记录（委托单维度）</h2>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="记录编号">{previewRecord.recordNo}</Descriptions.Item>
                            <Descriptions.Item label="生成日期">{previewRecord.generatedDate}</Descriptions.Item>
                            <Descriptions.Item label="委托单号">{previewRecord.entrustmentId}</Descriptions.Item>
                            <Descriptions.Item label="委托单位">{previewRecord.clientName}</Descriptions.Item>
                        </Descriptions>

                        <h3 style={{ marginTop: 20 }}>样品清单</h3>
                        <Table
                            dataSource={previewRecord.samples.map((s, idx) => ({ ...s, key: idx }))}
                            columns={[
                                { title: '样品编号', dataIndex: 'sampleNo' },
                                { title: '样品名称', dataIndex: 'sampleName' },
                                {
                                    title: '检测参数',
                                    dataIndex: 'parameters',
                                    render: (params: string[]) => params.join(', ')
                                }
                            ]}
                            pagination={false}
                            size="small"
                        />

                        <h3 style={{ marginTop: 20 }}>检测数据汇总</h3>
                        <Table
                            dataSource={previewRecord.testDataSummary.map((d, idx) => ({ ...d, key: idx }))}
                            columns={[
                                { title: '样品编号', dataIndex: 'sampleNo' },
                                { title: '检测参数', dataIndex: 'parameter' },
                                { title: '观测值1', dataIndex: 'value1' },
                                { title: '观测值2', dataIndex: 'value2' },
                                { title: '结果', dataIndex: 'result' },
                                { title: '单位', dataIndex: 'unit' }
                            ]}
                            pagination={false}
                            size="small"
                        />
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default RawRecords;
