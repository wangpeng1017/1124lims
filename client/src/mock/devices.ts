
// 设备信息接口
export interface IDeviceInfo {
    id: string;                      // 设备唯一ID
    code: string;                    // 设备编号（如 ALTCCS-2022001）
    name: string;                    // 设备名称
    model: string;                   // 型号
    manufacturer: string;            // 制造商
    serialNumber: string;            // 出厂编号

    // 分类信息
    assetType: 'instrument' | 'device' | 'glassware'; // 资产类型：精密仪器、辅助设备、玻璃量器

    // 状态信息
    status: 'Running' | 'Maintenance' | 'Idle' | 'Scrapped'; // 设备状态
    location: string;                // 存放区域
    department: string;              // 所属部门

    // 日期信息
    purchaseDate: string;            // 采购日期
    commissioningDate: string;       // 启用日期
    lastCalibrationDate?: string;    // 上次定检日期
    nextCalibrationDate?: string;    // 下次定检日期

    // 责任人信息
    responsiblePerson: string;       // 设备负责人
    responsiblePersonId: string;

    // 性能指标
    utilization: number;             // 利用率 (%)
    operatingHours: number;          // 运行时长（小时）

    // 其他信息  
    specifications?: string;         // 技术规格
    attachments?: string[];          // 附件（说明书、合格证等）
    remarks?: string;                // 备注

    createTime: string;
    updateTime: string;
}

// 兼容旧接口别名
export type Device = IDeviceInfo;

