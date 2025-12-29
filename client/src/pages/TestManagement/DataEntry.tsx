import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Row, Col, message, Space, Upload, Alert } from 'antd';
import { SaveOutlined, FilePdfOutlined, UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import type { Sheet } from '@fortune-sheet/core';
import FortuneSheetEditor from '../../components/FortuneSheet';
import { stringifySheetData } from '../../components/FortuneSheet/utils';
import { testTaskData, type ITestTask } from '../../mock/test';
import { deviceData } from '../../mock/devices';

const DataEntry: React.FC = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const [selectedTask, setSelectedTask] = useState<ITestTask | null>(null);
    const [sheetData, setSheetData] = useState<Sheet[]>([{
        name: '检测数据',
        celldata: [],
        config: {},
    }]);
    const [fileList, setFileList] = useState<any[]>([]);

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
    };

    const handleSheetChange = (sheets: Sheet[]) => {
        setSheetData(sheets);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const saveData = {
                ...values,
                sheetData: stringifySheetData(sheetData),
            };
            console.log('Saved Data:', saveData);
            message.success('数据保存成功');
        });
    };

    const handleGenerateReport = () => {
        form.validateFields().then(() => {
            message.info('报告生成功能开发中...');
        });
    };

    return (
        <Card
            title="试验数据录入"
            bordered={false}
            extra={<span style={{ fontSize: '14px', color: '#666' }}>数据录入工作台 - 使用表格录入试验数据</span>}
        >
            <Form form={form} layout="vertical">
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
                        <Form.Item name="deviceId" label="关联设备">
                            <Select placeholder="选择检测设备">
                                {deviceData.map(d => (
                                    <Select.Option key={d.id} value={d.id}>{d.name} ({d.code})</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {selectedTask ? (
                    <div style={{ marginBottom: 24, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                        <FortuneSheetEditor
                            data={sheetData}
                            onChange={handleSheetChange}
                            height={500}
                        />
                    </div>
                ) : (
                    <Alert message="请选择任务以加载数据录入表格" type="info" showIcon style={{ marginBottom: 24 }} />
                )}

                <Form.Item label="上传附件" name="attachments">
                    <Upload
                        fileList={fileList}
                        beforeUpload={(file) => {
                            setFileList([...fileList, file]);
                            return false;
                        }}
                        onRemove={(file) => {
                            setFileList(fileList.filter(f => f !== file));
                        }}
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                    <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                        <PaperClipOutlined /> 支持 PDF、Word、Excel、图片文件
                    </div>
                </Form.Item>

                <Row justify="center">
                    <Space size="large">
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large">
                            保存数据
                        </Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleGenerateReport} size="large">
                            生成报告
                        </Button>
                    </Space>
                </Row>
            </Form>
        </Card>
    );
};

export default DataEntry;
