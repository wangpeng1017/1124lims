export interface Employee {
    id: number;
    empId: string;
    name: string;
    position: string;
    department: string;
    contact: string;
    status: 'Active' | 'Inactive';
}

export const employeeData: Employee[] = [
    { id: 1, empId: 'E001', name: '张三', position: '检测员', department: '力学实验室', contact: '13800138000', status: 'Active' },
    { id: 2, empId: 'E002', name: '李四', position: '主管', department: '管理部', contact: '13900139000', status: 'Active' },
    { id: 3, empId: 'E003', name: '王五', position: '检测员', department: '金相实验室', contact: '13700137000', status: 'Active' },
    { id: 4, empId: 'E004', name: '赵六', position: '检测员', department: '化学实验室', contact: '13600136000', status: 'Active' },
    { id: 5, empId: 'E005', name: '陈七', position: '高级检测员', department: '力学实验室', contact: '13500135000', status: 'Active' },
    { id: 6, empId: 'E006', name: '刘八', position: '检测员', department: '力学实验室', contact: '13400134000', status: 'Active' },
];

export interface Department {
    id: number;
    name: string;
    manager: string;
    description: string;
}

export const departmentData: Department[] = [
    { id: 1, name: '检测部', manager: '李四', description: '负责日常检测工作' },
    { id: 2, name: '质量部', manager: '王五', description: '负责质量体系维护' },
];

export interface Station {
    id: number;
    name: string;
    address: string;
    contactPerson: string;
}

export const stationData: Station[] = [
    { id: 1, name: '上海总站', address: '上海市浦东新区', contactPerson: '赵六' },
    { id: 2, name: '北京分站', address: '北京市朝阳区', contactPerson: '孙七' },
];

export interface Capability {
    id: number;
    empName: string;
    parameter: string; // 检测参数
    certificate: string; // 证书名称
    expiryDate: string;
}

export const capabilityData: Capability[] = [
    // 正常状态 - 张三
    { id: 1, empName: '张三', parameter: '拉伸测试', certificate: '力学检测员证', expiryDate: '2025-12-31' },
    { id: 2, empName: '张三', parameter: '压缩测试', certificate: '力学检测员证', expiryDate: '2025-12-31' },

    // 即将过期 - 王五 (30天内)
    { id: 3, empName: '王五', parameter: '金相分析', certificate: '金相检测员证', expiryDate: '2025-01-05' },
    { id: 4, empName: '王五', parameter: '硬度测试', certificate: '金相检测员证', expiryDate: '2025-01-05' },

    // 已过期 - 赵六
    { id: 5, empName: '赵六', parameter: '化学成分分析', certificate: '化学检测员证', expiryDate: '2024-11-30' },

    // 正常状态 - 陈七 (多个资质)
    { id: 6, empName: '陈七', parameter: '拉伸测试', certificate: '力学检测员证', expiryDate: '2026-06-30' },
    { id: 7, empName: '陈七', parameter: '压缩测试', certificate: '力学检测员证', expiryDate: '2026-06-30' },
    { id: 8, empName: '陈七', parameter: '弯曲测试', certificate: '力学检测员证', expiryDate: '2026-06-30' },
    { id: 9, empName: '陈七', parameter: '冲击测试', certificate: '高级力学检测员证', expiryDate: '2026-06-30' },

    // 刘八 - 无资质数据 (用于测试无资质场景)
];

export interface Review {
    id: number;
    empName: string;
    capabilityId?: number; // Link to Capability
    trainingContent: string;
    examResult: 'Pass' | 'Fail';
    date: string;
}

export const reviewData: Review[] = [
    { id: 1, empName: '张三', capabilityId: 1, trainingContent: '新标准培训', examResult: 'Pass', date: '2023-11-20' },
];
