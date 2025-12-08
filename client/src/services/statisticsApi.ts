/**
 * 统计报表 API 服务
 */
import { request } from './api';

// 委托统计
export interface EntrustmentStats {
    total: number;
    byStatus: Record<string, number>;
    totalAmount: number;
}

// 任务完成率统计
export interface TaskCompletionStats {
    total: number;
    completed: number;
    completionRate: number;
    onTimeCount: number;
    onTimeRate: number;
    overdueCount: number;
}

// 趋势数据项
export interface TrendItem {
    date: string;
    count?: number;
    completed?: number;
}

// 客户统计项
export interface ClientStatsItem {
    clientName: string;
    count: number;
}

// 检测员工作量
export interface TesterWorkload {
    tester: string;
    completedCount: number;
}

export const statisticsApi = {
    // ===== 委托统计 =====
    entrustment: {
        overview: (params?: { startDate?: string; endDate?: string }) =>
            request.get<EntrustmentStats>('/statistics/entrustment/overview', params),

        trend: (days: number = 7) =>
            request.get<TrendItem[]>('/statistics/entrustment/trend', { days }),

        byClient: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
            request.get<ClientStatsItem[]>('/statistics/entrustment/by-client', params),
    },

    // ===== 样品统计 =====
    sample: {
        overview: (params?: { startDate?: string; endDate?: string }) =>
            request.get<{ total: number; byStatus: Record<string, number> }>('/statistics/sample/overview', params),

        trend: (days: number = 7) =>
            request.get<TrendItem[]>('/statistics/sample/trend', { days }),
    },

    // ===== 任务统计 =====
    task: {
        completionRate: (params?: { startDate?: string; endDate?: string }) =>
            request.get<TaskCompletionStats>('/statistics/task/completion-rate', params),

        trend: (days: number = 7) =>
            request.get<TrendItem[]>('/statistics/task/trend', { days }),

        byTester: (params?: { startDate?: string; endDate?: string }) =>
            request.get<TesterWorkload[]>('/statistics/task/by-tester', params),
    },

    // ===== 报告统计 =====
    report: {
        overview: (params?: { startDate?: string; endDate?: string }) =>
            request.get<{ total: number; byStatus: Record<string, number>; issuedCount: number; issueRate: number }>('/statistics/report/overview', params),
    },
};

export default statisticsApi;
