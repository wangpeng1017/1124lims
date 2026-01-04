// 委托咨询相关类型定义

/**
 * 咨询状态流转说明：
 *
 * 状态流转图：
 *   [pending - 待跟进]
 *        | 添加跟进记录
 *        ↓
 *   [following - 跟进中]
 *        | 生成报价单
 *        ↓
 *   [quoted - 已报价]
 *        |
 *        |--- 报价被客户接受 → [合同流程]
 *        |--- 报价被客户拒绝 → [rejected - 已拒绝]
 *        |
 *   [closed - 已关闭] ← 手动关闭（任意时间）
 *
 * 各状态下可执行的操作：
 * - pending：可编辑、删除（管理员）、关闭、添加跟进
 * - following：可编辑、关闭、生成报价单、添加跟进
 * - quoted：只能查看（终态）
 * - rejected：只能查看（终态）
 * - closed：只能查看（终态）
 */

export interface FollowUpRecord {
    id: string;
    date: string;                        // 跟进日期
    type: 'phone' | 'email' | 'visit' | 'other';  // 跟进方式
    content: string;                     // 跟进内容
    nextAction?: string;                 // 下一步行动
    operator: string;                    // 操作人
}

export interface IConsultation {
    id: string;                          // 咨询编号
    consultationNo: string;              // 咨询单号 (如: ZX20231201001)
    createTime: string;                  // 创建时间

    // 客户信息
    clientCompany: string;               // 客户公司名称
    clientContact: string;               // 联系人
    clientTel: string;                   // 联系电话
    clientEmail?: string;                // 邮箱
    clientAddress?: string;              // 地址

    // 咨询内容
    sampleName: string;                  // 样品名称
    sampleModel?: string;                // 样品型号/规格
    sampleMaterial?: string;             // 样品材质
    estimatedQuantity?: number;          // 预计样品数量

    testItems: string[];                 // 检测项目列表
    testPurpose: 'quality_inspection' | 'product_certification' | 'rd_testing' | 'other';  // 检测目的
    urgencyLevel: 'normal' | 'urgent' | 'very_urgent';  // 紧急程度
    expectedDeadline?: string;           // 期望完成时间

    // 客户需求
    clientRequirements?: string;         // 客户特殊要求
    budgetRange?: string;                // 预算范围 (如: 5000-10000)

    // 跟进信息
    status: 'pending' | 'following' | 'quoted' | 'rejected' | 'closed';
    // 待跟进/跟进中/已报价/已拒绝/已关闭
    follower: string;                    // 跟进人
    followUpRecords: FollowUpRecord[];   // 跟进记录

    // 评估信息
    feasibility?: 'feasible' | 'difficult' | 'infeasible';  // 可行性评估
    feasibilityNote?: string;            // 可行性说明
    estimatedPrice?: number;             // 预估价格

    // 转化信息
    quotationId?: string;                // 关联的报价单ID
    quotationNo?: string;                // 关联的报价单号

    // 附件信息
    attachments?: {
        id: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        uploadTime: string;
        uploadBy: string;
    }[];

    // 元数据
    createdBy: string;                   // 创建人
    updatedAt: string;                   // 更新时间
}

// 检测目的映射
export const TEST_PURPOSE_MAP: Record<IConsultation['testPurpose'], string> = {
    quality_inspection: '质量检验',
    product_certification: '产品认证',
    rd_testing: '研发测试',
    other: '其他'
};

// 紧急程度映射
export const URGENCY_LEVEL_MAP: Record<IConsultation['urgencyLevel'], { text: string; color: string }> = {
    normal: { text: '普通', color: 'default' },
    urgent: { text: '紧急', color: 'warning' },
    very_urgent: { text: '非常紧急', color: 'error' }
};

// 咨询状态映射
export const CONSULTATION_STATUS_MAP: Record<IConsultation['status'], { text: string; color: string }> = {
    pending: { text: '待跟进', color: 'default' },      // 新创建，等待处理
    following: { text: '跟进中', color: 'processing' }, // 正在跟进客户
    quoted: { text: '已报价', color: 'success' },       // 已生成报价单
    rejected: { text: '已拒绝', color: 'error' },       // 客户拒绝报价（由报价单被拒后自动流转）
    closed: { text: '已关闭', color: 'default' }        // 手动关闭咨询
};

