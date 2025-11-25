import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { inspectionStandardsData, detectionParametersData } from '../../../mock/basicParameters';
import type { InspectionStandard } from '../../../mock/basicParameters';
import { deviceData } from '../../../mock/devices';
import { employeeData } from '../../../mock/personnel';

const InspectionStandards: React.FC = () => {
    const [dataSource, setDataSource] = useState<InspectionStandard[]>(inspectionStandardsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<InspectionStandard | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: InspectionStandard) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        message.success('删除成功');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingRecord) {
                setDataSource(dataSource.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
                message.success('更新成功');
            } else {
                const newId = Math.max(...dataSource.map(item => item.id), 0) + 1;
                setDataSource([...dataSource, { id: newId, ...values }]);
                message.success('创建成功');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<InspectionStandard> = [
        { title: '标准/依据名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '编号', dataIndex: 'standardNo', key: 'standardNo', width: 150 },
        { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '有效性',
            dataIndex: 'validity',
            key: 'validity',
            render: (text) => <Tag color={text === '现行有效' ? 'success' : 'default'}>{text}</Tag>,
            width: 100
        },
        {
            title: '关联设备',
            dataIndex: 'devices',
            key: 'devices',
            render: (devices: string[]) => (
                <>
                    {devices && devices.map(device => (
                        <Tag color="blue" key={device}>{device}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '检测参数/项目',
            dataIndex: 'parameters',
            key: 'parameters',
            render: (params: string[]) => (
                <>
                    {params && params.map(param => (
                        <Tag color="cyan" key={param}>{param}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '可检测人员',
            dataIndex: 'personnel',
            key: 'personnel',
            render: (people: string[]) => (
                <>
                    {people && people.map(person => (
                        <Tag color="purple" key={person}>{person}</Tag>
                    ))}
                </>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </Space>
            ),
            width: 120
        },
    ];

    return (
        <Card title="检查标准/依据管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增标准</Button>}>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
            <Modal
                title={editingRecord ? "编辑标准" : "新增标准"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="标准/依据名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="standardNo" label="编号" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="validity" label="有效性" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="现行有效">现行有效</Select.Option>
                            <Select.Option value="作废">作废</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="devices" label="关联设备">
                        <Select mode="multiple" placeholder="请选择关联设备">
                            {deviceData.map(d => (
                                <Select.Option key={d.id} value={d.name}>{d.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="parameters" label="检测参数/项目">
                        <Select mode="multiple" placeholder="请选择检测参数">
                            {detectionParametersData.map(p => (
                                <Select.Option key={p.id} value={p.name}>{p.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="personnel" label="可检测人员">
                        <Select mode="multiple" placeholder="请选择人员">
                            {employeeData.map(e => (
                                <Select.Option key={e.id} value={e.name}>{e.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default InspectionStandards;
