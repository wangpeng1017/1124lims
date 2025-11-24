// 委外/分包管理 Mock 数据

// 供应商信息
export interface ISupplier {
    id: number;
    supplierCode: string;
    name: string;
    level: 'A' | 'B' | 'C';
    contactPerson: string;
    contactPhone: string;
    contactEmail?: string;
    address: string;
    qualification: string;
    qualificationFile?: string;
    capabilityScope: string;
    status: '启用' | '停用';
    remark?: string;
    creator: string;
    createTime: string;
}

// 供应商能力值
export interface ISupplierCapability {
    id: number;
    supplierId: number;
    supplierName: string;
    parameterId: number;
    parameterName: string;
    certificateNo: string;
    validFrom: string;
    validTo: string;
    status: '有效' | '过期';
    remark?: string;
}

// 委外单（委托单维度）
export interface IOutsourceOrder {
    id: number;
    outsourceNo: string;
    entrustmentId: string;
    sampleIds: string[];
    sampleCount: number;
    supplierId: number;
    supplierName: string;
    pricePerSample: number;
    totalPrice: number;
    sendDate?: string;
    trackingNo?: string;
    receivedDate?: string;
    approvalStatus: '待审批' | '已通过' | '已拒绝';
    approvalId?: string;
    status: '待确认' | '已发送' | '检测中' | '已完成' | '已终止';
    assignedBy: string;
    assignDate: string;
    expectedReturnDate?: string;
    remark?: string;
}

// 委外单（参数维度）
export interface IOutsourceParameter {
    id: number;
    outsourceNo: string;
    parameterId: number;
    parameterName: string;
    sampleIds: string[];
    supplierId: number;
    supplierName: string;
    pricePerSample: number;
    totalPrice: number;
    qualifiedSuppliers: number[];
    sendDate?: string;
    trackingNo?: string;
    receivedDate?: string;
    approvalStatus: '待审批' | '已通过' | '已拒绝';
    approvalId?: string;
    status: '待确认' | '已发送' | '检测中' | '已完成' | '已终止';
    assignedBy: string;
    assignDate: string;
    remark?: string;
}

// 委外检测结果
export interface IOutsourceResult {
    id: number;
    outsourceNo: string;
    outsourceType: '委托单' | '参数';
    sampleNo: string;
    parameterName: string;
    testValue: string;
    testDate: string;
    testPerson: string;
    reviewStatus: '待审核' | '已通过' | '已拒绝';
    reviewer?: string;
    reviewDate?: string;
    reviewRemark?: string;
    createBy: string;
    createTime: string;
}

// Mock 数据
export const supplierData: ISupplier[] = [
    { id: 1, supplierCode: 'SUP001', name: '华测检测认证集团股份有限公司', level: 'A', contactPerson: '李经理', contactPhone: '021-12345678', contactEmail: 'li@cti-cert.com', address: '上海市浦东新区张江高科技园区', qualification: 'CNAS L0001', capabilityScope: '金属材料、环境检测、食品安全', status: '启用', creator: 'Admin', createTime: '2023-01-15' },
    { id: 2, supplierCode: 'SUP002', name: '中国检验认证集团', level: 'A', contactPerson: '王主任', contactPhone: '010-88888888', address: '北京市朝阳区建国门外大街', qualification: 'CNAS L0002', capabilityScope: '机械性能、化学分析、无损检测', status: '启用', creator: 'Admin', createTime: '2023-02-20' },
    { id: 3, supplierCode: 'SUP003', name: '苏州市产品质量监督检验所', level: 'B', contactPerson: '张工', contactPhone: '0512-66666666', address: '江苏省苏州市工业园区', qualification: 'CNAS L0103', capabilityScope: '塑料材料、橡胶测试', status: '启用', creator: 'Admin', createTime: '2023-03-10' },
    { id: 4, supplierCode: 'SUP004', name: '上海材料研究所', level: 'B', contactPerson: '赵博士', contactPhone: '021-55555555', address: '上海市杨浦区', qualification: 'CNAS L0204', capabilityScope: '金相分析、热处理', status: '停用', remark: '资质到期', creator: 'Admin', createTime: '2022-11-01' },
];

