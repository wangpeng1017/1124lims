export interface Consumable {
    id: string;
    name: string;
    spec: string;
    unit: string;
    totalIn: number;
    totalOut: number;
    stock: number;
    category: string;
    location: string;
}

export const consumablesData: Consumable[] = [
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
