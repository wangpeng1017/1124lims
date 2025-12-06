// 报告管理模块 Mock数据 - Enhanced Version

// 样品检测报告接口 (任务报告)
export interface ITestReport {
    id: number;
    reportNo: string;           // 报告编号（格式：RPT-YYYYMMDD-XXX）
    entrustmentId: string;      // 委托单号
    projectId: string;          // 项目ID
    projectName: string;        //项目名称
    clientName: string;         // 委托单位
    sampleNo: string;           // 样品编号
    sampleName: string;         // 样品名称
    taskNo: string;             // 检测任务编号
    testParameters: string[];   // 检测参数
    testResults: {              // 检测结果
        parameter: string;
        result: string;
        unit: string;
        conclusion: string;
    }[];
    standardName: string;       // 检测标准
    tester: string;             // 检测人员
    reviewer?: string;          // 审核人员
    approver?: string;          // 批准人员
    reportType: string;         // 报告分类
    templateId: number;         // 模板ID
    status: '草稿' | '待审核' | '已审核' | '已批准' | '已发布';
    generatedDate: string;      // 生成日期
    reviewedDate?: string;      // 审核日期
    approvedDate?: string;      // 批准日期
}

// 客户报告接口 (原项目报告，合并多个任务报告)
export interface IClientReport {
    id: number;
    reportNo: string;              // 报告编号：如 ALTC-TC-JR-002-2/II
    entrustmentId: string;         // 委托单号
    projectId: string;             // 项目ID
    projectName: string;           // 项目名称
    clientName: string;            // 委托单位
    clientAddress?: string;        // 委托单位地址

    // 样品信息
    sampleName: string;            // 样品名称
    sampleNo: string;              // 样品编号
    specification?: string;        // 型号规格
    sampleQuantity?: string;       // 样品数量
    sampleStatus?: string;         // 样品状态
    receivedDate?: string;         // 接样日期
    testCategory?: string;         // 检验类别

    // 关联的任务报告
    taskReportNos: string[];       // 任务报告编号列表

    // 汇总信息
    testItems: string[];           // 检测项目列表
    testStandards: string[];       // 检测依据列表
    testDateRange: {               // 检测日期范围
        start: string;
        end: string;
    };

    // 结论与备注
    overallConclusion?: string;    // 总体结论
    remarks?: string;              // 备注

    // 审批信息
    preparer: string;              // 编制人
    reviewer?: string;             // 审核人
    approver?: string;             // 批准人

    // 状态管理
    status: '草稿' | '待审核' | '待批准' | '已批准' | '已发布';
    generatedDate: string;
    reviewedDate?: string;
    approvedDate?: string;
    issuedDate?: string;

    // 模板关联
    templateId: number;
}

// 报告审核记录接口
export interface IReportReview {
    id: number;
    reportNo: string;           // 报告编号
    reviewerName: string;       // 审核人
    reviewType: '审核' | '批准';
    reviewResult: '通过' | '驳回';
    comments: string;           // 批注意见
    reviewDate: string;
    dingTalkProcessId?: string; // 钉钉审批流程ID（模拟）
}



// 报告模板接口
export interface IReportTemplate {
    id: number;
    name: string;
    code: string;
    category: string;
    fileUrl: string; // 模拟文件路径
    uploadDate: string;
    uploader: string;
    status: 'active' | 'inactive';
}

// 报告分类接口
export interface IReportCategory {
    id: number;
    categoryName: string;       // 分类名称
    categoryCode: string;       // 分类代码
    testTypes: string[];        // 适用的试验类型
    templateName: string;       // 模板名称
    description: string;        // 描述
}

// ========== 客户报告模板接口 ==========

// 模板页面布局项
export interface ITemplateLayoutItem {
    id: string;
    type: 'text' | 'image' | 'field' | 'table' | 'signature' | 'declaration' | 'header';
    x: number;
    y: number;
    w: number;
    h: number;
    config: {
        content?: string;           // 文本内容
        fontSize?: number;          // 字体大小
        fontWeight?: 'normal' | 'bold';
        textAlign?: 'left' | 'center' | 'right';
        imageUrl?: string;          // 图片URL
        fieldKey?: string;          // 数据字段Key
        fieldLabel?: string;        // 字段标签
        declarations?: string[];    // 声明内容
        [key: string]: any;
    };
}

// 模板页面配置
export interface ITemplatePage {
    id: string;
    type: 'cover' | 'info' | 'result';
    name: string;
    layout: ITemplateLayoutItem[];
}

