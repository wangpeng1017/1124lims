export interface InspectionStandard {
    id: number;
    name: string;
    standardNo: string;
    description: string;
    validity: string;
    devices: string[]; // Associated devices
    parameters: string[]; // Detection parameters
    personnel: string[]; // Qualified personnel
}

export const inspectionStandardsData: InspectionStandard[] = [
    // 混凝土检测标准
    {
        id: 1,
        name: '混凝土物理力学性能试验方法标准',
        standardNo: 'GB/T 50081-2019',
        description: '包括抗压、抗折、劈裂抗拉强度等试验方法',
        validity: '现行有效',
        devices: ['2T电子万能试验机', '5T电子万能试验机'],
        parameters: ['抗压强度', '抗折强度', '劈裂抗拉强度', '抗渗等级'],
        personnel: ['张三', '李四', '王五']
    },

    // 钢筋检测标准
    {
        id: 2,
        name: '金属材料 拉伸试验 第1部分：室温试验方法',
        standardNo: 'GB/T 228.1-2021',
        description: '适用于金属材料在室温下的拉伸试验',
        validity: '现行有效',
        devices: ['2T电子万能试验机', '5T电子万能试验机'],
        parameters: ['屈服强度', '抗拉强度', '伸长率', '最大力总伸长率'],
        personnel: ['张三', '李四']
    },
    {
        id: 3,
        name: '金属材料 弯曲试验方法',
        standardNo: 'GB/T 232-2010',
        description: '用于测定金属材料的弯曲性能',
        validity: '现行有效',
        devices: ['2T电子万能试验机'],
        parameters: ['冷弯'],
        personnel: ['李四', '王五']
    },

    // 水泥检测标准
    {
        id: 4,
        name: '水泥标准稠度用水量、凝结时间、安定性检验方法',
        standardNo: 'GB/T 1346-2011',
        description: '测定水泥标准稠度及凝结时间',
        validity: '现行有效',
        devices: ['水泥净浆搅拌机', '水泥标准稠度及凝结时间测定仪'],
        parameters: ['凝结时间(初凝)', '凝结时间(终凝)', '标准稠度用水量'],
        personnel: ['张三', '王五']
    },
    {
        id: 5,
        name: '水泥比表面积测定方法 勃氏法',
        standardNo: 'GB/T 8074-2008',
        description: '采用勃氏透气仪测定水泥比表面积',
        validity: '现行有效',
        devices: ['勃氏透气比表面积仪'],
        parameters: ['比表面积'],
        personnel: ['张三']
    },
    {
        id: 6,
        name: '水泥安定性试验方法',
        standardNo: 'GB/T 750-1992',
        description: '雷氏法和试饼法测定水泥安定性',
        validity: '现行有效',
        devices: ['雷氏夹', '沸煮箱'],
        parameters: ['安定性'],
        personnel: ['王五']
    },

    // 砂石料检测标准
    {
        id: 7,
        name: '建设用砂',
        standardNo: 'GB/T 14684-2022',
        description: '建设用天然砂、机制砂的技术要求和试验方法',
        validity: '现行有效',
        devices: ['标准筛', '电子天平', '摇筛机'],
        parameters: ['颗粒级配', '含泥量', '泥块含量', '表观密度', '堆积密度'],
        personnel: ['张三', '李四', '王五']
    },
    {
        id: 8,
        name: '建设用卵石、碎石',
        standardNo: 'GB/T 14685-2022',
        description: '建设用卵石和碎石的技术要求和试验方法',
        validity: '现行有效',
        devices: ['标准筛', '压力试验机', '电子天平'],
        parameters: ['颗粒级配', '含泥量', '压碎值', '表观密度'],
        personnel: ['李四', '王五']
    },

    // 沥青检测标准
    {
        id: 9,
        name: '公路工程沥青及沥青混合料试验规程',
        standardNo: 'JTG E20-2011',
        description: '沥青及沥青混合料的标准试验方法',
        validity: '现行有效',
        devices: ['沥青针入度仪', '沥青软化点试验器', '沥青延度仪', '密度计'],
        parameters: ['针入度', '软化点', '延度', '密度'],
        personnel: ['李四']
    },

    // 土工检测标准
    {
        id: 10,
        name: '土工试验方法标准',
        standardNo: 'GB/T 50123-2019',
        description: '土的物理力学性质试验方法',
        validity: '现行有效',
        devices: ['电子天平', '烘箱', '液塑限联合测定仪'],
        parameters: ['含水率', '液限', '塑限'],
        personnel: ['张三', '王五']
    },
    {
        id: 11,
        name: '公路路基路面现场测试规程',
        standardNo: 'JTG 3450-2019',
        description: '路基路面压实度等现场试验方法',
        validity: '现行有效',
        devices: ['灌砂筒', '环刀', '电子天平'],
        parameters: ['压实度', '最大干密度', '最佳含水率'],
        personnel: ['李四', '王五']
    },

    // 金相类标准
    {
        id: 12,
        name: '金属显微组织检验方法',
        standardNo: 'GB/T 13298-2015',
        description: '用于金属显微组织检验的标准方法',
        validity: '现行有效',
        devices: ['金相显微镜', '镶嵌机', '磨抛机'],
        parameters: ['显微组织', '晶粒度'],
        personnel: ['张三']
    },
];

