// 报告管理模块 Mock数据

// 样品检测报告接口
export interface ITestReport {
    id: number;
    reportNo: string;           // 报告编号（格式：RPT-YYYYMMDD-XXX）
    entrustmentId: string;      // 委托单号
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

// 原始记录接口（委托单维度）
export interface IRawRecord {
    id: number;
    recordNo: string;           // 原始记录编号
    entrustmentId: string;      // 委托单号
    clientName: string;         // 委托单位
    samples: {                  // 包含的样品
        sampleNo: string;
        sampleName: string;
        parameters: string[];
    }[];
    testDataSummary: any[];     // 检测数据汇总
    generatedDate: string;
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
    }
];

// 报告分类接口
export interface IReportCategory {
    id: number;
    categoryName: string;       // 分类名称
    categoryCode: string;       // 分类代码
    testTypes: string[];        // 适用的试验类型
    templateName: string;       // 模板名称
    description: string;        // 描述
}

// 模拟检测报告数据
export const testReportData: ITestReport[] = [
    {
        id: 1,
        reportNo: 'RPT-20231125-001',
        entrustmentId: 'WT20231101001',
        clientName: '某汽车零部件公司',
        sampleNo: 'S20231101001',
        sampleName: '钢筋混凝土试件',
        taskNo: 'TASK20231101001',
        testParameters: ['抗压强度', '外观质量'],
        testResults: [
            { parameter: '抗压强度', result: '35.0', unit: 'MPa', conclusion: '合格' },
            { parameter: '外观质量', result: '无裂纹', unit: '', conclusion: '合格' }
        ],
        standardName: 'GB/T 50081-2019',
        tester: '张三',
        reviewer: '李四',
        approver: '王五',
        reportType: '力学性能报告',
        templateId: 1,
        status: '已批准',
        generatedDate: '2023-11-06',
        reviewedDate: '2023-11-07',
        approvedDate: '2023-11-08'
    },
    {
        id: 2,
        reportNo: 'RPT-20231125-002',
        entrustmentId: 'WT20231102001',
        clientName: '某建筑材料公司',
        sampleNo: 'S20231102001',
        sampleName: '砂石料',
        taskNo: 'TASK20231102001',
        testParameters: ['级配分析', '含泥量'],
        testResults: [
            { parameter: '级配分析', result: '符合要求', unit: '', conclusion: '合格' }
        ],
        standardName: 'GB/T 14684-2011',
        tester: '赵六',
        reportType: '材料性能报告',
        templateId: 2,
        status: '待审核',
        generatedDate: '2023-11-10'
    },
    {
        id: 3,
        reportNo: 'RPT-20231124-003',
        entrustmentId: 'WT20231103001',
        clientName: '某新能源公司',
        sampleNo: 'S20231103001',
        sampleName: '水泥',
        taskNo: 'TASK20231103001',
        testParameters: ['凝结时间', '安定性'],
        testResults: [],
        standardName: 'GB 175-2007',
        tester: '孙七',
        reportType: '化学性能报告',
        templateId: 3,
        status: '草稿',
        generatedDate: '2023-11-05'
    }
];

// 模拟审核记录数据
export const reportReviewData: IReportReview[] = [
    {
        id: 1,
        reportNo: 'RPT-20231125-001',
        reviewerName: '李四',
        reviewType: '审核',
        reviewResult: '通过',
        comments: '数据准确，符合标准要求',
        reviewDate: '2023-11-07 10:30:00',
        dingTalkProcessId: 'DD-PROC-20231107-001'
    },
    {
        id: 2,
        reportNo: 'RPT-20231125-001',
        reviewerName: '王五',
        reviewType: '批准',
        reviewResult: '通过',
        comments: '同意发布',
        reviewDate: '2023-11-08 09:15:00',
        dingTalkProcessId: 'DD-PROC-20231107-001'
    },
    {
        id: 3,
        reportNo: 'RPT-20231125-002',
        reviewerName: '李四',
        reviewType: '审核',
        reviewResult: '驳回',
        comments: '检测参数不完整，请补充含泥量数据',
        reviewDate: '2023-11-11 14:20:00'
    }
];

// 模拟原始记录数据
export const rawRecordData: IRawRecord[] = [
    {
        id: 1,
        recordNo: 'RAW-20231125-001',
        entrustmentId: 'WT20231101001',
        clientName: '某汽车零部件公司',
        samples: [
            {
                sampleNo: 'S20231101001',
                sampleName: '钢筋混凝土试件',
                parameters: ['抗压强度', '外观质量']
            },
            {
                sampleNo: 'S20231101002',
                sampleName: '水泥试样',
                parameters: ['凝结时间']
            }
        ],
        testDataSummary: [
            { sampleNo: 'S20231101001', parameter: '抗压强度', value1: '35.2', value2: '34.8', result: '35.0', unit: 'MPa' }
        ],
        generatedDate: '2023-11-08'
    }
];

// 模拟报告分类数据
export const reportCategoryData: IReportCategory[] = [
    {
        id: 1,
        categoryName: '力学性能报告',
        categoryCode: 'MECH',
        testTypes: ['抗压强度', '抗拉强度', '弯曲性能'],
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
        testTypes: ['化学成分', '凝结时间', '安定性'],
        templateName: '化学性能标准模板',
        description: '适用于化学性能分析报告'
    }
];
