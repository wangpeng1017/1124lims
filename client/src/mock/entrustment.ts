// 委托项目
export interface IEntrustmentProject {
    id: string;
    name: string;           // 项目名称 (如: 金相分析)
    testItems: string[];    // 检测参数列表
    method: string;         // 检测方法
    standard: string;       // 判定标准
    status: 'pending' | 'assigned' | 'subcontracted' | 'completed';

    // 任务流向信息
    assignTo?: string;      // 内部: 分配给谁
    subcontractor?: string; // 外部: 分包商
}

export interface IEntrustmentRecord {
    id: number;
    entrustmentId: string;
    reportId: string;
    sampleDate: string;
    testDate: string;

    // 委托方信息
    clientName: string;     // 委托单位
    clientAddress?: string;
    contactPerson?: string;
    contactPhone?: string;

    // 样品信息
    sampleName: string;
    sampleModel?: string;   // 规格型号
    sampleMaterial?: string;// 材质牌号
    sampleQuantity?: number;
    isSampleReturn?: boolean; // 是否退样
    sampleIds: string[]; // Link to SampleDetail

    // 报告要求
    reportHeader?: string;
    isEnglishReport?: boolean;
    isUrgent?: boolean;

    // 项目管理
    projects: IEntrustmentProject[];

    // 兼容旧字段 (用于列表显示)
    testItems: string;
    follower: string;
    contractNo?: string;
}

export interface IEntrustmentContract {
    id: number;
    contractNo: string;
    contractName: string;
    entrustmentId: string; // Link to EntrustmentRecord
    signDate: string;
    expiryDate: string;
    clientUnit: string;
    amount: number; // New field: Contract Amount
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
    {
        id: 1,
        entrustmentId: '202211001',
        reportId: 'w-2022-ALTC-TC-001',
        sampleDate: '22.11.08',
        testDate: '22.11.09',
        clientName: '某某汽车零部件有限公司',
        sampleName: '热轧板',
        sampleIds: ['S20231101001'],
        testItems: '金属拉伸、弯曲',
        follower: '吴凡',
        contractNo: 'CT20221101',
        projects: [
            {
                id: 'P1',
                name: '力学性能',
                testItems: ['抗拉强度', '屈服强度'],
                method: 'GB/T 228.1-2010',
                standard: 'Q/BQB 302-2018',
                status: 'assigned',
                assignTo: '力学实验室'
            }
        ]
    },
    {
        id: 2,
        entrustmentId: '202211002',
        reportId: 'w-2022-ALTC-TC-002',
        sampleDate: '22.11.21',
        testDate: '22.11.22',
        clientName: '某某机械制造厂',
        sampleName: '聚丙烯',
        sampleIds: ['S20231101002'],
        testItems: '塑料机械、热性能的测定...',
        follower: '吴凡',
        contractNo: 'CT20221102',
        projects: []
    },
    // ... 其他数据保持兼容或按需更新
];

export const contractData: IEntrustmentContract[] = [
    { id: 1, contractNo: 'CT20231101', contractName: '年度检测服务合同', entrustmentId: 'WT20231101001', signDate: '2023-01-01', expiryDate: '2023-12-31', clientUnit: '某某汽车零部件有限公司', amount: 500000 },
    { id: 2, contractNo: 'CT20231102', contractName: '单次委托协议', entrustmentId: 'WT20231102002', signDate: '2023-11-02', expiryDate: '2023-12-02', clientUnit: '某某机械制造厂', amount: 3500 },
];

export const clientData: IClientUnit[] = [
    { id: 1, name: '某某汽车零部件有限公司', contactPerson: '赵六', contactPhone: '13800138000', entrustmentInfo: '长期合作', address: '上海市嘉定区某某路123号', remark: 'VIP客户', creator: 'Admin', createTime: '2023-01-01' },
    { id: 2, name: '某某机械制造厂', contactPerson: '钱七', contactPhone: '13900139000', entrustmentInfo: '新客户', address: '江苏省苏州市某某工业园', remark: '', creator: 'Admin', createTime: '2023-11-02' },
];