export interface DetectionParameter {
    id: number;
    name: string;
    method: string;  // 检测方法标准
    unit: string;    // 单位
}

export const detectionParametersData: DetectionParameter[] = [
    // 混凝土类检测参数
    { id: 1, name: '抗压强度', method: 'GB/T 50081-2019', unit: 'MPa' },
    { id: 2, name: '抗折强度', method: 'GB/T 50081-2019', unit: 'MPa' },
    { id: 3, name: '劈裂抗拉强度', method: 'GB/T 50081-2019', unit: 'MPa' },
    { id: 4, name: '抗渗等级', method: 'GB/T 50081-2019', unit: '-' },

    // 钢筋类检测参数
    { id: 5, name: '屈服强度', method: 'GB/T 228.1-2021', unit: 'MPa' },
    { id: 6, name: '抗拉强度', method: 'GB/T 228.1-2021', unit: 'MPa' },
    { id: 7, name: '伸长率', method: 'GB/T 228.1-2021', unit: '%' },
    { id: 8, name: '最大力总伸长率', method: 'GB/T 228.1-2021', unit: '%' },
    { id: 9, name: '冷弯', method: 'GB/T 232-2010', unit: '-' },

    // 水泥类检测参数
    { id: 10, name: '凝结时间(初凝)', method: 'GB/T 1346-2011', unit: 'min' },
    { id: 11, name: '凝结时间(终凝)', method: 'GB/T 1346-2011', unit: 'min' },
    { id: 12, name: '安定性', method: 'GB/T 750-1992', unit: '-' },
    { id: 13, name: '比表面积', method: 'GB/T 8074-2008', unit: 'm²/kg' },
    { id: 14, name: '标准稠度用水量', method: 'GB/T 1346-2011', unit: '%' },

    // 砂石料检测参数
    { id: 15, name: '颗粒级配', method: 'GB/T 14684-2022', unit: '-' },
    { id: 16, name: '含泥量', method: 'GB/T 14684-2022', unit: '%' },
    { id: 17, name: '泥块含量', method: 'GB/T 14684-2022', unit: '%' },
    { id: 18, name: '表观密度', method: 'GB/T 14684-2022', unit: 'kg/m³' },
    { id: 19, name: '堆积密度', method: 'GB/T 14684-2022', unit: 'kg/m³' },
    { id: 20, name: '压碎值', method: 'GB/T 14685-2022', unit: '%' },

    // 沥青类检测参数
    { id: 21, name: '针入度', method: 'JTG E20-2011', unit: '0.1mm' },
    { id: 22, name: '软化点', method: 'JTG E20-2011', unit: '℃' },
    { id: 23, name: '延度', method: 'JTG E20-2011', unit: 'cm' },
    { id: 24, name: '密度', method: 'JTG E20-2011', unit: 'g/cm³' },

    // 土工类检测参数
    { id: 25, name: '含水率', method: 'GB/T 50123-2019', unit: '%' },
    { id: 26, name: '液限', method: 'GB/T 50123-2019', unit: '%' },
    { id: 27, name: '塑限', method: 'GB/T 50123-2019', unit: '%' },
    { id: 28, name: '压实度', method: 'JTG 3450-2019', unit: '%' },
    { id: 29, name: '最大干密度', method: 'JTG 3450-2019', unit: 'g/cm³' },
    { id: 30, name: '最佳含水率', method: 'JTG 3450-2019', unit: '%' },
];

