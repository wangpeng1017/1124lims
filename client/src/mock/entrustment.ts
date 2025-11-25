export interface IEntrustmentRecord {
    id: number;
    entrustmentId: string;
    reportId: string;
    sampleDate: string;
    testDate: string;
    sampleName: string; // Keep for display summary
    sampleIds: string[]; // Link to SampleDetail
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

export const entrustmentData: IEntrustmentRecord[] = [
    { id: 1, entrustmentId: '202211001', reportId: 'w-2022-ALTC-TC-001', sampleDate: '22.11.08', testDate: '22.11.09', sampleName: '热轧板', sampleIds: ['S20231101001'], testItems: '金属拉伸、弯曲', follower: '吴凡' },
    { id: 2, entrustmentId: '202211002', reportId: 'w-2022-ALTC-TC-002', sampleDate: '22.11.21', testDate: '22.11.22', sampleName: '聚丙烯', sampleIds: ['S20231101002'], testItems: '塑料机械、热性能的测定...', follower: '吴凡' },
    { id: 3, entrustmentId: '202211003', reportId: 'w-2022-ALTC-TC-003', sampleDate: '22.11.28', testDate: '22.11.29', sampleName: '橡胶', sampleIds: [], testItems: '橡胶拉伸、撕裂', follower: '吴凡' },
    { id: 4, entrustmentId: '202212001', reportId: 'w-2022-ALTC-TC-004', sampleDate: '22.12.06', testDate: '22.12.07', sampleName: '聚丙烯', sampleIds: [], testItems: '塑料机械、热性能的测定...', follower: '吴凡' },
    { id: 5, entrustmentId: '202212002', reportId: 'w-2022-ALTC-TC-005', sampleDate: '22.12.13', testDate: '22.12.14', sampleName: '热轧板', sampleIds: [], testItems: '金属拉伸、弯曲', follower: '吴凡' },
    { id: 6, entrustmentId: '202304001', reportId: 'w-2023-ALTC-TC-010', sampleDate: '23.4.07', testDate: '23.4.10', sampleName: '指淀板支架总成圆管', sampleIds: [], testItems: '金相组织珠光体组织评定', follower: '张鑫明' },
    { id: 7, entrustmentId: '202304003', reportId: 'w-2023-ALTC-TC-012', sampleDate: '23.4.10', testDate: '23.4.11', sampleName: '座椅头枕杆', sampleIds: [], testItems: '中性盐雾', follower: '刘丽愉' },
    { id: 8, entrustmentId: '202306011', reportId: 'w-2023-ALTC-TC-057', sampleDate: '23.6.30', testDate: '23.7.3', sampleName: '聚丙烯', sampleIds: [], testItems: '塑料燃烧性能', follower: '姜艺莹' },
    { id: 9, entrustmentId: '202308009', reportId: 'w-2023-ALTC-TC-076', sampleDate: '23.8.23', testDate: '23.8.24', sampleName: '加油管支架', sampleIds: [], testItems: '中性盐雾', follower: '武基勇' },
    { id: 10, entrustmentId: '202310001', reportId: 'w-2023-ALTC-TC-095', sampleDate: '23.10.7', testDate: '23.10.8', sampleName: '管路固定支架', sampleIds: [], testItems: '中性盐雾', follower: '武基勇' },
];

export const contractData: IEntrustmentContract[] = [
    { id: 1, contractNo: 'CT20231101', contractName: '年度检测服务合同', entrustmentId: 'WT20231101001', signDate: '2023-01-01', expiryDate: '2023-12-31', clientUnit: '某某汽车零部件有限公司' },
    { id: 2, contractNo: 'CT20231102', contractName: '单次委托协议', entrustmentId: 'WT20231102002', signDate: '2023-11-02', expiryDate: '2023-12-02', clientUnit: '某某机械制造厂' },
];

export const clientData: IClientUnit[] = [
    { id: 1, name: '某某汽车零部件有限公司', contactPerson: '赵六', contactPhone: '13800138000', entrustmentInfo: '长期合作', address: '上海市嘉定区某某路123号', remark: 'VIP客户', creator: 'Admin', createTime: '2023-01-01' },
    { id: 2, name: '某某机械制造厂', contactPerson: '钱七', contactPhone: '13900139000', entrustmentInfo: '新客户', address: '江苏省苏州市某某工业园', remark: '', creator: 'Admin', createTime: '2023-11-02' },
];
