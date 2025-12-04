import React, { useEffect } from 'react';
import { Modal, Form, Select, DatePicker, Input } from 'antd';
import { FOLLOW_UP_TYPE_MAP, type FollowUpRecord } from '../../mock/consultation';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface FollowUpModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (record: Omit<FollowUpRecord, 'id'>) => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({
    visible,
    onCancel,
    onSave
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            // 设置默认值
            form.setFieldsValue({
                date: dayjs(),
                type: 'phone',
                operator: '当前用户'
            });
        }
    }, [visible, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            const record: Omit<FollowUpRecord, 'id'> = {
                date: values.date.format('YYYY-MM-DD HH:mm:ss'),
                type: values.type,
                content: values.content,
                nextAction: values.nextAction,
                operator: values.operator
            };
            onSave(record);
            form.resetFields();
        }).catch(info => {
            console.log('验证失败:', info);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="添加跟进记录"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            okText="保存"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="date"
                    label="跟进日期"
                    rules={[{ required: true, message: '请选择跟进日期' }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="请选择跟进日期"
                    />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="跟进方式"
                    rules={[{ required: true, message: '请选择跟进方式' }]}
                >
                    <Select placeholder="请选择跟进方式">
                        {Object.entries(FOLLOW_UP_TYPE_MAP).map(([key, value]) => (
                            <Option key={key} value={key}>{value}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="跟进内容"
                    rules={[
                        { required: true, message: '请输入跟进内容' },
                        { min: 10, message: '跟进内容不能少于10个字' },
                        { max: 500, message: '跟进内容不能超过500个字' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="请详细描述本次跟进的内容..."
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    name="nextAction"
                    label="下一步行动"
                >
                    <TextArea
                        rows={2}
                        placeholder="请输入下一步行动计划（选填）"
                        maxLength={200}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    name="operator"
                    label="操作人"
                    rules={[{ required: true, message: '请选择操作人' }]}
                >
                    <Select placeholder="请选择操作人">
                        <Option value="张馨">张馨</Option>
                        <Option value="李四">李四</Option>
                        <Option value="王五">王五</Option>
                        <Option value="赵六">赵六</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FollowUpModal;
