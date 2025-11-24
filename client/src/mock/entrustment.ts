export interface IEntrustmentRecord {
    id: number;
    entrustmentId: string;
    reportId: string;
    sampleDate: string;
    sampleName: string;
    testItems: string;
    follower: string;
}

export interface IEntrustmentContract {
    id: number;
    contractNo: string;
    contractName: string;
    entrustmentId: string; // Link to EntrustmentRecord
    signDate: string;
    expiryDate: string;
    clientUnit: string;
}

export interface IClientUnit {
    id: number;
    name: string;
    contactPerson: string;
    contactPhone: string;
    entrustmentInfo: string;
    address: string;
    remark: string;
    creator: string;
    createTime: string;
}

export interface IEntrustmentSample {
    id: number;
    sampleNo: string;
    name: string;
    spec: string; // Specification/Model
    quantity: number;
    status: string;
    remark: string;
}

export const entrustmentData: IEntrustmentRecord[] = [
    { id: 1, entrustmentId: 'WT20231101001', reportId: 'REP20231101001', sampleDate: '2023-11-01', sampleName: '钢板', testItems: '拉伸, 冲击', follower: '张三' },
    { id: 2, entrustmentId: 'WT20231102002', reportId: 'REP20231102002', sampleDate: '2023-11-02', sampleName: '螺栓', testItems: '硬度, 金相', follower: '李四' },
    { id: 3, entrustmentId: 'WT20231103003', reportId: 'REP20231103003', sampleDate: '2023-11-03', sampleName: '润滑油', testItems: '粘度, 酸值', follower: '王五' },
];

export const contractData: IEntrustmentContract[] = [
    { id: 1, contractNo: 'CT20231101', contractName: '年度检测服务合同', entrustmentId: 'WT20231101001', signDate: '2023-01-01', expiryDate: '2023-12-31', clientUnit: '某某汽车零部件有限公司' },
    { id: 2, contractNo: 'CT20231102', contractName: '单次委托协议', entrustmentId: 'WT20231102002', signDate: '2023-11-02', expiryDate: '2023-12-02', clientUnit: '某某机械制造厂' },
];

export const clientData: IClientUnit[] = [
    { id: 1, name: '某某汽车零部件有限公司', contactPerson: '赵六', contactPhone: '13800138000', entrustmentInfo: '长期合作', address: '上海市嘉定区某某路123号', remark: 'VIP客户', creator: 'Admin', createTime: '2023-01-01' },
    { id: 2, name: '某某机械制造厂', contactPerson: '钱七', contactPhone: '13900139000', entrustmentInfo: '新客户', address: '江苏省苏州市某某工业园', remark: '', creator: 'Admin', createTime: '2023-11-02' },
];

export const sampleData: IEntrustmentSample[] = [
    { id: 1, sampleNo: 'S2023110101', name: '钢板样品A', spec: '10mm*100mm', quantity: 5, status: '待检', remark: '表面无划痕' },
    { id: 2, sampleNo: 'S2023110201', name: '高强度螺栓', spec: 'M12*50', quantity: 10, status: '检测中', remark: '' },
];
