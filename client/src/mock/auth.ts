/**
 * 用户认证和权限系统 - 数据模型和模拟数据
 */

// ==================== 数据模型 ====================

/**
 * 用户
 */
export interface IUser {
    id: string;
    username: string;
    password?: string;          // 实际应用中不返回密码
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    departmentId: string;
    roleIds: string[];          // 支持多角色
    status: 'active' | 'disabled';
    createTime: string;
    lastLoginTime?: string;
}

/**
 * 部门
 */
export interface IDepartment {
    id: string;
    name: string;
    parentId?: string;
    code: string;
    description?: string;
    status: 'active' | 'disabled';
}

/**
 * 模块权限
 */
export interface IModuleAccess {
    moduleKey: string;
    moduleName: string;
    access: 'full' | 'read' | 'operate' | 'approve' | 'none';
}

/**
 * 审批权限
 */
export interface IApprovalPermission {
    businessType: string;
    businessName: string;
    canApprove: boolean;
    stepIds?: string[];
}

/**
 * 数据权限范围类型
 * 1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义
 */
export type DataScopeType = 'all' | 'department_and_children' | 'department' | 'self' | 'custom';

/**
 * 角色
 */
export interface IRole {
    id: string;
    name: string;
    code: string;
    description?: string;
    isSystem: boolean;          // 系统预设角色不可删除
    permissions: string[];      // 操作权限: create, read, update, delete, export, import, approve, print
    deletePermissions: string[]; // 模块级删除权限: ['entrustment', 'sample', ...]
    moduleAccess: IModuleAccess[];
    dataScope: DataScopeType;   // 数据权限范围
    customDeptIds?: string[];   // 自定义部门ID列表 (当 dataScope 为 'custom' 时使用)
    approvalPermissions: IApprovalPermission[];
    createTime: string;
    updateTime: string;
}

// ==================== 权限常量 ====================

/**
 * 操作权限
 */
export const OPERATION_PERMISSIONS = [
    { key: 'create', label: '新增' },
    { key: 'read', label: '查看' },
    { key: 'update', label: '编辑' },
    { key: 'delete', label: '删除' },
    { key: 'export', label: '导出' },
    { key: 'import', label: '导入' },
    { key: 'approve', label: '审批' },
    { key: 'print', label: '打印' },
] as const;

/**
 * 系统模块
 */
export const SYSTEM_MODULES = [
    { key: 'entrustment', name: '业务管理', icon: 'FileTextOutlined' },
    { key: 'sample', name: '样品管理', icon: 'ExperimentOutlined' },
    { key: 'test', name: '检测管理', icon: 'AuditOutlined' },
    { key: 'report', name: '报告管理', icon: 'FileDoneOutlined' },
    { key: 'device', name: '设备管理', icon: 'ToolOutlined' },
    { key: 'consumable', name: '耗材管理', icon: 'AppstoreOutlined' },
    { key: 'outsourcing', name: '委外管理', icon: 'ShareAltOutlined' },
    { key: 'supplier', name: '供应商管理', icon: 'TeamOutlined' },
    { key: 'personnel', name: '人员管理', icon: 'UserOutlined' },
    { key: 'finance', name: '财务管理', icon: 'DollarOutlined' },
    { key: 'statistics', name: '统计报表', icon: 'BarChartOutlined' },
    { key: 'system', name: '系统设置', icon: 'SettingOutlined' },
] as const;

/**
 * 数据权限范围 (与后端对应: 1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义)
 */
export const DATA_SCOPE_OPTIONS = [
    { value: 'all', label: '全部数据', code: 1 },
    { value: 'department_and_children', label: '本部门及以下', code: 2 },
    { value: 'department', label: '本部门数据', code: 3 },
    { value: 'self', label: '仅本人数据', code: 4 },
    { value: 'custom', label: '自定义部门', code: 5 },
] as const;

/**
 * 模块访问级别
 */
export const MODULE_ACCESS_OPTIONS = [
    { value: 'full', label: '全部权限', color: 'green' },
    { value: 'operate', label: '操作权限', color: 'blue' },
    { value: 'approve', label: '审批权限', color: 'orange' },
    { value: 'read', label: '只读权限', color: 'default' },
    { value: 'none', label: '无权限', color: 'red' },
] as const;

/**
 * 审批业务类型
 */
