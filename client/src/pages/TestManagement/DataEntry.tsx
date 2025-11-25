import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Input, InputNumber, Button, Row, Col, Divider, message, Modal, Descriptions, Space } from 'antd';
import { SaveOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { testTaskData, type ITestTask } from '../../mock/test';
import { deviceData } from '../../mock/devices';
import { environmentData } from '../../mock/environment';

const DataEntry: React.FC = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const [selectedTask, setSelectedTask] = useState<ITestTask | null>(null);
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
        form.resetFields(['parameterName', 'value1', 'value2', 'result', 'unit', 'conclusion']);
    };

    const handleEnvironmentChange = (envId: number) => {
        const env = environmentData.find(e => e.id === envId);
        if (env) {
            form.setFieldsValue({
                temperature: env.temperature,
                humidity: env.humidity
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
                device: deviceData.find(d => d.id === values.deviceId),
                date: new Date().toLocaleDateString(),
            };
            setReportData(data);
            setIsReportModalOpen(true);
        });
    };

    return (
        <Card title="试验数据录入" bordered={false}>
            <Form form={form} layout="vertical" initialValues={{ temperature: 23.5, humidity: 45 }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="taskNo" label="选择任务" rules={[{ required: true }]}>
                            <Select
                                placeholder="选择进行中的任务"
                                onChange={handleTaskChange}
                                showSearch
                            >
                                {activeTasks.map(t => (
                                    <Select.Option key={t.taskNo} value={t.taskNo}>
                                        {t.taskNo} - {t.sampleName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="parameterName" label="检测参数" rules={[{ required: true }]}>
                            <Select placeholder="选择参数" disabled={!selectedTask}>
                                {selectedTask?.parameters.map(p => (
                                    <Select.Option key={p} value={p}>{p}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="deviceId" label="使用设备" rules={[{ required: true }]}>
                            <Select placeholder="选择设备" showSearch optionFilterProp="children">
                                {deviceData.map(d => (
                                    <Select.Option key={d.id} value={d.id}>
                                        {d.name} ({d.code})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider>环境条件</Divider>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="快速选择环境记录">
                            <Select placeholder="选择实验室环境记录" onChange={handleEnvironmentChange}>
                                {environmentData.map(e => (
                                    <Select.Option key={e.id} value={e.id}>
                                        {e.location} - {e.room}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="temperature" label="温度 (°C)">
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="humidity" label="湿度 (%)">
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider>测试数据</Divider>
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item name="value1" label="观测值 1" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="value2" label="观测值 2">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="result" label="计算结果" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item name="conclusion" label="判定结论" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="合格">合格</Select.Option>
                                <Select.Option value="不合格">不合格</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />
                <Space>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                        保存记录
                    </Button>
                    <Button icon={<FilePdfOutlined />} onClick={handleGenerateReport}>
                        生成报告预览
                    </Button>
                </Space>
            </Form>

            <Modal
                title="检测报告预览"
                open={isReportModalOpen}
                onCancel={() => setIsReportModalOpen(false)}
                width={800}
                footer={[
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
                        打印
                    </Button>,
                    <Button key="close" onClick={() => setIsReportModalOpen(false)}>
                        关闭
                    </Button>
                ]}
            >
                {reportData && (
                    <div style={{ padding: '20px', border: '1px solid #ddd' }} id="report-content">
                        <h2 style={{ textAlign: 'center' }}>检测报告</h2>
                        <Divider />
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="报告编号">RPT{new Date().getTime()}</Descriptions.Item>
                            <Descriptions.Item label="检测日期">{reportData.date}</Descriptions.Item>
                            <Descriptions.Item label="委托单号">{reportData.task.entrustmentId}</Descriptions.Item>
                            <Descriptions.Item label="样品名称">{reportData.task.sampleName}</Descriptions.Item>
                            <Descriptions.Item label="检测项目">{reportData.parameterName}</Descriptions.Item>
                            <Descriptions.Item label="检测设备">{reportData.device?.name} ({reportData.device?.model})</Descriptions.Item>
                            <Descriptions.Item label="环境条件">温度:{reportData.temperature}°C, 湿度:{reportData.humidity}%</Descriptions.Item>
                        </Descriptions>
                        <br />
                        <Descriptions bordered column={1} title="检测结果">
                            <Descriptions.Item label="观测值">{reportData.value1} {reportData.value2 ? `, ${reportData.value2}` : ''}</Descriptions.Item>
                            <Descriptions.Item label="计算结果"><strong>{reportData.result} {reportData.unit}</strong></Descriptions.Item>
                            <Descriptions.Item label="判定结论">
                                <span style={{ color: reportData.conclusion === '合格' ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {reportData.conclusion}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                            <span>检测人: {reportData.task.assignedTo}</span>
                            <span>审核人: ____________</span>
                            <span>批准人: ____________</span>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default DataEntry;