// 客户报告模板
export interface IClientReportTemplate {
    id: string;
    name: string;                   // 模板名称
    clientId?: string;              // 关联客户ID
    clientName?: string;            // 关联客户名称
    baseTemplateId?: string;        // 继承自哪个模板
    isDefault: boolean;             // 是否默认模板

    // 公司信息
    companyInfo: {
        logoUrl: string;
        nameCn: string;
        nameEn: string;
        address: string;
        postalCode: string;
        phone: string;
    };

    // 客户Logo（可选）
    clientLogoUrl?: string;

    // 页面配置
    pages: ITemplatePage[];

    // 声明内容
    declarations: string[];

    status: 'active' | 'inactive';
    createTime: string;
    updateTime: string;
}

// ========== 客户报告模板数据 ==========

export const clientReportTemplateData: IClientReportTemplate[] = [
    {
        id: 'TPL-CHERY-001',
        name: '奇瑞汽车金相检测报告模板',
        clientId: 'CLIENT-CHERY',
        clientName: '奇瑞汽车股份有限公司',
        isDefault: false,

        companyInfo: {
            logoUrl: '/assets/altc-logo.png',
            nameCn: '江苏国轻检测技术有限公司',
            nameEn: 'Jiangsu Guoqing Testing Technology Co.,Ltd',
            address: '江苏省扬州市邗江区金山路99号B栋1-3层',
            postalCode: '225000',
            phone: '0514-80585092'
        },

        pages: [
            {
                id: 'cover',
                type: 'cover',
                name: '封面页',
                layout: [
                    { id: 'logo', type: 'image', x: 0, y: 0, w: 12, h: 2, config: { imageUrl: '/assets/altc-logo.png' } },
                    { id: 'title', type: 'text', x: 0, y: 3, w: 12, h: 2, config: { content: '检 测 报 告', fontSize: 36, fontWeight: 'bold', textAlign: 'center' } },
                    { id: 'reportNo', type: 'field', x: 0, y: 6, w: 12, h: 1, config: { fieldKey: 'reportNo', fieldLabel: '报告编号' } },
                    { id: 'sampleName', type: 'field', x: 0, y: 7, w: 12, h: 1, config: { fieldKey: 'sampleName', fieldLabel: '样品名称' } },
                    { id: 'testItem', type: 'field', x: 0, y: 8, w: 12, h: 1, config: { fieldKey: 'testItems', fieldLabel: '检测项目' } },
                    { id: 'clientName', type: 'field', x: 0, y: 9, w: 12, h: 1, config: { fieldKey: 'clientName', fieldLabel: '委托单位' } },
                    { id: 'clientAddress', type: 'field', x: 0, y: 10, w: 12, h: 1, config: { fieldKey: 'clientAddress', fieldLabel: '委托单位地址' } },
                    { id: 'declarations', type: 'declaration', x: 0, y: 12, w: 12, h: 4, config: {} }
                ]
            },
            {
                id: 'info',
                type: 'info',
                name: '检测信息页',
                layout: [
                    { id: 'header', type: 'header', x: 0, y: 0, w: 12, h: 1, config: {} },
                    {
                        id: 'infoTable', type: 'table', x: 0, y: 2, w: 12, h: 8, config: {
                            fields: ['sampleName', 'sampleNo', 'specification', 'clientName', 'sampleStatus',
                                'sampleQuantity', 'receivedDate', 'testCategory', 'entrustmentId',
                                'testItems', 'testStandards', 'testDate']
                        }
                    },
                    { id: 'resultSummary', type: 'text', x: 0, y: 11, w: 12, h: 2, config: { content: '实测结果见数据页。', textAlign: 'left' } },
                    { id: 'signatures', type: 'signature', x: 0, y: 14, w: 12, h: 2, config: { roles: ['编制', '审核', '批准'] } }
                ]
            },
            {
                id: 'result',
                type: 'result',
                name: '检测结果页',
                layout: [
                    { id: 'header', type: 'header', x: 0, y: 0, w: 12, h: 1, config: {} },
                    { id: 'resultTitle', type: 'text', x: 0, y: 2, w: 12, h: 1, config: { content: '检测结果:', fontWeight: 'bold' } },
                    { id: 'resultDesc', type: 'field', x: 0, y: 3, w: 12, h: 3, config: { fieldKey: 'resultDescription' } },
                    { id: 'imageTable', type: 'table', x: 0, y: 7, w: 12, h: 8, config: { type: 'image', columns: ['样品编号', '金相'] } }
                ]
            }
        ],

        declarations: [
            '1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；',
            '2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；',
            '3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；单独抽出某些页导致误解或用于其他用途而造成的后果，本公司不负任何法律责任；',
            '4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。'
        ],

        status: 'active',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
    },
    {
        id: 'TPL-DEFAULT-001',
        name: '通用检测报告模板',
        isDefault: true,

        companyInfo: {
            logoUrl: '/assets/altc-logo.png',
            nameCn: '江苏国轻检测技术有限公司',
            nameEn: 'Jiangsu Guoqing Testing Technology Co.,Ltd',
            address: '江苏省扬州市邗江区金山路99号B栋1-3层',
            postalCode: '225000',
            phone: '0514-80585092'
        },

        pages: [
            {
                id: 'cover',
                type: 'cover',
                name: '封面页',
                layout: [
                    { id: 'logo', type: 'image', x: 0, y: 0, w: 12, h: 2, config: { imageUrl: '/assets/altc-logo.png' } },
                    { id: 'title', type: 'text', x: 0, y: 3, w: 12, h: 2, config: { content: '检 测 报 告', fontSize: 36, fontWeight: 'bold', textAlign: 'center' } },
                    { id: 'reportNo', type: 'field', x: 0, y: 6, w: 12, h: 1, config: { fieldKey: 'reportNo', fieldLabel: '报告编号' } },
                    { id: 'sampleName', type: 'field', x: 0, y: 7, w: 12, h: 1, config: { fieldKey: 'sampleName', fieldLabel: '样品名称' } },
                    { id: 'clientName', type: 'field', x: 0, y: 8, w: 12, h: 1, config: { fieldKey: 'clientName', fieldLabel: '委托单位' } },
                    { id: 'declarations', type: 'declaration', x: 0, y: 10, w: 12, h: 4, config: {} }
                ]
            },
            {
                id: 'info',
                type: 'info',
                name: '检测信息页',
                layout: [
                    { id: 'header', type: 'header', x: 0, y: 0, w: 12, h: 1, config: {} },
                    {
                        id: 'infoTable', type: 'table', x: 0, y: 2, w: 12, h: 8, config: {
                            fields: ['sampleName', 'sampleNo', 'clientName', 'testItems', 'testStandards', 'testDate']
                        }
                    },
                    { id: 'signatures', type: 'signature', x: 0, y: 12, w: 12, h: 2, config: { roles: ['编制', '审核', '批准'] } }
                ]
            }
        ],

        declarations: [
            '1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；',
            '2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；',
            '3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；',
            '4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。'
        ],

        status: 'active',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
    }
];