export const APPROVAL_BUSINESS_TYPES = [
    { key: 'quotation', name: '报价单审批' },
    { key: 'contract', name: '合同审批' },
    { key: 'entrustment', name: '委托单审批' },
    { key: 'report', name: '检测报告审批' },
    { key: 'outsourcing', name: '委外申请审批' },
    { key: 'purchase', name: '采购申请审批' },
    { key: 'expense', name: '费用报销审批' },
] as const;

// ==================== 模拟数据 ====================

/**
 * 部门数据
 */
export const departmentData: IDepartment[] = [
    { id: 'dept-001', name: '总经办', code: 'CEO', status: 'active' },
    { id: 'dept-002', name: '检测一部', code: 'LAB1', parentId: 'dept-001', status: 'active' },
    { id: 'dept-003', name: '检测二部', code: 'LAB2', parentId: 'dept-001', status: 'active' },
    { id: 'dept-004', name: '业务部', code: 'SALES', parentId: 'dept-001', status: 'active' },
    { id: 'dept-005', name: '质量部', code: 'QA', parentId: 'dept-001', status: 'active' },
    { id: 'dept-006', name: '财务部', code: 'FIN', parentId: 'dept-001', status: 'active' },
    { id: 'dept-007', name: '信息技术部', code: 'IT', parentId: 'dept-001', status: 'active' },
    { id: 'dept-008', name: '样品管理室', code: 'SAMPLE', parentId: 'dept-002', status: 'active' },
];

/**
 * 角色数据 - 系统预设 + 可编辑
 */
