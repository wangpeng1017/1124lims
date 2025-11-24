// 检测基础参数相关数据类型

export interface DetectionParameter {
    id: number;
    name: string; // 参数名称
    category: string; // 分类
    unit: string; // 单位
    description: string;
}

export const detectionParametersData: DetectionParameter[] = [
    { id: 1, name: '抗压强度', category: '力学性能', unit: 'MPa', description: '混凝土抗压强度测试' },
    { id: 2, name: '级配分析', category: '物理性能', unit: '-', description: '砂石级配分析' },
    { id: 3, name: '含泥量', category: '物理性能', unit: '%', description: '砂石含泥量测定' },
];
