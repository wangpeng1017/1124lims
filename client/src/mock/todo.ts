// 待办事项相关类型定义

export type TodoType =
    | 'quotation_approval'      // 报价单审批
    | 'report_approval'         // 报告审批
    | 'task_assignment'         // 任务分配
    | 'sample_collection'       // 样品领用
    | 'device_maintenance'      // 设备维护
    | 'device_calibration'      // 设备校准
    | 'contract_sign'           // 合同签订
    | 'outsourcing_review';     // 委外审核

export type TodoPriority = 'urgent' | 'high' | 'normal' | 'low';

export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface ITodo {
    id: string;
    type: TodoType;
    title: string;
    description: string;
    priority: TodoPriority;
    status: TodoStatus;
    dueDate: string;
    createdAt: string;
    createdBy: string;
    assignedTo: string;
    relatedId?: string;        // 关联的业务ID（如报价单ID、任务ID等）
    relatedNo?: string;        // 关联的业务编号
    link?: string;             // 跳转链接
}

// 待办类型映射
export const TODO_TYPE_MAP: Record<TodoType, { text: string; color: string; icon: string }> = {
    quotation_approval: { text: '报价单审批', color: 'blue', icon: '📋' },
    report_approval: { text: '报告审批', color: 'green', icon: '📄' },
    task_assignment: { text: '任务分配', color: 'orange', icon: '📝' },
    sample_collection: { text: '样品领用', color: 'purple', icon: '🧪' },
    device_maintenance: { text: '设备维护', color: 'cyan', icon: '🔧' },
    device_calibration: { text: '设备校准', color: 'geekblue', icon: '⚙️' },
    contract_sign: { text: '合同签订', color: 'magenta', icon: '📑' },
    outsourcing_review: { text: '委外审核', color: 'volcano', icon: '🔍' },
};

// 优先级映射
export const PRIORITY_MAP: Record<TodoPriority, { text: string; color: string }> = {
    urgent: { text: '紧急', color: 'red' },
    high: { text: '高', color: 'orange' },
    normal: { text: '普通', color: 'blue' },
    low: { text: '低', color: 'default' },
};

// 状态映射
export const TODO_STATUS_MAP: Record<TodoStatus, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'default' },
    in_progress: { text: '处理中', color: 'processing' },
    completed: { text: '已完成', color: 'success' },
    overdue: { text: '已逾期', color: 'error' },
};

// Mock数据
export const todoData: ITodo[] = [
    {
        id: '1',
        type: 'quotation_approval',
        title: '报价单审批 - BJ20231202001',
        description: '上海汽车集团股份有限公司的报价单需要财务审批',
        priority: 'high',
        status: 'pending',
        dueDate: '2023-12-05',
        createdAt: '2023-12-02 09:15:00',
        createdBy: '张馨',
        assignedTo: '张会计',
        relatedId: '2',
        relatedNo: 'BJ20231202001',
        link: '/entrustment/quotation',
    },
    {
        id: '2',
        type: 'task_assignment',
        title: '任务分配 - T20231201003',
        description: '新任务需要分配给检测人员',
        priority: 'urgent',
        status: 'pending',
        dueDate: '2023-12-04',
        createdAt: '2023-12-01 14:30:00',
        createdBy: '李主任',
        assignedTo: '当前用户',
        relatedId: '3',
        relatedNo: 'T20231201003',
        link: '/task-management/all-tasks',
    },
    {
        id: '3',
        type: 'report_approval',
        title: '报告审批 - R20231201001',
        description: '检测报告需要技术负责人审批',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2023-12-06',
        createdAt: '2023-12-01 16:00:00',
        createdBy: '王工',
        assignedTo: '李主任',
        relatedId: '1',
        relatedNo: 'R20231201001',
        link: '/report-management/approval',
    },
    {
        id: '4',
        type: 'device_maintenance',
        title: '设备维护 - 拉力试验机',
        description: '拉力试验机需要进行定期维护',
        priority: 'normal',
        status: 'pending',
        dueDate: '2023-12-10',
        createdAt: '2023-12-01 10:00:00',
        createdBy: '系统',
        assignedTo: '设备管理员',
        relatedId: '1',
        relatedNo: 'DEV001',
        link: '/device-management/maintenance',
    },
    {
        id: '5',
        type: 'device_calibration',
        title: '设备校准 - 电子天平',
        description: '电子天平校准到期，需要安排校准',
        priority: 'high',
        status: 'overdue',
        dueDate: '2023-11-30',
        createdAt: '2023-11-25 09:00:00',
        createdBy: '系统',
        assignedTo: '设备管理员',
        relatedId: '2',
        relatedNo: 'DEV002',
        link: '/device-management/calibration',
    },
    {
        id: '6',
        type: 'sample_collection',
        title: '样品领用审批 - S20231201005',
        description: '样品领用申请需要审批',
        priority: 'normal',
        status: 'pending',
        dueDate: '2023-12-05',
        createdAt: '2023-12-02 11:00:00',
        createdBy: '张三',
        assignedTo: '样品管理员',
        relatedId: '5',
        relatedNo: 'S20231201005',
        link: '/sample-management/my-samples',
    },
    {
        id: '7',
        type: 'contract_sign',
        title: '合同签订 - HT20231201001',
        description: '委托合同需要签订',
        priority: 'high',
        status: 'pending',
        dueDate: '2023-12-05',
        createdAt: '2023-12-01 16:00:00',
        createdBy: '张馨',
        assignedTo: '销售经理',
        relatedId: '1',
        relatedNo: 'HT20231201001',
        link: '/entrustment/contract',
    },
    {
        id: '8',
        type: 'outsourcing_review',
        title: '委外审核 - OUT20231201001',
        description: '委外检测结果需要审核',
        priority: 'normal',
        status: 'pending',
        dueDate: '2023-12-08',
        createdAt: '2023-12-02 14:00:00',
        createdBy: '李工',
        assignedTo: '技术负责人',
        relatedId: '1',
        relatedNo: 'OUT20231201001',
        link: '/outsourcing-management/my',
    },
    {
        id: '9',
        type: 'quotation_approval',
        title: '报价单审批 - BJ20231203001',
        description: '比亚迪汽车的报价单需要销售经理审批',
        priority: 'normal',
        status: 'completed',
        dueDate: '2023-12-04',
        createdAt: '2023-12-03 11:00:00',
        createdBy: '张馨',
        assignedTo: '王经理',
        relatedId: '3',
        relatedNo: 'BJ20231203001',
        link: '/entrustment/quotation',
    },
];

// 统计数据
export interface ITodoStats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    urgent: number;
}

export const getTodoStats = (todos: ITodo[]): ITodoStats => {
    return {
        total: todos.length,
        pending: todos.filter(t => t.status === 'pending').length,
        inProgress: todos.filter(t => t.status === 'in_progress').length,
        completed: todos.filter(t => t.status === 'completed').length,
        overdue: todos.filter(t => t.status === 'overdue').length,
        urgent: todos.filter(t => t.priority === 'urgent').length,
    };
};
