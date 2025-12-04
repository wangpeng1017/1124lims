import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { TEST_PURPOSE_MAP, type IConsultation } from '../../mock/consultation';
import { clientData } from '../../mock/entrustment';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ConsultationFormProps {
    visible: boolean;
    consultation: IConsultation | null;
    onCancel: () => void;
    onSave: (values: Partial<IConsultation>) => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
    visible,
    consultation,
    onCancel,
    onSave
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        if (visible) {
            if (consultation) {
                // 编辑模式 - 填充表单
                form.setFieldsValue({
                    ...consultation,
                    expectedDeadline: consultation.expectedDeadline ? dayjs(consultation.expectedDeadline) : null
                });
                // 恢复附件列表
                if (consultation.attachments) {
                    const files = consultation.attachments.map(att => ({
                        uid: att.id,
                        name: att.fileName,
                        status: 'done',
                        url: att.fileUrl
                    }));
                    setFileList(files);
                }
            } else {
                // 新建模式 - 重置表单
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, consultation, form]);

    const handleClientSelect = (value: string) => {
        const client = clientData.find(c => c.name === value);
        if (client) {
            form.setFieldsValue({
                clientContact: client.contactPerson,
                clientTel: client.contactPhone,
                clientAddress: client.address
            });
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // 处理附件数据
            const attachments = fileList.map((file, index) => ({
                id: file.uid || `att_${Date.now()}_${index}`,
                fileName: file.name,
                fileUrl: file.url || `/uploads/consultations/${file.name}`,
                fileSize: file.size || 0,
                uploadTime: new Date().toISOString(),
                uploadBy: '当前用户'
            }));

            const formattedValues = {
                ...values,
                expectedDeadline: values.expectedDeadline ? values.expectedDeadline.format('YYYY-MM-DD') : undefined,
                attachments: attachments.length > 0 ? attachments : undefined
            };
            onSave(formattedValues);
            form.resetFields();
            setFileList([]);
        }).catch(info => {
            console.log('验证失败:', info);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    return (
        <Modal
            title={consultation ? '编辑咨询' : '新建咨询'}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={900}
            okText="保存"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    urgencyLevel: 'normal',
                    testPurpose: 'quality_inspection'
                }}
            >
                {/* 客户信息 */}
                <div style={{ marginBottom: 16, fontWeight: 'bold', fontSize: 16 }}>客户信息</div>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="clientCompany"
                            label="客户公司"
                            rules={[{ required: true, message: '请输入或选择客户公司' }]}
                        >
                            <Select
                                showSearch
                                placeholder="选择或输入客户公司"
                                optionFilterProp="children"
                                onChange={handleClientSelect}
                                dropdownRender={menu => (
                                    <>
                                        {menu}
                                        <div style={{ padding: 8, color: '#999', fontSize: 12 }}>
                                            可从委托单位库选择或直接输入
                                        </div>
                                    </>
                                )}
                            >
                                {clientData.map(client => (
                                    <Option key={client.id} value={client.name}>
                                        {client.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="clientContact"
                            label="联系人"
                            rules={[{ required: true, message: '请输入联系人' }]}
                        >
                            <Input placeholder="请输入联系人" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="clientTel"
                            label="联系电话"
                            rules={[
                                { required: true, message: '请输入联系电话' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                            ]}
                        >
                            <Input placeholder="请输入联系电话" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="clientEmail"
                            label="邮箱"
                            rules={[
                                { type: 'email', message: '请输入正确的邮箱地址' }
                            ]}
                        >
                            <Input placeholder="请输入邮箱" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="clientAddress"
                            label="地址"
                        >
                            <Input placeholder="请输入地址" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 样品信息 */}
                <div style={{ marginBottom: 16, marginTop: 24, fontWeight: 'bold', fontSize: 16 }}>样品信息</div>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="sampleName"
                            label="样品名称"
                            rules={[{ required: true, message: '请输入样品名称' }]}
                        >
                            <Input placeholder="请输入样品名称" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="sampleModel"
                            label="样品型号/规格"
                        >
                            <Input placeholder="请输入样品型号/规格" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="sampleMaterial"
                            label="样品材质"
                        >
                            <Input placeholder="请输入样品材质" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="estimatedQuantity"
                            label="预计数量"
                        >
                            <InputNumber
                                min={1}
                                placeholder="请输入预计数量"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 检测需求 */}
                <div style={{ marginBottom: 16, marginTop: 24, fontWeight: 'bold', fontSize: 16 }}>检测需求</div>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="testItems"
                            label="检测项目"
                            rules={[{ required: true, message: '请选择或输入检测项目' }]}
                        >
                            <Select
                                mode="tags"
                                placeholder="请选择或输入检测项目（可多选）"
                                style={{ width: '100%' }}
                            >
                                <Option value="拉伸强度测试">拉伸强度测试</Option>
                                <Option value="金相分析">金相分析</Option>
                                <Option value="硬度测试">硬度测试</Option>
                                <Option value="化学成分分析">化学成分分析</Option>
                                <Option value="弯曲试验">弯曲试验</Option>
                                <Option value="冲击试验">冲击试验</Option>
                                <Option value="盐雾试验">盐雾试验</Option>
                                <Option value="耐腐蚀性能">耐腐蚀性能</Option>
                                <Option value="焊缝检验">焊缝检验</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="testPurpose"
                            label="检测目的"
                            rules={[{ required: true, message: '请选择检测目的' }]}
                        >
                            <Select placeholder="请选择检测目的">
                                {Object.entries(TEST_PURPOSE_MAP).map(([key, value]) => (
                                    <Option key={key} value={key}>{value}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="urgencyLevel"
                            label="紧急程度"
                            rules={[{ required: true, message: '请选择紧急程度' }]}
                        >
                            <Select placeholder="请选择紧急程度">
                                <Option value="normal">普通</Option>
                                <Option value="urgent">紧急</Option>
                                <Option value="very_urgent">非常紧急</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="expectedDeadline"
                            label="期望完成时间"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="请选择期望完成时间"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 其他信息 */}
                <div style={{ marginBottom: 16, marginTop: 24, fontWeight: 'bold', fontSize: 16 }}>其他信息</div>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="budgetRange"
                            label="预算范围"
                        >
                            <Input placeholder="例如: 5000-10000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="follower"
                            label="跟进人"
                            rules={[{ required: true, message: '请选择跟进人' }]}
                        >
                            <Select placeholder="请选择跟进人">
                                <Option value="张馨">张馨</Option>
                                <Option value="李四">李四</Option>
                                <Option value="王五">王五</Option>
                                <Option value="赵六">赵六</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="clientRequirements"
                            label="客户特殊要求"
                        >
                            <TextArea
                                rows={3}
                                placeholder="请输入客户特殊要求"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="附件上传"
                            tooltip="可上传客户提供的截图、文件等资料"
                        >
                            <Upload
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    const isValidType = [
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'image/jpeg',
                                        'image/png'
                                    ].includes(file.type);
                                    if (!isValidType) {
                                        message.error('只支持 PDF、Word、JPG、PNG 格式文件!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        message.error('文件大小不能超过 10MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    setFileList([...fileList, file]);
                                    return false;
                                }}
                                onRemove={(file) => {
                                    setFileList(fileList.filter(f => f.uid !== file.uid));
                                }}
                                maxCount={5}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>选择文件</Button>
                            </Upload>
                            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                                支持 PDF、Word、图片格式,最多5个文件,单个文件不超过10MB
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ConsultationForm;