// 原始设备数据迁移并扩展
export const deviceData: IDeviceInfo[] = [
    { id: '1', name: '火花源原子发射光谱仪', model: 'SPECTRO MAXx', code: 'ALTCCS-2022001', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'SPECTRO', serialNumber: 'SN2022001', location: '光谱室', department: '检测部', purchaseDate: '2022-01-15', commissioningDate: '2022-02-01', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 1200, createTime: '2022-01-15T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-02-01' },
    { id: '2', name: '全自动显微维氏硬度计', model: 'THVS-1MDX-AXYZF', code: 'ALTCCS-2022005', assetType: 'instrument', status: 'Running', utilization: 20, manufacturer: 'Time Group', serialNumber: 'SN2022005', location: '硬度室', department: '检测部', purchaseDate: '2022-03-10', commissioningDate: '2022-03-20', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 500, createTime: '2022-03-10T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-03-20' },
    { id: '3', name: '布氏硬度计', model: 'THB-3000S', code: 'ALTCCS-2022006', assetType: 'instrument', status: 'Running', utilization: 20, manufacturer: 'Time Group', serialNumber: 'SN2022006', location: '硬度室', department: '检测部', purchaseDate: '2022-03-12', commissioningDate: '2022-03-22', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 450, createTime: '2022-03-12T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-03-22' },
    { id: '4', name: '洛氏硬度计', model: 'THR-150DT', code: 'ALTCCS-2022008', assetType: 'instrument', status: 'Running', utilization: 20, manufacturer: 'Time Group', serialNumber: 'SN2022008', location: '硬度室', department: '检测部', purchaseDate: '2022-03-15', commissioningDate: '2022-03-25', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 480, createTime: '2022-03-15T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-03-25' },
    { id: '5', name: '金相显微镜', model: 'AE2000MET', code: 'ALTCCS-2022013', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'Motic', serialNumber: 'SN2022013', location: '金相室', department: '检测部', purchaseDate: '2022-04-01', commissioningDate: '2022-04-10', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 800, createTime: '2022-04-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-04-10' },
    { id: '6', name: '水平燃烧测试仪', model: 'TTech-GB8410-T', code: 'ALTCCS-2022026', assetType: 'device', status: 'Running', utilization: 20, manufacturer: 'TTech', serialNumber: 'SN2022026', location: '燃烧室', department: '检测部', purchaseDate: '2022-05-05', commissioningDate: '2022-05-15', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 300, createTime: '2022-05-05T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-05-15' },
    { id: '7', name: '垂直燃烧测试仪', model: 'TTech-GB32086-T', code: 'ALTCCS-2022027', assetType: 'device', status: 'Running', utilization: 20, manufacturer: 'TTech', serialNumber: 'SN2022027', location: '燃烧室', department: '检测部', purchaseDate: '2022-05-06', commissioningDate: '2022-05-16', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 320, createTime: '2022-05-06T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-05-16' },
    { id: '8', name: '盐雾试验箱（中性）', model: 'QS-ST-720optA', code: 'ALTCCS-2022035', assetType: 'device', status: 'Running', utilization: 60, manufacturer: 'Q-LAB', serialNumber: 'SN2022035', location: '环境实验室', department: '检测部', purchaseDate: '2022-06-01', commissioningDate: '2022-06-10', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 2000, createTime: '2022-06-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-06-10' },
    { id: '9', name: '2T电子万能试验机', model: 'CMT4204', code: 'ALTCCS-2022052', assetType: 'device', status: 'Running', utilization: 50, manufacturer: 'SANS', serialNumber: 'SN2022052', location: '力学室', department: '检测部', purchaseDate: '2022-07-01', commissioningDate: '2022-07-10', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 1500, createTime: '2022-07-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-07-10' },
    { id: '10', name: '5T电子万能试验机', model: 'E45.504', code: 'ALTCCS-2022053', assetType: 'device', status: 'Running', utilization: 50, manufacturer: 'MTS', serialNumber: 'SN2022053', location: '力学室', department: '检测部', purchaseDate: '2022-07-05', commissioningDate: '2022-07-15', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 1600, createTime: '2022-07-05T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-07-15' },
    { id: '11', name: '熔体流动速率试验机', model: 'ZRE1452', code: 'ALTCCS-2022055', assetType: 'device', status: 'Running', utilization: 30, manufacturer: 'Zwick', serialNumber: 'SN2022055', location: '物理室', department: '检测部', purchaseDate: '2022-08-01', commissioningDate: '2022-08-10', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 600, createTime: '2022-08-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-08-10' },
    { id: '12', name: '热变形维卡试验机', model: 'ZWK1302-B', code: 'ALTCCS-2022056', assetType: 'device', status: 'Running', utilization: 30, manufacturer: 'Zwick', serialNumber: 'SN2022056', location: '物理室', department: '检测部', purchaseDate: '2022-08-05', commissioningDate: '2022-08-15', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 650, createTime: '2022-08-05T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-08-15' },
    { id: '13', name: '电子天平', model: 'MSA2203S-1CE-DE', code: 'ALTCCS-2022061', assetType: 'instrument', status: 'Running', utilization: 40, manufacturer: 'Sartorius', serialNumber: 'SN2022061', location: '天平室', department: '检测部', purchaseDate: '2022-09-01', commissioningDate: '2022-09-05', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 1000, createTime: '2022-09-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-09-05' },
    { id: '14', name: '摆锤冲击试验机', model: 'ZBC7550-B', code: 'ALTCCS-2022063', assetType: 'device', status: 'Running', utilization: 30, manufacturer: 'Zwick', serialNumber: 'SN2022063', location: '力学室', department: '检测部', purchaseDate: '2022-09-10', commissioningDate: '2022-09-20', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 400, createTime: '2022-09-10T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-09-20' },
    { id: '15', name: '数显游标卡尺', model: '500-196-30', code: 'ALTCCS-2022066', assetType: 'instrument', status: 'Running', utilization: 50, manufacturer: 'Mitutoyo', serialNumber: 'SN2022066', location: '尺寸室', department: '检测部', purchaseDate: '2022-10-01', commissioningDate: '2022-10-05', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 800, createTime: '2022-10-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-05' },
    { id: '16', name: '电导率仪', model: 'S230', code: 'ALTCCS-2022067', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'Mettler Toledo', serialNumber: 'SN2022067', location: '化学室', department: '检测部', purchaseDate: '2022-10-10', commissioningDate: '2022-10-15', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 300, createTime: '2022-10-10T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-15' },
    { id: '17', name: 'PH计', model: 'S2', code: 'ALTCCS-2022068', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'Mettler Toledo', serialNumber: 'SN2022068', location: '化学室', department: '检测部', purchaseDate: '2022-10-12', commissioningDate: '2022-10-17', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 320, createTime: '2022-10-12T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-17' },
    { id: '18', name: '密度计', model: 'DMA35', code: 'ALTCCS-2022069', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'Anton Paar', serialNumber: 'SN2022069', location: '物理室', department: '检测部', purchaseDate: '2022-10-15', commissioningDate: '2022-10-20', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 350, createTime: '2022-10-15T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-20' },
    { id: '19', name: '轴向电子引伸计', model: 'Y50/25', code: 'ALTCCS-2022070', assetType: 'instrument', status: 'Running', utilization: 30, manufacturer: 'Epsilon', serialNumber: 'SN2022070', location: '力学室', department: '检测部', purchaseDate: '2022-10-20', commissioningDate: '2022-10-25', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 400, createTime: '2022-10-20T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-25' },
    { id: '20', name: '大变形测量装置', model: '（10-800）mm', code: 'ALTCCS-2022071', assetType: 'device', status: 'Running', utilization: 20, manufacturer: 'Zwick', serialNumber: 'SN2022071', location: '力学室', department: '检测部', purchaseDate: '2022-10-25', commissioningDate: '2022-10-30', responsiblePerson: '李四', responsiblePersonId: 'E002', operatingHours: 200, createTime: '2022-10-25T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-10-30' },
    { id: '21', name: '钢直尺', model: '500mm', code: 'ALTCCS-2022072', assetType: 'glassware', status: 'Running', utilization: 50, manufacturer: 'Generic', serialNumber: 'SN2022072', location: '尺寸室', department: '检测部', purchaseDate: '2022-11-01', commissioningDate: '2022-11-05', responsiblePerson: '张三', responsiblePersonId: 'E001', operatingHours: 100, createTime: '2022-11-01T00:00:00Z', updateTime: '2023-11-25T00:00:00Z', nextCalibrationDate: '2024-11-05' },
];

