export interface IEntrustmentProject {
    id: string;
    name: string;
    testItems: string[];
    method?: string;
    standard?: string;
    status: 'pending' | 'assigned' | 'subcontracted' | 'completed';
    assignTo?: string; // Internal user name
    subcontractor?: string; // External supplier name
}

export interface IEntrustmentRecord {
    id: number;
    entrustmentId: string;
    contractNo?: string;
    clientName: string;
    contactPerson?: string;
    sampleDate: string;
    follower: string;
    sampleName: string;
    sampleModel?: string;
    sampleMaterial?: string;
    sampleQuantity?: number;
    isSampleReturn?: boolean;
    testItems: string; // Summary string
    projects?: IEntrustmentProject[];
    assignmentMode?: 'manual' | 'auto';
}

export const entrustmentData: IEntrustmentRecord[] = [
    {
        id: 1,
        entrustmentId: 'WT20231101001',
        contractNo: 'HT20231101',
        clientName: '某某建设集团有限公司',
        contactPerson: '张经理',
        sampleDate: '2023-11-01',
        follower: '李四',
        sampleName: 'C30混凝土试块',
        sampleModel: '150*150*150mm',
        sampleMaterial: 'C30',
        sampleQuantity: 3,
        isSampleReturn: false,
        testItems: '抗压强度',
        projects: [
            {
                id: 'P001',
                name: '混凝土抗压强度检测',
                testItems: ['抗压强度'],
                method: 'GB/T 50081-2019',
                standard: 'GB/T 50081-2019',
                status: 'completed',
                assignTo: '张三'
            }
        ]
    },
    {
        id: 2,
        entrustmentId: 'WT20231102002',
        clientName: '某某工程检测有限公司',
        sampleDate: '2023-11-02',
        follower: '王五',
        sampleName: 'HRB400E钢筋',
        testItems: '屈服强度、抗拉强度、伸长率',
        projects: [
            {
                id: 'P002',
                name: '钢筋拉伸性能检测',
                testItems: ['屈服强度', '抗拉强度', '伸长率'],
                method: 'GB/T 228.1-2021',
                standard: 'GB/T 1499.2-2018',
                status: 'assigned',
                assignTo: '李四'
            },
            {
                id: 'P003',
                name: '钢筋弯曲性能检测',
                testItems: ['冷弯'],
                method: 'GB/T 232-2010',
                standard: 'GB/T 1499.2-2018',
                status: 'pending'
            }
        ]
    },
    {
        id: 3,
        entrustmentId: 'WT20231103003',
        clientName: '某某建材有限公司',
        sampleDate: '2023-11-03',
        follower: '赵六',
        sampleName: '水泥',
        testItems: '凝结时间、安定性、强度',
        projects: [
            {
                id: 'P004',
                name: '水泥物理性能检测',
                testItems: ['凝结时间(初凝)', '凝结时间(终凝)', '安定性'],
                method: 'GB/T 1346-2011',
                standard: 'GB 175-2007',
                status: 'subcontracted',
                subcontractor: '第三方检测中心'
            }
        ]
    },
    {
        id: 4,
        entrustmentId: 'WT20231104004',
        clientName: '新城建设开发部',
        sampleDate: '2023-11-04',
        follower: '张三',
        sampleName: '砂石料',
        testItems: '颗粒级配、含泥量',
        projects: [] // 待录入状态
    },
    {
        id: 5,
        entrustmentId: 'WT20231105005',
        clientName: '市政路桥公司',
        sampleDate: '2023-11-05',
        follower: '李四',
        sampleName: '沥青混合料',
        testItems: '马歇尔稳定度、流值',
        projects: [
            {
                id: 'P005',
                name: '沥青混合料性能',
                testItems: ['稳定度', '流值'],
                method: 'JTG E20-2011',
                standard: 'JTG F40-2004',
                status: 'pending'
            }
        ]
    }
];
