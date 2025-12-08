/**
 * 报告管理 API 服务
 */
import { request, type PageResult } from './api';

export interface ITestReport {
    id?: number;
    reportNo?: string;
    taskId?: number;
    taskNo?: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    clientId?: number;
    clientName?: string;
    sampleName?: string;
    testItems?: string;
    conclusion?: string;
    status?: string;
    compilerId?: number;
    compiler?: string;
    reviewerId?: number;
    reviewer?: string;
    reviewTime?: string;
    approverId?: number;
    approver?: string;
    approveTime?: string;
    issueDate?: string;
    signatureImage?: string;
    stampImage?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
}

export interface ReportQuery {
    current?: number;
    size?: number;
    reportNo?: string;
    clientName?: string;
    status?: string;
}

export const reportApi = {
    // 分页查询报告
    page: (params: ReportQuery) =>
        request.get<PageResult<ITestReport>>('/report/page', params),

    // 获取报告详情
    getById: (id: number) =>
        request.get<ITestReport>(`/report/${id}`),

    // 新增报告
    create: (data: ITestReport) =>
        request.post<ITestReport>('/report', data),

    // 更新报告
    update: (data: ITestReport) =>
        request.put<void>('/report', data),

    // 删除报告
    delete: (id: number) =>
        request.delete<void>(`/report/${id}`),

    // 提交审核
    submitReview: (id: number) =>
        request.post<void>(`/report/${id}/submit-review`),

    // 审核报告
    review: (id: number, reviewerId: number, reviewerName: string, approved: boolean, comment?: string) =>
        request.post<void>(`/report/${id}/review`, null, {
            params: { reviewerId, reviewerName, approved, comment }
        }),

    // 批准报告
    approve: (id: number, approverId: number, approverName: string) =>
        request.post<void>(`/report/${id}/approve`, null, {
            params: { approverId, approverName }
        }),

    // 发布报告
    issue: (id: number) =>
        request.post<void>(`/report/${id}/issue`),

    // 添加签名盖章
    addSignatureAndStamp: (id: number, signatureImage?: string, stampImage?: string) =>
        request.post<void>(`/report/${id}/signature-stamp`, null, {
            params: { signatureImage, stampImage }
        }),

    // 根据任务查询报告
    getByTask: (taskId: number) =>
        request.get<ITestReport>(`/report/by-task/${taskId}`),

    // 根据委托单查询报告列表
    getByEntrustment: (entrustmentId: number) =>
        request.get<ITestReport[]>(`/report/by-entrustment/${entrustmentId}`),
};

export default reportApi;
