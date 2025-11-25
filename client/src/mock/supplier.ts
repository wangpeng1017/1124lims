// 供应商管理 Mock 数据

// 供应商分类
export interface ISupplierCategory {
    id: string;
    name: string; // 类别名称
    code: string; // 类别编码
    description: string; // 类别描述
    createTime: string;
    status: 'active' | 'inactive';
}

// 供应商能力
export interface ISupplierCapability {
    id: string;
    parameterId: number; // 关联检测参数ID
    parameterName: string;
    certificateNo: string; // 证书编号
    validFrom: string;
    validTo: string;
    status: 'active' | 'expired';
    remark?: string;
}

// 供应商信息
export interface ISupplier {
    id: string;
    code: string; // 供应商编码
    name: string; // 供应商名称
    categories: string[]; // 供应商类别（支持多选）
    contactPerson: string; // 联系人
    phone: string; // 联系电话
    email: string; // 邮箱
    address: string; // 地址

    // 资质信息
    certifications: {
        type: string; // 资质类型
        number: string; // 证书编号
        issueDate: string; // 发证日期
        expiryDate: string; // 有效期
        attachmentUrl?: string; // 附件
    }[];

    // 检测能力
    capabilities?: ISupplierCapability[];

    // 合作信息
    cooperationStartDate: string; // 合作开始日期
    cooperationStatus: 'active' | 'suspended' | 'terminated'; // 合作状态

    // 评价信息
    overallScore?: number; // 综合评分
    lastEvaluationDate?: string; // 最近评价日期
    evaluationLevel?: 'excellent' | 'good' | 'qualified' | 'unqualified'; // 评价等级

    remark: string; // 备注
    createTime: string;
    updateTime: string;
}

// 评价指标
export interface IEvaluationIndicator {
    id: string;
    name: string; // 指标名称
    weight: number; // 权重（百分比）
    maxScore: number; // 最高分
    description: string; // 指标说明
    order: number; // 排序
}

// 评价模板
export interface IEvaluationTemplate {
    id: string;
    name: string; // 模板名称
    categoryId: string; // 适用的供应商类别
    categoryName: string;
    indicators: IEvaluationIndicator[]; // 评价指标
    totalScore: number; // 总分（通常100分）
    createTime: string;
    updateTime: string;
    status: 'active' | 'inactive';
}

// 供应商评价记录
export interface ISupplierEvaluation {
    id: string;
    supplierId: string; // 供应商ID
    supplierName: string;
    templateId: string; // 评价模板ID
    templateName: string;

    evaluationDate: string; // 评价日期
    evaluationPeriod: string; // 评价周期：2024年第一季度、2024年度

    scores: {
        indicatorId: string;
        indicatorName: string;
        score: number; // 实际得分
        maxScore: number;
        comments: string; // 评价说明
    }[];

    totalScore: number; // 总分
    level: 'excellent' | 'good' | 'qualified' | 'unqualified'; // 评价等级

    evaluator: string; // 评价人
    evaluatorId: string;

    suggestions: string; // 改进建议
    attachments: string[]; // 附件

    createTime: string;
}

// ============ Mock 数据 ============

// 供应商分类数据
export const supplierCategoryData: ISupplierCategory[] = [
    {
        id: 'CAT001',
        name: '外包供应商',
        code: 'OUTSOURCE',
        description: '提供检测服务的第三方机构',
        createTime: '2023-01-01',
        status: 'active'
    },
    {
        id: 'CAT002',
        name: '耗材供应商',
        code: 'CONSUMABLE',
        description: '提供试剂、标准品、备件等物料的供应商',
        createTime: '2023-01-01',
        status: 'active'
    }
];

