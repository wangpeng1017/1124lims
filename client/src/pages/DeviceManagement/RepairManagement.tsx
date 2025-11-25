const [dataSource, setDataSource] = useState<IRepairRecord[]>(repairRecordData);
const [isModalOpen, setIsModalOpen] = useState(false);
const [form] = Form.useForm();
const [editingId, setEditingId] = useState<string | null>(null);

const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
};

const handleEdit = (record: IRepairRecord) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
};

const handleDelete = (id: string) => {
    setDataSource(prev => prev.filter(item => item.id !== id));
    message.success('删除成功');
};

const handleOk = async () => {
    try {
        const values = await form.validateFields();

        if (editingId) {
            setDataSource(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
            message.success('更新成功');
        } else {
            const newId = `RR${String(dataSource.length + 1).padStart(3, '0')}`;
            const device = deviceData.find(d => d.id === values.deviceId);
            const newRecord: IRepairRecord = {
                id: newId,
                ...values,
                deviceName: device?.name || '',
                status: 'pending',
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
                laborCost: 0,
                partsCost: 0,
                otherCost: 0,
                totalCost: 0
            };
            setDataSource(prev => [newRecord, ...prev]);
            message.success('报修成功');
        }
        setIsModalOpen(false);
    } catch (error) {
        console.error('Validate Failed:', error);
    }
};

const columns: ColumnsType<IRepairRecord> = [
    { title: '维修单号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
    { title: '故障描述', dataIndex: 'faultDescription', key: 'faultDescription', width: 200, ellipsis: true },
    {
        title: '严重程度',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
        render: (severity) => {
            const colorMap: any = { low: 'blue', medium: 'orange', high: 'red', critical: 'magenta' };
            const textMap: any = { low: '低', medium: '中', high: '高', critical: '紧急' };
            return <Tag color={colorMap[severity]}>{textMap[severity]}</Tag>;
        }
    },
    { title: '报修人', dataIndex: 'reportedBy', key: 'reportedBy', width: 100 },
    { title: '报修日期', dataIndex: 'reportDate', key: 'reportDate', width: 120, render: (text) => text?.substring(0, 10) },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => {
            const map: any = { pending: '待处理', 'in-progress': '维修中', completed: '已完成', cancelled: '已取消' };
            const colorMap: any = { pending: 'orange', 'in-progress': 'blue', completed: 'green', cancelled: 'default' };
            return <Tag color={colorMap[status]}>{map[status]}</Tag>;
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 150,
        render: (_, record) => (
            <Space size="middle">
                <a onClick={() => handleEdit(record)}>编辑</a>
                <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                    <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>
            </Space>
        ),
    },
];

return (
    <Card title="设备维修管理">
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>故障报修</Button>
        </div>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />

        <Modal title={editingId ? "编辑维修记录" : "故障报修"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={800}>
            <Form form={form} layout="vertical">
                <Form.Item name="deviceId" label="选择设备" rules={[{ required: true }]}>
                    <Select showSearch optionFilterProp="children">
                        {deviceData.map(d => (
                            <Select.Option key={d.id} value={d.id}>{d.name} ({d.code})</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="faultDescription" label="故障描述" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="faultType" label="故障类型" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="hardware">硬件故障</Select.Option>
                        <Select.Option value="software">软件故障</Select.Option>
                        <Select.Option value="other">其他</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="severity" label="严重程度" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="low">低</Select.Option>
                        <Select.Option value="medium">中</Select.Option>
                        <Select.Option value="high">高</Select.Option>
                        <Select.Option value="critical">紧急</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="faultDate" label="故障发生日期" rules={[{ required: true }]}>
                    <Input type="date" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="reportedBy" label="报修人" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="reportDate" label="报修日期" rules={[{ required: true }]}>
                    <Input type="date" style={{ width: '100%' }} />
                </Form.Item>

                {editingId && (
                    <>
                        <Form.Item name="status" label="维修状态">
                            <Select>
                                <Select.Option value="pending">待处理</Select.Option>
                                <Select.Option value="in-progress">维修中</Select.Option>
                                <Select.Option value="completed">已完成</Select.Option>
                                <Select.Option value="cancelled">已取消</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="repairMethod" label="维修方法">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <Form.Item name="repairer" label="维修人员">
                            <Input />
                        </Form.Item>
                        <Space>
                            <Form.Item name="laborCost" label="人工费">
                                <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item name="partsCost" label="配件费">
                                <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item name="otherCost" label="其他费用">
                                <InputNumber min={0} />
                            </Form.Item>
                        </Space>
                    </>
                )}
            </Form>
        </Modal>
    </Card>
);
};

export default RepairManagement;
