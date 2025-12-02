// 样品管理相关数据类型和模拟数据

// 收样/计价记录
export interface ISampleReceipt {
    id: number;
    receiptNo: string; // 收样单号
    entrustmentId: string; // 委托单号
    sampleIds: string[]; // 样品编号列表
    receiptDate: string; // 收样日期
    receivedBy: string; // 收样人
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
    totalQuantity: number; // 样品总量
    unit: string; // 单位
    remainingQuantity: number; // 剩余可用数量
    receiptDate: string; // 收样日期
    receiptPerson: string; // 收样人
    collectionDate?: string; // 领样日期
    collectionPerson?: string; // 领样人
    status: string; // 状态：待收样、已收样、部分领用、全部领用、检测中、已完成、已外包、已归还、已销毁
    outsourceStatus?: 'not_outsourced' | 'outsourced' | 'returned'; // 委外状态
    outsourceSupplierId?: string; // 委外供应商ID
    outsourceSupplierName?: string; // 委外供应商名称
    outsourceDate?: string; // 委外日期
}

// 样品领用记录
export interface ISampleCollection {
    id: string;
    sampleNo: string; // 样品编号
    sampleName: string; // 样品名称
    laboratory: string; // 领用实验室/部门
    collectionPerson: string; // 领用人
    collectionPersonId: string; // 领用人ID
    collectionDate: string; // 领用日期
    collectionQuantity: number; // 领用数量
    unit: string; // 单位
    purpose: string; // 领用用途
    testItems?: string[]; // 检测项目
    expectedReturnDate: string; // 预计归还日期
    actualReturnDate?: string; // 实际归还日期
    returnedQuantity?: number; // 实际归还数量
    status: 'in_use' | 'partial_returned' | 'fully_returned' | 'consumed'; // 状态
    remark?: string;
    createTime: string;
}