// 保养计划接口
export interface IMaintenancePlan {
    id: string;
    deviceId: string;               // 关联设备
    deviceName: string;
    planName: string;               // 计划名称
    planType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'; // 周期类型
    interval: number;               // 间隔（天数）
    nextMaintenanceDate: string;    // 下次保养日期
    responsiblePerson: string;
    responsiblePersonId: string;
    maintenanceItems: string[];     // 保养项目
    status: 'active' | 'inactive';
    createTime: string;
}

// 保养记录接口
export interface IMaintenanceRecord {
    id: string;
    planId?: string;                // 关联计划（可选，临时保养无计划）
    deviceId: string;
    deviceName: string;
    maintenanceType: 'routine' | 'preventive' | 'emergency'; // 保养类型
    maintenanceDate: string;
    maintenanceItems: string[];     // 实际保养项目
    operator: string;               // 操作人员
    operatorId: string;
    duration: number;               // 耗时（小时）
    result: 'normal' | 'abnormal';  // 保养结果
    findings?: string;              // 发现的问题
    followUpActions?: string;       // 后续行动
    attachments?: string[];         // 附件（照片、报告等）
    createTime: string;
}

// 维修记录接口
export interface IRepairRecord {
    id: string;
    deviceId: string;
    deviceName: string;
    faultDescription: string;       // 故障描述
    faultDate: string;              // 故障日期
    faultType: 'hardware' | 'software' | 'other'; // 故障类型
    severity: 'low' | 'medium' | 'high' | 'critical'; // 严重程度

    reportedBy: string;             // 报修人
    reportedById: string;
    reportDate: string;             // 报修日期

    repairStartDate?: string;       // 维修开始日期
    repairEndDate?: string;         // 维修结束日期
    repairer?: string;              // 维修人员
    repairerId?: string;

    repairMethod: string;           // 维修方法
    replacedParts?: Array<{         // 更换部件
        partName: string;
        partNumber: string;
        quantity: number;
        unitPrice: number;
    }>;

    // 费用信息
    laborCost: number;              // 人工费
    partsCost: number;              // 配件费
    otherCost: number;              // 其他费用
    totalCost: number;              // 总费用

    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    result?: 'success' | 'failed';  // 维修结果
    feedback?: string;              // 维修反馈

    attachments?: string[];
    createTime: string;
    updateTime: string;
}

// 定检计划接口
export interface ICalibrationPlan {
    id: string;
    deviceId: string;
    deviceName: string;
    planName: string;               // 计划名称
    calibrationType: 'internal' | 'external'; // 内部/外部检定
    calibrationCycle: number;       // 检定周期（月）
    calibrationStandard: string;    // 检定标准

    lastCalibrationDate?: string;
    nextCalibrationDate: string;

    responsiblePerson: string;
    responsiblePersonId: string;

    reminderDays: number;           // 提前提醒天数

    status: 'active' | 'inactive';
    createTime: string;
    updateTime: string;
}

// 定检记录接口
export interface ICalibrationRecord {
    id: string;
    planId?: string;
    deviceId: string;
    deviceName: string;
    calibrationDate: string;
    calibrationType: 'internal' | 'external';
    calibrationAgency?: string;     // 检定机构（外部检定）
    certificateNumber?: string;     // 证书编号

    calibrationItems: Array<{       // 检定项目
        itemName: string;
        standard: string;
        actualValue: string;
        result: 'pass' | 'fail';
    }>;

    overallResult: 'pass' | 'fail'; // 总体结果
    validUntil?: string;            // 有效期至

