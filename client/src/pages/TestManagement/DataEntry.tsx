import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Row, Col, message, Modal, Alert, Upload } from 'antd';
import { SaveOutlined, FilePdfOutlined, PrinterOutlined, UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { deviceData } from '../../mock/devices';
import { testTemplatesData, type TestTemplate } from '../../mock/testTemplates';
import DynamicFormRenderer from '../../components/DynamicFormRenderer';

const DataEntry: React.FC = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const [selectedTask, setSelectedTask] = useState<ITestTask | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState<TestTemplate | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    // 获取进行中的任务
    const activeTasks = testTaskData.filter(t => t.status === '进行中');

    useEffect(() => {
        if (location.state?.taskNo) {
            const task = activeTasks.find(t => t.taskNo === location.state.taskNo);
            if (task) {
                setSelectedTask(task);
                form.setFieldsValue({ taskNo: task.taskNo });
            }
        }
    }, [location.state]);

    const handleTaskChange = (taskNo: string) => {
        const task = activeTasks.find(t => t.taskNo === taskNo);
        setSelectedTask(task || null);
        setCurrentTemplate(null);
        form.resetFields(['templateId', 'dataRows', 'envTemperature', 'envHumidity', 'testDate', 'remarks']);
    };

    const handleTemplateChange = (templateId: number) => {
        const template = testTemplatesData.find(t => t.id === templateId);
        setCurrentTemplate(template || null);
        // 重置表单数据，保留任务信息
        const taskNo = form.getFieldValue('taskNo');
        form.resetFields();
        form.setFieldsValue({ taskNo, templateId });
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            console.log('Saved Data:', values);
            message.success('数据保存成功');
            // 实际项目中应调用API保存数据
        });
    };

    const handleGenerateReport = () => {
        form.validateFields().then(values => {
            const data = {
                ...values,
                task: selectedTask,
                template: currentTemplate,
                device: deviceData.find(d => d.id === values.deviceId),
                date: new Date().toLocaleDateString(),
            };
            setReportData(data);
            setIsReportModalOpen(true);
        });
    };

    return (
        <Card
            title="试验数据录入"
            bordered={false}
            extra={<span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>数据录入工作台 - 快速录入试验数据</span>}
        >
            <Form form={form} layout="vertical" initialValues={{ envTemperature: 23.5, envHumidity: 45 }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="taskNo" label="选择任务" rules={[{ required: true }]}>
                            <Select
                                placeholder="选择进行中的任务"
                                onChange={handleTaskChange}
                                showSearch
                                optionFilterProp="label"
                                options={activeTasks.map(t => ({ label: `${t.taskNo} - ${t.sampleName}`, value: t.taskNo }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="templateId" label="选择检测模版" rules={[{ required: true }]}>
                            <Select
                                placeholder="选择检测模版"
                                onChange={handleTemplateChange}
                                showSearch
                                optionFilterProp="label"
                                options={testTemplatesData.map(t => ({ label: t.name, value: t.id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="deviceId" label="关联设备">
                            <Select placeholder="选择检测设备">
                                {deviceData.map(d => (
                                    <Select.Option key={d.id} value={d.id}>{d.name} ({d.code})</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {currentTemplate ? (
                    <div style={{ border: '1px solid #f0f0f0', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
                        <DynamicFormRenderer template={currentTemplate} />
                    </div>
                ) : (
                    <Alert message="请选择检测模版以加载录入表单" type="info" showIcon style={{ marginBottom: 24 }} />
                )}

                {/* 上传附件 - 位于底部，备注上方 */}
                <Form.Item
                    label="上传附件"
                    name="attachments"
                    tooltip="可上传与检测相关的附件文件，如图片、PDF、Word、Excel等"
                    style={{ marginBottom: 24 }}
                >
                    <Upload
                        fileList={fileList}
                        beforeUpload={(file) => {
                            const isValidType = [
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'application/vnd.ms-excel',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'image/jpeg',
                                'image/png',
                                'image/gif',
                                'text/plain'
                            ].includes(file.type);

                            if (!isValidType) {
                                message.error('只支持 PDF、Word、Excel、图片和文本文件!');
                                return Upload.LIST_IGNORE;
                            }

                            const isLt20M = file.size / 1024 / 1024 < 20;
                            if (!isLt20M) {
                                message.error('文件大小不能超过 20MB!');
                                return Upload.LIST_IGNORE;
                            }

                            setFileList([...fileList, file]);
                            return false; // 阻止自动上传
                        }}
                        onRemove={(file) => {
                            const index = fileList.indexOf(file);
                            const newFileList = fileList.slice();
                            newFileList.splice(index, 1);
                            setFileList(newFileList);
                        }}
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                    <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                        <PaperClipOutlined /> 支持 PDF、Word、Excel、图片、文本文件，单个文件不超过 20MB，可上传多个文件
                    </div>
                </Form.Item>

                <Row justify="center">
                    <Col>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large" style={{ marginRight: 16 }}>
                            保存数据
                        </Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleGenerateReport} size="large" style={{ marginRight: 16 }}>
                            生成原始记录单
                        </Button>

                    </Col>
                </Row>
            </Form>

            <Modal
                title="原始记录单预览"
                open={isReportModalOpen}
                onCancel={() => setIsReportModalOpen(false)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setIsReportModalOpen(false)}>关闭</Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />}>打印</Button>
                ]}
            >
                {reportData && (
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ textAlign: 'center' }}>{reportData.template?.schema.title}</h3>
                        <p><strong>任务编号:</strong> {reportData.task?.taskNo}</p>
                        <p><strong>样品名称:</strong> {reportData.task?.sampleName}</p>
                        <p><strong>检测设备:</strong> {reportData.device?.name}</p>
                        <p><strong>检测日期:</strong> {reportData.date}</p>
                        <div style={{ marginTop: 20, border: '1px solid #eee', padding: 10 }}>
                            <p style={{ color: '#999', textAlign: 'center' }}>[此处显示详细检测数据]</p>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default DataEntry;