// 供应商信息数据（迁移并扩展原有数据）
export const supplierData: ISupplier[] = [
    {
        id: 'SUP001',
        code: 'SUP001',
        name: '华测检测认证集团股份有限公司',
        categories: ['CAT001'], // 外包供应商
        contactPerson: '李经理',
        phone: '021-12345678',
        email: 'li@cti-cert.com',
        address: '上海市浦东新区张江高科技园区',
        certifications: [
            {
                type: 'CNAS认证',
                number: 'CNAS L0001',
                issueDate: '2020-01-01',
                expiryDate: '2025-12-31'
            }
        ],
        capabilities: [
            { id: 'CAP001', parameterId: 1, parameterName: '拉伸强度', certificateNo: 'CERT-2023-001', validFrom: '2023-01-01', validTo: '2025-12-31', status: 'active' },
            { id: 'CAP002', parameterId: 4, parameterName: '中性盐雾', certificateNo: 'CERT-2023-002', validFrom: '2023-01-01', validTo: '2025-12-31', status: 'active' }
        ],
        cooperationStartDate: '2023-01-15',
        cooperationStatus: 'active',
        overallScore: 92,
        lastEvaluationDate: '2024-09-30',
        evaluationLevel: 'excellent',
        remark: '金属材料、环境检测、食品安全',
        createTime: '2023-01-15',
        updateTime: '2024-09-30'
    },
    {
        id: 'SUP002',
        code: 'SUP002',
        name: '中国检验认证集团',
        categories: ['CAT001'],
        contactPerson: '王主任',
        phone: '010-88888888',
        email: 'wang@ccic.com',
        address: '北京市朝阳区建国门外大街',
        certifications: [
            {
                type: 'CNAS认证',
                number: 'CNAS L0002',
                issueDate: '2020-02-01',
                expiryDate: '2025-12-31'
            }
        ],
        capabilities: [
            { id: 'CAP003', parameterId: 2, parameterName: '弯曲性能', certificateNo: 'CERT-2023-101', validFrom: '2023-02-01', validTo: '2026-01-31', status: 'active' },
            { id: 'CAP004', parameterId: 5, parameterName: '金相组织', certificateNo: 'CERT-2023-102', validFrom: '2023-02-01', validTo: '2026-01-31', status: 'active' }
        ],
        cooperationStartDate: '2023-02-20',
        cooperationStatus: 'active',
        overallScore: 88,
        lastEvaluationDate: '2024-09-30',
        evaluationLevel: 'good',
        remark: '机械性能、化学分析、无损检测',
        createTime: '2023-02-20',
        updateTime: '2024-09-30'
    },
    {
        id: 'SUP003',
        code: 'SUP003',
        name: '苏州市产品质量监督检验所',
        categories: ['CAT001'],
        contactPerson: '张工',
        phone: '0512-66666666',
        email: 'zhang@szqi.com',
        address: '江苏省苏州市工业园区',
        certifications: [
            {
                type: 'CNAS认证',
                number: 'CNAS L0103',
                issueDate: '2021-03-01',
                expiryDate: '2026-02-28'
            }
        ],
        capabilities: [
            { id: 'CAP005', parameterId: 3, parameterName: '燃烧性能', certificateNo: 'CERT-2023-201', validFrom: '2023-03-01', validTo: '2024-02-28', status: 'active' }
        ],
        cooperationStartDate: '2023-03-10',
        cooperationStatus: 'active',
        overallScore: 85,
        lastEvaluationDate: '2024-06-30',
        evaluationLevel: 'good',
        remark: '塑料材料、橡胶测试',
        createTime: '2023-03-10',
        updateTime: '2024-06-30'
    },
    {
        id: 'SUP004',
        code: 'SUP004',
        name: '上海试剂有限公司',
        categories: ['CAT002'], // 耗材供应商
        contactPerson: '赵经理',
        phone: '021-55555555',
        email: 'zhao@shreagent.com',
        address: '上海市杨浦区',
        certifications: [
            {
                type: '营业执照',
                number: '91310000XXXXXXXX',
                issueDate: '2018-01-01',
                expiryDate: '2028-12-31'
            }
        ],
        cooperationStartDate: '2023-05-01',
        cooperationStatus: 'active',
        overallScore: 90,
        lastEvaluationDate: '2024-09-30',
        evaluationLevel: 'excellent',
        remark: '化学试剂、标准品供应商',
        createTime: '2023-05-01',
        updateTime: '2024-09-30'
    },
    {
        id: 'SUP005',
        code: 'SUP005',
        name: '北京仪器耗材公司',
        categories: ['CAT002'],
        contactPerson: '孙总',
        phone: '010-66666666',
        email: 'sun@bjyqhc.com',
        address: '北京市海淀区中关村',
        certifications: [
            {
                type: '营业执照',
                number: '91110000XXXXXXXX',
                issueDate: '2019-06-01',
                expiryDate: '2029-06-01'
            }
        ],
        cooperationStartDate: '2023-06-15',
        cooperationStatus: 'active',
        overallScore: 82,
        lastEvaluationDate: '2024-06-30',
        evaluationLevel: 'good',
        remark: '实验室耗材、备件供应',
        createTime: '2023-06-15',
        updateTime: '2024-06-30'
    },
    {
        id: 'SUP006',
        code: 'SUP006',
        name: '广州标准物质中心',
        categories: ['CAT002'],
        contactPerson: '周主任',
        phone: '020-88888888',
        email: 'zhou@gzcrm.com',
        address: '广东省广州市天河区',
        certifications: [
            {
                type: '标准物质注册证书',
                number: 'GBW(E)XXXXXX',
                issueDate: '2020-01-01',
                expiryDate: '2025-12-31'
            }
        ],
        cooperationStartDate: '2023-04-01',
        cooperationStatus: 'active',
        overallScore: 95,
        lastEvaluationDate: '2024-09-30',
        evaluationLevel: 'excellent',
        remark: '标准品、对照品供应',
        createTime: '2023-04-01',
        updateTime: '2024-09-30'
    }
];

