import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Modal, Form, Upload, message, Popconfirm, Tooltip, Select, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, DeleteOutlined, EditOutlined, DownloadOutlined, FileWordOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined, FilePptOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useAuth } from '../../hooks/useAuth';
import systemDocumentApi, {
    type ISystemDocument,
    type SystemDocumentQuery,
    DOCUMENT_CATEGORY_MAP,
    getFileIcon,
    formatFileSize,
} from '../../services/systemDocumentApi';

const SystemDocuments: React.FC = () => {
    const { canDelete } = useAuth();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ISystemDocument[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ISystemDocument | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 获取当前用户信息
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return { id: 1, realName: '管理员' };
            }
        }
        return { id: 1, realName: '管理员' };
    };

    // 加载数据
    const loadData = async (params: SystemDocumentQuery = {}) => {
        setLoading(true);
        try {
            const res = await systemDocumentApi.page({
                current: params.current || pagination.current,
                size: params.size || pagination.pageSize,
                name: params.name || searchText || undefined,
            });

            if (res.code === 200 && res.data) {
                setDataSource(res.data.records || []);
                setPagination(prev => ({
                    ...prev,
                    current: res.data?.current || 1,
                    pageSize: res.data?.size || 10,
                    total: res.data?.total || 0,
                }));
            } else {
                message.error(res.msg || '加载数据失败');
            }
        } catch (error) {
            console.error('加载体系文件失败:', error);
            message.error('加载数据失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 搜索
    const handleSearch = () => {
        loadData({ current: 1, name: searchText });
    };

    // 表格分页变化
    const handleTableChange = (pag: TablePaginationConfig) => {
        loadData({ current: pag.current, size: pag.pageSize });
    };

    // 新增
    const handleAdd = () => {
        setEditingRecord(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    // 编辑
    const handleEdit = (record: ISystemDocument) => {
        setEditingRecord(record);
        form.setFieldsValue({
            name: record.name,
            version: record.version,
            description: record.description,
            category: record.category,
        });
        setFileList([{
            uid: '-1',
            name: record.originalName,
            status: 'done',
        }]);
        setIsModalOpen(true);
    };

    // 删除
    const handleDelete = async (id: number) => {
        try {
            const res = await systemDocumentApi.delete(id);
            if (res.code === 200) {
                message.success('删除成功');
                loadData();
            } else {
                message.error(res.msg || '删除失败');
            }
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败，请重试');
        }
    };

    // 下载
    const handleDownload = async (record: ISystemDocument) => {
        try {
            message.loading({ content: '正在下载...', key: 'download' });
            await systemDocumentApi.download(record.id, record.originalName);
            message.success({ content: '下载成功', key: 'download' });
        } catch (error) {
            console.error('下载失败:', error);
            message.error({ content: '下载失败，请重试', key: 'download' });
        }
    };

    // 提交表单
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const user = getCurrentUser();

            setSubmitting(true);

            if (editingRecord) {
                // 编辑模式
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    // 有新文件上传，使用替换接口
                    const res = await systemDocumentApi.replace(
                        editingRecord.id,
                        fileList[0].originFileObj as File,
                        {
                            name: values.name,
                            version: values.version,
                            description: values.description,
                        }
                    );
                    if (res.code === 200) {
                        message.success('更新成功');
                        setIsModalOpen(false);
                        loadData();
                    } else {
                        message.error(res.msg || '更新失败');
                    }
                } else {
                    // 没有新文件，只更新信息
                    const res = await systemDocumentApi.update(editingRecord.id, {
                        name: values.name,
                        version: values.version,
                        description: values.description,
                        category: values.category,
                    });
                    if (res.code === 200) {
                        message.success('更新成功');
                        setIsModalOpen(false);
                        loadData();
                    } else {
                        message.error(res.msg || '更新失败');
                    }
                }
            } else {
                // 新增模式
                if (fileList.length === 0 || !fileList[0].originFileObj) {
                    message.error('请上传文件');
                    setSubmitting(false);
                    return;
                }

                const res = await systemDocumentApi.upload(
                    fileList[0].originFileObj as File,
                    {
                        name: values.name,
                        version: values.version,
                        description: values.description,
                        category: values.category,
                        uploaderId: user.id,
                        uploader: user.realName,
                    }
                );

                if (res.code === 200) {
                    message.success('上传成功');
                    setIsModalOpen(false);
                    loadData();
                } else {
                    message.error(res.msg || '上传失败');
                }
            }
        } catch (error) {
            console.error('操作失败:', error);
            message.error('操作失败，请重试');
        } finally {
            setSubmitting(false);
        }
    };

    // 获取文件图标组件
    const getFileIconComponent = (fileName: string) => {
        const iconType = getFileIcon(fileName);
        switch (iconType) {
            case 'word':
                return <FileWordOutlined style={{ color: '#1890ff', fontSize: 16 }} />;
            case 'excel':
                return <FileExcelOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
            case 'pdf':
                return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />;
            case 'ppt':
                return <FilePptOutlined style={{ color: '#fa8c16', fontSize: 16 }} />;
            default:
                return <FileTextOutlined style={{ fontSize: 16 }} />;
        }
    };

    const columns: ColumnsType<ISystemDocument> = [
        {
            title: '序号',
            key: 'index',
            width: 60,
            render: (_, __, index) => ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
        },
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
            width: 80,
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 100,
            render: (category: string) => {
                const info = DOCUMENT_CATEGORY_MAP[category];
                return info ? (
                    <span style={{ color: info.color }}>{info.text}</span>
                ) : (category || '-');
            },
        },
        {
            title: '附件',
            dataIndex: 'originalName',
            key: 'originalName',
            render: (text, record) => (
                <Space>
                    {getFileIconComponent(text)}
                    <a onClick={() => handleDownload(record)}>{text}</a>
                </Space>
            ),
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: 100,
            render: (size: number) => formatFileSize(size),
        },
        {
            title: '上传人',
            dataIndex: 'uploader',
            key: 'uploader',
            width: 100,
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: 160,
            render: (time: string) => time ? time.replace('T', ' ').substring(0, 16) : '-',
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="下载">
                        <Button
                            type="text"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    {canDelete && (
                        <Popconfirm
                            title="确定删除此文件?"
                            description="删除后无法恢复"
                            onConfirm={() => handleDelete(record.id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Tooltip title="删除">
                                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file: RcFile) => {
            // 检查文件大小（限制50MB）
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('文件大小不能超过50MB');
                return Upload.LIST_IGNORE;
            }
            setFileList([{
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file,
            }]);
            return false;
        },
        fileList,
    };

    return (
        <Card
            title="体系文件管理"
            extra={
                <Space>
                    <Input
                        placeholder="搜索文件名称"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button onClick={handleSearch}>搜索</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        上传文件
                    </Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={editingRecord ? '编辑文件' : '上传文件'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={submitting}
                width={500}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="文件名称"
                        rules={[{ required: true, message: '请输入文件名称' }]}
                    >
                        <Input placeholder="请输入文件名称" maxLength={200} />
                    </Form.Item>
                    <Form.Item
                        name="version"
                        label="版本号"
                        rules={[{ required: true, message: '请输入版本号' }]}
                    >
                        <Input placeholder="请输入版本号，如 V1.0" maxLength={20} />
                    </Form.Item>
                    <Form.Item name="category" label="分类">
                        <Select placeholder="请选择分类" allowClear>
                            {Object.entries(DOCUMENT_CATEGORY_MAP).map(([key, value]) => (
                                <Select.Option key={key} value={key}>
                                    {value.text}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea rows={3} placeholder="请输入文件描述" maxLength={500} showCount />
                    </Form.Item>
                    <Form.Item
                        label="附件"
                        required={!editingRecord}
                        extra={editingRecord ? '不选择新文件则保留原文件' : '支持 doc/docx/xls/xlsx/pdf/ppt/pptx 等格式，最大50MB'}
                    >
                        <Upload {...uploadProps} maxCount={1}>
                            <Button icon={<UploadOutlined />}>
                                {editingRecord ? '选择新文件(可选)' : '选择文件'}
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SystemDocuments;
