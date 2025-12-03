// 检测任务接口
export interface ITestTask {
    id: number;
    taskNo: string;              // 任务编号
    sampleNo: string;            // 样品编号
    sampleName: string;          // 样品名称
    entrustmentId: string;       // 委托单号
    parameters: string[];        // 检测参数列表
    assignedTo: string;          // 负责人
    dueDate: string;             // 截止日期
    status: '待开始' | '进行中' | '已完成' | '已转交'; // 状态
    progress: number;            // 完成进度百分比 (0-100)
    createdDate: string;         // 创建日期
    priority: 'Normal' | 'Urgent'; // 优先级
    isOutsourced?: boolean;      // 新增: 是否委外
    outsourceInfo?: {            // 新增: 委外信息
        outsourceNo: string;     // 委外单号
        supplierId: string;      // 供应商ID
        supplierName: string;    // 供应商名称
        status: string;          // 委外状态
    };
}

// 数据录入记录接口
export interface ITestDataEntry {
    id: number;
    taskNo: string;              // 任务编号
    parameterName: string;       // 参数名称
    testData: {                  // 测试数据
        value1: string;          // 观测值1
        value2?: string;         // 观测值2
        result: string;          // 计算结果
        unit: string;            // 单位
        conclusion: '合格' | '不合格'; // 判定结论
    };
    deviceId?: string;           // 绑定设备编号
    deviceName?: string;         // 设备名称
    temperature?: number;        // 检测时温度
    humidity?: number;           // 检测时湿度
    operator: string;            // 操作员
    entryDate: string;           // 录入日期
}

// 任务转交记录接口
export interface ITestTaskTransfer {
    id: number;
    taskNo: string;
    fromPerson: string;
    toPerson: string;
    reason: string;
    transferDate: string;
}

// 模拟检测任务数据
export const testTaskData: ITestTask[] = [
    {
        id: 1,
        taskNo: 'TASK20231101001',
        sampleNo: 'S20231101001',
        sampleName: '钢筋混凝土试件',
        entrustmentId: 'WT20231101001',
        parameters: ['抗压强度', '外观质量'],
        assignedTo: '当前用户', // 模拟当前登录用户
        dueDate: '2023-11-10',
        status: '进行中',
        progress: 50,
        createdDate: '2023-11-01',
        priority: 'Urgent'
    },
    {
        id: 2,
        taskNo: 'TASK20231102001',
        sampleNo: 'S20231102001',
        sampleName: '砂石料',
        entrustmentId: 'WT20231102001',
        parameters: ['级配分析', '含泥量'],
        assignedTo: '赵六',
        dueDate: '2023-11-12',
        status: '待开始',
        progress: 0,
        createdDate: '2023-11-03',
        priority: 'Normal'
    },
    {
        id: 3,
        taskNo: 'TASK20231103001',
        sampleNo: 'S20231103001',
        sampleName: '水泥',
        entrustmentId: 'WT20231103001',
        parameters: ['凝结时间', '安定性'],
        assignedTo: '当前用户',
        dueDate: '2023-11-15',
        status: '待开始',
        progress: 0,
        createdDate: '2023-11-04',
        priority: 'Normal'
    },
    {
        id: 4,
        taskNo: 'TASK20231025001',
        sampleNo: 'S20231025001',
        sampleName: '钢筋',
        entrustmentId: 'WT20231025001',
        parameters: ['屈服强度', '抗拉强度', '伸长率'],
        assignedTo: '王五',
        dueDate: '2023-10-30',
        status: '已完成',
        progress: 100,
        createdDate: '2023-10-25',
        priority: 'Normal'
    },
    {
        id: 5,
        taskNo: 'TASK20231126001',
        sampleNo: 'S20231126001',
        sampleName: '水质样品A',
        entrustmentId: '202311001',
        parameters: ['pH值', '类大肠菌群', '色度'],
        assignedTo: '当前用户',
        dueDate: '2023-11-30',
        status: '进行中',
        progress: 0,
        createdDate: '2023-11-26',
        priority: 'Urgent'
    },
    {
        id: 6,
        taskNo: 'TASK20231115001',
        sampleNo: 'S2023110101',
        sampleName: '金属材料A',
        entrustmentId: '202311001',
        parameters: ['拉伸强度'],
        assignedTo: '张三',
        dueDate: '2023-11-30',
        status: '进行中',
        progress: 30,
        createdDate: '2023-11-15',
        priority: 'Normal',
        isOutsourced: true,
        outsourceInfo: {
            outsourceNo: 'WW-20231115-001',
            supplierId: 'SUP001',
            supplierName: '华测检测认证集团',
            status: '检测中'
        }
    },
    {
        id: 7,
        taskNo: 'TASK20231118001',
        sampleNo: 'S2023110301',
        sampleName: '涂层样品',
        entrustmentId: '202311003',
        parameters: ['中性盐雾'],
        assignedTo: '王五',
        dueDate: '2023-12-01',
        status: '待开始',
        progress: 0,
        createdDate: '2023-11-18',
        priority: 'Normal',
        isOutsourced: true,
        outsourceInfo: {
            outsourceNo: 'WW-20231118-002',
            supplierId: 'SUP001',
            supplierName: '华测检测认证集团',
            status: '已发送'
        }
    }
];

// 模拟数据录入记录
export const testDataEntryData: ITestDataEntry[] = [
    {
        id: 1,
        taskNo: 'TASK20231101001',
        parameterName: '抗压强度',
        testData: {
            value1: '35.2',
            value2: '34.8',
            result: '35.0',
            unit: 'MPa',
            conclusion: '合格'
        },
        deviceId: 'DEV001',
        deviceName: '万能试验机',
        temperature: 22.5,
        humidity: 45,
        operator: '当前用户',
        entryDate: '2023-11-05 10:30:00'
    },
    {
        id: 2,
        taskNo: 'TASK20231025001',
        parameterName: '屈服强度',
        testData: {
            value1: '420',
            result: '420',
            unit: 'MPa',
            conclusion: '合格'
        },
        deviceId: 'DEV001',
        deviceName: '万能试验机',
        temperature: 23.0,
        humidity: 42,
        operator: '王五',
        entryDate: '2023-10-28 09:15:00'
    },
    {
        id: 3,
        taskNo: 'TASK20231025001',
        parameterName: '抗拉强度',
        testData: {
            value1: '560',
            result: '560',
            unit: 'MPa',
            conclusion: '合格'
        },
        deviceId: 'DEV001',
        deviceName: '万能试验机',
        temperature: 23.0,
        humidity: 42,
        operator: '王五',
        entryDate: '2023-10-28 09:45:00'
    }
];

// 模拟转交记录
export const testTaskTransferData: ITestTaskTransfer[] = [
    {
        id: 1,
        taskNo: 'TASK20231101001',
        fromPerson: '李四',
        toPerson: '当前用户',
        reason: '工作量调整',
        transferDate: '2023-11-02 14:00:00'
    }
];
