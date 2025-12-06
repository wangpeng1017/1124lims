import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Drawer, Descriptions, List, Row, Col, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, CopyOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { clientReportTemplateData, type IClientReportTemplate } from '../../mock/report';
import { useAuth } from '../../hooks/useAuth';

const ClientReportTemplates: React.FC = () => {
    const navigate = useNavigate();
    const { canDelete } = useAuth();
    const [dataSource, setDataSource] = useState<IClientReportTemplate[]>(clientReportTemplateData);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<IClientReportTemplate | null>(null);
    const [copySource, setCopySource] = useState<IClientReportTemplate | null>(null);
    const [createForm] = Form.useForm();
    const [copyForm] = Form.useForm();

    // 行选择状态
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IClientReportTemplate[]>([]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: IClientReportTemplate[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };

    // 预览模板
    const handlePreview = (template: IClientReportTemplate) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    // 复制模板
    const handleCopy = (template: IClientReportTemplate) => {
        setCopySource(template);
        copyForm.resetFields();
        copyForm.setFieldsValue({
            name: `${template.name} - 副本`,
            clientName: '',
        });
        setIsCopyModalOpen(true);
    };

    // 确认复制
    const handleCopySubmit = () => {
        copyForm.validateFields().then(values => {
            if (!copySource) return;

            const newTemplate: IClientReportTemplate = {
                ...copySource,
                id: `TPL-${Date.now()}`,
                name: values.name,
                clientId: values.clientId,
                clientName: values.clientName,
                baseTemplateId: copySource.id,
                isDefault: false,
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
            };

            setDataSource([...dataSource, newTemplate]);
            setIsCopyModalOpen(false);
            setCopySource(null);
            message.success('模板复制成功');
        });
    };

    // 删除模板
    const handleDelete = (id: string) => {
        const template = dataSource.find(t => t.id === id);
        if (template?.isDefault) {
            message.error('默认模板不可删除');
            return;
        }
        setDataSource(dataSource.filter(t => t.id !== id));
        message.success('模板已删除');
    };

    // 切换状态
    const handleToggleStatus = (id: string) => {
        setDataSource(dataSource.map(t => {
            if (t.id === id) {
                return { ...t, status: t.status === 'active' ? 'inactive' : 'active' };
            }
            return t;
        }));
        message.success('状态已更新');
    };

    // 新增模板
    const handleCreate = () => {
        createForm.resetFields();
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = () => {
        createForm.validateFields().then(values => {
            const newTemplate: IClientReportTemplate = {
                id: `TPL-${Date.now()}`,
                name: values.name,
                clientId: values.clientId,
                clientName: values.clientName,
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
                    { id: 'info', type: 'info', name: '信息页', layout: [] }
                ],
                declarations: [
                    '1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；',
                    '2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；',
                    '3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；',
                    '4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。'
                ],
                status: 'active',
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
            };

            setDataSource([...dataSource, newTemplate]);
            setIsCreateModalOpen(false);
            message.success('模板创建成功，正在跳转到编辑器...');
            navigate(`/report-management/template-editor/${newTemplate.id}`);
        });
    };

    const columns: ColumnsType<IClientReportTemplate> = [
        {
            title: '模板ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
        },
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (text, record) => (
                <Space>
                    <a onClick={() => handlePreview(record)}>{text}</a>
                    {record.isDefault && <Tag color="gold">默认</Tag>}
                </Space>
            ),
        },
        {
            title: '关联客户',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 180,
            render: (text) => text || <Tag>通用</Tag>,
        },
        {
            title: '页面数',
            key: 'pages',
            width: 80,
            render: (_, record) => (
                <Tag color="blue">{record.pages.length} 页</Tag>
            ),
        },
        {
            title: '继承自',
            dataIndex: 'baseTemplateId',
            key: 'baseTemplateId',
            width: 130,
            render: (text) => text ? <Tag color="cyan">{text}</Tag> : '-',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status === 'active' ? '启用' : '停用'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 170,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(record)}
                    >
                        查看
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="客户报告模板管理"
            extra={
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        onClick={() => selectedRows[0] && navigate(`/report-management/template-editor/${selectedRows[0].id}`)}
                        disabled={selectedRows.length === 0}
                    >
                        编辑模板
                    </Button>
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => selectedRows[0] && handleCopy(selectedRows[0])}
                        disabled={selectedRows.length === 0}
                    >
                        复制模板
                    </Button>
                    <Button
                        onClick={() => selectedRows[0] && handleToggleStatus(selectedRows[0].id)}
                        disabled={selectedRows.length === 0}
                    >
                        切换状态
                    </Button>
                    {canDelete && (
                        <Popconfirm
                            title="确定删除该模板?"
                            onConfirm={() => selectedRows[0] && handleDelete(selectedRows[0].id)}
                            disabled={selectedRows.length === 0 || selectedRows[0]?.isDefault}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                disabled={selectedRows.length === 0 || selectedRows[0]?.isDefault}
                            >
                                删除
                            </Button>
                        </Popconfirm>
                    )}
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        新建模板
                    </Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                rowSelection={rowSelection}
                scroll={{ x: 1200 }}
                pagination={{ pageSize: 10 }}
            />

            {/* 预览抽屉 */}
            <Drawer
                title="模板详情"
                width={700}
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                extra={
                    <Space>
                        <Button onClick={() => previewTemplate && handleCopy(previewTemplate)}>
                            复制此模板
                        </Button>
                    </Space>
                }
            >
                {previewTemplate && (
                    <>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="模板ID">{previewTemplate.id}</Descriptions.Item>
                            <Descriptions.Item label="模板名称">{previewTemplate.name}</Descriptions.Item>
                            <Descriptions.Item label="关联客户">{previewTemplate.clientName || '通用'}</Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Tag color={previewTemplate.status === 'active' ? 'green' : 'default'}>
                                    {previewTemplate.status === 'active' ? '启用' : '停用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="是否默认">
                                {previewTemplate.isDefault ? <Tag color="gold">是</Tag> : '否'}
                            </Descriptions.Item>
                            <Descriptions.Item label="继承自">
                                {previewTemplate.baseTemplateId || '-'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>公司信息</Divider>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="公司名称(中文)">{previewTemplate.companyInfo.nameCn}</Descriptions.Item>
                            <Descriptions.Item label="公司名称(英文)">{previewTemplate.companyInfo.nameEn}</Descriptions.Item>
                            <Descriptions.Item label="地址">{previewTemplate.companyInfo.address}</Descriptions.Item>
                            <Descriptions.Item label="电话">{previewTemplate.companyInfo.phone}</Descriptions.Item>
                        </Descriptions>

                        <Divider>页面配置</Divider>
                        <List
                            bordered
                            dataSource={previewTemplate.pages}
                            renderItem={(page, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`第 ${index + 1} 页: ${page.name}`}
                                        description={`类型: ${page.type} | 元素数: ${page.layout.length}`}
                                    />
                                </List.Item>
                            )}
                        />

                        <Divider>声明内容</Divider>
                        <List
                            size="small"
                            dataSource={previewTemplate.declarations}
                            renderItem={(item) => (
                                <List.Item style={{ fontSize: 12, color: '#666' }}>
                                    {item}
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Drawer>

            {/* 复制模板 Modal */}
            <Modal
                title={`复制模板: ${copySource?.name}`}
                open={isCopyModalOpen}
                onOk={handleCopySubmit}
                onCancel={() => setIsCopyModalOpen(false)}
            >
                <Form form={copyForm} layout="vertical">
                    <Form.Item
                        label="新模板名称"
                        name="name"
                        rules={[{ required: true, message: '请输入模板名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="关联客户名称" name="clientName">
                        <Input placeholder="留空则为通用模板" />
                    </Form.Item>
                    <Form.Item label="客户ID" name="clientId">
                        <Input placeholder="可选" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 新建模板 Modal */}
            <Modal
                title="新建报告模板"
                open={isCreateModalOpen}
                onOk={handleCreateSubmit}
                onCancel={() => setIsCreateModalOpen(false)}
            >
                <Form form={createForm} layout="vertical">
                    <Form.Item
                        label="模板名称"
                        name="name"
                        rules={[{ required: true, message: '请输入模板名称' }]}
                    >
                        <Input placeholder="例如: 长城汽车检测报告模板" />
                    </Form.Item>
                    <Form.Item label="关联客户名称" name="clientName">
                        <Input placeholder="留空则为通用模板" />
                    </Form.Item>
                    <Form.Item label="客户ID" name="clientId">
                        <Input placeholder="可选，用于系统自动匹配" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ClientReportTemplates;
