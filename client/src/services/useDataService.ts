import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { entrustmentApi, sampleApi, taskApi, reportApi, deviceApi, dashboardApi, authApi } from './businessApi';
import type { Entrustment, Sample, TestTask, TestReport, Device, User } from './businessApi';

// 配置是否使用API (环境变量控制)
const USE_API = import.meta.env.VITE_USE_API === 'true';

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
        if (!USE_API) {
            // Mock模式 - 使用本地数据
            const { entrustmentData } = await import('../mock/entrustment');
            setData(entrustmentData as any);
            setTotal(entrustmentData.length);
            return;
        }

        // API模式
        setLoading(true);
        try {
            const res = await entrustmentApi.page({
                current: params.current || 1,
                size: params.size || 10,
                ...params
            });
            setData(res.data.records);
            setTotal(res.data.total);
        } catch (error: any) {
            message.error(error.message || '获取委托单列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (data: Partial<Entrustment>) => {
        if (!USE_API) {
            message.success('创建成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('更新成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('删除成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            const { sampleDetailData } = await import('../mock/sample');
            setData(sampleDetailData as any);
            setTotal(sampleDetailData.length);
            return;
        }

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
        if (!USE_API) {
            message.success('创建成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('更新成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('删除成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            const { testTaskData } = await import('../mock/test');
            setData(testTaskData as any);
            setTotal(testTaskData.length);
            return;
        }

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
        if (!USE_API) {
            const { testTaskData } = await import('../mock/test');
            // 模拟过滤我的任务
            setData(testTaskData.filter((t: any) => t.assigneeId === 3) as any);
            setTotal(testTaskData.filter((t: any) => t.assigneeId === 3).length);
            return;
        }

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
        if (!USE_API) {
            message.success('分配成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('任务已开始(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('任务已完成(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            const { testReportData } = await import('../mock/report');
            setData(testReportData as any);
            setTotal(testReportData.length);
            return;
        }

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
        if (!USE_API) {
            message.success('提交审核成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            message.success('审批成功(mock)');
            return { success: true };
        }
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
        if (!USE_API) {
            const { deviceData } = await import('../mock/devices');
            setData(deviceData as any);
            setTotal(deviceData.length);
            return;
        }

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
        if (!USE_API) {
            message.success('创建成功(mock)');
            return { success: true };
        }
        try {
            await deviceApi.create(data);
            message.success('创建成功');
            return { success: true };
        } catch (error: any) {
            message.error(error.message || '创建失败');
            return { success: false };
        }
    }, []);

    return { loading, data, total, fetchList, create };
}

// ==================== 认证服务 Hook ====================
export function useAuthService() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback(async (username: string, password: string) => {
        if (!USE_API) {
            // Mock登录
            const mockUser = { id: 1, username, realName: '管理员', status: 1 };
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
            message.success('登录成功');
            return { success: true };
        }

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
        if (USE_API) {
            try {
                await authApi.logout();
            } catch (e) {
                // ignore
            }
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
        if (!USE_API) {
            // Mock数据
            setStatistics({
                entrustmentCount: 156,
                sampleCount: 423,
                taskCount: 89,
                reportCount: 67,
                entrustmentTrend: 12.5,
                taskCompletionRate: 85.3
            });
            return;
        }

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
        if (!USE_API) {
            setTodos([
                { id: 1, title: '待审核委托单', count: 5, type: 'entrustment' },
                { id: 2, title: '待分配任务', count: 8, type: 'task' },
                { id: 3, title: '待审批报告', count: 3, type: 'report' }
            ]);
            return;
        }

        try {
            const res = await dashboardApi.getTodos();
            setTodos(res.data);
        } catch (error: any) {
            message.error(error.message || '获取待办事项失败');
        }
    }, []);

    return { loading, statistics, todos, fetchStatistics, fetchTodos };
}