// 样品委外记录
export interface ISampleOutsource {
    id: string;
    sampleNo: string; // 样品编号
    sampleName: string; // 样品名称
    supplierId: string; // 供应商ID
    supplierName: string; // 供应商名称
    quantity: number; // 委外数量
    unit: string; // 单位
    testItems: string[]; // 检测项目
    assignedBy: string; // 分配人
    assignedById: string; // 分配人ID
    assignDate: string; // 分配日期
    dueDate: string; // 截止日期
    status: 'pending' | 'in_progress' | 'completed' | 'returned'; // 状态
    outsourceOrderId?: string; // 关联的委外单ID
    actualReturnDate?: string; // 实际归还日期
    remark?: string;
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
        totalQuantity: 3,`r`n        unit: '个',`r`n        remainingQuantity: 3,
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
        totalQuantity: 5,`r`n        unit: '个',`r`n        remainingQuantity: 5,
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
        totalQuantity: 10,`r`n        unit: '个',`r`n        remainingQuantity: 10,
        receiptDate: '2023-11-02',
        receiptPerson: '李四',
        collectionDate: '2023-11-03',
        collectionPerson: '赵六',
        status: '已分配'
    },
    {
        id: 4,
        sampleNo: 'S20231103001',
        receiptId: 3,
        entrustmentId: 'WT20231103001',
        name: '沥青混合料',
        spec: 'AC-13C',
        totalQuantity: 2,`r`n        unit: '个',`r`n        remainingQuantity: 2,
        receiptDate: '2023-11-03',
        receiptPerson: '张三',
        status: '待收样'
    },
    {
        id: 5,
        sampleNo: 'S20231103002',
        receiptId: 3,
        entrustmentId: 'WT20231103001',
        name: '沥青混合料',
        spec: 'AC-20C',
        totalQuantity: 2,`r`n        unit: '个',`r`n        remainingQuantity: 2,
        receiptDate: '2023-11-03',
        receiptPerson: '张三',
        status: '待收样'
    },
    {
        id: 6,
        sampleNo: 'S20231104001',
        receiptId: 4,
        entrustmentId: 'WT20231104001',
        name: '钢绞线',
        spec: '1x7-15.20-1860',
        totalQuantity: 5,`r`n        unit: '个',`r`n        remainingQuantity: 5,
        receiptDate: '2023-11-04',
        receiptPerson: '李四',
        status: '已收样'
    },
    {
        id: 7,
        sampleNo: 'S20231105001',
        receiptId: 5,
        entrustmentId: 'WT20231105001',
        name: '土工布',
        spec: '200g/m2',
        totalQuantity: 10,`r`n        unit: '个',`r`n        remainingQuantity: 10,
        receiptDate: '2023-11-05',
        receiptPerson: '王五',
        status: '检测中'
    },
    {
        id: 8,
        sampleNo: 'S20231106001',
        receiptId: 6,
        entrustmentId: 'WT20231106001',
        name: '防水卷材',
        spec: 'SBS I PY PE 3.0',
        totalQuantity: 3,`r`n        unit: '个',`r`n        remainingQuantity: 3,
        receiptDate: '2023-11-06',
        receiptPerson: '赵六',
        status: '已完成'
    },
    {
        id: 9,
        sampleNo: 'S20231107001',
        receiptId: 7,
        entrustmentId: 'WT20231107001',
        name: '外加剂',
        spec: '聚羧酸减水剂',
        totalQuantity: 1,`r`n        unit: '个',`r`n        remainingQuantity: 1,
        receiptDate: '2023-11-07',
        receiptPerson: '张三',
        status: '已归还'
    },
    {
        id: 10,
        sampleNo: 'S20231108001',
        receiptId: 8,
        entrustmentId: 'WT20231108001',
        name: '粉煤灰',
        spec: 'F类 II级',
        totalQuantity: 5,`r`n        unit: '个',`r`n        remainingQuantity: 5,
        receiptDate: '2023-11-08',
        receiptPerson: '李四',
        status: '已销毁'
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
        totalQuantity: 3,`r`n        unit: '个',`r`n        remainingQuantity: 3,
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
        totalQuantity: 10,`r`n        unit: '个',`r`n        remainingQuantity: 10,
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

// 样品领用记录数据
export const sampleCollectionData: ISampleCollection[] = [
    {
        id: 'COL001',
        sampleNo: 'S20231101001',
        sampleName: '钢筋混凝土试件',
        laboratory: '物理实验室',
        collectionPerson: '王五',
        collectionPersonId: 'E003',
        collectionDate: '2023-11-02',
        collectionQuantity: 2,
        unit: '个',
        purpose: '抗压强度检测',
        testItems: ['抗压强度', '抗折强度'],
        expectedReturnDate: '2023-11-10',
        status: 'in_use',
        createTime: '2023-11-02T08:00:00Z'
    },
    {
        id: 'COL002',
        sampleNo: 'S20231102001',
        sampleName: '砂石料',
        laboratory: '化学实验室',
        collectionPerson: '赵六',
        collectionPersonId: 'E004',
        collectionDate: '2023-11-03',
        collectionQuantity: 5,
        unit: '个',
        purpose: '级配分析',
        testItems: ['级配分析'],
        expectedReturnDate: '2023-11-08',
        actualReturnDate: '2023-11-07',
        returnedQuantity: 5,
        status: 'fully_returned',
        createTime: '2023-11-03T09:00:00Z'
    }
];

// 样品委外记录数据
export const sampleOutsourceData: ISampleOutsource[] = [
    {
        id: 'OUT001',
        sampleNo: 'S20231105001',
        sampleName: '土工布',
        supplierId: 'SUP001',
        supplierName: '第三方检测机构A',
        quantity: 5,
        unit: '个',
        testItems: ['拉伸强度', '撕裂强度'],
        assignedBy: '张三',
        assignedById: 'E001',
        assignDate: '2023-11-05',
        dueDate: '2023-11-15',
        status: 'in_progress',
        remark: '紧急项目'
    }
];
