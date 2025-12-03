// 委外管理 Mock 数据

// 委外任务接口 (参考 ITestTask 设计)
export interface IOutsourceTask {
    id: number;
    outsourceNo: string;           // 委外单号 (类似 taskNo)
    entrustmentId: string;         // 委托单号
    projectName: string;           // 项目名称

    // 样品信息
    sampleIds: string[];           // 样品编号列表
    sampleCount: number;           // 样品数量
    sampleNames: string;           // 样品名称(逗号分隔)

    // 检测参数
    parameters: string[];          // 委外检测参数列表 (类似任务的parameters)

    // 供应商信息
    supplierId: string;
    supplierName: string;

    // 费用信息
    pricePerSample: number;
    totalPrice: number;

    // 责任人信息 (关键字段,用于"我的委外"筛选)
    assignedTo: string;            // 内部责任人姓名 (对应原 internalManager)
    assignedToId: string;          // 内部责任人ID (对应原 internalManagerId)
    createdBy: string;             // 创建人 (对应原 assignedBy)
    createdDate: string;           // 创建日期 (对应原 assignDate)

    // 物流信息
    sendDate?: string;             // 发送日期
    trackingNo?: string;           // 物流单号
    receivedDate?: string;         // 接收日期
    expectedReturnDate?: string;   // 预计返回日期

    // 审批信息
    approvalStatus: '待审批' | '已通过' | '已拒绝';
    approvalId?: string;           // 钉钉审批ID

    // 执行状态 (类似任务的status)
    status: '待确认' | '已发送' | '检测中' | '已完成' | '已终止';
    progress: number;              // 完成进度 0-100

    // 其他
    priority?: 'Normal' | 'Urgent'; // 优先级 (参考任务)
    remark?: string;               // 备注
}

// 委外检测结果
export interface IOutsourceResult {
    id: number;
    outsourceNo: string;
    sampleNo: string;
    parameterName: string;
    testValue: string;
    testDate: string;
    testPerson: string;
    reviewStatus: '待审核' | '已通过' | '已拒绝';
    reviewer?: string;
    reviewDate?: string;
    reviewRemark?: string;
    createBy: string;
    createTime: string;
}