    operator: string;
    operatorId: string;

    cost?: number;                  // 费用
    remarks?: string;
    attachments?: string[];         // 证书、报告等

    createTime: string;
}

// Mock Data for Maintenance Plans
export const maintenancePlanData: IMaintenancePlan[] = [
    {
        id: 'MP001',
        deviceId: '1',
        deviceName: '火花源原子发射光谱仪',
        planName: '光谱仪日常维护',
        planType: 'daily',
        interval: 1,
        nextMaintenanceDate: '2023-11-26',
        responsiblePerson: '张三',
        responsiblePersonId: 'E001',
        maintenanceItems: ['清洁激发台', '检查氩气压力', '检查水冷系统'],
        status: 'active',
        createTime: '2023-01-01T00:00:00Z'
    },
    {
        id: 'MP002',
        deviceId: '8',
        deviceName: '盐雾试验箱（中性）',
        planName: '盐雾箱周度保养',
        planType: 'weekly',
        interval: 7,
        nextMaintenanceDate: '2023-11-27',
        responsiblePerson: '李四',
        responsiblePersonId: 'E002',
        maintenanceItems: ['更换盐水', '清洁喷嘴', '检查密封性'],
        status: 'active',
        createTime: '2023-01-01T00:00:00Z'
    }
];

// Mock Data for Calibration Plans
export const calibrationPlanData: ICalibrationPlan[] = [
    {
        id: 'CP001',
        deviceId: '1',
        deviceName: '火花源原子发射光谱仪',
        planName: '光谱仪年度校准',
        calibrationType: 'external',
        calibrationCycle: 12,
        calibrationStandard: 'JJG 768-2005',
        lastCalibrationDate: '2023-02-01',
        nextCalibrationDate: '2024-02-01',
        responsiblePerson: '张三',
        responsiblePersonId: 'E001',
        reminderDays: 30,
        status: 'active',
        createTime: '2023-01-01T00:00:00Z',
        updateTime: '2023-01-01T00:00:00Z'
    }
];

// Mock Data for Maintenance Records
export const maintenanceRecordData: IMaintenanceRecord[] = [
    {
        id: 'MR001',
        planId: 'MP001',
        deviceId: '1',
        deviceName: '火花源原子发射光谱仪',
        maintenanceType: 'routine',
        maintenanceDate: '2023-11-20',
        maintenanceItems: ['清洁激发台', '检查氩气压力'],
        operator: '张三',
        operatorId: 'E001',
        duration: 0.5,
        result: 'normal',
        createTime: '2023-11-20T10:00:00Z'
    }
];

// Mock Data for Calibration Records
export const calibrationRecordData: ICalibrationRecord[] = [
    {
        id: 'CR001',
        planId: 'CP001',
        deviceId: '1',
        deviceName: '火花源原子发射光谱仪',
        calibrationType: 'external',
        calibrationDate: '2023-02-01',
        calibrationAgency: '上海市计量测试技术研究院',
        certificateNumber: 'CAL20230201001',
        calibrationItems: [
            { itemName: '波长示值误差', standard: '±0.02nm', actualValue: '+0.01nm', result: 'pass' }
        ],
        overallResult: 'pass',
        validUntil: '2024-02-01',
        operator: '张三',
        operatorId: 'E001',
        attachments: ['cert.pdf'],
        createTime: '2023-02-02T10:00:00Z'
    }
];

// Mock Data for Repair Records
export const repairRecordData: IRepairRecord[] = [
    {
        id: 'RR001',
        deviceId: '8',
        deviceName: '盐雾试验箱（中性）',
        faultDescription: '喷嘴堵塞，无法喷雾',
        faultDate: '2023-11-15',
        faultType: 'hardware',
        severity: 'medium',
        reportedBy: '李四',
        reportedById: 'E002',
        reportDate: '2023-11-15T09:00:00Z',
        repairStartDate: '2023-11-15T10:00:00Z',
        repairEndDate: '2023-11-15T14:00:00Z',
        repairer: '王五',
        repairerId: 'E003',
        repairMethod: '清理喷嘴，更换过滤网',
        replacedParts: [
            { partName: '过滤网', partNumber: 'F-001', quantity: 1, unitPrice: 50 }
        ],
        laborCost: 200,
        partsCost: 50,
        otherCost: 0,
        totalCost: 250,
        status: 'completed',
        result: 'success',
        feedback: '修复后运行正常',
        createTime: '2023-11-15T09:00:00Z',
        updateTime: '2023-11-15T14:00:00Z'
    }
];