// ========== MOCK DATA ==========


// 模拟报告模板数据
export const reportTemplateData: IReportTemplate[] = [
    {
        id: 1,
        name: '力学性能标准模板',
        code: 'TPL-MECH-001',
        category: '力学性能报告',
        fileUrl: '/templates/mech_template_v1.docx',
        uploadDate: '2023-01-15',
        uploader: 'Admin',
        status: 'active'
    },
    {
        id: 2,
        name: '材料性能标准模板',
        code: 'TPL-MAT-001',
        category: '材料性能报告',
        fileUrl: '/templates/mat_template_v1.docx',
        uploadDate: '2023-02-20',
        uploader: 'Admin',
        status: 'active'
    },
    {
        id: 3,
        name: '化学性能标准模板',
        code: 'TPL-CHEM-001',
        category: '化学性能报告',
        fileUrl: '/templates/chem_template_v1.docx',
        uploadDate: '2023-03-10',
        uploader: 'Admin',
        status: 'active'
    },
    {
        id: 4,
        name: '金相分析标准模板',
        code: 'TPL-META-001',
        category: '金相分析报告',
        fileUrl: '/templates/meta_template_v1.docx',
        uploadDate: '2023-04-05',
        uploader: 'Admin',
        status: 'active'
    }
];

// ========== 测试数据：奇瑞汽车 ==========
// Entrustment: WT20231101001 - 奇瑞汽车复合材料检测
// Project 1: P001 - 复合材料力学性能
//   - Task: TASK001 - 抗拉强度
//   - Task: TASK002 - 抗压强度  
//   - Task: TASK003 - 弯曲强度
// Project 2: P002 - 金相分析
//   - Task: TASK004 - 金相组织