// Mock 数据
export const outsourceTaskData: IOutsourceTask[] = [
    {
        id: 1,
        outsourceNo: 'WW-20231115-001',
        entrustmentId: '202311001',
        projectName: '复合材料力学性能检测',
        sampleIds: ['S2023110101', 'S2023110102'],
        sampleCount: 2,
        sampleNames: '碳纤维复合材料板, 玻璃纤维复合材料板',
        parameters: ['拉伸强度', '弯曲强度'],
        supplierId: 'SUP001',
        supplierName: '华测检测认证集团股份有限公司',
        pricePerSample: 500,
        totalPrice: 1000,
        assignedTo: '张三',
        assignedToId: 'EMP001',
        createdBy: '吴凡',
        createdDate: '2023-11-15',
        sendDate: '2023-11-16',
        trackingNo: 'SF1234567890',
        expectedReturnDate: '2023-11-30',
        approvalStatus: '已通过',
        approvalId: 'DD-20231115-001',
        status: '检测中',
        progress: 60,
        priority: 'Normal'
    },
    {
        id: 2,
        outsourceNo: 'WW-20231120-001',
        entrustmentId: '202311002',
        projectName: '金属材料成分分析',
        sampleIds: ['S2023110201'],
        sampleCount: 1,
        sampleNames: '不锈钢板',
        parameters: ['化学成分分析'],
        supplierId: 'SUP002',
        supplierName: '中国检验认证集团',
        pricePerSample: 800,
        totalPrice: 800,
        assignedTo: '李四',
        assignedToId: 'EMP002',
        createdBy: '张鑫明',
        createdDate: '2023-11-20',
        approvalStatus: '待审批',
        status: '待确认',
        progress: 0,
        priority: 'Normal'
    },
    {
        id: 3,
        outsourceNo: 'WW-20231118-002',
        entrustmentId: '202311003',
        projectName: '涂层耐腐蚀性能测试',
        sampleIds: ['S2023110301', 'S2023110302', 'S2023110303'],
        sampleCount: 3,
        sampleNames: '镀锌钢板, 喷涂钢板, 电泳钢板',
        parameters: ['中性盐雾'],
        supplierId: 'SUP001',
        supplierName: '华测检测认证集团股份有限公司',
        pricePerSample: 300,
        totalPrice: 900,
        assignedTo: '王五',
        assignedToId: 'EMP003',
        createdBy: '刘丽愉',
        createdDate: '2023-11-18',
        sendDate: '2023-11-19',
        trackingNo: 'SF9876543210',
        approvalStatus: '已通过',
        approvalId: 'DD-20231118-002',
        status: '已发送',
        progress: 30,
        priority: 'Urgent'
    },
    {
        id: 4,
        outsourceNo: 'WW-20231122-001',
        entrustmentId: '202311004',
        projectName: '金相组织分析',
        sampleIds: ['S2023110401'],
        sampleCount: 1,
        sampleNames: '合金钢',
        parameters: ['金相组织'],
        supplierId: 'SUP002',
        supplierName: '中国检验认证集团',
        pricePerSample: 600,
        totalPrice: 600,
        assignedTo: '赵六',
        assignedToId: 'EMP004',
        createdBy: '武基勇',
        createdDate: '2023-11-22',
        approvalStatus: '已通过',
        approvalId: 'DD-20231122-001',
        status: '已完成',
        progress: 100,
        priority: 'Urgent',
        remark: '加急处理'
    },
    {
        id: 5,
        outsourceNo: 'WW-20231125-001',
        entrustmentId: '202311005',
        projectName: '环境可靠性测试',
        sampleIds: ['S2023110501', 'S2023110502'],
        sampleCount: 2,
        sampleNames: '电子元件A, 电子元件B',
        parameters: ['高低温循环', '湿热试验'],
        supplierId: 'SUP003',
        supplierName: '深圳市计量质量检测研究院',
        pricePerSample: 1200,
        totalPrice: 2400,
        assignedTo: '当前用户',
        assignedToId: 'EMP005',
        createdBy: '当前用户',
        createdDate: '2023-11-25',
        expectedReturnDate: '2023-12-10',
        approvalStatus: '待审批',
        status: '待确认',
        progress: 0,
        priority: 'Normal'
    },
    {
        id: 6,
        outsourceNo: 'WW-20231126-001',
        entrustmentId: '202311006',
        projectName: '材料硬度测试',
        sampleIds: ['S2023110601'],
        sampleCount: 1,
        sampleNames: '铝合金板',
        parameters: ['洛氏硬度', '维氏硬度'],
        supplierId: 'SUP001',
        supplierName: '华测检测认证集团股份有限公司',
        pricePerSample: 200,
        totalPrice: 200,
        assignedTo: '当前用户',
        assignedToId: 'EMP005',
        createdBy: '吴凡',
        createdDate: '2023-11-26',
        sendDate: '2023-11-27',
        trackingNo: 'YTO1122334455',
        approvalStatus: '已通过',
        approvalId: 'DD-20231126-001',
        status: '检测中',
        progress: 50,
        priority: 'Normal'
    }
];

export const outsourceResultData: IOutsourceResult[] = [
    {
        id: 1,
        outsourceNo: 'WW-20231122-001',
        sampleNo: 'S2023110401',
        parameterName: '金相组织',
        testValue: '珠光体+铁素体，符合标准',
        testDate: '2023-11-25',
        testPerson: '王检测师',
        reviewStatus: '已通过',
        reviewer: '吴凡',
        reviewDate: '2023-11-26',
        createBy: '张鑫明',
        createTime: '2023-11-26 09:30:00'
    },
    {
        id: 2,
        outsourceNo: 'WW-20231118-002',
        sampleNo: 'S2023110301',
        parameterName: '中性盐雾',
        testValue: '72小时无锈蚀',
        testDate: '2023-11-23',
        testPerson: '李检测师',
        reviewStatus: '待审核',
        createBy: '刘丽愉',
        createTime: '2023-11-24 14:20:00'
    }
];
