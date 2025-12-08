/**
 * 任务管理 API 服务
 */
import { request, type PageResult } from './api';

export interface ITestTask {
    id?: number;
    taskNo?: string;
    sampleId?: number;
    sampleNo?: string;
    sampleName?: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    testItems?: string;
    assigneeId?: number;
    assignee?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    startDate?: string;
    completedDate?: string;
    progress?: number;
    isOutsourced?: boolean;
    outsourceSupplierId?: number;
    outsourceSupplierName?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
}

export interface TaskQuery {
    current?: number;
    size?: number;
    taskNo?: string;
    sampleName?: string;
    assignee?: string;
    status?: string;
}

export const taskApi = {
    // 分页查询任务
    page: (params: TaskQuery) =>
        request.get<PageResult<ITestTask>>('/task/page', params),

    // 查询我的任务
    myTasks: (userId: number, params?: { current?: number; size?: number; status?: string }) =>
        request.get<PageResult<ITestTask>>('/task/my', { userId, ...params }),

    // 获取任务详情
    getById: (id: number) =>
        request.get<ITestTask>(`/task/${id}`),

    // 新增任务
    create: (data: ITestTask) =>
        request.post<ITestTask>('/task', data),

    // 更新任务
    update: (data: ITestTask) =>
        request.put<void>('/task', data),

    // 删除任务
    delete: (id: number) =>
        request.delete<void>(`/task/${id}`),

    // 分配任务
    assign: (id: number, assigneeId: number, assigneeName: string) =>
        request.post<void>(`/task/${id}/assign`, null, {
            params: { assigneeId, assigneeName }
        }),

    // 批量分配任务
    batchAssign: (taskIds: number[], assigneeId: number, assigneeName: string) =>
        request.post<void>('/task/batch-assign', taskIds, {
            params: { assigneeId, assigneeName }
        }),

    // 开始任务
    start: (id: number) =>
        request.post<void>(`/task/${id}/start`),

    // 完成任务
    complete: (id: number) =>
        request.post<void>(`/task/${id}/complete`),

    // 转交任务
    transfer: (id: number, newAssigneeId: number, newAssigneeName: string, reason: string) =>
        request.post<void>(`/task/${id}/transfer`, null, {
            params: { newAssigneeId, newAssigneeName, reason }
        }),

    // 更新进度
    updateProgress: (id: number, progress: number) =>
        request.put<void>(`/task/${id}/progress`, null, { params: { progress } }),
};

export default taskApi;