export interface ELNTemplate {
    id: number;
    name: string;
    createDate: string;
    author: string;
    parameterName?: string; // Associated detection parameter
    standard?: string; // Detection Standard/Basis
    schema?: any; // JSON Schema for the form
}

export const elnTemplatesData: ELNTemplate[] = [
    { id: 1, name: '产品检验数据表.xlsx', createDate: '2023-01-01', author: '管理员', parameterName: '装配检验', standard: '装配检验' },
    { id: 2, name: '批检检查报告.xlsx', createDate: '2023-01-15', author: '管理员', parameterName: '批检', standard: 'GB/T 5750.4-2006' },
    {
        id: 3,
        name: 'CXPS-JS01-05 pH值检测记录 (改).xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: 'pH值',
        standard: 'GB/T 5750.4-2006',
        schema: {
            title: 'pH值检测记录',
            header: {
                methodBasis: '水质 HJ 1147-2020',
                instrument: 'pH计 / YQ-'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号/样品名称', dataIndex: 'sampleName' },
                { title: '检测结果', dataIndex: 'result' },
                { title: '样品温度 (°C)', dataIndex: 'temperature' },
                {
                    title: '标准溶液的pH值',
                    children: [
                        { title: '0.05M 邻苯二甲酸氢钾', dataIndex: 'std1' },
                        { title: '0.025M 混合磷酸盐', dataIndex: 'std2' },
                        { title: '0.01M 硼砂', dataIndex: 'std3' }
                    ]
                }
            ],
            environment: true // Show temp/humidity inputs
        }
    },
    {
        id: 4,
        name: 'CXPS-JS07-03 类大肠菌群 (滤膜法).xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '类大肠菌群',
        standard: 'GB/T 5750.4-2006',
        schema: {
            title: '类大肠菌群检测记录',
            subtitle: '(滤膜法)',
            header: {
                methodBasis: 'CXPS-JS 07-03'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号/样品名称', dataIndex: 'sampleName' },
                { title: '稀释后接种体积V (mL)', dataIndex: 'volume' },
                { title: '稀释倍数 (K)', dataIndex: 'dilution' },
                { title: '滤膜上生长的类大肠菌群菌落数 (个)', dataIndex: 'colonyCount' },
                { title: '检测结果 (个/L)', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    { id: 5, name: 'CXPS-JS09-03 色度检测记录 (改).xlsx', createDate: '2023-11-26', author: '管理员', parameterName: '色度', standard: 'GB/T 5750.4-2006' },
    {
        id: 6,
        name: '金属拉伸试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '金属拉伸',
        standard: 'GB/T 228.1-2021',
        schema: {
            title: '金属材料拉伸试验记录',
            header: {
                methodBasis: 'GB/T 228.1-2021',
                device: '电子万能试验机'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '屈服强度 (MPa)', dataIndex: 'yieldStrength' },
                { title: '抗拉强度 (MPa)', dataIndex: 'tensileStrength' },
                { title: '断后伸长率 (%)', dataIndex: 'elongation' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 7,
        name: '金属弯曲试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '弯曲',
        standard: 'GB/T 232-2010',
        schema: {
            title: '金属材料弯曲试验记录',
            header: {
                methodBasis: 'GB/T 232-2010',
                device: '弯曲试验机'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '弯曲直径 (mm)', dataIndex: 'diameter' },
                { title: '弯曲角度 (°)', dataIndex: 'angle' },
                { title: '弯曲后外观', dataIndex: 'appearance' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 8,
        name: '中性盐雾试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '中性盐雾',
        standard: 'GB/T 10125-2021',
        schema: {
            title: '中性盐雾试验记录',
            header: {
                methodBasis: 'GB/T 10125-2021',
                device: '盐雾试验箱'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '试验时间 (h)', dataIndex: 'duration' },
                { title: '腐蚀情况描述', dataIndex: 'corrosionDesc' },
                { title: '保护等级 (Rp/Ra)', dataIndex: 'rating' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 9,
        name: '混凝土抗压强度试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '抗压强度',
        standard: 'GB/T 50081-2019',
        schema: {
            title: '混凝土立方体抗压强度试验记录',
            header: {
                methodBasis: 'GB/T 50081-2019',
                device: '压力试验机'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '试件编号', dataIndex: 'sampleId' },
                { title: '养护龄期 (d)', dataIndex: 'age' },
                { title: '破坏荷载 (kN)', dataIndex: 'load' },
                { title: '抗压强度 (MPa)', dataIndex: 'strength' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 10,
        name: '混凝土抗折强度试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '抗折强度',
        standard: 'GB/T 50081-2019',
        schema: {
            title: '混凝土抗折强度试验记录',
            header: {
                methodBasis: 'GB/T 50081-2019',
                device: '万能试验机'
            },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '试件编号', dataIndex: 'sampleId' },
                { title: '跨度 (mm)', dataIndex: 'span' },
                { title: '破坏荷载 (kN)', dataIndex: 'load' },
                { title: '抗折强度 (MPa)', dataIndex: 'strength' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 11,
        name: '金属拉伸试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '屈服强度',
        standard: 'GB/T 228.1-2021',
        schema: {
            title: '金属材料拉伸试验记录',
            header: { methodBasis: 'GB/T 228.1-2021', device: '电子万能试验机' },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '屈服强度 (MPa)', dataIndex: 'yieldStrength' },
                { title: '抗拉强度 (MPa)', dataIndex: 'tensileStrength' },
                { title: '断后伸长率 (%)', dataIndex: 'elongation' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 12,
        name: '金属拉伸试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '抗拉强度',
        standard: 'GB/T 228.1-2021',
        schema: {
            title: '金属材料拉伸试验记录',
            header: { methodBasis: 'GB/T 228.1-2021', device: '电子万能试验机' },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '屈服强度 (MPa)', dataIndex: 'yieldStrength' },
                { title: '抗拉强度 (MPa)', dataIndex: 'tensileStrength' },
                { title: '断后伸长率 (%)', dataIndex: 'elongation' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    },
    {
        id: 13,
        name: '金属拉伸试验记录.xlsx',
        createDate: '2023-11-26',
        author: '管理员',
        parameterName: '伸长率',
        standard: 'GB/T 228.1-2021',
        schema: {
            title: '金属材料拉伸试验记录',
            header: { methodBasis: 'GB/T 228.1-2021', device: '电子万能试验机' },
            columns: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: '样品编号', dataIndex: 'sampleId' },
                { title: '屈服强度 (MPa)', dataIndex: 'yieldStrength' },
                { title: '抗拉强度 (MPa)', dataIndex: 'tensileStrength' },
                { title: '断后伸长率 (%)', dataIndex: 'elongation' },
                { title: '结果判定', dataIndex: 'result' }
            ],
            environment: true
        }
    }
];
