import React, { useState, useCallback } from 'react';
import { Card, Button, Space, Row, Col, Form, Input, Select, message, Drawer, Tabs, List, Tag, Modal, Popconfirm } from 'antd';
import { SaveOutlined, EyeOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import GridLayout, { Layout } from 'react-grid-layout';
import { useNavigate, useParams } from 'react-router-dom';
import { clientReportTemplateData, type IClientReportTemplate, type ITemplateLayoutItem } from '../../mock/report';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 可拖放的组件类型
const COMPONENT_TYPES = [
    { type: 'text', label: '文本', icon: '📝', defaultConfig: { content: '请输入文本...', fontSize: 12, textAlign: 'left' } },
    { type: 'image', label: '图片', icon: '🖼️', defaultConfig: { imageUrl: '', width: 100, height: 60 } },
    { type: 'field', label: '数据字段', icon: '📊', defaultConfig: { fieldKey: '', fieldLabel: '' } },
    { type: 'table', label: '表格', icon: '📋', defaultConfig: { fields: [] } },
    { type: 'signature', label: '签章区', icon: '✍️', defaultConfig: { roles: ['编制', '审核', '批准'] } },
    { type: 'declaration', label: '声明', icon: '📄', defaultConfig: {} },
    { type: 'header', label: '页眉', icon: '📰', defaultConfig: {} },
];

// 数据字段选项
const FIELD_OPTIONS = [
    { key: 'reportNo', label: '报告编号' },
    { key: 'sampleName', label: '样品名称' },
    { key: 'sampleNo', label: '样品编号' },
    { key: 'clientName', label: '委托单位' },
    { key: 'clientAddress', label: '委托单位地址' },
    { key: 'testItems', label: '检测项目' },
    { key: 'testStandards', label: '检测依据' },
    { key: 'testDate', label: '检测日期' },
    { key: 'specification', label: '规格型号' },
    { key: 'sampleQuantity', label: '样品数量' },
    { key: 'sampleStatus', label: '样品状态' },
    { key: 'receivedDate', label: '送样日期' },
    { key: 'testCategory', label: '检测类别' },
    { key: 'entrustmentId', label: '委托编号' },
    { key: 'resultDescription', label: '检测结果描述' },
];

interface TemplateEditorProps {
    templateId?: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = () => {
    const navigate = useNavigate();
    const { templateId } = useParams<{ templateId: string }>();

    // 查找模板
    const existingTemplate = templateId ? clientReportTemplateData.find(t => t.id === templateId) : null;

    const [template, setTemplate] = useState<IClientReportTemplate>(existingTemplate || {
        id: `TPL-${Date.now()}`,
        name: '新建模板',
        isDefault: false,
        companyInfo: {
            logoUrl: '/assets/altc-logo.png',
            nameCn: '江苏国轻检测技术有限公司',
            nameEn: 'Jiangsu Guoqing Testing Technology Co.,Ltd',
            address: '江苏省扬州市邗江区金山路99号B栋1-3层',
            postalCode: '225000',
            phone: '0514-80585092'
        },
        pages: [
            { id: 'cover', type: 'cover', name: '封面页', layout: [] },
            { id: 'info', type: 'info', name: '信息页', layout: [] },
        ],
        declarations: [],
        status: 'active',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
    });

    const [activePageId, setActivePageId] = useState('cover');
    const [selectedItem, setSelectedItem] = useState<ITemplateLayoutItem | null>(null);
    const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
    const [configForm] = Form.useForm();

    // 当前页面
    const currentPage = template.pages.find(p => p.id === activePageId);
    const currentLayout = currentPage?.layout || [];

    // 转换为GridLayout格式
    const gridLayout: Layout[] = currentLayout.map(item => ({
        i: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: 2,
        minH: 1,
    }));

    // 处理布局变化
    const handleLayoutChange = useCallback((newLayout: Layout[]) => {
        setTemplate(prev => ({
            ...prev,
            pages: prev.pages.map(page => {
                if (page.id === activePageId) {
                    return {
                        ...page,
                        layout: page.layout.map(item => {
                            const layoutItem = newLayout.find(l => l.i === item.id);
                            if (layoutItem) {
                                return {
                                    ...item,
                                    x: layoutItem.x,
                                    y: layoutItem.y,
                                    w: layoutItem.w,
                                    h: layoutItem.h,
                                };
                            }
                            return item;
                        }),
                    };
                }
                return page;
            }),
        }));
    }, [activePageId]);

    // 添加组件
    const handleAddComponent = (type: string) => {
        const componentDef = COMPONENT_TYPES.find(c => c.type === type);
        if (!componentDef) return;

        const newItem: ITemplateLayoutItem = {
            id: `item-${Date.now()}`,
            type: type as ITemplateLayoutItem['type'],
            x: 0,
            y: currentLayout.length * 2,
            w: 12,
            h: 2,
            config: { ...componentDef.defaultConfig },
        };

        setTemplate(prev => ({
            ...prev,
            pages: prev.pages.map(page => {
                if (page.id === activePageId) {
                    return {
                        ...page,
                        layout: [...page.layout, newItem],
                    };
                }
                return page;
            }),
        }));

        message.success(`已添加 ${componentDef.label}`);
    };

    // 选中组件
    const handleSelectItem = (item: ITemplateLayoutItem) => {
        setSelectedItem(item);
        configForm.setFieldsValue(item.config);
        setIsConfigDrawerOpen(true);
    };

    // 保存组件配置
    const handleSaveConfig = () => {
        if (!selectedItem) return;

        configForm.validateFields().then(values => {
            setTemplate(prev => ({
                ...prev,
                pages: prev.pages.map(page => {
                    if (page.id === activePageId) {
                        return {
                            ...page,
                            layout: page.layout.map(item => {
                                if (item.id === selectedItem.id) {
                                    return { ...item, config: values };
                                }
                                return item;
                            }),
                        };
                    }
                    return page;
                }),
            }));
            setIsConfigDrawerOpen(false);
            message.success('配置已保存');
        });
    };

    // 删除组件
    const handleDeleteItem = (itemId: string) => {
        setTemplate(prev => ({
            ...prev,
            pages: prev.pages.map(page => {
                if (page.id === activePageId) {
                    return {
                        ...page,
                        layout: page.layout.filter(item => item.id !== itemId),
                    };
                }
                return page;
            }),
        }));
        setIsConfigDrawerOpen(false);
        setSelectedItem(null);
        message.success('已删除');
    };

    // 添加页面
    const handleAddPage = () => {
        const pageTypes = ['cover', 'info', 'result'] as const;
        const existingTypes = template.pages.map(p => p.type);
        const availableType = pageTypes.find(t => !existingTypes.includes(t)) || 'info';

        const newPage = {
            id: `page-${Date.now()}`,
            type: availableType,
            name: availableType === 'cover' ? '封面页' : availableType === 'info' ? '信息页' : '结果页',
            layout: [],
        };

        setTemplate(prev => ({
            ...prev,
            pages: [...prev.pages, newPage],
        }));
        setActivePageId(newPage.id);
    };

    // 保存模板
    const handleSave = () => {
        // 在实际应用中，这里会调用API保存
        console.log('Saving template:', template);
        message.success('模板已保存');
    };

    // 渲染组件预览
    const renderComponentPreview = (item: ITemplateLayoutItem) => {
        const componentDef = COMPONENT_TYPES.find(c => c.type === item.type);

        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 8,
                    background: selectedItem?.id === item.id ? '#e6f7ff' : '#fafafa',
                    border: '1px dashed #d9d9d9',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
                onClick={() => handleSelectItem(item)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Tag color="blue">{componentDef?.icon} {componentDef?.label}</Tag>
                    <Popconfirm
                        title="确定删除此组件?"
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDeleteItem(item.id);
                        }}
                    >
                        <DeleteOutlined
                            style={{ color: '#ff4d4f', cursor: 'pointer' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                </div>
                <div style={{ flex: 1, fontSize: 12, color: '#666', overflow: 'hidden' }}>
                    {item.type === 'text' && (item.config.content || '文本内容...')}
                    {item.type === 'field' && `字段: ${item.config.fieldLabel || item.config.fieldKey || '未配置'}`}
                    {item.type === 'image' && '🖼️ 图片区域'}
                    {item.type === 'table' && '📋 表格区域'}
                    {item.type === 'signature' && '✍️ 签章区域'}
                    {item.type === 'declaration' && '📄 声明区域'}
                    {item.type === 'header' && '📰 页眉'}
                </div>
            </div>
        );
    };

    // 渲染配置表单
    const renderConfigForm = () => {
        if (!selectedItem) return null;

        return (
            <Form form={configForm} layout="vertical">
                {selectedItem.type === 'text' && (
                    <>
                        <Form.Item label="文本内容" name="content">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="字体大小" name="fontSize">
                            <Select>
                                {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36].map(size => (
                                    <Select.Option key={size} value={size}>{size}px</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="字体粗细" name="fontWeight">
                            <Select>
                                <Select.Option value="normal">正常</Select.Option>
                                <Select.Option value="bold">加粗</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="对齐方式" name="textAlign">
                            <Select>
                                <Select.Option value="left">左对齐</Select.Option>
                                <Select.Option value="center">居中</Select.Option>
                                <Select.Option value="right">右对齐</Select.Option>
                            </Select>
                        </Form.Item>
                    </>
                )}

                {selectedItem.type === 'field' && (
                    <>
                        <Form.Item label="选择字段" name="fieldKey">
                            <Select
                                onChange={(value) => {
                                    const field = FIELD_OPTIONS.find(f => f.key === value);
                                    configForm.setFieldsValue({ fieldLabel: field?.label });
                                }}
                            >
                                {FIELD_OPTIONS.map(field => (
                                    <Select.Option key={field.key} value={field.key}>{field.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="显示标签" name="fieldLabel">
                            <Input />
                        </Form.Item>
                    </>
                )}

                {selectedItem.type === 'image' && (
                    <>
                        <Form.Item label="图片URL" name="imageUrl">
                            <Input placeholder="输入图片地址" />
                        </Form.Item>
                    </>
                )}

                {selectedItem.type === 'signature' && (
                    <Form.Item label="签章角色" name="roles">
                        <Select mode="tags" placeholder="输入角色名称">
                            <Select.Option value="编制">编制</Select.Option>
                            <Select.Option value="审核">审核</Select.Option>
                            <Select.Option value="批准">批准</Select.Option>
                        </Select>
                    </Form.Item>
                )}

                {selectedItem.type === 'table' && (
                    <Form.Item label="显示字段" name="fields">
                        <Select mode="multiple" placeholder="选择要显示的字段">
                            {FIELD_OPTIONS.map(field => (
                                <Select.Option key={field.key} value={field.key}>{field.label}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        );
    };

    return (
        <div style={{ height: '100%' }}>
            {/* 工具栏 */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/report-management/client-templates')}>
                                返回
                            </Button>
                            <Input
                                value={template.name}
                                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                                style={{ width: 250 }}
                            />
                            <Tag color={template.clientName ? 'blue' : 'default'}>
                                {template.clientName || '通用模板'}
                            </Tag>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Button icon={<EyeOutlined />}>预览</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16}>
                {/* 左侧：组件面板 */}
                <Col span={4}>
                    <Card title="组件库" size="small">
                        <List
                            size="small"
                            dataSource={COMPONENT_TYPES}
                            renderItem={(item) => (
                                <List.Item
                                    style={{ cursor: 'pointer', padding: '8px' }}
                                    onClick={() => handleAddComponent(item.type)}
                                >
                                    <Space>
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                        <PlusOutlined style={{ color: '#1890ff' }} />
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* 中间：画布 */}
                <Col span={16}>
                    <Card
                        size="small"
                        title={
                            <Tabs
                                activeKey={activePageId}
                                onChange={setActivePageId}
                                type="editable-card"
                                onEdit={(targetKey, action) => {
                                    if (action === 'add') handleAddPage();
                                }}
                                items={template.pages.map(page => ({
                                    key: page.id,
                                    label: page.name,
                                    closable: template.pages.length > 1,
                                }))}
                            />
                        }
                        bodyStyle={{ background: '#fff', minHeight: 600, padding: 16 }}
                    >
                        <div style={{
                            border: '2px solid #e0e0e0',
                            borderRadius: 4,
                            minHeight: 550,
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <GridLayout
                                className="layout"
                                layout={gridLayout}
                                cols={12}
                                rowHeight={30}
                                width={700}
                                onLayoutChange={handleLayoutChange}
                                draggableHandle=".drag-handle"
                                isResizable
                                isDraggable
                            >
                                {currentLayout.map((item) => (
                                    <div key={item.id} className="drag-handle">
                                        {renderComponentPreview(item)}
                                    </div>
                                ))}
                            </GridLayout>
                            {currentLayout.length === 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 400,
                                    color: '#999'
                                }}>
                                    点击左侧组件添加到画布
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* 右侧：属性面板 */}
                <Col span={4}>
                    <Card title="模板信息" size="small">
                        <Form layout="vertical" size="small">
                            <Form.Item label="关联客户">
                                <Input
                                    value={template.clientName}
                                    onChange={(e) => setTemplate(prev => ({ ...prev, clientName: e.target.value }))}
                                    placeholder="留空为通用"
                                />
                            </Form.Item>
                            <Form.Item label="页面数">
                                <Tag color="blue">{template.pages.length} 页</Tag>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* 组件配置抽屉 */}
            <Drawer
                title={`配置 - ${COMPONENT_TYPES.find(c => c.type === selectedItem?.type)?.label || ''}`}
                open={isConfigDrawerOpen}
                onClose={() => setIsConfigDrawerOpen(false)}
                width={350}
                extra={
                    <Space>
                        <Popconfirm
                            title="确定删除此组件?"
                            onConfirm={() => selectedItem && handleDeleteItem(selectedItem.id)}
                        >
                            <Button danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                        <Button type="primary" onClick={handleSaveConfig}>保存</Button>
                    </Space>
                }
            >
                {renderConfigForm()}
            </Drawer>
        </div>
    );
};

export default TemplateEditor;