export const testReportData: ITestReport[] = [
    // 奇瑞汽车 - 复合材料力学性能 - 3个任务
    {
        id: 1,
        reportNo: 'RPT-20231201-001',
        entrustmentId: 'WT20231101001',
        projectId: 'P001',
        projectName: '复合材料力学性能检测',
        clientName: '奇瑞汽车股份有限公司',
        sampleNo: 'ALTC2509034',
        sampleName: '复合材料试件',
        taskNo: 'TASK001',
        testParameters: ['抗拉强度'],
        testResults: [
            { parameter: '抗拉强度', result: '520', unit: 'MPa', conclusion: '合格' }
        ],
        standardName: 'GB/T 1040.1-2018',
        tester: '张三',
        reviewer: '李四',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-12-01',
        reviewedDate: '2023-12-02',
        approvedDate: '2023-12-03'
    },
    {
        id: 2,
        reportNo: 'RPT-20231201-002',
        entrustmentId: 'WT20231101001',
        projectId: 'P001',
        projectName: '复合材料力学性能检测',
        clientName: '奇瑞汽车股份有限公司',
        sampleNo: 'ALTC2509034',
        sampleName: '复合材料试件',
        taskNo: 'TASK002',
        testParameters: ['抗压强度'],
        testResults: [
            { parameter: '抗压强度', result: '450', unit: 'MPa', conclusion: '合格' }
        ],
        standardName: 'GB/T 1041-2008',
        tester: '李四',
        reviewer: '张三',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-12-01',
        reviewedDate: '2023-12-02',
        approvedDate: '2023-12-03'
    },
    {
        id: 3,
        reportNo: 'RPT-20231201-003',
        entrustmentId: 'WT20231101001',
        projectId: 'P001',
        projectName: '复合材料力学性能检测',
        clientName: '奇瑞汽车股份有限公司',
        sampleNo: 'ALTC2509034',
        sampleName: '复合材料试件',
        taskNo: 'TASK003',
        testParameters: ['弯曲强度'],
        testResults: [
            { parameter: '弯曲强度', result: '380', unit: 'MPa', conclusion: '合格' }
        ],
        standardName: 'GB/T 9341-2008',
        tester: '赵六',
        reviewer: '李四',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-12-01',
        reviewedDate: '2023-12-02',
        approvedDate: '2023-12-03'
    },
    // 奇瑞汽车 - 金相分析
    {
        id: 4,
        reportNo: 'RPT-20231201-004',
        entrustmentId: 'WT20231101001',
        projectId: 'P002',
        projectName: '金相分析',
        clientName: '奇瑞汽车股份有限公司',
        sampleNo: 'ALTC2510007G',
        sampleName: '金属材料试件',
        taskNo: 'TASK004',
        testParameters: ['金相组织', '显微硬度'],
        testResults: [
            { parameter: '金相组织', result: '珠光体+铁素体', unit: '', conclusion: '符合要求' },
            { parameter: '显微硬度', result: '220', unit: 'HV', conclusion: '合格' }
        ],
        standardName: 'GB/T 13298-2015',
        tester: '王五',
        reviewer: '张三',
        approver: '李四',
        reportType: '金相分析报告',
        templateId: 4,
        status: '已批准',
        generatedDate: '2023-12-01',
        reviewedDate: '2023-12-02',
        approvedDate: '2023-12-03'
    },

    // ========== 上汽集团 - 钢材检测 ==========
    // Entrustment: WT20231102002 - 上汽集团钢材检测
    // Project 1: P003 - 钢材成分分析
    //   - Task: TASK005 - 化学成分
    // Project 2: P004 - 钢材力学性能
    //   - Task: TASK006 - 屈服强度
    //   - Task: TASK007 - 抗拉强度
    {
        id: 5,
        reportNo: 'RPT-20231202-001',
        entrustmentId: 'WT20231102002',
        projectId: 'P003',
        projectName: '钢材成分分析',
        clientName: '上海汽车集团股份有限公司',
        sampleNo: 'S20231102001',
        sampleName: 'Q235钢板',
        taskNo: 'TASK005',
        testParameters: ['碳含量', '硅含量', '锰含量'],
        testResults: [
            { parameter: '碳含量', result: '0.18', unit: '%', conclusion: '合格' },
            { parameter: '硅含量', result: '0.25', unit: '%', conclusion: '合格' },
            { parameter: '锰含量', result: '0.55', unit: '%', conclusion: '合格' }
        ],
        standardName: 'GB/T 700-2006',
        tester: '孙七',
        reviewer: '李四',
        approver: '王五',
        reportType: '化学性能报告',
        templateId: 3,
        status: '已批准',
        generatedDate: '2023-12-02',
        reviewedDate: '2023-12-03',
        approvedDate: '2023-12-04'
    },
    {
        id: 6,
        reportNo: 'RPT-20231202-002',
        entrustmentId: 'WT20231102002',
        projectId: 'P004',
        projectName: '钢材力学性能',
        clientName: '上海汽车集团股份有限公司',
        sampleNo: 'S20231102001',
        sampleName: 'Q235钢板',
        taskNo: 'TASK006',
        testParameters: ['屈服强度'],
        testResults: [
            { parameter: '屈服强度', result: '245', unit: 'MPa', conclusion: '合格' }
        ],
        standardName: 'GB/T 228.1-2021',
        tester: '张三',
        reviewer: '李四',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-12-02',
        reviewedDate: '2023-12-03',
        approvedDate: '2023-12-04'
    },
    {
        id: 7,
        reportNo: 'RPT-20231202-003',
        entrustmentId: 'WT20231102002',
        projectId: 'P004',
        projectName: '钢材力学性能',
        clientName: '上海汽车集团股份有限公司',
        sampleNo: 'S20231102001',
        sampleName: 'Q235钢板',
        taskNo: 'TASK007',
        testParameters: ['抗拉强度', '伸长率'],
        testResults: [
            { parameter: '抗拉强度', result: '420', unit: 'MPa', conclusion: '合格' },
            { parameter: '伸长率', result: '28', unit: '%', conclusion: '合格' }
        ],
        standardName: 'GB/T 228.1-2021',
        tester: '李四',
        reviewer: '张三',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-12-02',
        reviewedDate: '2023-12-03',
        approvedDate: '2023-12-04'
    },

    // ========== 比亚迪 - 电池材料 ==========
    // Entrustment: WT20231103003 - 比亚迪电池材料
    // Project: P005 - 电池性能测试
    //   - Task: TASK008 - 容量测试
    //   - Task: TASK009 - 循环寿命
    {
        id: 8,
        reportNo: 'RPT-20231203-001',
        entrustmentId: 'WT20231103003',
        projectId: 'P005',
        projectName: '电池性能测试',
        clientName: '比亚迪汽车工业有限公司',
        sampleNo: 'S20231103001',
        sampleName: '锂电池样品',
        taskNo: 'TASK008',
        testParameters: ['额定容量', '实际容量'],
        testResults: [
            { parameter: '额定容量', result: '100', unit: 'Ah', conclusion: '符合标准' },
            { parameter: '实际容量', result: '102', unit: 'Ah', conclusion: '合格' }
        ],
        standardName: 'GB/T 31467.3-2015',
        tester: '周八',
        reviewer: '张三',
        approver: '李四',
        reportType: '化学性能报告',
        templateId: 3,
        status: '已批准',
        generatedDate: '2023-12-03',
        reviewedDate: '2023-12-04',
        approvedDate: '2023-12-05'
    },
    {
        id: 9,
        reportNo: 'RPT-20231203-002',
        entrustmentId: 'WT20231103003',
        projectId: 'P005',
        projectName: '电池性能测试',
        clientName: '比亚迪汽车工业有限公司',
        sampleNo: 'S20231103001',
        sampleName: '锂电池样品',
        taskNo: 'TASK009',
        testParameters: ['循环寿命'],
        testResults: [
            { parameter: '循环寿命', result: '1200', unit: '次', conclusion: '合格' }
        ],
        standardName: 'GB/T 31467.3-2015',
        tester: '吴九',
        reviewer: '李四',
        approver: '王五',
        reportType: '化学性能报告',
        templateId: 3,
        status: '待审核',
        generatedDate: '2023-12-03'
    }
];