// 跟进方式映射
export const FOLLOW_UP_TYPE_MAP: Record<FollowUpRecord['type'], string> = {
    phone: '电话',
    email: '邮件',
    visit: '拜访',
    other: '其他'
};

// 可行性评估映射
export const FEASIBILITY_MAP: Record<NonNullable<IConsultation['feasibility']>, { text: string; color: string }> = {
    feasible: { text: '可行', color: 'success' },
    difficult: { text: '困难', color: 'warning' },
    infeasible: { text: '不可行', color: 'error' }
};

// Mock数据
export const consultationData: IConsultation[] = [
    {
        id: '1',
        consultationNo: 'ZX20231201001',
        createTime: '2023-12-01 10:00:00',
        clientCompany: '奇瑞汽车股份有限公司',
        clientContact: '李工',
        clientTel: '13800138000',
        clientEmail: 'ligong@chery.com',
        clientAddress: '安徽省芜湖市经济技术开发区长春路8号',
        sampleName: '莱尼 K01',
        sampleModel: 'K01-2023',
        sampleMaterial: '合金钢',
        estimatedQuantity: 5,
        testItems: ['拉伸强度测试', '金相分析', '硬度测试'],
        testPurpose: 'quality_inspection',
        urgencyLevel: 'urgent',
        expectedDeadline: '2023-12-10',
        clientRequirements: '需要加急处理，3天内出具报告',
        budgetRange: '3000-5000',
        status: 'quoted',
        follower: '张馨',
        followUpRecords: [
            {
                id: 'F1',
                date: '2023-12-01 10:00:00',
                type: 'phone',
                content: '客户来电咨询莱尼K01材料的检测项目和价格，初步沟通了检测需求',
                nextAction: '整理报价方案，明天回复客户',
                operator: '张馨'
            },
            {
                id: 'F2',
                date: '2023-12-02 14:30:00',
                type: 'email',
                content: '已发送初步报价方案给客户，等待客户确认',
                nextAction: '跟进客户反馈',
                operator: '张馨'
            },
            {
                id: 'F3',
                date: '2023-12-03 09:00:00',
                type: 'phone',
                content: '客户确认报价方案，要求正式报价单',
                operator: '张馨'
            }
        ],
        feasibility: 'feasible',
        feasibilityNote: '实验室具备相关检测能力，设备齐全，可以按时完成',
        estimatedPrice: 3500,
        quotationId: '1',
        quotationNo: 'BJ20231201001',
        createdBy: '张馨',
        updatedAt: '2023-12-03 09:00:00'
    },
    {
        id: '2',
        consultationNo: 'ZX20231202001',
        createTime: '2023-12-02 14:00:00',
        clientCompany: '长安汽车股份有限公司',
        clientContact: '王经理',
        clientTel: '13900139001',
        clientEmail: 'wangjl@changan.com',
        clientAddress: '重庆市江北区建新东路260号',
        sampleName: '铝合金压铸件',
        sampleModel: 'AC-2023-05',
        sampleMaterial: 'ADC12铝合金',
        estimatedQuantity: 10,
        testItems: ['化学成分分析', '拉伸性能', '金相组织'],
        testPurpose: 'product_certification',
        urgencyLevel: 'normal',
        expectedDeadline: '2023-12-20',
        clientRequirements: '需要CNAS认证报告',
        budgetRange: '8000-12000',
        status: 'following',
        follower: '李四',
        followUpRecords: [
            {
                id: 'F4',
                date: '2023-12-02 15:00:00',
                type: 'visit',
                content: '拜访客户，详细了解检测需求和样品情况，客户需要CNAS认证报告用于产品认证',
                nextAction: '回公司评估检测能力和周期，准备报价',
                operator: '李四'
            },
            {
                id: 'F5',
                date: '2023-12-04 10:00:00',
                type: 'phone',
                content: '电话沟通报价方案，客户表示价格可以接受，但需要确认检测周期',
                nextAction: '与实验室确认排期后回复客户',
                operator: '李四'
            }
        ],
        feasibility: 'feasible',
        feasibilityNote: '具备CNAS认证资质，可以出具认证报告，预计10个工作日完成',
        estimatedPrice: 9500,
        createdBy: '李四',
        updatedAt: '2023-12-04 10:00:00'
    },
    {
        id: '3',
        consultationNo: 'ZX20231203001',
        createTime: '2023-12-03 11:00:00',
        clientCompany: '吉利汽车集团有限公司',
        clientContact: '赵工',
        clientTel: '13700137002',
        clientEmail: 'zhaog@geely.com',
        sampleName: '高强度钢板',
        sampleModel: 'DP980',
        sampleMaterial: '双相钢',
        estimatedQuantity: 3,
        testItems: ['拉伸试验', '弯曲试验', '金相分析', '硬度测试'],
        testPurpose: 'rd_testing',
        urgencyLevel: 'very_urgent',
        expectedDeadline: '2023-12-06',
        clientRequirements: '研发项目急需数据，希望3天内完成',
        budgetRange: '5000以内',
        status: 'following',
        follower: '张馨',
        followUpRecords: [
            {
                id: 'F6',
                date: '2023-12-03 11:00:00',
                type: 'phone',
                content: '客户来电咨询加急检测，项目非常紧急，需要3天内出报告',
                nextAction: '立即与实验室沟通能否加急安排',
                operator: '张馨'
            }
        ],
        feasibility: 'difficult',
        feasibilityNote: '时间非常紧张，需要协调实验室资源，可能需要加班完成',
        estimatedPrice: 4800,
        createdBy: '张馨',
        updatedAt: '2023-12-03 11:00:00'
    },
    {
        id: '4',
        consultationNo: 'ZX20231204001',
        createTime: '2023-12-04 09:00:00',
        clientCompany: '比亚迪汽车工业有限公司',
        clientContact: '孙工',
        clientTel: '13600136003',
        clientEmail: 'sung@byd.com',
        clientAddress: '广东省深圳市龙岗区葵涌镇延安路',
        sampleName: '电池外壳材料',
        sampleModel: 'BYD-AL-2023',
        sampleMaterial: '铝合金',
        estimatedQuantity: 8,
        testItems: ['盐雾试验', '耐腐蚀性能', '表面处理质量'],
        testPurpose: 'quality_inspection',
        urgencyLevel: 'normal',
        expectedDeadline: '2023-12-25',
        budgetRange: '10000-15000',
        status: 'pending',
        follower: '王五',
        followUpRecords: [],
        createdBy: '王五',
        updatedAt: '2023-12-04 09:00:00'
    },
    {
        id: '5',
        consultationNo: 'ZX20231205001',
        createTime: '2023-12-05 10:00:00',
        clientCompany: '长城汽车股份有限公司',
        clientContact: '周工',
        clientTel: '13500135004',
        clientEmail: 'zhoug@gwm.com',
        clientAddress: '河北省保定市朝阳南大街2266号',
        sampleName: '钢材样品',
        sampleModel: 'Q345B',
        sampleMaterial: '低合金钢',
        estimatedQuantity: 5,
        testItems: ['拉伸测试', '冲击试验', '化学成分'],
        testPurpose: 'quality_inspection',
        urgencyLevel: 'normal',
        expectedDeadline: '2023-12-18',
        clientRequirements: '常规检测',
        budgetRange: '2000-3000',
        status: 'rejected',
        follower: '李四',
        followUpRecords: [
            {
                id: 'F7',
                date: '2023-12-05 10:00:00',
                type: 'phone',
                content: '客户咨询钢材检测价格',
                nextAction: '准备报价方案',
                operator: '李四'
            },
            {
                id: 'F8',
                date: '2023-12-05 15:00:00',
                type: 'email',
                content: '发送报价方案给客户',
                nextAction: '等待客户反馈',
                operator: '李四'
            },
            {
                id: 'F9',
                date: '2023-12-06 09:00:00',
                type: 'phone',
                content: '客户反馈价格超出预算，暂不检测',
                operator: '李四'
            }
        ],
        feasibility: 'feasible',
        feasibilityNote: '常规检测项目，实验室可以完成',
        estimatedPrice: 2800,
        createdBy: '李四',
        updatedAt: '2023-12-06 09:00:00'
    },
    {
        id: '6',
        consultationNo: 'ZX20231206001',
        createTime: '2023-12-06 14:00:00',
        clientCompany: '上海汽车集团股份有限公司',
        clientContact: '赵主管',
        clientTel: '13400134005',
        clientEmail: 'zhaozg@saic.com',
        clientAddress: '上海市嘉定区安亭镇曹安公路4800号',
        sampleName: '塑料件',
        sampleModel: 'PP-2023',
        sampleMaterial: '聚丙烯',
        estimatedQuantity: 15,
        testItems: ['拉伸性能', '冲击性能', '热变形温度'],
        testPurpose: 'product_certification',
        urgencyLevel: 'normal',
        expectedDeadline: '2023-12-30',
        clientRequirements: '需要符合汽车行业标准',
        budgetRange: '6000-8000',
        status: 'closed',
        follower: '张馨',
        followUpRecords: [
            {
                id: 'F10',
                date: '2023-12-06 14:00:00',
                type: 'email',
                content: '客户邮件咨询塑料件检测',
                nextAction: '回复客户，了解详细需求',
                operator: '张馨'
            },
            {
                id: 'F11',
                date: '2023-12-07 10:00:00',
                type: 'phone',
                content: '客户表示项目暂时搁置，后续有需求再联系',
                operator: '张馨'
            }
        ],
        createdBy: '张馨',
        updatedAt: '2023-12-07 10:00:00'
    },
    {
        id: '7',
        consultationNo: 'ZX20231207001',
        createTime: '2023-12-07 09:00:00',
        clientCompany: '广州汽车集团股份有限公司',
        clientContact: '钱工',
        clientTel: '13300133006',
        clientEmail: 'qiang@gac.com',
        clientAddress: '广东省广州市天河区珠江新城珠江东路6号',
        sampleName: '橡胶密封件',
        sampleModel: 'NBR-2023',
        sampleMaterial: '丁腈橡胶',
        estimatedQuantity: 20,
        testItems: ['拉伸强度', '撕裂强度', '压缩永久变形', '耐老化性能'],
        testPurpose: 'quality_inspection',
        urgencyLevel: 'urgent',
        expectedDeadline: '2023-12-15',
        clientRequirements: '需要测试耐高温性能',
        budgetRange: '7000-10000',
        status: 'following',
        follower: '王五',
        followUpRecords: [
            {
                id: 'F12',
                date: '2023-12-07 09:00:00',
                type: 'visit',
                content: '拜访客户，现场查看样品，讨论检测方案',
                nextAction: '回公司准备详细报价',
                operator: '王五'
            },
            {
                id: 'F13',
                date: '2023-12-08 11:00:00',
                type: 'email',
                content: '发送详细检测方案和报价给客户',
                nextAction: '等待客户确认',
                operator: '王五'
            }
        ],
        feasibility: 'feasible',
        feasibilityNote: '橡胶检测是我们的强项，设备齐全，可以按时完成',
        estimatedPrice: 8500,
        createdBy: '王五',
        updatedAt: '2023-12-08 11:00:00'
    },
    {
        id: '8',
        consultationNo: 'ZX20231208001',
        createTime: '2023-12-08 16:00:00',
        clientCompany: '东风汽车集团有限公司',
        clientContact: '孙经理',
        clientTel: '13200132007',
        clientEmail: 'sunjl@dfmc.com',
        clientAddress: '湖北省武汉市经济技术开发区东风大道10号',
        sampleName: '焊接件',
        sampleModel: 'WJ-2023-12',
        sampleMaterial: 'Q235钢',
        estimatedQuantity: 6,
        testItems: ['焊缝宏观检验', '焊缝微观检验', '拉伸试验'],
        testPurpose: 'quality_inspection',
        urgencyLevel: 'normal',
        expectedDeadline: '2023-12-22',
        clientRequirements: '需要检测焊接质量',
        budgetRange: '4000-6000',
        status: 'pending',
        follower: '李四',
        followUpRecords: [],
        createdBy: '李四',
        updatedAt: '2023-12-08 16:00:00'
    }
];
