import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { entrustmentApi, sampleApi, taskApi, reportApi, deviceApi, dashboardApi, authApi } from './businessApi';
import type { Entrustment, Sample, TestTask, TestReport, Device, User } from './businessApi';

// 通用分页参数
export interface PageParams {
    current?: number;
    size?: number;
    [key: string]: any;
}

// 通用分页结果
export interface PageData<T> {
    records: T[];
    total: number;
    current: number;
    size: number;
}

// ==================== 委托管理 Hook ====================
export function useEntrustmentService() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Entrustment[]>([]);
    const [total, setTotal] = useState(0);

    const fetchList = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await entrustmentApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            // 确保 data 和 records 存在（兼容 mock 回退）
            const records = res?.data?.records || [];
            const total = res?.data?.total || 0;
            setData(records);
            setTotal(total);
        } catch (error: any) {
            console.error('获取委托单列表失败:', error);
            // 不显示错误消息，因为可能已经使用了 mock 数据
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: Partial<Entrustment>) => {
        try {
            await entrustmentApi.create(data);
            message.success('创建成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '创建失败');
            return { success: false };
        }
    }, []);

    const update = useCallback(async (data: Partial<Entrustment>) => {
        try {
            await entrustmentApi.update(data);
            message.success('更新成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '更新失败');
            return { success: false };
        }
    }, []);

    const remove = useCallback(async (id: number) => {
        try {
            await entrustmentApi.delete(id);
            message.success('删除成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '删除失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, create, update, remove };
}

// ==================== 样品管理 Hook ====================
export function useSampleService() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Sample[]>([]);
    const [total, setTotal] = useState(0);

    const fetchList = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await sampleApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取样品列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: Partial<Sample>) => {
        try {
            await sampleApi.create(data);
            message.success('创建成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '创建失败');
            return { success: false };
        }
    }, []);

    const update = useCallback(async (data: Partial<Sample>) => {
        try {
            await sampleApi.update(data);
            message.success('更新成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '更新失败');
            return { success: false };
        }
    }, []);

    const remove = useCallback(async (id: number) => {
        try {
            await sampleApi.delete(id);
            message.success('删除成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '删除失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, create, update, remove };
}

// ==================== 任务管理 Hook ====================
export function useTaskService() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TestTask[]>([]);
    const [total, setTotal] = useState(0);

    const fetchList = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await taskApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取任务列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyTasks = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await taskApi.myTasks({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取我的任务失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const assign = useCallback(async (taskId: number, assigneeId: number, assigneeName: string) => {
        try {
            await taskApi.assign(taskId, assigneeId, assigneeName);
            message.success('分配成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '分配失败');
            return { success: false };
        }
    }, []);

    const start = useCallback(async (taskId: number) => {
        try {
            await taskApi.start(taskId);
            message.success('任务已开始');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '操作失败');
            return { success: false };
        }
    }, []);

    const complete = useCallback(async (taskId: number) => {
        try {
            await taskApi.complete(taskId);
            message.success('任务已完成');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '操作失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, fetchMyTasks, assign, start, complete };
}

// ==================== 报告管理 Hook ====================
export function useReportService() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TestReport[]>([]);
    const [total, setTotal] = useState(0);

    const fetchList = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await reportApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取报告列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const submitReview = useCallback(async (reportId: number) => {
        try {
            await reportApi.submitReview(reportId);
            message.success('提交审核成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '提交失败');
            return { success: false };
        }
    }, []);

    const approve = useCallback(async (reportId: number, approverId: number, approverName: string) => {
        try {
            await reportApi.approve(reportId, approverId, approverName);
            message.success('审批成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '审批失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, submitReview, approve };
}

// ==================== 设备管理 Hook ====================
export function useDeviceService() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Device[]>([]);
    const [total, setTotal] = useState(0);

    const fetchList = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const res = await deviceApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取设备列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: Partial<Device>) => {
        try {
            await deviceApi.create(data);
            message.success('创建成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '创建失败');
            return { success: false };
        }
    }, []);

    const update = useCallback(async (data: Partial<Device>) => {
        try {
            await deviceApi.update(data);
            message.success('更新成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '更新失败');
            return { success: false };
        }
    }, []);

    const remove = useCallback(async (id: number) => {
        try {
            await deviceApi.delete(id);
            message.success('删除成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '删除失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, create, update, remove };
}

// ==================== 认证服务 Hook ====================
export function useAuthService() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        try {
            const res = await authApi.login(username, password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            message.success('登录成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '登录失败');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // ignore
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        message.success('已退出登录');
    }, []);

    const checkAuth = useCallback(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return { loading, user, login, logout, checkAuth, isLoggedIn: !!user };
}

// ==================== 仪表盘 Hook ====================
export function useDashboardService() {
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState<any>(null);
    const [todos, setTodos] = useState<any[]>([]);

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await dashboardApi.getStatistics();
            setStatistics(res.data);
        } catch (error: any) {
            message.error(error.message || '获取统计数据失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTodos = useCallback(async () => {
        try {
            const res = await dashboardApi.getTodos();
            setTodos(res.data);
        } catch (error: any) {
            message.error(error.message || '获取待办事项失败');
        }
    }, []);

    return { loading, statistics, todos, fetchStatistics, fetchTodos };
}

// ==================== 财务管理 Hook ====================
export function useFinanceService() {
    const [loading, setLoading] = useState(false);
    const [receivables, setReceivables] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any>(null);

    const fetchReceivables = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const { financeApi } = await import('./financeApi');
            const res = await financeApi.receivable.page(params);
            setReceivables(res.data.records);
        } catch (error: any) {
            message.error(error.message || '获取应收列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPayments = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const { financeApi } = await import('./financeApi');
            const res = await financeApi.payment.page(params);
            setPayments(res.data.records);
        } catch (error: any) {
            message.error(error.message || '获取收款列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInvoices = useCallback(async (params: PageParams = {}) => {
        setLoading(true);
        try {
            const { financeApi } = await import('./financeApi');
            const res = await financeApi.invoice.page(params);
            setInvoices(res.data.records);
        } catch (error: any) {
            message.error(error.message || '获取发票列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStatistics = useCallback(async () => {
        try {
            const { financeApi } = await import('./financeApi');
            const res = await financeApi.receivable.statistics();
            setStatistics(res.data);
        } catch (error: any) {
            message.error(error.message || '获取财务统计失败');
        }
    }, []);

    return { loading, receivables, payments, invoices, statistics, fetchReceivables, fetchPayments, fetchInvoices, fetchStatistics };
}

// ==================== 统计报表 Hook ====================
export function useStatisticsService() {
    const [loading, setLoading] = useState(false);
    const [entrustmentStats, setEntrustmentStats] = useState<any>(null);
    const [sampleStats, setSampleStats] = useState<any>(null);
    const [taskStats, setTaskStats] = useState<any>(null);
    const [reportStats, setReportStats] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);

    const fetchEntrustmentStats = useCallback(async (params: { startDate?: string; endDate?: string } = {}) => {
        setLoading(true);
        try {
            const { statisticsApi } = await import('./statisticsApi');
            const res = await statisticsApi.entrustment.overview(params);
            setEntrustmentStats(res.data);
        } catch (error: any) {
            message.error(error.message || '获取委托统计失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTaskStats = useCallback(async (params: { startDate?: string; endDate?: string } = {}) => {
        setLoading(true);
        try {
            const { statisticsApi } = await import('./statisticsApi');
            const res = await statisticsApi.task.completionRate(params);
            setTaskStats(res.data);
        } catch (error: any) {
            message.error(error.message || '获取任务统计失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTrend = useCallback(async (days: number = 7, type: 'entrustment' | 'sample' | 'task' = 'entrustment') => {
        try {
            const { statisticsApi } = await import('./statisticsApi');
            let res;
            switch (type) {
                case 'entrustment':
                    res = await statisticsApi.entrustment.trend(days);
                    break;
                case 'sample':
                    res = await statisticsApi.sample.trend(days);
                    break;
                case 'task':
                    res = await statisticsApi.task.trend(days);
                    break;
            }
            setTrend(res?.data || []);
        } catch (error: any) {
            message.error(error.message || '获取趋势数据失败');
        }
    }, []);

    return { loading, entrustmentStats, sampleStats, taskStats, reportStats, trend, fetchEntrustmentStats, fetchTaskStats, fetchTrend };
}