// 客户报告数据 (合并后的报告)
export const clientReportData: IClientReport[] = [
    // 奇瑞汽车 - 复合材料力学性能 (合并3个任务)
    {
        id: 1,
        reportNo: 'ALTC-TC-JR-002-2/II',
        entrustmentId: 'WT20231101001',
        projectId: 'P001',
        projectName: '复合材料力学性能检测',
        clientName: '奇瑞汽车股份有限公司',
        clientAddress: '安徽省芜湖市经济技术开发区长春路8号',

        sampleName: '复合材料试件',
        sampleNo: 'ALTC2509034',
        specification: '100x20x5mm',
        sampleQuantity: '5',
        sampleStatus: '完好',
        receivedDate: '2023-11-28',
        testCategory: '委托检验',

        taskReportNos: ['RPT-20231201-001', 'RPT-20231201-002', 'RPT-20231201-003'],

        testItems: ['抗拉强度', '抗压强度', '弯曲强度'],
        testStandards: ['GB/T 1040.1-2018', 'GB/T 1041-2008', 'GB/T 9341-2008'],
        testDateRange: {
            start: '2023-12-01',
            end: '2023-12-01'
        },

        overallConclusion: '经检测，送检样品的抗拉强度、抗压强度、弯曲强度均符合相关标准要求，综合判定：合格。',
        remarks: '本次检测样品由委托方提供，检测结果仅对送检样品负责。',

        preparer: '张三',
        reviewer: '李四',
        approver: '王五',

        status: '已批准',
        generatedDate: '2023-12-03',
        reviewedDate: '2023-12-03',
        approvedDate: '2023-12-03',
        issuedDate: '2023-12-03',

        templateId: 1
    },
    // 上汽集团 - 钢材力学性能 (合并2个任务)
    {
        id: 2,
        reportNo: 'ALTC-TC-JR-003-1/I',
        entrustmentId: 'WT20231102002',
        projectId: 'P004',
        projectName: '钢材力学性能',
        clientName: '上海汽车集团股份有限公司',
        clientAddress: '上海市静安区威海路489号',

        sampleName: 'Q235钢板',
        sampleNo: 'S20231102001',
        specification: '200x200x10mm',
        sampleQuantity: '3',
        sampleStatus: '完好',
        receivedDate: '2023-11-30',
        testCategory: '委托检验',

        taskReportNos: ['RPT-20231202-002', 'RPT-20231202-003'],

        testItems: ['屈服强度', '抗拉强度', '伸长率'],
        testStandards: ['GB/T 228.1-2021'],
        testDateRange: {
            start: '2023-12-02',
            end: '2023-12-02'
        },

        overallConclusion: '经检测，送检样品的屈服强度、抗拉强度、伸长率均符合GB/T 700-2006标准要求，综合判定：合格。',

        preparer: '李四',
        reviewer: '张三',
        approver: '王五',

        status: '已发布',
        generatedDate: '2023-12-04',
        reviewedDate: '2023-12-04',
        approvedDate: '2023-12-04',
        issuedDate: '2023-12-04',

        templateId: 1
    }
];

