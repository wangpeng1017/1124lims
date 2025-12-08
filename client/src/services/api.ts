import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建axios实例
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response;
        // 如果后端返回的code不是200，抛出错误
        if (data.code !== 200 && data.code !== undefined) {
            return Promise.reject(new Error(data.message || '请求失败'));
        }
        return data;
    },
    (error: AxiosError) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    // Token过期，跳转登录
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('无权访问');
                    break;
                case 404:
                    console.error('资源不存在');
                    break;
                case 500:
                    console.error('服务器错误');
                    break;
                default:
                    console.error('请求失败');
            }
            return Promise.reject(new Error((data as any)?.message || '请求失败'));
        }
        return Promise.reject(error);
    }
);

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

// 通用请求方法
export const request = {
    get: <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
        return api.get(url, { params });
    },
    post: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        return api.post(url, data, config);
    },
    put: <T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        return api.put(url, data, config);
    },
    delete: <T = any>(url: string, config?: any): Promise<ApiResponse<T>> => {
        return api.delete(url, config);
    },
};

export default api;
