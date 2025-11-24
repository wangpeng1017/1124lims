// 样品管理相关数据类型和模拟数据

// 收样/计价记录
export interface ISampleReceipt {
    id: number;
    receiptNo: string; // 收样单号
    entrustmentId: string; // 委托单号
    sampleIds: string[]; // 样品编号列表
    receiptDate: string; // 收样日期
    receivedBy: string; // 收样人
    totalPrice: number; // 总计价
    priceDetails: { sampleNo: string; price: number }[]; // 价格明细
    status: string; // 状态：待确认、已确认
    remark?: string;
}

// 样品明细
export interface ISampleDetail {
    id: number;
    sampleNo: string; // 样品编号
    receiptId: number; // 收样单ID
    entrustmentId: string; // 委托单号
    name: string; // 样品名称
    spec: string; // 规格型号
    quantity: number; // 数量
    receiptDate: string; // 收样日期
    receiptPerson: string; // 收样人
    collectionDate?: string; // 领样日期
    collectionPerson?: string; // 领样人
    status: string; // 状态：待收样、已收样、已分配、检测中、已完成、已归还、已销毁
}

// 样品流转记录
export interface ISampleTransfer {
    id: number;
    sampleNo: string; // 样品编号
    fromStatus: string; // 原状态
    toStatus: string; // 目标状态
    operator: string; // 操作人
    operateTime: string; // 操作时间
    remark?: string;
}

// 我的样品
export interface IMySample {
    id: number;
    sampleNo: string; // 样品编号
    sampleName: string; // 样品名称
    collectionPerson: string; // 领用人
    collectionDate: string; // 领用日期
    quantity: number; // 领用数量
    purpose: string; // 用途
    expectedReturnDate: string; // 预计归还日期
    actualReturnDate?: string; // 实际归还日期
    status: string; // 状态：领用中、已归还、逾期
}

// 任务分配（样品）
export interface ISampleTaskAssignment {
    id: number;
    taskNo: string; // 任务编号
    sampleIds: string[]; // 样品编号列表
    assignedTo: string; // 分配给
    assignedBy: string; // 分配人
    assignDate: string; // 分配日期
    dueDate: string; // 截止日期
    status: string; // 状态：待开始、进行中、已完成
    remark?: string;
}

// 任务分配（参数）
export interface IParameterTaskAssignment {
    id: number;
    taskNo: string; // 任务编号
    parameterId: number; // 检测参数ID
    parameterName: string; // 参数名称
    sampleIds: string[]; // 样品编号列表
    assignedTo: string; // 分配给
    assignedBy: string; // 分配人
    assignDate: string; // 分配日期
    dueDate: string; // 截止日期
    qualifiedPersonnel: string[]; // 有资质人员列表
    status: string; // 状态：待开始、进行中、已完成
}

// 模拟数据
export const sampleReceiptData: ISampleReceipt[] = [
    {
        id: 1,
        receiptNo: 'SY20231101001',
        entrustmentId: 'WT20231101001',
        sampleIds: ['S20231101001', 'S20231101002'],
        receiptDate: '2023-11-01',
        receivedBy: '张三',
        totalPrice: 5000,
        priceDetails: [
            { sampleNo: 'S20231101001', price: 3000 },
            { sampleNo: 'S20231101002', price: 2000 }
        ],
        status: '已确认',
        remark: '样品完好'
    },
    {
        id: 2,
        receiptNo: 'SY20231102001',
        entrustmentId: 'WT20231102001',
        sampleIds: ['S20231102001'],
        receiptDate: '2023-11-02',
        receivedBy: '李四',
        totalPrice: 3500,
        priceDetails: [
            { sampleNo: 'S20231102001', price: 3500 }
        ],
        status: '待确认'
    }
];

