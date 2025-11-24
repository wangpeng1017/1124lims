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
    {
        id: 1,
        name: '金属显微组织检验方法',
        standardNo: 'GB/T 13298-2015',
        description: '用于金属显微组织检验的标准方法',
        validity: '现行有效',
        devices: ['显微镜A', '显微镜B'],
        parameters: ['显微组织', '晶粒度'],
        personnel: ['张三', '李四']
    },
    {
        id: 2,
        name: '钢的游离渗碳体、珠光体和魏氏组织的评定方法',
        standardNo: 'GB/T 13299-2022',
        description: '评定钢中特定组织的具体方法',
        validity: '现行有效',
        devices: ['显微镜A'],
        parameters: ['游离渗碳体', '珠光体'],
        personnel: ['张三']
    },
    {
        id: 3,
        name: '灰铸铁金相检验',
        standardNo: 'GB/T 7216-2023',
        description: '灰铸铁的金相检验标准',
        validity: '现行有效',
        devices: ['显微镜B'],
        parameters: ['石墨形态', '基体组织'],
        personnel: ['李四', '王五']
    },
    // ... more data can be added as needed
];

export interface DetectionParameter {
    id: number;
    name: string;
    standard: string;
    value: string;
    requirements: string;
    materials: string;
}

export const detectionParametersData: DetectionParameter[] = [
    { id: 1, name: '抗拉强度', standard: 'GB/T 228.1', value: '≥400 MPa', requirements: '室温', materials: '碳钢' },
    { id: 2, name: '屈服强度', standard: 'GB/T 228.1', value: '≥250 MPa', requirements: '室温', materials: '碳钢' },
    { id: 3, name: '延伸率', standard: 'GB/T 228.1', value: '≥20%', requirements: '室温', materials: '碳钢' },
];

export interface ELNTemplate {
    id: number;
    name: string;
    createDate: string;
    author: string;
}

export const elnTemplatesData: ELNTemplate[] = [
    { id: 1, name: '拉伸试验原始记录模板', createDate: '2023-01-01', author: '管理员' },
    { id: 2, name: '金相检验原始记录模板', createDate: '2023-01-15', author: '管理员' },
];
