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
    { id: 1, empId: 'E001', name: '张三', position: '检测员', department: '检测部', contact: '13800138000', status: 'Active' },
    { id: 2, empId: 'E002', name: '李四', position: '主管', department: '管理部', contact: '13900139000', status: 'Active' },
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
    { id: 1, empName: '张三', parameter: '拉伸测试', certificate: '力学检测员证', expiryDate: '2025-12-31' },
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
