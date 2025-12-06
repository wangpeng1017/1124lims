// 系统设置相关Mock数据

// 用户接口
export interface IUser {
    id: string;
    username: string;
    realName: string;
    email: string;
    phone: string;
    department: string;
    roles: string[]; // 角色ID列表
    status: 'active' | 'inactive';
    createTime: string;
    lastLoginTime?: string;
    employeeId?: number; // Linked Employee ID
}

// 角色接口
export interface IRole {
    id: string;
    roleName: string;
    description: string;
    permissions: string[]; // 权限ID列表
    status: 'active' | 'inactive';
    createTime: string;
}

// 权限接口
export interface IPermission {
    key: string;
    title: string;
    children?: IPermission[];
}

// 模拟用户数据
export const userData: IUser[] = [
    {
        id: '1',
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@lims.com',
        phone: '13800138000',
        department: 'IT部',
        roles: ['admin'],
        status: 'active',
        createTime: '2023-01-01 09:00:00',
        lastLoginTime: '2023-11-25 09:00:00',
        employeeId: 1
    },
    {
        id: '2',
        username: 'lab_manager',
        realName: '张主管',
        email: 'zhang@lims.com',
        phone: '13900139000',
        department: '检测部',
        roles: ['lab_manager'],
        status: 'active',
        createTime: '2023-01-02 10:00:00',
        lastLoginTime: '2023-11-24 10:00:00'
    },
    {
        id: '3',
        username: 'tester01',
        realName: '李检测',
        email: 'li@lims.com',
        phone: '13700137000',
        department: '检测部',
        roles: ['tester'],
        status: 'active',
        createTime: '2023-01-05 08:30:00',
        lastLoginTime: '2023-11-25 08:30:00'
    },
    {
        id: '4',
        username: 'sales01',
        realName: '王销售',
        email: 'wang@lims.com',
        phone: '13600136000',
        department: '市场部',
        roles: ['sales'],
        status: 'active',
        createTime: '2023-01-06 14:00:00',
        lastLoginTime: '2023-11-23 14:00:00'
    },
    {
        id: '5',
        username: 'finance01',
        realName: '赵财务',
        email: 'zhao@lims.com',
        phone: '13500135000',
        department: '财务部',
        roles: ['finance'], // 假设有财务角色，虽然主要关注4个核心角色
        status: 'active',
        createTime: '2023-01-07 09:00:00',
        lastLoginTime: '2023-11-22 16:00:00'
    }
];

// 模拟角色数据
export const roleData: IRole[] = [
    {
        id: 'admin',
        roleName: '系统管理员',
        description: '拥有系统所有权限',
        permissions: ['all'],
        status: 'active',
        createTime: '2023-01-01 09:00:00'
    },
    {
        id: 'lab_manager',
        roleName: '实验室主管',
        description: '负责实验室业务管理和报表查看',
        permissions: ['dashboard', 'entrustment', 'test', 'report', 'device', 'personnel'],
        status: 'active',
        createTime: '2023-01-01 09:00:00'
    },
    {
        id: 'tester',
        roleName: '检测人员',
        description: '负责任务执行和数据录入',
        permissions: ['test', 'sample', 'device'],
        status: 'active',
        createTime: '2023-01-01 09:00:00'
    },
    {
        id: 'sales',
        roleName: '销售人员',
        description: '负责委托管理和客户管理',
        permissions: ['entrustment', 'report_view'],
        status: 'active',
        createTime: '2023-01-01 09:00:00'
    }
];

// 权限树数据
export const permissionTreeData: IPermission[] = [
    {
        key: 'dashboard',
        title: '仪表盘',
    },
    {
        key: 'entrustment',
        title: '委托管理',
        children: [
            { key: 'entrustment_view', title: '查看委托' },
            { key: 'entrustment_edit', title: '编辑委托' },
            { key: 'entrustment_audit', title: '审核委托' },
        ]
    },
    {
        key: 'test',
        title: '试验管理',
        children: [
            { key: 'test_task', title: '检测任务' },
            { key: 'test_data', title: '数据录入' },
        ]
    },
    {
        key: 'report',
        title: '报告管理',
        children: [
            { key: 'report_view', title: '查看报告' },
            { key: 'report_audit', title: '审核报告' },
        ]
    },
    {
        key: 'device',
        title: '设备管理',
        children: [
            { key: 'device_view', title: '查看设备' },
            { key: 'device_maintain', title: '设备维护' },
        ]
    },
    {
        key: 'system',
        title: '系统设置',
        children: [
            { key: 'user_manage', title: '用户管理' },
            { key: 'role_manage', title: '角色管理' },
            { key: 'permission_manage', title: '权限配置' },
        ]
    }
];
