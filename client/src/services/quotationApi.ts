/**
 * 报价单管理 API 服务
 * @file quotationApi.ts
 * @desc 对应后端 QuotationController
 */
import { request, type PageResult } from './api';

/**
 * 报价单状态
 */
export type QuotationStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired';

/**
 * 报价单接口
 */
export interface IQuotation {
    id?: number;
    quotationNo?: string;
    clientId?: number;
    clientName?: string;
    contactPerson?: string;
    phone?: string;
    totalAmount?: number;
    discountAmount?: number;
    actualAmount?: number;
    validUntil?: string;
    items?: string;
    status?: QuotationStatus;
    remark?: string;
    creatorId?: number;
    creator?: string;
    createTime?: string;
    updateTime?: string;
    // 扩展字段（前端使用）
    clientCompany?: string;  // 兼容前端mock数据
    clientStatus?: 'pending' | 'accepted' | 'rejected' | 'archived';  // 客户反馈状态
    testItems?: string[];  // 检测项目
    sampleName?: string;  // 样品名称
    sampleModel?: string;  // 样品型号
    sampleQuantity?: number;  // 样品数量
    quotationDate?: string;  // 报价日期
    operator?: string;  // 操作人
    quotationId?: string;  // 咨询关联ID
    consultationNo?: string;  // 关联咨询单号
}

/**
 * 报价单查询参数
 */
export interface QuotationQuery {
    current?: number;
    size?: number;
    quotationNo?: string;
    clientName?: string;
    status?: string;
}

/**
 * 报价单API服务
 */
export const quotationApi = {
    /**
     * 分页查询报价单
     */
    page: (params: QuotationQuery) =>
        request.get<PageResult<IQuotation>>('/quotation/page', params),

    /**
     * 获取报价单详情
     */
    getById: (id: number) =>
        request.get<IQuotation>(`/quotation/${id}`),

    /**
     * 根据客户获取报价单列表
     */
    getByClient: (clientId: number) =>
        request.get<IQuotation[]>(`/quotation/by-client/${clientId}`),

    /**
     * 新增报价单
     */
    create: (data: IQuotation) =>
        request.post<IQuotation>('/quotation', data),

    /**
     * 更新报价单
     */
    update: (data: IQuotation) =>
        request.put<void>('/quotation', data),

    /**
     * 删除报价单
     */
    delete: (id: number) =>
        request.delete<void>(`/quotation/${id}`),

    /**
     * 提交报价单
     */
    submit: (id: number) =>
        request.post<void>(`/quotation/${id}/submit`),

    /**
     * 审批报价单
     */
    approve: (id: number, approved: boolean, comment?: string) =>
        request.post<void>(`/quotation/${id}/approve`, null, {
            params: { approved, comment }
        }),

    /**
     * 复制报价单
     */
    copy: (id: number) =>
        request.post<IQuotation>(`/quotation/${id}/copy`),

    /**
     * 转为合同
     */
    toContract: (id: number) =>
        request.post<void>(`/quotation/${id}/to-contract`),
};

export default quotationApi;