// 评价模板数据（示例，用户可自行创建）
export const evaluationTemplateData: IEvaluationTemplate[] = [
    {
        id: 'TPL001',
        name: '外包供应商年度评价',
        categoryId: 'CAT001',
        categoryName: '外包供应商',
        indicators: [
            { id: 'IND001', name: '检测能力', weight: 30, maxScore: 30, description: '资质、设备、人员配置', order: 1 },
            { id: 'IND002', name: '服务质量', weight: 30, maxScore: 30, description: '准确性、及时性、沟通配合', order: 2 },
            { id: 'IND003', name: '报告质量', weight: 20, maxScore: 20, description: '规范性、完整性', order: 3 },
            { id: 'IND004', name: '价格合理性', weight: 10, maxScore: 10, description: '性价比', order: 4 },
            { id: 'IND005', name: '合作稳定性', weight: 10, maxScore: 10, description: '长期合作意愿', order: 5 }
        ],
        totalScore: 100,
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
        status: 'active'
    },
    {
        id: 'TPL002',
        name: '耗材供应商季度评价',
        categoryId: 'CAT002',
        categoryName: '耗材供应商',
        indicators: [
            { id: 'IND006', name: '产品质量', weight: 40, maxScore: 40, description: '符合标准、质量稳定性', order: 1 },
            { id: 'IND007', name: '交付及时性', weight: 25, maxScore: 25, description: '按时交货率', order: 2 },
            { id: 'IND008', name: '价格竞争力', weight: 15, maxScore: 15, description: '市场比价', order: 3 },
            { id: 'IND009', name: '售后服务', weight: 10, maxScore: 10, description: '响应速度、问题解决', order: 4 },
            { id: 'IND010', name: '资质合规性', weight: 10, maxScore: 10, description: '产品证书、检验报告', order: 5 }
        ],
        totalScore: 100,
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
        status: 'active'
    }
];

