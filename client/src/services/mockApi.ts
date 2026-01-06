/**
 * @file mockApi.ts
 * @desc Mock API 回退服务 - 当真实 API 不可用时返回模拟数据
 */

import { entrustmentData } from '../mock/entrustment';
import { sampleDetailData } from '../mock/sample';
import { testTaskData } from '../mock/test';
import { testReportData } from '../mock/report';
import { deviceData } from '../mock/devices';

// 模拟延迟，让体验更真实
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 统一分页响应格式
function mockPageResponse<T>(records: T[], total?: number, current: number = 1, size: number = 10) {
    return {
        code: 200,
        message: 'success',
        data: {
            records: records.slice((current - 1) * size, current * size),
            total: total ?? records.length,
            current,
            size,
        }
    };
}

// Mock API 服务
export const mockApi = {
    // 委托单 API
    entrustment: {
        page: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            let records = [...entrustmentData];

            // 简单过滤
            if (params.entrustmentNo) {
                records = records.filter(r => r.entrustmentId.includes(params.entrustmentNo));
            }
            if (params.clientName) {
                records = records.filter(r => r.clientName.includes(params.clientName));
            }

            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },

        getById: async (id: number) => {
            await mockDelay();
            const record = entrustmentData.find(r => r.id === id);
            if (!record) {
                throw new Error('委托单不存在');
            }
            return { code: 200, message: 'success', data: record };
        },

        create: async (data: any) => {
            await mockDelay();
            const newRecord = { id: Date.now(), ...data };
            return { code: 200, message: '创建成功', data: newRecord };
        },

        update: async (data: any) => {
            await mockDelay();
            return { code: 200, message: '更新成功', data: undefined };
        },

        delete: async (id: number) => {
            await mockDelay();
            return { code: 200, message: '删除成功', data: undefined };
        },
    },

    // 样品 API
    sample: {
        page: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            let records = [...sampleDetailData];

            if (params.sampleNo) {
                records = records.filter((r: any) => (r.sampleNo || '').includes(params.sampleNo));
            }
            if (params.name) {
                records = records.filter((r: any) => (r.name || '').includes(params.name));
            }

            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },

        getById: async (id: number) => {
            await mockDelay();
            const record = sampleDetailData.find((r: any) => r.id === id);
            if (!record) {
                throw new Error('样品不存在');
            }
            return { code: 200, message: 'success', data: record };
        },

        create: async (data: any) => {
            await mockDelay();
            const newRecord = { id: Date.now(), ...data };
            return { code: 200, message: '创建成功', data: newRecord };
        },

        update: async (data: any) => {
            await mockDelay();
            return { code: 200, message: '更新成功', data: undefined };
        },

        delete: async (id: number) => {
            await mockDelay();
            return { code: 200, message: '删除成功', data: undefined };
        },
    },

    // 任务 API
    task: {
        page: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            let records = [...testTaskData];

            if (params.taskNo) {
                records = records.filter((r: any) => (r.taskNo || '').includes(params.taskNo));
            }
            if (params.assignee) {
                records = records.filter((r: any) => r.assignee?.includes(params.assignee));
            }

            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },

        getById: async (id: number) => {
            await mockDelay();
            const record = testTaskData.find((r: any) => r.id === id);
            if (!record) {
                throw new Error('任务不存在');
            }
            return { code: 200, message: 'success', data: record };
        },

        create: async (data: any) => {
            await mockDelay();
            const newRecord = { id: Date.now(), ...data };
            return { code: 200, message: '创建成功', data: newRecord };
        },

        assign: async (taskId: number, assigneeId: number, assigneeName: string) => {
            await mockDelay();
            return { code: 200, message: '分配成功', data: undefined };
        },

        start: async (taskId: number) => {
            await mockDelay();
            return { code: 200, message: '任务已开始', data: undefined };
        },

        complete: async (taskId: number) => {
            await mockDelay();
            return { code: 200, message: '任务已完成', data: undefined };
        },

        myTasks: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            const records = testTaskData.filter((r: any) => r.assignee);
            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },
    },

    // 报告 API
    report: {
        page: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            let records = [...testReportData];

            if (params.reportNo) {
                records = records.filter((r: any) => (r.reportNo || '').includes(params.reportNo));
            }
            if (params.clientName) {
                records = records.filter((r: any) => r.clientName?.includes(params.clientName));
            }

            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },

        getById: async (id: number) => {
            await mockDelay();
            const record = testReportData.find((r: any) => r.id === id);
            if (!record) {
                throw new Error('报告不存在');
            }
            return { code: 200, message: 'success', data: record };
        },

        create: async (data: any) => {
            await mockDelay();
            const newRecord = { id: Date.now(), ...data };
            return { code: 200, message: '创建成功', data: newRecord };
        },

        submitReview: async (reportId: number) => {
            await mockDelay();
            return { code: 200, message: '提交审核成功', data: undefined };
        },

        approve: async (reportId: number, approverId: number, approverName: string) => {
            await mockDelay();
            return { code: 200, message: '审批成功', data: undefined };
        },
    },

    // 设备 API
    device: {
        page: async (params: { current?: number; size?: number; [key: string]: any }) => {
            await mockDelay();
            let records = [...deviceData];

            if (params.code) {
                records = records.filter(r => r.code.includes(params.code));
            }
            if (params.name) {
                records = records.filter(r => r.name.includes(params.name));
            }

            return mockPageResponse(
                records,
                records.length,
                params.current || 1,
                params.size || 10
            );
        },

        getById: async (id: number) => {
            await mockDelay();
            const record = deviceData.find(r => r.id === id);
            if (!record) {
                throw new Error('设备不存在');
            }
            return { code: 200, message: 'success', data: record };
        },

        list: async () => {
            await mockDelay();
            return { code: 200, message: 'success', data: deviceData };
        },

        create: async (data: any) => {
            await mockDelay();
            const newRecord = { id: Date.now(), ...data };
            return { code: 200, message: '创建成功', data: newRecord };
        },

        update: async (data: any) => {
            await mockDelay();
            return { code: 200, message: '更新成功', data: undefined };
        },

        delete: async (id: number) => {
            await mockDelay();
            return { code: 200, message: '删除成功', data: undefined };
        },
    },
};

