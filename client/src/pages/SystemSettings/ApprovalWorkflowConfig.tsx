import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, InputNumber, message, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { APPROVAL_WORKFLOW_CONFIG, type BusinessType, type ApprovalRole, BUSINESS_TYPE_MAP } from '../../services/approvalService';

const { Option } = Select;

interface WorkflowLevel {
    level: number;
    role: ApprovalRole;
    name: string;
}

interface WorkflowConfig {
    id: string;
    businessType: BusinessType;
    name: string;
    levels: WorkflowLevel[];
}

const ApprovalWorkflowConfig: React.FC = () => {
    // 初始化工作流配置数据
    const initialWorkflows: WorkflowConfig[] = Object.entries(APPROVAL_WORKFLOW_CONFIG).map(([key, config]) => ({
        id: key,
        businessType: key as BusinessType,
        name: config.name,
        levels: config.levels
    }));

    const [workflows, setWorkflows] = useState<WorkflowConfig[]>(initialWorkflows);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<WorkflowConfig | null>(null);
    const [form] = Form.useForm();

    const roleOptions: { value: ApprovalRole; label: string }[] = [
        { value: 'sales_manager', label: '销售经理' },
        { value: 'finance', label: '财务' },
        { value: 'lab_director', label: '实验室负责人' },
        { value: 'technical_director', label: '技术负责人' },
        { value: 'quality_manager', label: '质量负责人' },
    ];

    const handleEdit = (record: WorkflowConfig) => {
        setEditingWorkflow(record);
        form.setFieldsValue({
            name: record.name,
            levels: record.levels
        });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingWorkflow) {
                const updatedWorkflows = workflows.map(w =>
                    w.id === editingWorkflow.id
                        ? { ...w, name: values.name, levels: values.levels }
                        : w
                );
                setWorkflows(updatedWorkflows);
                message.success('审批流程配置已更新');
            }
            setIsModalOpen(false);
            setEditingWorkflow(null);
            form.resetFields();
        });
    };

    const columns: ColumnsType<WorkflowConfig> = [
        {
            title: '业务类型',
            dataIndex: 'businessType',
            key: 'businessType',
            width: 150,
            render: (type: BusinessType) => {
                const typeInfo = BUSINESS_TYPE_MAP[type];
                return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
            }
        },
        {
            title: '流程名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '审批级别',
            key: 'levels',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.levels.map((level, index) => (
                        <Tag key={index} color="blue">
                            第{level.level}级: {level.name}
                        </Tag>
                    ))}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Card title="审批流程配置" bordered={false}>
            <Table
                columns={columns}
                dataSource={workflows}
                rowKey="id"
                pagination={false}
            />

            <Modal
                title="编辑审批流程"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingWorkflow(null);
                    form.resetFields();
                }}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="流程名称"
                        rules={[{ required: true, message: '请输入流程名称' }]}
                    >
                        <Input placeholder="请输入流程名称" />
                    </Form.Item>

                    <Form.List name="levels">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...field}
                                            label={`第${index + 1}级`}
                                            name={[field.name, 'level']}
                                            initialValue={index + 1}
                                            hidden
                                        >
                                            <InputNumber />
                                        </Form.Item>

                                        <Form.Item
                                            {...field}
                                            label="审批角色"
                                            name={[field.name, 'role']}
                                            rules={[{ required: true, message: '请选择审批角色' }]}
                                            style={{ width: 200 }}
                                        >
                                            <Select placeholder="选择审批角色">
                                                {roleOptions.map(option => (
                                                    <Option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...field}
                                            label="级别名称"
                                            name={[field.name, 'name']}
                                            rules={[{ required: true, message: '请输入级别名称' }]}
                                            style={{ width: 200 }}
                                        >
                                            <Input placeholder="如：销售经理" />
                                        </Form.Item>

                                        {fields.length > 1 && (
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => remove(field.name)}
                                                icon={<DeleteOutlined />}
                                            >
                                                删除
                                            </Button>
                                        )}
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add({ level: fields.length + 1 })}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        添加审批级别
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </Card>
    );
};

export default ApprovalWorkflowConfig;
