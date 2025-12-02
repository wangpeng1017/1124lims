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

export interface IClientUnit {
    id: number;
    name: string;
    contactPerson: string;
    contactPhone: string;
    entrustmentInfo?: string;
    address?: string;
    remark?: string;
    creator: string;
    createTime: string;
    // Invoice Info
    taxId?: string;
    invoiceAddress?: string;
    invoicePhone?: string;
    bankName?: string;
    bankAccount?: string;
    // Approval Info
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    approvalComment?: string;
}

export interface IEntrustmentContract {
    id: number;
    contractNo: string;
    name: string;
    clientName: string;
    amount: number;
    signDate: string;
    status: 'signed' | 'pending' | 'terminated';
    attachment?: string;
}

export const entrustmentData: IEntrustmentRecord[] = [
    {
        id: 1,
        entrustmentId: 'WT20231101001',
        contractNo: 'HT20231101',
        clientName: '奇瑞汽车股份有限公司',
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
        clientName: '上海汽车集团股份有限公司',
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
        clientName: '比亚迪汽车工业有限公司',
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
        clientName: '长城汽车股份有限公司',
        sampleDate: '2023-11-04',
        follower: '张三',
        sampleName: '砂石料',
        testItems: '颗粒级配、含泥量',
        projects: [] // 待录入状态
    },
    {
        id: 5,
        entrustmentId: 'WT20231105005',
        clientName: '奇瑞汽车股份有限公司',
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

export const clientData: IClientUnit[] = [
    {
        id: 1,
        name: '奇瑞汽车股份有限公司',
        contactPerson: '王经理',
        contactPhone: '13800138001',
        address: '安徽省芜湖市经济技术开发区长春路8号',
        creator: 'Admin',
        createTime: '2023-01-01',
        taxId: '91340200713920435C',
        invoiceAddress: '安徽省芜湖市经济技术开发区长春路8号',
        invoicePhone: '0553-5961111',
        bankName: '中国工商银行芜湖分行',
        bankAccount: '1307023009022100123',
        status: 'approved'
    },
    {
        id: 2,
        name: '上海汽车集团股份有限公司',
        contactPerson: '李主管',
        contactPhone: '13900139002',
        address: '上海市静安区威海路489号',
        creator: 'Admin',
        createTime: '2023-01-15',
        taxId: '91310000132260250X',
        invoiceAddress: '上海市静安区威海路489号',
        invoicePhone: '021-22011888',
        bankName: '上海银行总行营业部',
        bankAccount: '31628800003029888',
        status: 'approved'
    },
    {
        id: 3,
        name: '比亚迪汽车工业有限公司',
        contactPerson: '赵工',
        contactPhone: '13700137003',
        address: '深圳市坪山区比亚迪路3009号',
        creator: 'Admin',
        createTime: '2023-02-01',
        taxId: '91440300791705886F',
        invoiceAddress: '深圳市坪山区比亚迪路3009号',
        invoicePhone: '0755-89888888',
        bankName: '中国建设银行深圳坪山支行',
        bankAccount: '44201583400052500888',
        status: 'approved'
    },
    {
        id: 4,
        name: '长城汽车股份有限公司',
        contactPerson: '孙经理',
        contactPhone: '13600136004',
        address: '河北省保定市朝阳南大街2266号',
        creator: 'Admin',
        createTime: '2023-03-10',
        taxId: '91130600726236824F',
        invoiceAddress: '河北省保定市朝阳南大街2266号',
        invoicePhone: '0312-2196666',
        bankName: '中国银行保定分行',
        bankAccount: '100147896325',
        status: 'approved'
    }
];

export const contractData: IEntrustmentContract[] = [
    {
        id: 1,
        contractNo: 'HT20231101',
        name: '年度检测服务合同',
        clientName: '奇瑞汽车股份有限公司',
        amount: 500000,
        signDate: '2023-01-01',
        status: 'signed',
        attachment: 'contract_v1.pdf'
    },
    {
        id: 2,
        contractNo: 'HT20231102',
        name: '专项检测合同',
        clientName: '上海汽车集团股份有限公司',
        amount: 200000,
        signDate: '2023-06-15',
        status: 'pending'
    }
];
