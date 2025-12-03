// 委外/分包管理 Mock 数据

// 委外/分包管理 Mock 数据
// 委外/分包管理 Mock 数据

// 委外单（委托单维度）
export interface IOutsourceOrder {
    id: number;
    outsourceNo: string;
    entrustmentId: string;
    sampleIds: string[];
    sampleCount: number;
    supplierId: string;
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
    internalManager: string;      // 新增: 内部责任人(必填)
    internalManagerId: string;    // 新增: 内部责任人ID
    remark?: string;
}

// 委外单（参数维度）
export interface IOutsourceParameter {
    id: number;
    outsourceNo: string;
    parameterId: number;
    parameterName: string;
    sampleIds: string[];
    supplierId: string;
    supplierName: string;
    pricePerSample: number;
    totalPrice: number;
    qualifiedSuppliers: string[];
    sendDate?: string;
    trackingNo?: string;
    receivedDate?: string;
    approvalStatus: '待审批' | '已通过' | '已拒绝';
    approvalId?: string;
    status: '待确认' | '已发送' | '检测中' | '已完成' | '已终止';
    assignedBy: string;
    assignDate: string;
    internalManager: string;      // 新增: 内部责任人(必填)
    internalManagerId: string;    // 新增: 内部责任人ID
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
export const outsourceOrderData: IOutsourceOrder[] = [
    { id: 1, outsourceNo: 'WW-20231115-001', entrustmentId: '202311001', sampleIds: ['S2023110101', 'S2023110102'], sampleCount: 2, supplierId: 'SUP001', supplierName: '华测检测认证集团股份有限公司', pricePerSample: 500, totalPrice: 1000, sendDate: '2023-11-16', trackingNo: 'SF1234567890', approvalStatus: '已通过', approvalId: 'DD-20231115-001', status: '检测中', assignedBy: '吴凡', assignDate: '2023-11-15', expectedReturnDate: '2023-11-30', internalManager: '张三', internalManagerId: 'EMP001' },
    { id: 2, outsourceNo: 'WW-20231120-001', entrustmentId: '202311002', sampleIds: ['S2023110201'], sampleCount: 1, supplierId: 'SUP002', supplierName: '中国检验认证集团', pricePerSample: 800, totalPrice: 800, approvalStatus: '待审批', status: '待确认', assignedBy: '张鑫明', assignDate: '2023-11-20', internalManager: '李四', internalManagerId: 'EMP002' },
];

export const outsourceParameterData: IOutsourceParameter[] = [
    { id: 1, outsourceNo: 'WW-20231118-002', parameterId: 4, parameterName: '中性盐雾', sampleIds: ['S2023110301', 'S2023110302', 'S2023110303'], supplierId: 'SUP001', supplierName: '华测检测认证集团股份有限公司', pricePerSample: 300, totalPrice: 900, qualifiedSuppliers: ['SUP001'], sendDate: '2023-11-19', trackingNo: 'SF9876543210', approvalStatus: '已通过', approvalId: 'DD-20231118-002', status: '已发送', assignedBy: '刘丽愉', assignDate: '2023-11-18', internalManager: '王五', internalManagerId: 'EMP003' },
    { id: 2, outsourceNo: 'WW-20231122-001', parameterId: 5, parameterName: '金相组织', sampleIds: ['S2023110401'], supplierId: 'SUP002', supplierName: '中国检验认证集团', pricePerSample: 600, totalPrice: 600, qualifiedSuppliers: ['SUP002', 'SUP004'], approvalStatus: '已通过', approvalId: 'DD-20231122-001', status: '已完成', assignedBy: '武基勇', assignDate: '2023-11-22', internalManager: '赵六', internalManagerId: 'EMP004', remark: '加急处理' },
];

export const outsourceResultData: IOutsourceResult[] = [
    { id: 1, outsourceNo: 'WW-20231122-001', outsourceType: '参数', sampleNo: 'S2023110401', parameterName: '金相组织', testValue: '珠光体+铁素体，符合标准', testDate: '2023-11-25', testPerson: '王检测师', reviewStatus: '已通过', reviewer: '吴凡', reviewDate: '2023-11-26', createBy: '张鑫明', createTime: '2023-11-26 09:30:00' },
    { id: 2, outsourceNo: 'WW-20231118-002', outsourceType: '参数', sampleNo: 'S2023110301', parameterName: '中性盐雾', testValue: '72小时无锈蚀', testDate: '2023-11-23', testPerson: '李检测师', reviewStatus: '待审核', createBy: '刘丽愉', createTime: '2023-11-24 14:20:00' },
];