// 供应商评价记录数据
export const supplierEvaluationData: ISupplierEvaluation[] = [
    {
        id: 'EVA001',
        supplierId: 'SUP001',
        supplierName: '华测检测认证集团股份有限公司',
        templateId: 'TPL001',
        templateName: '外包供应商年度评价',
        evaluationDate: '2024-09-30',
        evaluationPeriod: '2024年第三季度',
        scores: [
            { indicatorId: 'IND001', indicatorName: '检测能力', score: 28, maxScore: 30, comments: '资质齐全，设备先进' },
            { indicatorId: 'IND002', indicatorName: '服务质量', score: 27, maxScore: 30, comments: '响应及时，沟通顺畅' },
            { indicatorId: 'IND003', indicatorName: '报告质量', score: 19, maxScore: 20, comments: '报告规范完整' },
            { indicatorId: 'IND004', indicatorName: '价格合理性', score: 9, maxScore: 10, comments: '价格略高但可接受' },
            { indicatorId: 'IND005', indicatorName: '合作稳定性', score: 9, maxScore: 10, comments: '合作稳定' }
        ],
        totalScore: 92,
        level: 'excellent',
        evaluator: '吴凡',
        evaluatorId: 'EMP001',
        suggestions: '继续保持现有服务水平',
        attachments: [],
        createTime: '2024-09-30 10:00:00'
    },
    {
        id: 'EVA002',
        supplierId: 'SUP002',
        supplierName: '中国检验认证集团',
        templateId: 'TPL001',
        templateName: '外包供应商年度评价',
        evaluationDate: '2024-09-30',
        evaluationPeriod: '2024年第三季度',
        scores: [
            { indicatorId: 'IND001', indicatorName: '检测能力', score: 27, maxScore: 30, comments: '资质良好' },
            { indicatorId: 'IND002', indicatorName: '服务质量', score: 26, maxScore: 30, comments: '服务较好' },
            { indicatorId: 'IND003', indicatorName: '报告质量', score: 17, maxScore: 20, comments: '报告合格' },
            { indicatorId: 'IND004', indicatorName: '价格合理性', score: 9, maxScore: 10, comments: '价格合理' },
            { indicatorId: 'IND005', indicatorName: '合作稳定性', score: 9, maxScore: 10, comments: '合作良好' }
        ],
        totalScore: 88,
        level: 'good',
        evaluator: '张鑫明',
        evaluatorId: 'EMP002',
        suggestions: '希望进一步提升报告质量',
        attachments: [],
        createTime: '2024-09-30 14:00:00'
    },
    {
        id: 'EVA003',
        supplierId: 'SUP004',
        supplierName: '上海试剂有限公司',
        templateId: 'TPL002',
        templateName: '耗材供应商季度评价',
        evaluationDate: '2024-09-30',
        evaluationPeriod: '2024年第三季度',
        scores: [
            { indicatorId: 'IND006', indicatorName: '产品质量', score: 38, maxScore: 40, comments: '产品质量优秀' },
            { indicatorId: 'IND007', indicatorName: '交付及时性', score: 23, maxScore: 25, comments: '交货及时' },
            { indicatorId: 'IND008', indicatorName: '价格竞争力', score: 13, maxScore: 15, comments: '价格适中' },
            { indicatorId: 'IND009', indicatorName: '售后服务', score: 9, maxScore: 10, comments: '售后响应快' },
            { indicatorId: 'IND010', indicatorName: '资质合规性', score: 7, maxScore: 10, comments: '资质基本齐全' }
        ],
        totalScore: 90,
        level: 'excellent',
        evaluator: '刘丽愉',
        evaluatorId: 'EMP003',
        suggestions: '建议完善产品资质文件',
        attachments: [],
        createTime: '2024-09-30 16:00:00'
    },
    {
        id: 'EVA004',
        supplierId: 'SUP006',
        supplierName: '广州标准物质中心',
        templateId: 'TPL002',
        templateName: '耗材供应商季度评价',
        evaluationDate: '2024-09-30',
        evaluationPeriod: '2024年第三季度',
        scores: [
            { indicatorId: 'IND006', indicatorName: '产品质量', score: 40, maxScore: 40, comments: '产品质量卓越' },
            { indicatorId: 'IND007', indicatorName: '交付及时性', score: 24, maxScore: 25, comments: '准时交付' },
            { indicatorId: 'IND008', indicatorName: '价格竞争力', score: 14, maxScore: 15, comments: '价格合理' },
            { indicatorId: 'IND009', indicatorName: '售后服务', score: 9, maxScore: 10, comments: '服务优质' },
            { indicatorId: 'IND010', indicatorName: '资质合规性', score: 8, maxScore: 10, comments: '资质完备' }
        ],
        totalScore: 95,
        level: 'excellent',
        evaluator: '武基勇',
        evaluatorId: 'EMP004',
        suggestions: '无，保持现有水平',
        attachments: [],
        createTime: '2024-09-30 17:00:00'
    }
];
