import React, { useState, useRef } from 'react';
import { Table, Card, Button, Space, Modal, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BarcodeOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { sampleDetailData, type ISampleDetail } from '../../mock/sample';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';

const SampleLabels: React.FC = () => {
    const [dataSource] = useState<ISampleDetail[]>(sampleDetailData);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [currentLabelRecord, setCurrentLabelRecord] = useState<ISampleDetail | null>(null);
    const [selectedRows, setSelectedRows] = useState<ISampleDetail[]>([]);
    const labelRef = useRef<HTMLDivElement>(null);

    const handleGenerateLabel = (record: ISampleDetail) => {
        setCurrentLabelRecord(record);
        setIsLabelModalOpen(true);
    };

    const handleBatchGenerate = () => {
        if (selectedRows.length === 0) {
            message.warning('请先选择样品');
            return;
        }
        message.info(`批量生成 ${selectedRows.length} 个标签`);
        // 实际应用中可逐个生成或合并到一个PDF
    };

    const handleDownloadLabel = async () => {
        if (labelRef.current) {
            try {
                const canvas = await html2canvas(labelRef.current);
                const link = document.createElement('a');
                link.download = `Label_${currentLabelRecord?.sampleNo}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                message.success('标签下载成功');
            } catch (error) {
                message.error('标签生成失败');
                console.error(error);
            }
        }
    };

    const rowSelection = {
        onChange: (_: React.Key[], selectedRows: ISampleDetail[]) => {
            setSelectedRows(selectedRows);
        },
    };

    const columns: ColumnsType<ISampleDetail> = [
        { title: '样品编号', dataIndex: 'sampleNo', key: 'sampleNo' },
        { title: '样品名称', dataIndex: 'name', key: 'name' },
        { title: '规格型号', dataIndex: 'spec', key: 'spec' },
        { title: '数量', dataIndex: 'quantity', key: 'quantity' },
        {
            title: '标签状态',
            key: 'labelStatus',
            render: () => <Tag color="green">可生成</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleGenerateLabel(record)}><BarcodeOutlined /> 生成标签</a>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="样品标签管理"
            extra={
                <Space>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={handleBatchGenerate}
                        disabled={selectedRows.length === 0}
                    >
                        批量生成 ({selectedRows.length})
                    </Button>
                </Space>
            }
        >
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />

            <Modal
                title="样品标签生成"
                open={isLabelModalOpen}
                onCancel={() => setIsLabelModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsLabelModalOpen(false)}>关闭</Button>,
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadLabel}>下载标签</Button>
                ]}
                width={400}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        background: '#fff',
                        border: '1px solid #f0f0f0'
                    }}
                >
                    <div ref={labelRef} style={{ padding: '20px', background: 'white', textAlign: 'center' }}>
                        {currentLabelRecord && (
                            <>
                                <Barcode value={currentLabelRecord.sampleNo} width={2} height={60} fontSize={14} />
                                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
                                    <div>样品编号: {currentLabelRecord.sampleNo}</div>
                                    <div>样品名称: {currentLabelRecord.name}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default SampleLabels;
