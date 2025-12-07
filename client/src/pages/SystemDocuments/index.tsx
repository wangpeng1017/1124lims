import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Modal, Form, Upload, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined, DeleteOutlined, EditOutlined, DownloadOutlined, FileWordOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { systemDocumentsData } from '../../mock/systemDocuments';
import type { ISystemDocument } from '../../mock/systemDocuments';
import { useAuth } from '../../hooks/useAuth';

const SystemDocuments: React.FC = () => {
    const { canDelete } = useAuth();

    const [dataSource, setDataSource] = useState<ISystemDocument[]>(systemDocumentsData);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        const filtered = systemDocumentsData.filter(item =>
            item.name.includes(value) || item.attachmentName.includes(value)
        );
        setDataSource(filtered);
    };

    const handleAdd = () => {
        setEditingId(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: ISystemDocument) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setFileList([{
            uid: '-1',
            name: record.attachmentName,
            status: 'done',
        }]);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (fileList.length === 0) {
                message.error('请上传附件');
                return;
            }

            const attachmentName = fileList[0].name;
            const now = new Date().toISOString().split('T')[0];

            if (editingId) {
                setDataSource(prev => prev.map(item =>
                    item.id === editingId
                        ? { ...item, ...values, attachmentName }
                        : item
                ));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
                const newItem: ISystemDocument = {
                    id: newId,
                    ...values,
                    attachmentName,
                    uploadTime: now,
                    uploader: '当前用户' // Mock user
                };
                setDataSource(prev => [newItem, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'doc' || ext === 'docx') return <FileWordOutlined style={{ color: '#1890ff' }} />;
        if (ext === 'xls' || ext === 'xlsx') return <FileExcelOutlined style={{ color: '#52c41a' }} />;
        if (ext === 'pdf') return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
        return <FileTextOutlined />;
    };

    const columns: ColumnsType<ISystemDocument> = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
        { title: '文件名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
        {
            title: '附件',
            dataIndex: 'attachmentName',
            key: 'attachmentName',
            render: (text) => (
                <Space>
                    {getFileIcon(text)}
                    <a onClick={() => message.success(`开始下载: ${text}`)}>{text}</a>
                </Space>
            )
        },
        { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
        { title: '上传人', dataIndex: 'uploader', key: 'uploader', width: 120 },
        { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 150 },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="下载">
                        <Button type="text" icon={<DownloadOutlined />} onClick={() => message.success(`开始下载: ${record.attachmentName}`)} />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    {canDelete && (
                        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ];

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file: UploadFile) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    return (
        <Card title="体系文件管理" extra={
            <Space>
                <Input
                    placeholder="搜索文件名称"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    上传文件
                </Button>
            </Space>
        }>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingId ? "编辑文件" : "上传文件"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="文件名称" rules={[{ required: true, message: '请输入文件名称' }]}>
                        <Input placeholder="请输入文件名称" />
                    </Form.Item>
                    <Form.Item name="version" label="版本" rules={[{ required: true, message: '请输入版本号' }]}>
                        <Input placeholder="请输入版本号，如 V1.0" />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea rows={3} placeholder="请输入文件描述" />
                    </Form.Item>
                    <Form.Item label="附件" required>
                        <Upload {...uploadProps} maxCount={1}>
                            <Button icon={<UploadOutlined />}>选择文件</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default SystemDocuments;