export const supplierCapabilityData: ISupplierCapability[] = [
    { id: 1, supplierId: 1, supplierName: '华测检测认证集团股份有限公司', parameterId: 1, parameterName: '拉伸强度', certificateNo: 'CERT-2023-001', validFrom: '2023-01-01', validTo: '2025-12-31', status: '有效' },
    { id: 2, supplierId: 1, supplierName: '华测检测认证集团股份有限公司', parameterId: 4, parameterName: '中性盐雾', certificateNo: 'CERT-2023-002', validFrom: '2023-01-01', validTo: '2025-12-31', status: '有效' },
    { id: 3, supplierId: 2, supplierName: '中国检验认证集团', parameterId: 2, parameterName: '弯曲性能', certificateNo: 'CERT-2023-101', validFrom: '2023-02-01', validTo: '2026-01-31', status: '有效' },
    { id: 4, supplierId: 2, supplierName: '中国检验认证集团', parameterId: 5, parameterName: '金相组织', certificateNo: 'CERT-2023-102', validFrom: '2023-02-01', validTo: '2026-01-31', status: '有效' },
    { id: 5, supplierId: 3, supplierName: '苏州市产品质量监督检验所', parameterId: 3, parameterName: '燃烧性能', certificateNo: 'CERT-2023-201', validFrom: '2023-03-01', validTo: '2024-02-28', status: '有效' },
    { id: 6, supplierId: 4, supplierName: '上海材料研究所', parameterId: 5, parameterName: '金相组织', certificateNo: 'CERT-2022-301', validFrom: '2022-11-01', validTo: '2023-10-31', status: '过期' },
];

export const outsourceOrderData: IOutsourceOrder[] = [
    { id: 1, outsourceNo: 'WW-20231115-001', entrustmentId: '202311001', sampleIds: ['S2023110101', 'S2023110102'], sampleCount: 2, supplierId: 1, supplierName: '华测检测认证集团股份有限公司', pricePerSample: 500, totalPrice: 1000, sendDate: '2023-11-16', trackingNo: 'SF1234567890', approvalStatus: '已通过', approvalId: 'DD-20231115-001', status: '检测中', assignedBy: '吴凡', assignDate: '2023-11-15', expectedReturnDate: '2023-11-30' },
    { id: 2, outsourceNo: 'WW-20231120-001', entrustmentId: '202311002', sampleIds: ['S2023110201'], sampleCount: 1, supplierId: 2, supplierName: '中国检验认证集团', pricePerSample: 800, totalPrice: 800, approvalStatus: '待审批', status: '待确认', assignedBy: '张鑫明', assignDate: '2023-11-20' },
];

export const outsourceParameterData: IOutsourceParameter[] = [
    { id: 1, outsourceNo: 'WW-20231118-002', parameterId: 4, parameterName: '中性盐雾', sampleIds: ['S2023110301', 'S2023110302', 'S2023110303'], supplierId: 1, supplierName: '华测检测认证集团股份有限公司', pricePerSample: 300, totalPrice: 900, qualifiedSuppliers: [1], sendDate: '2023-11-19', trackingNo: 'SF9876543210', approvalStatus: '已通过', approvalId: 'DD-20231118-002', status: '已发送', assignedBy: '刘丽愉', assignDate: '2023-11-18' },
    { id: 2, outsourceNo: 'WW-20231122-001', parameterId: 5, parameterName: '金相组织', sampleIds: ['S2023110401'], supplierId: 2, supplierName: '中国检验认证集团', pricePerSample: 600, totalPrice: 600, qualifiedSuppliers: [2, 4], approvalStatus: '已通过', approvalId: 'DD-20231122-001', status: '已完成', assignedBy: '武基勇', assignDate: '2023-11-22', remark: '加急处理' },
];

export const outsourceResultData: IOutsourceResult[] = [
    { id: 1, outsourceNo: 'WW-20231122-001', outsourceType: '参数', sampleNo: 'S2023110401', parameterName: '金相组织', testValue: '珠光体+铁素体，符合标准', testDate: '2023-11-25', testPerson: '王检测师', reviewStatus: '已通过', reviewer: '吴凡', reviewDate: '2023-11-26', createBy: '张鑫明', createTime: '2023-11-26 09:30:00' },
    { id: 2, outsourceNo: 'WW-20231118-002', outsourceType: '参数', sampleNo: 'S2023110301', parameterName: '中性盐雾', testValue: '72小时无锈蚀', testDate: '2023-11-23', testPerson: '李检测师', reviewStatus: '待审核', createBy: '刘丽愉', createTime: '2023-11-24 14:20:00' },
];
