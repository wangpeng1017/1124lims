// 报价单相关类型定义

export interface QuotationItem {
    id: number;
    serviceItem: string;        // 检测项目
    methodStandard: string;      // 检测标准
    quantity: number;            // 数量
    unitPrice: number;           // 单价
    totalPrice: number;          // 总价
}

export interface ApprovalRecord {
    level: number;               // 审批级别 1/2/3
    role: 'sales_manager' | 'finance' | 'lab_director';  // 审批角色
    approver: string;            // 审批人姓名
    action: 'approve' | 'reject';
    comment: string;
    timestamp: string;
}

export interface Quotation {
    id: string;                  // 报价单编号
    quotationNo: string;         // 报价单号 (如: BJ20231201001)
    createTime: string;          // 创建时间

    // 委托方信息
    clientCompany: string;
    clientContact: string;
    clientTel: string;
    clientEmail: string;
    clientAddress: string;

    // 服务方信息 (默认值)
    serviceCompany: string;
    serviceContact: string;
    serviceTel: string;
    serviceEmail: string;
    serviceAddress: string;

    // 样品和检测项目
    sampleName: string;
    items: QuotationItem[];

    // 价格汇总
    subtotal: number;            // 报价合计
    taxTotal: number;            // 含税合计(6%)
    discountTotal: number;       // 优惠后合计

    // 备注
    clientRemark: string;        // 客户要求备注

    // 审批流程 - 三级审批
    status: 'draft' | 'pending_sales' | 'pending_finance' | 'pending_lab' | 'approved' | 'rejected' | 'archived';
    // 草稿/待销售审批/待财务审批/待实验室审批/已批准/已拒绝/已归档
    currentApprovalLevel: number;  // 当前审批级别 (0:未提交 1:销售 2:财务 3:实验室)
    approvalHistory: ApprovalRecord[];

    // 客户反馈
    clientStatus: 'pending' | 'ok' | 'ng';  // 待反馈/接受/拒绝
    clientFeedbackDate?: string;  // 客户反馈日期
    ngReason?: string;           // NG原因
    contractFile?: string;       // 盖章合同文件路径
    contractFileName?: string;   // 合同文件名

    // 归档信息
    isArchived?: boolean;        // 是否已归档
    archivedAt?: string;         // 归档时间
    archivedBy?: string;         // 归档人
    archivedContractFile?: string;     // 归档合同文件路径
    archivedContractFileName?: string; // 归档合同文件名

    // 关联合同
    contractId?: string;         // 关联的委托合同ID
    contractNo?: string;         // 关联的委托合同编号

    // 关联咨询单
    consultationId?: string;     // 关联的咨询单ID
    consultationNo?: string;     // 关联的咨询单号

    // PDF
    pdfUrl?: string;             // 生成的PDF路径

    createdBy: string;
    updatedAt: string;
}

// 审批级别配置
export const APPROVAL_LEVELS = [
    { level: 1, role: 'sales_manager' as const, name: '销售经理', nextStatus: 'pending_finance' as const },
    { level: 2, role: 'finance' as const, name: '财务', nextStatus: 'pending_lab' as const },
    { level: 3, role: 'lab_director' as const, name: '实验室负责人', nextStatus: 'approved' as const }
];

// 状态显示映射
export const STATUS_MAP: Record<Quotation['status'], { text: string; color: string }> = {
    draft: { text: '草稿', color: 'default' },
    pending_sales: { text: '待销售审批', color: 'processing' },
    pending_finance: { text: '待财务审批', color: 'processing' },
    pending_lab: { text: '待实验室审批', color: 'processing' },
    approved: { text: '已批准', color: 'success' },
    rejected: { text: '已拒绝', color: 'error' },
    archived: { text: '已归档', color: 'cyan' }
};

// 客户反馈状态映射
export const CLIENT_STATUS_MAP: Record<Quotation['clientStatus'], { text: string; color: string }> = {
    pending: { text: '待反馈', color: 'default' },
    ok: { text: 'OK', color: 'success' },
    ng: { text: 'NG', color: 'error' }
};

// 服务方默认信息
export const DEFAULT_SERVICE_INFO = {
    serviceCompany: '江苏国轻检测技术有限公司',
    serviceContact: '张馨',
    serviceTel: '15952575002',
    serviceEmail: 'zhangxin@sae-china.org',
    serviceAddress: '扬州市邗江区金山路99号'
};

