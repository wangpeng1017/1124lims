/**
 * @file api.ts
 * @desc API 服务层 - DEMO 版本，直接使用 Mock 数据
 *
 * 说明：本项目为 LIMS 系统演示 DEMO，所有数据均为 Mock 数据
 * 部署环境：Vercel (纯静态前端)
 */

import { getMockResponse } from './mockApi';

// 统一响应类型
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 分页响应类型
export interface PageResult<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
}

// 模拟延迟，让体验更真实
const mockDelay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 通用请求方法 - 直接使用 Mock 数据
 */
export const request = {
    get: async <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
        await mockDelay();
        const response = await getMockResponse(url, 'GET', params);
        if (response) {
            return response;
        }
        // 默认空响应
        return { code: 200, message: 'success', data: {} as T };
    },
    post: async <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        await mockDelay();
        const response = await getMockResponse(url, 'POST', data);
        if (response) {
            return response;
        }
        return { code: 200, message: '操作成功', data: undefined as T };
    },
    put: async <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        await mockDelay();
        const response = await getMockResponse(url, 'PUT', data);
        if (response) {
            return response;
        }
        return { code: 200, message: '更新成功', data: undefined as T };
    },
    delete: async <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
        await mockDelay();
        const response = await getMockResponse(url, 'DELETE', config?.params);
        if (response) {
            return response;
        }
        return { code: 200, message: '删除成功', data: undefined as T };
    },
};

export default { request };
