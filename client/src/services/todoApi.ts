import { request } from './api';
import type { ApiResponse, PageResult } from './api';

/**
 * 待办事项接口定义
 */
export interface ITodo {
    id: number;
    type: string;
    title: string;
    description?: string;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate?: string;
    createdBy?: string;
    assignedTo?: string;
    assigneeId?: number;
    relatedId?: number;
    relatedNo?: string;
    relatedType?: string;
    link?: string;
    createTime?: string;
    updateTime?: string;
}

/**
 * 待办统计
 */
export interface ITodoStats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    urgent: number;
}

/**
 * 待办查询参数
 */
export interface TodoQuery {
    current?: number;
    size?: number;
    type?: string;
    status?: string;
    priority?: string;
    assigneeId?: number;
}

/**
 * 待办类型映射
 */
export const TODO_TYPE_MAP: Record<string, { text: string; color: string }> = {
    quotation_approval: { text: '报价审批', color: 'blue' },
    report_approval: { text: '报告审批', color: 'green' },
    task_assignment: { text: '任务分配', color: 'orange' },
    sample_receipt: { text: '样品接收', color: 'purple' },
    device_calibration: { text: '设备定检', color: 'red' },
};

/**
 * 优先级映射
 */
export const PRIORITY_MAP: Record<string, { text: string; color: string }> = {
    urgent: { text: '紧急', color: 'red' },
    high: { text: '高', color: 'orange' },
    normal: { text: '普通', color: 'blue' },
    low: { text: '低', color: 'gray' },
};

/**
 * 状态映射
 */
export const TODO_STATUS_MAP: Record<string, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'default' },
    in_progress: { text: '处理中', color: 'processing' },
    completed: { text: '已完成', color: 'success' },
    overdue: { text: '已逾期', color: 'error' },
};

/**
 * 待办事项API服务
 */
const todoApi = {
    /**
     * 分页查询待办
     */
    page: (params: TodoQuery): Promise<ApiResponse<PageResult<ITodo>>> => {
        return request.get('/todo/page', params);
    },

    /**
     * 获取我的待办列表
     */
    myTodos: (params: {
        current?: number;
        size?: number;
        userId: number;
        status?: string;
    }): Promise<ApiResponse<PageResult<ITodo>>> => {
        return request.get('/todo/my', params);
    },

    /**
     * 获取待办统计
     */
    getStats: (userId?: number): Promise<ApiResponse<ITodoStats>> => {
        return request.get('/todo/stats', { userId });
    },

    /**
     * 获取待办详情
     */
    getById: (id: number): Promise<ApiResponse<ITodo>> => {
        return request.get(`/todo/${id}`);
    },

    /**
     * 创建待办
     */
    create: (data: Partial<ITodo>): Promise<ApiResponse<ITodo>> => {
        return request.post('/todo', data);
    },

    /**
     * 更新待办
     */
    update: (data: Partial<ITodo>): Promise<ApiResponse<void>> => {
        return request.put('/todo', data);
    },

    /**
     * 更新待办状态
     */
    updateStatus: (id: number, status: string): Promise<ApiResponse<void>> => {
        return request.put(`/todo/${id}/status`, null, { params: { status } });
    },

    /**
     * 开始处理待办
     */
    start: (id: number): Promise<ApiResponse<void>> => {
        return request.post(`/todo/${id}/start`);
    },

    /**
     * 完成待办
     */
    complete: (id: number): Promise<ApiResponse<void>> => {
        return request.post(`/todo/${id}/complete`);
    },

    /**
     * 删除待办
     */
    delete: (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/todo/${id}`);
    },

    /**
     * 批量更新状态
     */
    batchUpdateStatus: (ids: number[], status: string): Promise<ApiResponse<void>> => {
        return request.post('/todo/batch-update-status', ids, { params: { status } });
    },
};

export default todoApi;
