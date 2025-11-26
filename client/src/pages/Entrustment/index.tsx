import React, { useState } from 'react';
import { Table, Card, Tag, Space, Button, Modal, Form, Input, Popconfirm, message, Tooltip, Select } from 'antd';
import { SearchOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { entrustmentData } from '../../mock/entrustment';
import type { IEntrustmentRecord } from '../../mock/entrustment';
import { detectionParametersData } from '../../mock/basicParameters';

const Entrustment: React.FC = () => {
    const [dataSource, setDataSource] = useState<IEntrustmentRecord[]>(entrustmentData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<IEntrustmentRecord | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: IEntrustmentRecord) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleGenerateLink = (record: IEntrustmentRecord) => {
        const link = `${window.location.origin}/fill/${record.entrustmentId}`;
        Modal.info({
            title: '生成外部链接',
            content: (
                <div>
                    <p>委托单: {record.entrustmentId}</p>
                    <p>外部链接已生成:</p>
                    <a href={link} target="_blank" rel="noreferrer">{link}</a>
                </div>
            ),
            onOk() { },
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Sync testItems string with testParams array
            const testItemsStr = values.testParams ? values.testParams.join('、') : values.testItems;
            const finalValues = { ...values, testItems: testItemsStr, assignmentMode: 'manual' };

            if (editingRecord) {
                setDataSource(prev => prev.map(item => item.id === editingRecord.id ? { ...item, ...finalValues } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(d => d.id), 0) + 1;
                setDataSource(prev => [{ id: newId, ...finalValues }, ...prev]);
                message.success('添加成功');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const columns: ColumnsType<IEntrustmentRecord> = [
        { title: '序号', dataIndex: 'id', key: 'id', width: 70 },
        {
            title: '委托编号',
            dataIndex: 'entrustmentId',
            key: 'entrustmentId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索委托编号"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={() => clearFilters && clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.entrustmentId
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
            render: (text, record) => <a onClick={() => navigate(`/entrustment/order/${record.id}`)}>{text}</a>,
        },
        {
            title: '合同编号',
            dataIndex: 'contractNo',
            key: 'contractNo',
        },
        {
            title: '检测报告编号',
            dataIndex: 'reportId',
            key: 'reportId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索报告编号"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={() => clearFilters && clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.reportId
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
        },
        { title: '送样时间', dataIndex: 'sampleDate', key: 'sampleDate' },
        { title: '试验时间', dataIndex: 'testDate', key: 'testDate' },
        {
            title: '样件名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <Input
                        placeholder="搜索样件名称"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={() => clearFilters && clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.sampleName
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
        },
        { title: '试验项目', dataIndex: 'testItems', key: 'testItems', ellipsis: true },
        {
            title: '跟单人',
            dataIndex: 'follower',
            key: 'follower',
            filters: Array.from(new Set(dataSource.map(d => d.follower))).map(f => ({ text: f, value: f })),
            onFilter: (value, record) => record.follower === value,
            render: (text) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="生成外部链接">
                        <a onClick={() => handleGenerateLink(record)}><LinkOutlined /></a>
                    </Tooltip>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="委托单管理"
            extra={<Button type="primary" onClick={handleAdd}>新建委托</Button>}
        >
            <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={{ pageSize: 10 }} />

            <Modal title={editingRecord ? "编辑委托" : "新建委托"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="entrustmentId" label="委托编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contractNo" label="合同编号">
                        <Input />
                    </Form.Item>
                    <Form.Item name="reportId" label="检测报告编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sampleDate" label="送样时间" rules={[{ required: true }]}>
                        <Input placeholder="YYYY.MM.DD" />
                    </Form.Item>
                    <Form.Item name="testDate" label="试验时间" rules={[{ required: true }]}>
                        <Input placeholder="YYYY.MM.DD" />
                    </Form.Item>
                    <Form.Item name="sampleName" label="样件名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="testParams" label="检测项目" rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            placeholder="请选择检测参数"
                            optionFilterProp="children"
                        >
                            {detectionParametersData.map(param => (
                                <Select.Option key={param.id} value={param.name}>
                                    {param.name} ({param.method})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="follower" label="跟进人" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Entrustment;
