// 耗材管理模块 Mock数据

// 耗材信息接口（升级版）
export interface IConsumableInfo {
    id: number;
    code: string;                 // 编号
    name: string;                 // 名称
    specification: string;        // 规格
    unit: string;                 // 单位
    category: '试剂' | '标样' | '对照品' | '标准品' | '备件耗材' | '危险品' | '易制毒品';

    // 采购信息
    purchaseQuantity: number;     // 购置数量
    purchaseDate: string;         // 购置日期

    // 库存信息
    currentStock: number;         // 库存数量
    minStock: number;             // 最小库存量（预警阈值）
    maxStock: number;             // 最大库存量

    // 存储信息
    storageCondition?: string;    // 存储条件
    storageLocation: string;      // 存放位置
    expiryDate?: string;          // 有效期

    // 统计字段
    totalInQuantity: number;      // 累计入库
    totalOutQuantity: number;     // 累计出库

    status: '正常' | '预警' | '过期';
    remark?: string;
}

// 出入库记录接口
export interface IStockTransaction {
    id: number;
    transactionNo: string;        // 单据编号
    consumableCode: string;       // 耗材编号
    consumableName: string;       // 耗材名称
    type: '入库' | '出库';
    quantity: number;             // 数量
    transactionDate: string;      // 日期

    // 出库专用字段
    department?: string;          // 领用部门
    recipientName?: string;       // 领用人
    purpose?: string;             // 用途

    // 入库专用字段
    supplier?: string;            // 供应商
    batchNo?: string;             // 批号

    handlerName: string;          // 经办人
    remark?: string;
}

// 原始旧数据（用于参考迁移逻辑，实际使用新数据）
const oldData = [
    { id: '01001', name: '0-150℃温度计', spec: '0-150℃', unit: '个', totalIn: 1, totalOut: 1, stock: 0, category: '低值易耗品', location: '' },
    { id: '01012', name: '镊子', spec: '直头、平头、弯头', unit: '套', totalIn: 2, totalOut: 1, stock: 1, category: '低值易耗品', location: 'C-4-1' },
    { id: '02001', name: '液压器油', spec: '46号', unit: '公斤', totalIn: 246.91, totalOut: 246.91, stock: 0, category: '原材料', location: '' },
    { id: '02030', name: '尖嘴冲洗瓶500ml', spec: '500ml', unit: '个', totalIn: 10, totalOut: 4, stock: 6, category: '原材料', location: 'C-4-1' },
    { id: '02033', name: '白凡士林500g', spec: '500g', unit: '个', totalIn: 1, totalOut: 0, stock: 1, category: '原材料', location: '试剂-A-8-1' },
    { id: '02037', name: '脱脂棉500g', spec: '500g', unit: '包', totalIn: 10, totalOut: 3, stock: 7, category: '原材料', location: 'C-4-3' },
    { id: '02048', name: '变色硅胶干燥剂', spec: '500g', unit: '个', totalIn: 20, totalOut: 10, stock: 10, category: '原材料', location: 'C-5-1' },
    { id: '02049', name: '氯化钠', spec: '分析纯', unit: '个', totalIn: 140, totalOut: 80, stock: 60, category: '原材料', location: 'D-6-3' },
    { id: '02050', name: '乙醇', spec: '分析纯', unit: '个', totalIn: 20, totalOut: 4, stock: 16, category: '原材料', location: '试剂-A-8-5' },
    { id: '02063', name: '镶嵌料（HM1 黑色）', spec: '500g', unit: '个', totalIn: 1, totalOut: 0, stock: 1, category: '原材料', location: 'C-3-3' },
];

// 辅助函数：确定新分类
const determineCategory = (oldCategory: string, name: string): IConsumableInfo['category'] => {
    if (oldCategory === '低值易耗品') return '备件耗材';
    if (name.includes('试剂') || name.includes('乙醇') || name.includes('氯化钠') || name.includes('油') || name.includes('凡士林')) return '试剂';
    return '备件耗材';
};

// 辅助函数：计算状态
const calculateStatus = (stock: number, minStock: number): IConsumableInfo['status'] => {
    if (stock <= minStock) return '预警';
    return '正常';
};

// 迁移后的耗材数据
export const consumablesData: IConsumableInfo[] = oldData.map((item, index) => {
    const minStock = Math.max(1, Math.floor(item.totalIn * 0.2)); // 设定最小库存为采购量的20%
    return {
        id: index + 1,
        code: item.id,
        name: item.name,
        specification: item.spec,
        unit: item.unit,
        category: determineCategory(item.category, item.name),
        purchaseQuantity: item.totalIn,
        purchaseDate: '2023-01-01', // 默认日期
        currentStock: item.stock,
        minStock: minStock,
        maxStock: item.totalIn * 2,
        storageCondition: '常温',
        storageLocation: item.location || '待分配',
        expiryDate: undefined, // 默认无有效期
        totalInQuantity: item.totalIn,
        totalOutQuantity: item.totalOut,
        status: calculateStatus(item.stock, minStock),
        remark: '数据迁移'
    };
});

// 模拟出入库记录数据
export const stockTransactionData: IStockTransaction[] = [
    {
        id: 1,
        transactionNo: 'OUT-20231120-001',
        consumableCode: '02049',
        consumableName: '氯化钠',
        type: '出库',
        quantity: 10,
        transactionDate: '2023-11-20',
        department: '检测一部',
        recipientName: '张三',
        purpose: '样品前处理',
        handlerName: '库管员',
        remark: ''
    },
    {
        id: 2,
        transactionNo: 'IN-20231115-001',
        consumableCode: '02050',
        consumableName: '乙醇',
        type: '入库',
        quantity: 20,
        transactionDate: '2023-11-15',
        supplier: '某化学试剂公司',
        batchNo: 'BATCH20231115',
        handlerName: '库管员',
        remark: '采购入库'
    }
];
