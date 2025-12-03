import React from 'react';
import { Select, Tag, Alert, Descriptions } from 'antd';
import { capabilityData, type Capability } from '../mock/personnel';

interface PersonSelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    employees: Array<{ id: number | string; name: string; position: string }>;
}

const PersonSelector: React.FC<PersonSelectorProps> = ({
    value,
    onChange,
    placeholder = '请选择人员',
    disabled = false,
    employees
}) => {
    const [selectedPerson, setSelectedPerson] = React.useState<string | undefined>(value);
    const [capabilities, setCapabilities] = React.useState<Capability[]>([]);

    React.useEffect(() => {
        setSelectedPerson(value);
        if (value) {
            const personCapabilities = capabilityData.filter(cap => cap.empName === value);
            setCapabilities(personCapabilities);
        } else {
            setCapabilities([]);
        }
    }, [value]);

    const handleChange = (newValue: string) => {
        setSelectedPerson(newValue);
        const personCapabilities = capabilityData.filter(cap => cap.empName === newValue);
        setCapabilities(personCapabilities);
        onChange?.(newValue);
    };

    // 判断证书是否过期
    const isExpired = (expiryDate: string): boolean => {
        return new Date(expiryDate) < new Date();
    };

    // 判断是否即将过期(30天内)
    const isExpiringSoon = (expiryDate: string): boolean => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return expiry > now && expiry <= thirtyDaysLater;
    };

    // 获取人员的资质状态
    const getPersonQualificationStatus = (personName: string) => {
        const personCaps = capabilityData.filter(cap => cap.empName === personName);

        if (personCaps.length === 0) {
            return { hasQualification: false, isExpired: false, isExpiringSoon: false };
        }

        const hasExpired = personCaps.some(cap => isExpired(cap.expiryDate));
        const hasExpiringSoon = personCaps.some(cap => isExpiringSoon(cap.expiryDate));

        return {
            hasQualification: true,
            isExpired: hasExpired,
            isExpiringSoon: hasExpiringSoon && !hasExpired
        };
    };

    // 渲染选项
    const renderOption = (emp: { id: number | string; name: string; position: string }) => {
        const status = getPersonQualificationStatus(emp.name);
        const personCaps = capabilityData.filter(cap => cap.empName === emp.name);

        return (
            <Select.Option key={emp.id} value={emp.name}>
                <div>
                    <div>
                        {emp.name} - {emp.position}
                        {/* 资质状态标签 */}
                        {status.isExpired && (
                            <Tag color="red" style={{ marginLeft: 8 }}>证书已过期</Tag>
                        )}
                        {status.isExpiringSoon && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>即将过期</Tag>
                        )}
                        {!status.hasQualification && (
                            <Tag color="default" style={{ marginLeft: 8 }}>无相关资质</Tag>
                        )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {status.hasQualification ? (
                            <>
                                资质: {personCaps.map(c => c.parameter).join('、')} |
                                证书: {personCaps[0]?.certificate} |
                                有效期至: {personCaps[0]?.expiryDate}
                            </>
                        ) : (
                            <span style={{ color: '#999' }}>暂无相关资质信息</span>
                        )}
                    </div>
                </div>
            </Select.Option>
        );
    };

    // 渲染选中后的资质详情
    const renderQualificationDetails = () => {
        if (!selectedPerson) return null;

        const status = getPersonQualificationStatus(selectedPerson);

        return (
            <div style={{ marginTop: 16 }}>
                {/* 无资质警告 */}
                {!status.hasQualification && (
                    <Alert
                        type="warning"
                        showIcon
                        message="人员资质提醒"
                        description="该人员暂无相关检测资质,请谨慎分配任务。"
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* 证书过期警告 */}
                {status.isExpired && (
                    <Alert
                        type="error"
                        showIcon
                        message="证书已过期"
                        description="该人员的检测证书已过期,不建议分配任务。"
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* 即将过期提醒 */}
                {status.isExpiringSoon && (
                    <Alert
                        type="warning"
                        showIcon
                        message="证书即将过期"
                        description={`该人员的检测证书将于 ${capabilities[0]?.expiryDate} 过期,请注意更新。`}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* 资质详情 */}
                {status.hasQualification && (
                    <Alert
                        type="info"
                        message="人员资质信息"
                        description={
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="检测能力">
                                    {capabilities.map(c => c.parameter).join('、')}
                                </Descriptions.Item>
                                <Descriptions.Item label="证书">
                                    {capabilities[0]?.certificate}
                                </Descriptions.Item>
                                <Descriptions.Item label="有效期">
                                    {capabilities[0]?.expiryDate}
                                    {status.isExpiringSoon && (
                                        <Tag color="orange" style={{ marginLeft: 8 }}>30天内到期</Tag>
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                    />
                )}
            </div>
        );
    };

    return (
        <>
            <Select
                value={selectedPerson}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
            >
                {employees.map(emp => renderOption(emp))}
            </Select>
            {renderQualificationDetails()}
        </>
    );
};

export default PersonSelector;