export const sampleDetailData: ISampleDetail[] = [
    {
        id: 1,
        sampleNo: 'S20231101001',
        receiptId: 1,
        entrustmentId: 'WT20231101001',
        name: '钢筋混凝土试件',
        spec: 'C30',
        quantity: 3,
        receiptDate: '2023-11-01',
        receiptPerson: '张三',
        collectionDate: '2023-11-02',
        collectionPerson: '王五',
        status: '检测中'
    },
    {
        id: 2,
        sampleNo: 'S20231101002',
        receiptId: 1,
        entrustmentId: 'WT20231101001',
        name: '水泥试样',
        spec: 'P.O 42.5',
        quantity: 5,
        receiptDate: '2023-11-01',
        receiptPerson: '张三',
        status: '已收样'
    },
    {
        id: 3,
        sampleNo: 'S20231102001',
        receiptId: 2,
        entrustmentId: 'WT20231102001',
        name: '砂石料',
        spec: '中砂',
        quantity: 10,
        receiptDate: '2023-11-02',
        receiptPerson: '李四',
        collectionDate: '2023-11-03',
        collectionPerson: '赵六',
        status: '已分配'
    }
];

export const sampleTransferData: ISampleTransfer[] = [
    {
        id: 1,
        sampleNo: 'S20231101001',
        fromStatus: '待收样',
        toStatus: '已收样',
        operator: '张三',
        operateTime: '2023-11-01 09:00:00',
        remark: '收样确认'
    },
    {
        id: 2,
        sampleNo: 'S20231101001',
        fromStatus: '已收样',
        toStatus: '已分配',
        operator: '李四',
        operateTime: '2023-11-01 14:00:00',
        remark: '分配给王五'
    },
    {
        id: 3,
        sampleNo: 'S20231101001',
        fromStatus: '已分配',
        toStatus: '检测中',
        operator: '王五',
        operateTime: '2023-11-02 08:30:00',
        remark: '开始检测'
    },
    {
        id: 4,
        sampleNo: 'S20231101002',
        fromStatus: '待收样',
        toStatus: '已收样',
        operator: '张三',
        operateTime: '2023-11-01 09:00:00'
    },
    {
        id: 5,
        sampleNo: 'S20231102001',
        fromStatus: '待收样',
        toStatus: '已收样',
        operator: '李四',
        operateTime: '2023-11-02 10:00:00'
    },
    {
        id: 6,
        sampleNo: 'S20231102001',
        fromStatus: '已收样',
        toStatus: '已分配',
        operator: '张三',
        operateTime: '2023-11-03 09:00:00',
        remark: '分配给赵六'
    }
];

export const mySampleData: IMySample[] = [
    {
        id: 1,
        sampleNo: 'S20231101001',
        sampleName: '钢筋混凝土试件',
        collectionPerson: '王五',
        collectionDate: '2023-11-02',
        quantity: 3,
        purpose: '抗压强度检测',
        expectedReturnDate: '2023-11-10',
        status: '领用中'
    },
    {
        id: 2,
        sampleNo: 'S20231102001',
        sampleName: '砂石料',
        collectionPerson: '赵六',
        collectionDate: '2023-11-03',
        quantity: 10,
        purpose: '级配分析',
        expectedReturnDate: '2023-11-08',
        actualReturnDate: '2023-11-07',
        status: '已归还'
    }
];

export const sampleTaskAssignmentData: ISampleTaskAssignment[] = [
    {
        id: 1,
        taskNo: 'TASK20231101001',
        sampleIds: ['S20231101001'],
        assignedTo: '王五',
        assignedBy: '李四',
        assignDate: '2023-11-01',
        dueDate: '2023-11-10',
        status: '进行中',
        remark: '优先处理'
    },
    {
        id: 2,
        taskNo: 'TASK20231102001',
        sampleIds: ['S20231102001'],
        assignedTo: '赵六',
        assignedBy: '张三',
        assignDate: '2023-11-03',
        dueDate: '2023-11-12',
        status: '待开始'
    }
];

export const parameterTaskAssignmentData: IParameterTaskAssignment[] = [
    {
        id: 1,
        taskNo: 'PTASK20231101001',
        parameterId: 1,
        parameterName: '抗压强度',
        sampleIds: ['S20231101001'],
        assignedTo: '王五',
        assignedBy: '李四',
        assignDate: '2023-11-01',
        dueDate: '2023-11-10',
        qualifiedPersonnel: ['王五', '赵六'],
        status: '进行中'
    },
    {
        id: 2,
        taskNo: 'PTASK20231102001',
        parameterId: 2,
        parameterName: '级配分析',
        sampleIds: ['S20231102001'],
        assignedTo: '赵六',
        assignedBy: '张三',
        assignDate: '2023-11-03',
        dueDate: '2023-11-12',
        qualifiedPersonnel: ['张三', '赵六', '孙七'],
        status: '待开始'
    }
];
