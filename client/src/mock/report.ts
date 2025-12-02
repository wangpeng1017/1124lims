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

// 项目报告接口 (合并多个任务报告)
export interface IProjectReport {
    id: number;
    projectReportNo: string;        // 项目报告编号 (auto-generated: RPT-[Date]-[Seq])
    entrustmentId: string;          // 委托单号
    projectId: string;              // 项目ID
    projectName: string;            // 项目名称
    clientName: string;             // 委托单位
    taskReportNos: string[];        // 关联的任务报告编号列表
    coverInfo: {                    // 封面信息
        reportTitle: string;
        clientName: string;
        clientAddress?: string;
        clientContact?: string;
        reportNo: string;
        testDate: string;
        issueDate: string;
    };
    summaryInfo: {                  // 总结页信息
        projectName: string;
        sampleInfo: string;
        testStandard: string;
        conclusion: string;         // 综合判定结论
        remarks?: string;
    };
    mergedTestResults: any[];       // 合并后的检测结果 (from all tasks)
    status: 'draft' | 'pending' | 'approved' | 'issued';
    templateId: number;
    generatedDate: string;
    issuedDate?: string;
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

// 报告分类接口
export interface IReportCategory {
    id: number;
    categoryName: string;       // 分类名称
    categoryCode: string;       // 分类代码
    testTypes: string[];        // 适用的试验类型
    templateName: string;       // 模板名称
    description: string;        // 描述
}

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

// 项目报告数据 (合并后的报告)
export const projectReportData: IProjectReport[] = [
    // 奇瑞汽车 - 复合材料力学性能 (合并3个任务)
    {
        id: 1,
        projectReportNo: 'RPT-20231203-P001',
        entrustmentId: 'WT20231101001',
        projectId: 'P001',
        projectName: '复合材料力学性能检测',
        clientName: '奇瑞汽车股份有限公司',
        taskReportNos: ['RPT-20231201-001', 'RPT-20231201-002', 'RPT-20231201-003'],
        coverInfo: {
            reportTitle: '复合材料力学性能检测报告',
            clientName: '奇瑞汽车股份有限公司',
            clientAddress: '安徽省芜湖市经济技术开发区长春路8号',
            clientContact: '王经理 / 13800138001',
            reportNo: 'RPT-20231203-P001',
            testDate: '2023-12-01',
            issueDate: '2023-12-03'
        },
        summaryInfo: {
            projectName: '复合材料力学性能检测',
            sampleInfo: '样品编号：ALTC2509034，样品名称：复合材料试件',
            testStandard: 'GB/T 1040.1-2018, GB/T 1041-2008, GB/T 9341-2008',
            conclusion: '经检测，送检样品的抗拉强度、抗压强度、弯曲强度均符合相关标准要求，综合判定：合格。',
            remarks: '本次检测样品由委托方提供，检测结果仅对送检样品负责。'
        },
        mergedTestResults: [
            { taskNo: 'TASK001', parameter: '抗拉强度', result: '520', unit: 'MPa', conclusion: '合格' },
            { taskNo: 'TASK002', parameter: '抗压强度', result: '450', unit: 'MPa', conclusion: '合格' },
            { taskNo: 'TASK003', parameter: '弯曲强度', result: '380', unit: 'MPa', conclusion: '合格' }
        ],
        status: 'approved',
        templateId: 1,
        generatedDate: '2023-12-03',
        issuedDate: '2023-12-03'
    },
    // 上汽集团 - 钢材力学性能 (合并2个任务)
    {
        id: 2,
        projectReportNo: 'RPT-20231204-P004',
        entrustmentId: 'WT20231102002',
        projectId: 'P004',
        projectName: '钢材力学性能',
        clientName: '上海汽车集团股份有限公司',
        taskReportNos: ['RPT-20231202-002', 'RPT-20231202-003'],
        coverInfo: {
            reportTitle: '钢材力学性能检测报告',
            clientName: '上海汽车集团股份有限公司',
            clientAddress: '上海市静安区威海路489号',
            clientContact: '李主管 / 13900139002',
            reportNo: 'RPT-20231204-P004',
            testDate: '2023-12-02',
            issueDate: '2023-12-04'
        },
        summaryInfo: {
            projectName: '钢材力学性能',
            sampleInfo: '样品编号：S20231102001，样品名称：Q235钢板',
            testStandard: 'GB/T 228.1-2021',
            conclusion: '经检测，送检样品的屈服强度、抗拉强度、伸长率均符合GB/T 700-2006标准要求，综合判定：合格。'
        },
        mergedTestResults: [
            { taskNo: 'TASK006', parameter: '屈服强度', result: '245', unit: 'MPa', conclusion: '合格' },
            { taskNo: 'TASK007', parameter: '抗拉强度', result: '420', unit: 'MPa', conclusion: '合格' },
            { taskNo: 'TASK007', parameter: '伸长率', result: '28', unit: '%', conclusion: '合格' }
        ],
        status: 'issued',
        templateId: 1,
        generatedDate: '2023-12-04',
        issuedDate: '2023-12-04'
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

// 模拟原始记录数据
export const rawRecordData: IRawRecord[] = [
    {
        id: 1,
        recordNo: 'RAW-20231201-001',
        entrustmentId: 'WT20231101001',
        clientName: '奇瑞汽车股份有限公司',
        samples: [
            {
                sampleNo: 'ALTC2509034',
                sampleName: '复合材料试件',
                parameters: ['抗拉强度', '抗压强度', '弯曲强度']
            }
        ],
        testDataSummary: [
            { sampleNo: 'ALTC2509034', parameter: '抗拉强度', value1: '521', value2: '519', result: '520', unit: 'MPa' }
        ],
        generatedDate: '2023-12-01'
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
