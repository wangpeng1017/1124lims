import React from 'react';
import { Form, Input, Table, InputNumber, Select, Upload, Button, Row, Col, Card, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TestTemplate } from '../mock/testTemplates';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface DynamicFormRendererProps {
    template: TestTemplate; // 使用新的TestTemplate接口
    initialValues?: any;
    readOnly?: boolean;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ template, initialValues, readOnly = false }) => {
    const { schema } = template;

    // 渲染表头信息
    const renderHeader = () => {
        if (!schema.header) return null;

        return (
            <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
                <Row gutter={[24, 12]}>
                    {Object.entries(schema.header).map(([key, value]) => (
                        <Col span={8} key={key}>
                            <Text type="secondary" style={{ marginRight: 8 }}>
                                {key === 'methodBasis' ? '检测依据' :
                                    key === 'device' ? '检测设备' :
                                        key === 'testConditions' ? '试验条件' :
                                            key === 'preparation' ? '样品制备' : key}:
                            </Text>
                            <Text strong>{value}</Text>
                        </Col>
                    ))}
                </Row>
            </Card>
        );
    };

    // 渲染数值型表格
    const renderTable = () => {
        if (!schema.columns || schema.columns.length === 0) return null;

        const columns = schema.columns.map((col: any) => ({
            title: col.title + (col.unit ? ` (${col.unit})` : ''),
            dataIndex: col.dataIndex,
            key: col.dataIndex,
            width: col.width,
            render: (text: any, _: any, index: number) => {
                if (readOnly) return text;

                // 序号列不可编辑
                if (col.dataIndex === 'index') return index + 1;

                // 根据类型渲染输入控件
                if (col.type === 'select' || col.dataIndex === 'failureMode') { // 特殊处理失效模式
                    return (
                        <Form.Item name={['dataRows', index, col.dataIndex]} noStyle>
                            <Select style={{ width: '100%' }} placeholder="选择">
                                {col.options ? col.options.map((opt: string) => (
                                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                )) : (
                                    // 默认失效模式选项
                                    ['LGM', 'AGM', 'MGM', 'BAB', 'BAM', 'LAT', 'GAT'].map(opt => (
                                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                    ))
                                )}
                            </Select>
                        </Form.Item>
                    );
                }

                return (
                    <Form.Item name={['dataRows', index, col.dataIndex]} noStyle>
                        <Input />
                    </Form.Item>
                );
            }
        }));

        // 生成初始行数据
        const initialData = initialValues?.dataRows || Array.from({ length: 5 }, (_, i) => ({ key: i, index: i + 1 }));

        return (
            <div style={{ marginBottom: 24 }}>
                <Table
                    dataSource={initialData}
                    columns={columns}
                    pagination={false}
                    size="small"
                    bordered
                    footer={() => (
                        <Space>
                            <Button type="dashed" icon={<PlusOutlined />} size="small">添加行</Button>
                            {schema.statistics && (
                                <Text type="secondary" style={{ marginLeft: 16 }}>
                                    自动计算: {schema.statistics.join(', ')}
                                </Text>
                            )}
                        </Space>
                    )}
                />
            </div>
        );
    };

    // 渲染描述型表单字段
    const renderFields = () => {
        if (!schema.fields || schema.fields.length === 0) return null;

        return (
            <Row gutter={24}>
                {schema.fields.map((field: any) => (
                    <Col span={field.type === 'textarea' || field.type === 'image-upload' ? 24 : 12} key={field.name}>
                        <Form.Item
                            name={field.name}
                            label={field.label}
                            rules={[{ required: field.required, message: `请输入${field.label}` }]}
                        >
                            {field.type === 'textarea' ? (
                                <TextArea rows={4} placeholder={field.placeholder} />
                            ) : field.type === 'select' ? (
                                <Select placeholder={`请选择${field.label}`}>
                                    {field.options?.map((opt: string) => (
                                        <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                                    ))}
                                </Select>
                            ) : field.type === 'number' ? (
                                <InputNumber style={{ width: '100%' }} min={field.min} max={field.max} />
                            ) : field.type === 'image-upload' ? (
                                <Upload
                                    listType="picture-card"
                                    fileList={initialValues?.[field.name] || []}
                                    multiple={field.multiple}
                                    accept={field.accept}
                                    beforeUpload={() => false} // 阻止自动上传
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>上传图片</div>
                                    </div>
                                </Upload>
                            ) : (
                                <Input placeholder={field.placeholder} />
                            )}
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <div className="dynamic-form-renderer">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={3}>{schema.title}</Title>
            </div>

            {renderHeader()}

            {/* 优先渲染表格(数值型)，然后渲染字段(描述型) */}
            {renderTable()}
            {renderFields()}

            <Form.Item name="remarks" label="备注">
                <TextArea rows={2} />
            </Form.Item>
        </div>
    );
};

export default DynamicFormRenderer;
