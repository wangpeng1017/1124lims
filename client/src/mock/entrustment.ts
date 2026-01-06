export interface IEntrustmentProject {
    id: string;
    name: string;
    testItems: string[];
    method?: string;
    standard?: string;
    status: 'pending' | 'assigned' | 'subcontracted' | 'completed';
    assignTo?: string; // Internal user name
    subcontractor?: string; // External supplier name
    deviceId?: string;
    assignDate?: string;
    deadline?: string;
}

export interface IEntrustmentRecord {
    id: number;
    entrustmentId: string;
    // 关联字段 - 合同
    contractId?: string;
    contractNo?: string;
    // 关联字段 - 报价单
    quotationId?: string;
    quotationNo?: string;
    // 关联字段 - 咨询单
    consultationId?: string;
    consultationNo?: string;
    // 来源类型
    sourceType?: 'contract' | 'quotation' | 'direct';
    // 基本信息
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

/**
 * @deprecated 此接口已废弃，请使用 mock/contract.ts 中的 IContract
 * 保留此接口仅为兼容旧代码 EntrustmentContract.tsx
 */
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
    // 1. 全部完成状态
    {
        id: 1,
        entrustmentId: 'WT20240101001',
        contractNo: 'HT20240101',
        sourceType: 'contract',
        clientName: '奇瑞汽车股份有限公司',
        contactPerson: '张经理',
        sampleDate: '2024-01-01',
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
                assignTo: '张三',
                assignDate: '2024-01-02',
                deadline: '2024-01-05'
            },
            {
                id: 'P002',
                name: '混凝土抗折强度检测',
                testItems: ['抗折强度'],
                method: 'GB/T 50081-2019',
                standard: 'GB/T 50081-2019',
                status: 'completed',
                assignTo: '李四',
                assignDate: '2024-01-02',
                deadline: '2024-01-05'
            }
        ]
    },
    // 2. 部分完成、部分进行中
    {
        id: 2,
        entrustmentId: 'WT20240102002',
        sourceType: 'direct',
        clientName: '上海汽车集团股份有限公司',
        contactPerson: '李主管',
        sampleDate: '2024-01-02',
        follower: '王五',
        sampleName: 'HRB400E钢筋',
        sampleModel: 'Φ12mm',
        testItems: '屈服强度、抗拉强度、伸长率',
        projects: [
            {
                id: 'P003',
                name: '钢筋拉伸性能检测',
                testItems: ['屈服强度', '抗拉强度', '伸长率'],
                method: 'GB/T 228.1-2021',
                standard: 'GB/T 1499.2-2018',
                status: 'completed',
                assignTo: '李四',
                assignDate: '2024-01-03',
                deadline: '2024-01-06'
            },
            {
                id: 'P004',
                name: '钢筋弯曲性能检测',
                testItems: ['冷弯'],
                method: 'GB/T 232-2010',
                standard: 'GB/T 1499.2-2018',
                status: 'assigned',
                assignTo: '王五',
                assignDate: '2024-01-03',
                deadline: '2024-01-07'
            },
            {
                id: 'P005',
                name: '钢筋反向弯曲性能检测',
                testItems: ['反向弯曲'],
                method: 'GB/T 1499.3-2010',
                standard: 'GB/T 1499.2-2018',
                status: 'pending'
            }
        ]
    },
    // 3. 全部待分配状态
    {
        id: 3,
        entrustmentId: 'WT20240103003',
        clientName: '比亚迪汽车工业有限公司',
        contactPerson: '赵工',
        sampleDate: '2024-01-03',
        follower: '赵六',
        sampleName: '水泥',
        sampleModel: 'P.O 42.5',
        testItems: '凝结时间、安定性、强度',
        projects: [
            {
                id: 'P006',
                name: '水泥凝结时间检测',
                testItems: ['初凝时间', '终凝时间'],
                method: 'GB/T 1346-2011',
                standard: 'GB 175-2007',
                status: 'pending'
            },
            {
                id: 'P007',
                name: '水泥安定性检测',
                testItems: ['安定性'],
                method: 'GB/T 1346-2011',
                standard: 'GB 175-2007',
                status: 'pending'
            },
            {
                id: 'P008',
                name: '水泥胶砂强度检测',
                testItems: ['3天强度', '28天强度'],
                method: 'GB/T 17671-2021',
                standard: 'GB 175-2007',
                status: 'pending'
            }
        ]
    },
    // 4. 外包状态
    {
        id: 4,
        entrustmentId: 'WT20240104004',
        sourceType: 'quotation',
        quotationId: 'QT20240101',
        quotationNo: 'BJ20240101',
        clientName: '长城汽车股份有限公司',
        contactPerson: '孙经理',
        sampleDate: '2024-01-04',
        follower: '张三',
        sampleName: '砂石料',
        sampleModel: '中砂',
        testItems: '颗粒级配、含泥量',
        projects: [
            {
                id: 'P009',
                name: '砂颗粒级配检测',
                testItems: ['细度模数', '颗粒级配'],
                method: 'JGJ 52-2006',
                standard: 'GB/T 14684-2022',
                status: 'subcontracted',
                subcontractor: '国家建材检测中心',
                assignDate: '2024-01-05',
                deadline: '2024-01-10'
            },
            {
                id: 'P010',
                name: '砂含泥量检测',
                testItems: ['含泥量', '泥块含量'],
                method: 'JGJ 52-2006',
                standard: 'GB/T 14684-2022',
                status: 'subcontracted',
                subcontractor: '国家建材检测中心',
                assignDate: '2024-01-05',
                deadline: '2024-01-10'
            }
        ]
    },
    // 5. 混合状态（内部分配+外包+待分配）
    {
        id: 5,
        entrustmentId: 'WT20240105005',
        clientName: '奇瑞汽车股份有限公司',
        contactPerson: '张经理',
        sampleDate: '2024-01-05',
        follower: '李四',
        sampleName: '沥青混合料',
        sampleModel: 'AC-13C',
        testItems: '马歇尔稳定度、流值',
        projects: [
            {
                id: 'P011',
                name: '沥青混合料马歇尔稳定度',
                testItems: ['稳定度', '流值', '密度'],
                method: 'JTG E20-2011',
                standard: 'JTG F40-2004',
                status: 'assigned',
                assignTo: '张三',
                deviceId: 'DEV001',
                assignDate: '2024-01-06',
                deadline: '2024-01-09'
            },
            {
                id: 'P012',
                name: '沥青含量检测',
                testItems: ['油石比', '沥青含量'],
                method: 'JTG E20-2011',
                standard: 'JTG F40-2004',
                status: 'subcontracted',
                subcontractor: '路桥检测技术有限公司',
                assignDate: '2024-01-06',
                deadline: '2024-01-11'
            },
            {
                id: 'P013',
                name: '沥青混合料车辙试验',
                testItems: ['动稳定度'],
                method: 'JTG E20-2011',
                standard: 'JTG F40-2004',
                status: 'pending'
            }
        ]
    },
    // 6. 待录入状态（无项目）
    {
        id: 6,
        entrustmentId: 'WT20240106006',
        clientName: '蔚来汽车科技发展有限公司',
        contactPerson: '周工',
        sampleDate: '2024-01-06',
        follower: '王五',
        sampleName: '铝合金板材',
        sampleModel: '6061-T6',
        sampleMaterial: '6061铝合金',
        sampleQuantity: 5,
        isSampleReturn: true,
        testItems: '待录入',
        projects: []
    },
    // 7. 全部已分配状态（多个项目）
    {
        id: 7,
        entrustmentId: 'WT20240107007',
        contractNo: 'HT20240102',
        sourceType: 'contract',
        clientName: '小鹏汽车科技有限公司',
        contactPerson: '吴主管',
        sampleDate: '2024-01-07',
        follower: '赵六',
        sampleName: '动力电池包',
        sampleModel: 'XP-BAT-001',
        testItems: '振动、冲击、防水',
        projects: [
            {
                id: 'P014',
                name: '电池包振动试验',
                testItems: ['随机振动', '正弦振动'],
                method: 'GB/T 31467-2015',
                standard: 'GB 38031-2020',
                status: 'assigned',
                assignTo: '李四',
                deviceId: 'DEV002',
                assignDate: '2024-01-08',
                deadline: '2024-01-12'
            },
            {
                id: 'P015',
                name: '电池包机械冲击试验',
                testItems: ['冲击加速度'],
                method: 'GB/T 31467-2015',
                standard: 'GB 38031-2020',
                status: 'assigned',
                assignTo: '张三',
                deviceId: 'DEV003',
                assignDate: '2024-01-08',
                deadline: '2024-01-13'
            },
            {
                id: 'P016',
                name: '电池包防水试验',
                testItems: ['IP防护等级'],
                method: 'GB/T 4208-2017',
                standard: 'GB 38031-2020',
                status: 'assigned',
                assignTo: '王五',
                assignDate: '2024-01-08',
                deadline: '2024-01-14'
            },
            {
                id: 'P017',
                name: '电池包热失控试验',
                testItems: ['热扩散', '热失控'],
                method: 'GB/T 38031-2020',
                standard: 'GB 38031-2020',
                status: 'assigned',
                assignTo: '赵六',
                assignDate: '2024-01-08',
                deadline: '2024-01-16'
            }
        ]
    },
    // 8. 部分外包、部分内部分配
    {
        id: 8,
        entrustmentId: 'WT20240108008',
        clientName: '理想汽车科技有限公司',
        contactPerson: '郑工',
        sampleDate: '2024-01-08',
        follower: '张三',
        sampleName: '增程器总成',
        sampleModel: 'Li-RE-001',
        testItems: '性能、耐久、排放',
        projects: [
            {
                id: 'P018',
                name: '增程器功率测试',
                testItems: ['额定功率', '最大功率'],
                method: 'GB/T 21404-2021',
                standard: 'GB 17691-2018',
                status: 'assigned',
                assignTo: '李四',
                deviceId: 'DEV004',
                assignDate: '2024-01-09',
                deadline: '2024-01-15'
            },
            {
                id: 'P019',
                name: '增程器燃油消耗率测试',
                testItems: ['燃油消耗率'],
                method: 'GB/T 21404-2021',
                standard: 'GB 17691-2018',
                status: 'subcontracted',
                subcontractor: '内燃机检测中心',
                assignDate: '2024-01-09',
                deadline: '2024-01-16'
            },
            {
                id: 'P020',
                name: '增程器排放测试',
                testItems: ['CO', 'HC', 'NOx', 'PM'],
                method: 'GB 17691-2018',
                standard: 'GB 17691-2018',
                status: 'subcontracted',
                subcontractor: '国家机动车质量监督检验中心',
                assignDate: '2024-01-09',
                deadline: '2024-01-18'
            }
        ]
    },
    // 9. 复杂混合状态（多个不同状态）
    {
        id: 9,
        entrustmentId: 'WT20240109009',
        clientName: '华为技术有限公司',
        contactPerson: '钱经理',
        sampleDate: '2024-01-09',
        follower: '王五',
        sampleName: '通信设备机柜',
        sampleModel: 'HC-CAB-001',
        testItems: '防护、环境适应性',
        projects: [
            {
                id: 'P021',
                name: '机柜防护等级测试',
                testItems: ['IP55', '防尘', '防水'],
                method: 'GB/T 4208-2017',
                standard: 'GB/T 4208-2017',
                status: 'completed',
                assignTo: '赵六',
                assignDate: '2024-01-10',
                deadline: '2024-01-12'
            },
            {
                id: 'P022',
                name: '机柜盐雾试验',
                testItems: ['中性盐雾', '酸性盐雾'],
                method: 'GB/T 2423.17-2008',
                standard: 'GB/T 2423.17-2008',
                status: 'assigned',
                assignTo: '张三',
                deviceId: 'DEV005',
                assignDate: '2024-01-10',
                deadline: '2024-01-15'
            },
            {
                id: 'P023',
                name: '机柜振动试验',
                testItems: ['随机振动'],
                method: 'GB/T 2423.10-2019',
                standard: 'GB/T 2423.10-2019',
                status: 'assigned',
                assignTo: '李四',
                assignDate: '2024-01-10',
                deadline: '2024-01-16'
            },
            {
                id: 'P024',
                name: '机柜高低温试验',
                testItems: ['高温', '低温', '温度冲击'],
                method: 'GB/T 2423.1-2008',
                standard: 'GB/T 2423.1-2008',
                status: 'subcontracted',
                subcontractor: '环境可靠性检测中心',
                assignDate: '2024-01-10',
                deadline: '2024-01-20'
            },
            {
                id: 'P025',
                name: '机柜跌落试验',
                testItems: ['自由跌落', '面跌落'],
                method: 'GB/T 2423.8-1995',
                standard: 'GB/T 2423.8-1995',
                status: 'pending'
            }
        ]
    },
    // 10. 全部完成（多项目）
    {
        id: 10,
        entrustmentId: 'WT20240110010',
        consultationId: 'ZX20240101',
        consultationNo: 'ZC20240101',
        sourceType: 'quotation',
        clientName: '宁德时代新能源科技股份有限公司',
        contactPerson: '冯工',
        sampleDate: '2024-01-10',
        follower: '赵六',
        sampleName: '锂离子电池电芯',
        sampleModel: 'NCM-2170-50Ah',
        sampleMaterial: '三元锂',
        sampleQuantity: 100,
        isSampleReturn: true,
        testItems: '电性能、安全性能',
        projects: [
            {
                id: 'P026',
                name: '电池容量测试',
                testItems: ['额定容量', '实际容量'],
                method: 'GB/T 31484-2015',
                standard: 'GB/T 31484-2015',
                status: 'completed',
                assignTo: '王五',
                assignDate: '2024-01-11',
                deadline: '2024-01-13'
            },
            {
                id: 'P027',
                name: '电池循环寿命测试',
                testItems: ['循环次数', '容量保持率'],
                method: 'GB/T 31484-2015',
                standard: 'GB/T 31484-2015',
                status: 'completed',
                assignTo: '张三',
                deviceId: 'DEV006',
                assignDate: '2024-01-11',
                deadline: '2024-01-18'
            },
            {
                id: 'P028',
                name: '电池倍率充放电测试',
                testItems: ['1C充放电', '2C充放电', '3C充放电'],
                method: 'GB/T 31484-2015',
                standard: 'GB/T 31484-2015',
                status: 'completed',
                assignTo: '李四',
                assignDate: '2024-01-11',
                deadline: '2024-01-15'
            },
            {
                id: 'P029',
                name: '电池安全性测试',
                testItems: ['过充', '过放', '短路', '针刺', '挤压'],
                method: 'GB 38031-2020',
                standard: 'GB 38031-2020',
                status: 'completed',
                assignTo: '赵六',
                deviceId: 'DEV007',
                assignDate: '2024-01-11',
                deadline: '2024-01-20'
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
        createTime: '2023-01-01 09:00:00',
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
        createTime: '2023-01-15 10:00:00',
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
        createTime: '2023-02-01 14:00:00',
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
        createTime: '2023-03-10 11:00:00',
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