// Mock数据
export const quotationData: Quotation[] = [
    {
        id: '1',
        quotationNo: 'BJ20231201001',
        createTime: '2023-12-01 09:30:00',
        clientCompany: '奇瑞汽车股份有限公司',
        clientContact: '李工',
        clientTel: '13800138000',
        clientEmail: 'ligong@chery.com',
        clientAddress: '安徽省芜湖市经济技术开发区长春路8号',
        ...DEFAULT_SERVICE_INFO,
        sampleName: '莱尼 K01',
        items: [
            { id: 1, serviceItem: '拉伸强度测试', methodStandard: 'GB/T 228.1-2021', quantity: 3, unitPrice: 500, totalPrice: 1500 },
            { id: 2, serviceItem: '金相分析', methodStandard: 'GB/T 13298-2015', quantity: 2, unitPrice: 800, totalPrice: 1600 }
        ],
        subtotal: 3100,
        taxTotal: 3286,
        discountTotal: 3000,
        clientRemark: '需要加急处理，3天内出具报告',
        status: 'approved',
        currentApprovalLevel: 3,
        approvalHistory: [
            { level: 1, role: 'sales_manager', approver: '王经理', action: 'approve', comment: '客户要求合理，同意报价', timestamp: '2023-12-01 10:30:00' },
            { level: 2, role: 'finance', approver: '张会计', action: 'approve', comment: '价格合理，同意', timestamp: '2023-12-01 14:20:00' },
            { level: 3, role: 'lab_director', approver: '李主任', action: 'approve', comment: '实验室有能力完成，同意', timestamp: '2023-12-01 16:00:00' }
        ],
        clientStatus: 'ok',
        contractFile: '/uploads/contracts/BJ20231201001_signed.pdf',
        pdfUrl: '/pdfs/quotations/BJ20231201001.pdf',
        createdBy: '张馨',
        updatedAt: '2023-12-01 16:00:00'
    },
    {
        id: '2',
        quotationNo: 'BJ20231202001',
        createTime: '2023-12-02 08:15:00',
        clientCompany: '上海汽车集团股份有限公司',
        clientContact: '赵工',
        clientTel: '13900139000',
        clientEmail: 'zhaogong@saic.com',
        clientAddress: '上海市嘉定区安亭镇曹安公路4800号',
        ...DEFAULT_SERVICE_INFO,
        sampleName: '复合材料样品',
        items: [
            { id: 1, serviceItem: '抗压强度测试', methodStandard: 'GB/T 50081-2019', quantity: 5, unitPrice: 400, totalPrice: 2000 }
        ],
        subtotal: 2000,
        taxTotal: 2120,
        discountTotal: 2120,
        clientRemark: '',
        status: 'pending_finance',
        currentApprovalLevel: 2,
        approvalHistory: [
            { level: 1, role: 'sales_manager', approver: '王经理', action: 'approve', comment: '同意报价', timestamp: '2023-12-02 09:15:00' }
        ],
        clientStatus: 'pending',
        createdBy: '张馨',
        updatedAt: '2023-12-02 09:15:00'
    },
    {
        id: '3',
        quotationNo: 'BJ20231203001',
        createTime: '2023-12-03 11:00:00',
        clientCompany: '比亚迪汽车工业有限公司',
        clientContact: '孙工',
        clientTel: '13700137000',
        clientEmail: 'sungong@byd.com',
        clientAddress: '广东省深圳市龙岗区葵涌镇延安路',
        ...DEFAULT_SERVICE_INFO,
        sampleName: '电池材料',
        items: [
            { id: 1, serviceItem: '化学成分分析', methodStandard: 'GB/T 223.1-2008', quantity: 10, unitPrice: 300, totalPrice: 3000 }
        ],
        subtotal: 3000,
        taxTotal: 3180,
        discountTotal: 3180,
        clientRemark: '',
        status: 'draft',
        currentApprovalLevel: 0,
        approvalHistory: [],
        clientStatus: 'pending',
        createdBy: '张馨',
        updatedAt: '2023-12-03 11:00:00'
    },
    {
        id: '4',
        quotationNo: 'BJ20231204001',
        createTime: '2023-12-04 14:00:00',
        clientCompany: '长城汽车股份有限公司',
        clientContact: '周工',
        clientTel: '13600136000',
        clientEmail: 'zhougong@gwm.com',
        clientAddress: '河北省保定市朝阳南大街2266号',
        ...DEFAULT_SERVICE_INFO,
        sampleName: '钢材样品',
        items: [
            { id: 1, serviceItem: '拉伸测试', methodStandard: 'GB/T 228.1-2021', quantity: 3, unitPrice: 500, totalPrice: 1500 },
            { id: 2, serviceItem: '弯曲测试', methodStandard: 'GB/T 232-2010', quantity: 3, unitPrice: 450, totalPrice: 1350 }
        ],
        subtotal: 2850,
        taxTotal: 3021,
        discountTotal: 2800,
        clientRemark: '价格偏高',
        status: 'rejected',
        currentApprovalLevel: 1,
        approvalHistory: [
            { level: 1, role: 'sales_manager', approver: '王经理', action: 'reject', comment: '价格超出客户预算，需重新报价', timestamp: '2023-12-04 15:30:00' }
        ],
        clientStatus: 'ng',
        ngReason: '价格超出预算',
        createdBy: '张馨',
        updatedAt: '2023-12-04 15:30:00'
    }
];