export const roleData: IRole[] = [
    {
        id: 'role-001',
        name: '系统管理员',
        code: 'admin',
        description: '拥有所有权限，管理用户和系统配置',
        isSystem: true,
        permissions: ['create', 'read', 'update', 'delete', 'export', 'import', 'approve', 'print'],
        deletePermissions: ['entrustment', 'sample', 'test', 'report', 'device', 'consumable', 'outsourcing', 'supplier', 'personnel', 'finance', 'statistics', 'system'], // 管理员可删除所有模块
        moduleAccess: SYSTEM_MODULES.map(m => ({ moduleKey: m.key, moduleName: m.name, access: 'full' as const })),
        dataScope: 'all',
        approvalPermissions: APPROVAL_BUSINESS_TYPES.map(t => ({ businessType: t.key, businessName: t.name, canApprove: true })),
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-002',
        name: '实验室主任',
        code: 'lab_director',
        description: '审批报告，管理检测流程',
        isSystem: true,
        permissions: ['create', 'read', 'update', 'export', 'approve', 'print'],
        deletePermissions: ['report', 'outsourcing'], // 实验室主任可删除报告和委外
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'approve' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'read' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'approve' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'approve' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'read' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'read' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'approve' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'read' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'read' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'read' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'full' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'all',
        approvalPermissions: [
            { businessType: 'report', businessName: '检测报告审批', canApprove: true },
            { businessType: 'outsourcing', businessName: '委外申请审批', canApprove: true },
        ],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-003',
        name: '业务经理',
        code: 'sales_manager',
        description: '客户管理，合同审批',
        isSystem: true,
        permissions: ['create', 'read', 'update', 'export', 'approve', 'print'],
        deletePermissions: ['entrustment'], // 业务经理可删除业务数据
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'full' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'read' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'read' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'read' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'none' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'none' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'read' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'read' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'none' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'read' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'operate' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'department',
        approvalPermissions: [
            { businessType: 'quotation', businessName: '报价单审批', canApprove: true },
            { businessType: 'contract', businessName: '合同审批', canApprove: true },
        ],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-004',
        name: '检测工程师',
        code: 'test_engineer',
        description: '执行检测任务，数据录入',
        isSystem: true,
        permissions: ['create', 'read', 'update'],
        deletePermissions: [], // 检测工程师无删除权限
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'read' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'operate' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'full' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'operate' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'operate' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'operate' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'read' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'none' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'none' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'none' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'read' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'self',
        approvalPermissions: [],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-005',
        name: '样品管理员',
        code: 'sample_admin',
        description: '样品接收、流转、存储',
        isSystem: true,
        permissions: ['create', 'read', 'update'],
        deletePermissions: ['sample'], // 样品管理员可删除样品
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'read' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'full' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'read' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'read' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'none' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'read' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'read' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'none' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'none' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'none' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'none' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'department',
        approvalPermissions: [],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-006',
        name: '财务人员',
        code: 'finance',
        description: '财务管理，收款确认',
        isSystem: true,
        permissions: ['create', 'read', 'update', 'export', 'approve'],
        deletePermissions: ['finance'], // 财务人员可删除财务数据
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'read' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'none' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'none' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'read' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'none' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'read' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'read' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'read' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'none' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'full' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'operate' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'all',
        approvalPermissions: [
            { businessType: 'expense', businessName: '费用报销审批', canApprove: true },
        ],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
    {
        id: 'role-007',
        name: '普通用户',
        code: 'user',
        description: '只读权限，查看报告',
        isSystem: true,
        permissions: ['read'],
        deletePermissions: [], // 普通用户无删除权限
        moduleAccess: [
            { moduleKey: 'entrustment', moduleName: '业务管理', access: 'read' },
            { moduleKey: 'sample', moduleName: '样品管理', access: 'read' },
            { moduleKey: 'test', moduleName: '检测管理', access: 'read' },
            { moduleKey: 'report', moduleName: '报告管理', access: 'read' },
            { moduleKey: 'device', moduleName: '设备管理', access: 'none' },
            { moduleKey: 'consumable', moduleName: '耗材管理', access: 'none' },
            { moduleKey: 'outsourcing', moduleName: '委外管理', access: 'none' },
            { moduleKey: 'supplier', moduleName: '供应商管理', access: 'none' },
            { moduleKey: 'personnel', moduleName: '人员管理', access: 'none' },
            { moduleKey: 'finance', moduleName: '财务管理', access: 'none' },
            { moduleKey: 'statistics', moduleName: '统计报表', access: 'none' },
            { moduleKey: 'system', moduleName: '系统设置', access: 'none' },
        ],
        dataScope: 'self',
        approvalPermissions: [],
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
    },
];

/**
 * 用户数据
 */
export const userData: IUser[] = [
    {
        id: 'user-001',
        username: 'admin',
        name: '系统管理员',
        phone: '13800000001',
        email: 'admin@lims.com',
        departmentId: 'dept-007',
        roleIds: ['role-001'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-07T10:00:00',
    },
    {
        id: 'user-002',
        username: 'director',
        name: '王主任',
        phone: '13800000002',
        email: 'director@lims.com',
        departmentId: 'dept-001',
        roleIds: ['role-002'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-06T15:30:00',
    },
    {
        id: 'user-003',
        username: 'sales',
        name: '李经理',
        phone: '13800000003',
        email: 'sales@lims.com',
        departmentId: 'dept-004',
        roleIds: ['role-003'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-06T09:00:00',
    },
    {
        id: 'user-004',
        username: 'engineer1',
        name: '张工程师',
        phone: '13800000004',
        email: 'engineer1@lims.com',
        departmentId: 'dept-002',
        roleIds: ['role-004'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-07T08:30:00',
    },
    {
        id: 'user-005',
        username: 'sample',
        name: '陈样品员',
        phone: '13800000005',
        email: 'sample@lims.com',
        departmentId: 'dept-008',
        roleIds: ['role-005'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-07T08:00:00',
    },
    {
        id: 'user-006',
        username: 'finance',
        name: '刘会计',
        phone: '13800000006',
        email: 'finance@lims.com',
        departmentId: 'dept-006',
        roleIds: ['role-006'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-06T17:00:00',
    },
    {
        id: 'user-007',
        username: 'guest',
        name: '访客用户',
        phone: '13800000007',
        email: 'guest@lims.com',
        departmentId: 'dept-001',
        roleIds: ['role-007'],
        status: 'active',
        createTime: '2024-01-01',
        lastLoginTime: '2024-12-01T10:00:00',
    },
];

// ==================== 工具函数 ====================

/**
 * 根据角色ID获取角色
 */
export const getRoleById = (roleId: string): IRole | undefined => {
    return roleData.find(r => r.id === roleId);
};

/**
 * 根据用户ID获取用户
 */
export const getUserById = (userId: string): IUser | undefined => {
    return userData.find(u => u.id === userId);
};

/**
 * 根据部门ID获取部门
 */
export const getDepartmentById = (deptId: string): IDepartment | undefined => {
    return departmentData.find(d => d.id === deptId);
};

/**
 * 获取用户的完整信息（包含角色和部门）
 */
export const getUserWithDetails = (userId: string) => {
    const user = getUserById(userId);
    if (!user) return null;

    const roles = user.roleIds.map(roleId => getRoleById(roleId)).filter(Boolean) as IRole[];
    const department = getDepartmentById(user.departmentId);

    return {
        ...user,
        roles,
        department,
    };
};
