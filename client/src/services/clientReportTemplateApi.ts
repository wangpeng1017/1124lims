import { request } from './api';
import type { ApiResponse, PageResult } from './api';

// 客户报告模板接口定义
export interface ClientReportTemplate {
    id: number;
    templateCode: string;
    name: string;
    clientId?: number;
    clientName?: string;
    baseTemplateId?: number;
    isDefault: number;  // 0-否 1-是
    companyInfo: string | CompanyInfo;  // JSON 字符串或对象
    clientLogoUrl?: string;
    pages: string | TemplatePage[];  // JSON 字符串或对象
    declarations: string | string[];  // JSON 字符串或数组
    status: number;  // 0-禁用 1-启用
    version?: string;
    description?: string;
    createTime?: string;
    updateTime?: string;
    createBy?: string;
    updateBy?: string;
}

// 公司信息
export interface CompanyInfo {
    logoUrl: string;
    nameCn: string;
    nameEn: string;
    address: string;
    postalCode: string;
    phone: string;
}

// 模板页面
export interface TemplatePage {
    id: string;
    type: 'cover' | 'info' | 'result';
    name: string;
    layout: TemplateLayoutItem[];
}

// 布局项
export interface TemplateLayoutItem {
    id: string;
    type: 'text' | 'image' | 'field' | 'table' | 'signature' | 'declaration' | 'header';
    x: number;
    y: number;
    w: number;
    h: number;
    config: Record<string, any>;
}

// 前端使用的模板类型（解析后的）
export interface ClientReportTemplateVO {
    id: number;
    templateCode: string;
    name: string;
    clientId?: number;
    clientName?: string;
    baseTemplateId?: number;
    isDefault: boolean;
    companyInfo: CompanyInfo;
    clientLogoUrl?: string;
    pages: TemplatePage[];
    declarations: string[];
    status: 'active' | 'inactive';
    version?: string;
    description?: string;
    createTime?: string;
    updateTime?: string;
}

// 将后端数据转换为前端格式
export const transformToVO = (template: ClientReportTemplate): ClientReportTemplateVO => {
    return {
        id: template.id,
        templateCode: template.templateCode,
        name: template.name,
        clientId: template.clientId,
        clientName: template.clientName,
        baseTemplateId: template.baseTemplateId,
        isDefault: template.isDefault === 1,
        companyInfo: typeof template.companyInfo === 'string'
            ? JSON.parse(template.companyInfo)
            : template.companyInfo,
        clientLogoUrl: template.clientLogoUrl,
        pages: typeof template.pages === 'string'
            ? JSON.parse(template.pages)
            : template.pages,
        declarations: typeof template.declarations === 'string'
            ? JSON.parse(template.declarations)
            : template.declarations,
        status: template.status === 1 ? 'active' : 'inactive',
        version: template.version,
        description: template.description,
        createTime: template.createTime,
        updateTime: template.updateTime,
    };
};

// 将前端数据转换为后端格式
export const transformToDTO = (template: Partial<ClientReportTemplateVO>): Partial<ClientReportTemplate> => {
    const dto: Partial<ClientReportTemplate> = {
        id: template.id,
        templateCode: template.templateCode,
        name: template.name,
        clientId: template.clientId,
        clientName: template.clientName,
        baseTemplateId: template.baseTemplateId,
        isDefault: template.isDefault ? 1 : 0,
        clientLogoUrl: template.clientLogoUrl,
        version: template.version,
        description: template.description,
    };

    if (template.companyInfo) {
        dto.companyInfo = JSON.stringify(template.companyInfo);
    }
    if (template.pages) {
        dto.pages = JSON.stringify(template.pages);
    }
    if (template.declarations) {
        dto.declarations = JSON.stringify(template.declarations);
    }
    if (template.status) {
        dto.status = template.status === 'active' ? 1 : 0;
    }

    return dto;
};

// 客户报告模板 API 服务
export const clientReportTemplateApi = {
    // 分页查询
    page: async (params: {
        current?: number;
        size?: number;
        name?: string;
        clientId?: number;
    }): Promise<ApiResponse<PageResult<ClientReportTemplateVO>>> => {
        const response = await request.get<PageResult<ClientReportTemplate>>('/client-report-template/page', params);
        return {
            ...response,
            data: {
                ...response.data,
                records: response.data.records.map(transformToVO),
            },
        };
    },

    // 获取所有启用的模板
    list: async (): Promise<ApiResponse<ClientReportTemplateVO[]>> => {
        const response = await request.get<ClientReportTemplate[]>('/client-report-template/list');
        return {
            ...response,
            data: response.data.map(transformToVO),
        };
    },

    // 获取模板详情
    getById: async (id: number): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const response = await request.get<ClientReportTemplate>(`/client-report-template/${id}`);
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },

    // 根据模板编码获取
    getByCode: async (templateCode: string): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const response = await request.get<ClientReportTemplate>(`/client-report-template/code/${templateCode}`);
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },

    // 根据客户ID获取模板列表
    getByClientId: async (clientId: number): Promise<ApiResponse<ClientReportTemplateVO[]>> => {
        const response = await request.get<ClientReportTemplate[]>(`/client-report-template/client/${clientId}`);
        return {
            ...response,
            data: response.data.map(transformToVO),
        };
    },

    // 获取默认模板
    getDefault: async (): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const response = await request.get<ClientReportTemplate>('/client-report-template/default');
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },

    // 为客户获取最合适的模板
    getForClient: async (clientId?: number): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const response = await request.get<ClientReportTemplate>('/client-report-template/for-client', { clientId });
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },

    // 创建模板
    create: async (data: Partial<ClientReportTemplateVO>): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const dto = transformToDTO(data);
        const response = await request.post<ClientReportTemplate>('/client-report-template', dto);
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },

    // 更新模板
    update: async (data: Partial<ClientReportTemplateVO>): Promise<ApiResponse<void>> => {
        const dto = transformToDTO(data);
        return request.put('/client-report-template', dto);
    },

    // 删除模板
    delete: async (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/client-report-template/${id}`);
    },

    // 切换状态
    toggleStatus: async (id: number, status: number): Promise<ApiResponse<void>> => {
        return request.put(`/client-report-template/${id}/status`, null, {
            params: { status },
        });
    },

    // 设置为默认模板
    setAsDefault: async (id: number): Promise<ApiResponse<void>> => {
        return request.put(`/client-report-template/${id}/set-default`);
    },

    // 复制模板
    copy: async (id: number): Promise<ApiResponse<ClientReportTemplateVO>> => {
        const response = await request.post<ClientReportTemplate>(`/client-report-template/${id}/copy`);
        return {
            ...response,
            data: transformToVO(response.data),
        };
    },
};

export default clientReportTemplateApi;