// 模拟审核记录数据
export const reportReviewData: IReportReview[] = [
    {
        id: 1,
        reportNo: 'RPT-20231201-001',
        reviewerName: '李四',
        reviewType: '审核',
        reviewResult: '通过',
        comments: '数据准确，符合标准要求',
        reviewDate: '2023-12-02 10:30:00',
        dingTalkProcessId: 'DD-PROC-20231202-001'
    },
    {
        id: 2,
        reportNo: 'RPT-20231201-001',
        reviewerName: '王五',
        reviewType: '批准',
        reviewResult: '通过',
        comments: '同意发布',
        reviewDate: '2023-12-03 09:15:00',
        dingTalkProcessId: 'DD-PROC-20231202-001'
    }
];



// 模拟报告分类数据
export const reportCategoryData: IReportCategory[] = [
    {
        id: 1,
        categoryName: '力学性能报告',
        categoryCode: 'MECH',
        testTypes: ['抗压强度', '抗拉强度', '弯曲性能', '屈服强度'],
        templateName: '力学性能标准模板',
        description: '适用于材料力学性能测试报告'
    },
    {
        id: 2,
        categoryName: '材料性能报告',
        categoryCode: 'MAT',
        testTypes: ['级配分析', '含泥量', '密度'],
        templateName: '材料性能标准模板',
        description: '适用于建筑材料性能测试报告'
    },
    {
        id: 3,
        categoryName: '化学性能报告',
        categoryCode: 'CHEM',
        testTypes: ['化学成分', '凝结时间', '安定性', '电池性能'],
        templateName: '化学性能标准模板',
        description: '适用于化学性能分析报告'
    },
    {
        id: 4,
        categoryName: '金相分析报告',
        categoryCode: 'META',
        testTypes: ['金相组织', '显微硬度', '晶粒度'],
        templateName: '金相分析标准模板',
        description: '适用于金相分析报告'
    }
];
