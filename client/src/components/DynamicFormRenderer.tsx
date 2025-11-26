import React from 'react';
import { Card, Form, Input, Table, Row, Col, Typography } from 'antd';
import type { ELNTemplate } from '../mock/basicParameters';

const { Title, Text } = Typography;

interface DynamicFormRendererProps {
    template: ELNTemplate;
    form: any;
}

/**
 * 动态表单渲染器 - 根据 ELN 模板的 schema 渲染不同的表单布局
 */
const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ template }) => {
    if (!template.schema) {
        // 如果没有 schema，显示默认的简单表单
        return (
            <>
                <Form.Item name="value1" label="数值1">
                    <Input />
                </Form.Item>
                <Form.Item name="value2" label="数值2">
                    <Input />
                </Form.Item>
                <Form.Item name="result" label="结果">
                    <Input />
                </Form.Item>
            </>
        );
    }

    const { schema } = template;

    // 渲染表格列
    const renderColumns = (columns: any[]): any[] => {
        return columns.map((col: any) => {
            if (col.children) {
                // 如果有子列，创建列组
                return {
                    title: col.title,
                    children: renderColumns(col.children)
                };
            }
            return {
                title: col.title,
                dataIndex: col.dataIndex,
                key: col.dataIndex,
                width: col.width,
                render: (_: any, __: any, index: number) => (
                    <Form.Item
                        name={[index, col.dataIndex]}
                        rules={[{ required: col.dataIndex === 'sampleName' }]}
                        style={{ margin: 0 }}
                    >
                        <Input placeholder={`请输入${col.title}`} />
                    </Form.Item>
                )
            };
        });
    };

    return (
        <div>
            {/* 标题区域 */}
            {schema.title && (
                <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
                    {schema.title}
                    {schema.subtitle && <div style={{ fontSize: '14px', fontWeight: 'normal' }}>{schema.subtitle}</div>}
                </Title>
            )}

            {/* 头部信息 */}
            {schema.header && (
                <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
                    <Row gutter={16}>
                        {schema.header.methodBasis && (
                            <Col span={12}>
                                <Text strong>方法依据：</Text>
                                <Text>{schema.header.methodBasis}</Text>
                            </Col>
                        )}
                        {schema.header.instrument && (
                            <Col span={12}>
                                <Text strong>使用仪器：</Text>
                                <Form.Item name="instrument" noStyle>
                                    <Input
                                        placeholder={schema.header.instrument}
                                        style={{ width: 200, marginLeft: 8 }}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Card>
            )}

            {/* 环境条件 */}
            {schema.environment && (
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="环境温度 (°C)" name="envTemperature">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="环境湿度 (%)" name="envHumidity">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="检测日期" name="testDate">
                                <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* 数据表格 */}
            {schema.columns && (
                <Form.List name="dataRows">
                    {(fields, { add }) => (
                        <>
                            <Table
                                columns={renderColumns(schema.columns)}
                                dataSource={fields.map((field, index) => ({ key: field.key, index }))}
                                pagination={false}
                                bordered
                                size="small"
                                footer={() => (
                                    <a onClick={() => add()}>+ 添加数据行</a>
                                )}
                            />
                        </>
                    )}
                </Form.List>
            )}

            {/* 备注 */}
            <Form.Item label="备注" name="remarks" style={{ marginTop: 16 }}>
                <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
        </div>
    );
};

export default DynamicFormRenderer;
