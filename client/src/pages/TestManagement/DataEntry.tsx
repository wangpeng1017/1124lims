import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Row, Col, message, Modal, Alert } from 'antd';
import { SaveOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { deviceData } from '../../mock/devices';
import { environmentData } from '../../mock/environment';
import { testTemplatesData, type TestTemplate } from '../../mock/testTemplates';
import DynamicFormRenderer from '../../components/DynamicFormRenderer';

const DataEntry: React.FC = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const [selectedTask, setSelectedTask] = useState<ITestTask | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState<TestTemplate | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

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

    const handleEnvironmentChange = (envId: number) => {
        const env = environmentData.find(e => e.id === envId);
        if (env) {
            form.setFieldsValue({
                envTemperature: env.temperature,
                envHumidity: env.humidity
            });
            message.success(`已加载 ${env.room} 环境数据`);
        }
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

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="envId" label="环境数据来源">
                            <Select placeholder="从环境监控系统加载" onChange={handleEnvironmentChange}>
                                {environmentData.map(e => (
                                    <Select.Option key={e.id} value={e.id}>{e.room}</Select.Option>
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

                <Row justify="center">
                    <Col>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large" style={{ marginRight: 16 }}>
                            保存数据
                        </Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleGenerateReport} size="large" style={{ marginRight: 16 }}>
                            生成原始记录单
                        </Button>
                        <Button icon={<PrinterOutlined />} size="large">
                            打印条码
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
