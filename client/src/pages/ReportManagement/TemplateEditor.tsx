import React, { useState, useCallback } from 'react';
import { Card, Button, Space, Row, Col, Form, Input, Select, message, Drawer, Tabs, List, Tag, Modal, Popconfirm, Upload, Image, Divider } from 'antd';
import { SaveOutlined, EyeOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
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

// A4 纸张尺寸配置 (按比例缩放到画布)
// A4: 210mm x 297mm, 画布宽度 700px => 比例 3.33px/mm
const A4_CONFIG = {
    widthMM: 210,        // A4 宽度 mm
    heightMM: 297,       // A4 高度 mm
    canvasWidth: 700,    // 画布宽度 px
    canvasHeight: 990,   // 画布高度 px (297/210 * 700)
    pxPerMM: 700 / 210,  // 约 3.33 px/mm
    cols: 12,            // GridLayout 列数
    rowHeight: 30,       // 行高 px
    colWidth: 700 / 12,  // 列宽 px (约 58.33)
    colWidthMM: 210 / 12, // 列宽 mm (17.5mm)
    rowHeightMM: 30 / (700 / 210), // 行高 mm (约 9mm)
};


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
        const isSelected = selectedItem?.id === item.id;

        // 使用 onMouseUp 代替 onClick，在拖拽结束后触发，避免与拖拽冲突
        const handleMouseUp = (e: React.MouseEvent) => {
            // 仅当鼠标没有移动太多时才触发选择（区分点击和拖拽）
            const target = e.target as HTMLElement;
            // 如果点击的是删除按钮区域，不处理
            if (target.closest('.delete-btn-area')) return;
        };

        // 点击编辑按钮打开配置
        const handleEditClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            handleSelectItem(item);
        };

        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 8,
                    background: isSelected ? '#e6f7ff' : '#fafafa',
                    border: isSelected ? '2px solid #1890ff' : '1px dashed #d9d9d9',
                    borderRadius: 4,
                    cursor: 'move',
                    position: 'relative',
                }}
                onDoubleClick={handleEditClick}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Tag color="blue">{componentDef?.icon} {componentDef?.label}</Tag>
                    <Space size={4}>
                        {/* 编辑按钮 - 主要交互方式 */}
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={handleEditClick}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ fontSize: 12, padding: '0 6px', height: 22 }}
                        >
                            配置
                        </Button>
                        {/* 删除按钮 */}
                        <div className="delete-btn-area" onMouseDown={(e) => e.stopPropagation()}>
                            <Popconfirm
                                title="确定删除此组件?"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleDeleteItem(item.id);
                                }}
                            >
                                <Button
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ fontSize: 12, padding: '0 6px', height: 22 }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Popconfirm>
                        </div>
                    </Space>
                </div>
                <div style={{ flex: 1, fontSize: 12, color: '#666', overflow: 'hidden', paddingTop: 4 }}>
                    {item.type === 'text' && (item.config.content || '文本内容...')}
                    {item.type === 'field' && `字段: ${item.config.fieldLabel || item.config.fieldKey || '未配置'}`}
                    {item.type === 'image' && '🖼️ 图片区域'}
                    {item.type === 'table' && '📋 表格区域'}
                    {item.type === 'signature' && '✍️ 签章区域'}
                    {item.type === 'declaration' && '📄 声明区域'}
                    {item.type === 'header' && '📰 页眉'}
                </div>
                {/* 双击提示 */}
                <div style={{ fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 }}>
                    双击或点击"配置"编辑
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
                        <Form.Item label="图片来源">
                            <Divider plain style={{ margin: '8px 0' }}>方式一：上传本地图片</Divider>
                            <Upload
                                name="file"
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('只能上传图片文件!');
                                        return false;
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        message.error('图片大小不能超过 2MB!');
                                        return false;
                                    }
                                    // 转换为 base64
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = () => {
                                        configForm.setFieldsValue({ imageUrl: reader.result as string });
                                        message.success('图片已加载');
                                    };
                                    return false; // 阻止自动上传
                                }}
                            >
                                {configForm.getFieldValue('imageUrl') ? (
                                    <img
                                        src={configForm.getFieldValue('imageUrl')}
                                        alt="preview"
                                        style={{ width: '100%', maxHeight: 100, objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>点击上传</div>
                                    </div>
                                )}
                            </Upload>

                            <Divider plain style={{ margin: '16px 0 8px' }}>方式二：输入图片URL</Divider>
                        </Form.Item>
                        <Form.Item label="图片URL" name="imageUrl">
                            <Input.TextArea
                                rows={2}
                                placeholder="输入图片地址，如: /assets/logo.png 或 https://example.com/image.jpg"
                            />
                        </Form.Item>
                        {configForm.getFieldValue('imageUrl') && (
                            <Form.Item label="图片预览">
                                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8, textAlign: 'center' }}>
                                    <img
                                        src={configForm.getFieldValue('imageUrl')}
                                        alt="预览"
                                        style={{ maxWidth: '100%', maxHeight: 150 }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60"><rect fill="%23f0f0f0" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999">加载失败</text></svg>';
                                        }}
                                    />
                                </div>
                            </Form.Item>
                        )}
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
                        {/* A4 尺寸信息面板 */}
                        <div style={{
                            marginBottom: 8,
                            padding: '8px 12px',
                            background: '#f5f5f5',
                            borderRadius: 4,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 12
                        }}>
                            <Space size="large">
                                <span><strong>A4纸张:</strong> 210mm × 297mm</span>
                                <span><strong>画布:</strong> {A4_CONFIG.canvasWidth}px × {A4_CONFIG.canvasHeight}px</span>
                                <span><strong>比例:</strong> 1格 ≈ {A4_CONFIG.colWidthMM.toFixed(1)}mm × {A4_CONFIG.rowHeightMM.toFixed(1)}mm</span>
                            </Space>
                            <Tag color="blue">12列 × 33行 = A4满页</Tag>
                        </div>

                        {/* 水平标尺 (mm) */}
                        <div style={{
                            display: 'flex',
                            marginLeft: 30,
                            marginBottom: 4,
                            height: 20,
                            background: '#fafafa',
                            borderRadius: '4px 4px 0 0'
                        }}>
                            {Array.from({ length: 22 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: i === 21 ? 10 : A4_CONFIG.pxPerMM * 10,
                                        borderLeft: '1px solid #ccc',
                                        fontSize: 10,
                                        color: '#666',
                                        paddingLeft: 2,
                                        display: 'flex',
                                        alignItems: 'flex-end'
                                    }}
                                >
                                    {i % 2 === 0 && <span>{i * 10}</span>}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex' }}>
                            {/* 垂直标尺 (mm) */}
                            <div style={{
                                width: 30,
                                background: '#fafafa',
                                borderRadius: '4px 0 0 4px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            height: A4_CONFIG.pxPerMM * 10,
                                            borderTop: '1px solid #ccc',
                                            fontSize: 10,
                                            color: '#666',
                                            paddingTop: 2,
                                            paddingLeft: 4,
                                            lineHeight: 1
                                        }}
                                    >
                                        {i % 2 === 0 && <span>{i * 10}</span>}
                                    </div>
                                ))}
                            </div>

                            {/* 画布区域 */}
                            <div style={{
                                border: '2px solid #1890ff',
                                borderRadius: 4,
                                minHeight: A4_CONFIG.canvasHeight,
                                width: A4_CONFIG.canvasWidth,
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}>
                                {/* 列网格参考线 */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '100%',
                                    display: 'flex',
                                    pointerEvents: 'none',
                                    zIndex: 0
                                }}>
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                flex: 1,
                                                borderRight: i < 11 ? '1px dashed #e8e8e8' : 'none',
                                            }}
                                        />
                                    ))}
                                </div>

                                <GridLayout
                                    className="layout"
                                    layout={gridLayout}
                                    cols={12}
                                    rowHeight={A4_CONFIG.rowHeight}
                                    width={A4_CONFIG.canvasWidth}
                                    onLayoutChange={handleLayoutChange}
                                    draggableHandle=".drag-handle"
                                    isResizable
                                    isDraggable
                                    style={{ position: 'relative', zIndex: 1 }}
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
                                        color: '#999',
                                        flexDirection: 'column',
                                        gap: 8
                                    }}>
                                        <span>点击左侧组件添加到画布</span>
                                        <Tag>每格约 17.5mm × 9mm</Tag>
                                    </div>
                                )}
                            </div>
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