// 路由匹配器，将 URL 路径映射到 mock API
export async function getMockResponse(url: string, method: string = 'GET', data?: any) {
    // 移除开头的斜杠和 /api 前缀
    const path = url.replace(/^\/+/, '').replace(/^api\//, '');

    try {
        // 委托单相关
        if (path.startsWith('entrustment/page')) {
            return mockApi.entrustment.page(data || {});
        }
        if (path.match(/^entrustment\/\d+$/)) {
            const id = parseInt(path.split('/')[1]);
            return mockApi.entrustment.getById(id);
        }
        if (path === 'entrustment' && method === 'POST') {
            return mockApi.entrustment.create(data);
        }
        if (path === 'entrustment' && method === 'PUT') {
            return mockApi.entrustment.update(data);
        }
        if (path.match(/^entrustment\/\d+/) && method === 'DELETE') {
            const id = parseInt(path.split('/')[1]);
            return mockApi.entrustment.delete(id);
        }

        // 样品相关
        if (path.startsWith('sample/page')) {
            return mockApi.sample.page(data || {});
        }
        if (path.match(/^sample\/\d+$/)) {
            const id = parseInt(path.split('/')[1]);
            return mockApi.sample.getById(id);
        }
        if (path === 'sample' && method === 'POST') {
            return mockApi.sample.create(data);
        }
        if (path === 'sample' && method === 'PUT') {
            return mockApi.sample.update(data);
        }
        if (path.match(/^sample\/\d+/) && method === 'DELETE') {
            const id = parseInt(path.split('/')[1]);
            return mockApi.sample.delete(id);
        }

        // 任务相关
        if (path.startsWith('task/page')) {
            return mockApi.task.page(data || {});
        }
        if (path.match(/^task\/\d+$/)) {
            const id = parseInt(path.split('/')[1]);
            return mockApi.task.getById(id);
        }
        if (path === 'task' && method === 'POST') {
            return mockApi.task.create(data);
        }
        if (path.match(/^task\/\d+\/assign/)) {
            return mockApi.task.assign(parseInt(path.split('/')[1]), data?.assigneeId, data?.assigneeName);
        }
        if (path.match(/^task\/\d+\/start/)) {
            return mockApi.task.start(parseInt(path.split('/')[1]));
        }
        if (path.match(/^task\/\d+\/complete/)) {
            return mockApi.task.complete(parseInt(path.split('/')[1]));
        }
        if (path.startsWith('task/my-tasks')) {
            return mockApi.task.myTasks(data || {});
        }

        // 报告相关
        if (path.startsWith('report/page')) {
            return mockApi.report.page(data || {});
        }
        if (path.match(/^report\/\d+$/)) {
            const id = parseInt(path.split('/')[1]);
            return mockApi.report.getById(id);
        }
        if (path === 'report' && method === 'POST') {
            return mockApi.report.create(data);
        }
        if (path.match(/^report\/\d+\/submit-review/)) {
            return mockApi.report.submitReview(parseInt(path.split('/')[1]));
        }
        if (path.match(/^report\/\d+\/approve/)) {
            return mockApi.report.approve(parseInt(path.split('/')[1]), data?.approverId, data?.approverName);
        }

        // 设备相关
        if (path.startsWith('device/page')) {
            return mockApi.device.page(data || {});
        }
        if (path.match(/^device\/\d+$/)) {
            const id = parseInt(path.split('/')[1]);
            return mockApi.device.getById(id);
        }
        if (path === 'device/list') {
            return mockApi.device.list();
        }
        if (path === 'device' && method === 'POST') {
            return mockApi.device.create(data);
        }
        if (path === 'device' && method === 'PUT') {
            return mockApi.device.update(data);
        }
        if (path.match(/^device\/\d+/) && method === 'DELETE') {
            return mockApi.device.delete(parseInt(path.split('/')[1]));
        }

        // 没有匹配的 mock 数据
        return null;
    } catch (error) {
        console.error('Mock API error:', error);
        return null;
    }
}
