import { request } from './api';
import type { ApiResponse, PageResult } from './api';

/**
 * 体系文件接口定义
 */
export interface ISystemDocument {
    id: number;
    name: string;
    version: string;
    description?: string;
    filePath: string;
    originalName: string;
    fileSize?: number;
    contentType?: string;
    category?: string;
    uploaderId?: number;
    uploader?: string;
    uploadTime?: string;
    createTime?: string;
    updateTime?: string;
}

/**
 * 体系文件查询参数
 */
export interface SystemDocumentQuery {
    current?: number;
    size?: number;
    name?: string;
    category?: string;
    version?: string;
}

/**
 * 文件分类映射
 */
export const DOCUMENT_CATEGORY_MAP: Record<string, { text: string; color: string }> = {
    manual: { text: '质量手册', color: 'blue' },
    procedure: { text: '程序文件', color: 'green' },
    sop: { text: '作业指导书', color: 'orange' },
    regulation: { text: '管理制度', color: 'purple' },
    plan: { text: '计划', color: 'cyan' },
};

/**
 * 获取文件图标
 */
export const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'doc':
        case 'docx':
            return 'word';
        case 'xls':
        case 'xlsx':
            return 'excel';
        case 'pdf':
            return 'pdf';
        case 'ppt':
        case 'pptx':
            return 'ppt';
        default:
            return 'file';
    }
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
};

/**
 * 体系文件API服务
 */
const systemDocumentApi = {
    /**
     * 分页查询体系文件
     */
    page: (params: SystemDocumentQuery): Promise<ApiResponse<PageResult<ISystemDocument>>> => {
        return request.get('/system-document/page', params);
    },

    /**
     * 获取所有体系文件
     */
    list: (category?: string): Promise<ApiResponse<ISystemDocument[]>> => {
        return request.get('/system-document/list', { category });
    },

    /**
     * 获取体系文件详情
     */
    getById: (id: number): Promise<ApiResponse<ISystemDocument>> => {
        return request.get(`/system-document/${id}`);
    },

    /**
     * 上传体系文件
     */
    upload: (
        file: File,
        params: {
            name: string;
            version: string;
            description?: string;
            category?: string;
            uploaderId?: number;
            uploader?: string;
        }
    ): Promise<ApiResponse<ISystemDocument>> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', params.name);
        formData.append('version', params.version);
        if (params.description) formData.append('description', params.description);
        if (params.category) formData.append('category', params.category);
        if (params.uploaderId) formData.append('uploaderId', params.uploaderId.toString());
        if (params.uploader) formData.append('uploader', params.uploader);

        return request.post('/system-document/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * 下载体系文件
     */
    download: async (id: number, fileName?: string): Promise<void> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/system-document/download/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('下载失败');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    /**
     * 更新体系文件信息
     */
    update: (id: number, data: Partial<ISystemDocument>): Promise<ApiResponse<void>> => {
        return request.put(`/system-document/${id}`, data);
    },

    /**
     * 替换体系文件（含文件）
     */
    replace: (
        id: number,
        file: File,
        params?: {
            name?: string;
            version?: string;
            description?: string;
        }
    ): Promise<ApiResponse<ISystemDocument>> => {
        const formData = new FormData();
        formData.append('file', file);
        if (params?.name) formData.append('name', params.name);
        if (params?.version) formData.append('version', params.version);
        if (params?.description) formData.append('description', params.description);

        return request.post(`/system-document/${id}/replace`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * 删除体系文件
     */
    delete: (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/system-document/${id}`);
    },

    /**
     * 搜索体系文件
     */
    search: (keyword: string): Promise<ApiResponse<ISystemDocument[]>> => {
        return request.get('/system-document/search', { keyword });
    },
};

export default systemDocumentApi;
