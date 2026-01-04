/**
 * 委托咨询 API 服务
 * @file consultationApi.ts
 * @desc 对应后端 ConsultationController
 */
import { request, type PageResult } from './api';

/**
 * 咨询状态
 */
export type ConsultationStatus = 'following' | 'quoted' | 'rejected' | 'closed';

/**
 * 检测目的
 */
export type TestPurpose = 'quality_inspection' | 'product_certification' | 'rd_testing' | 'other';

/**
 * 紧急程度
 */
export type UrgencyLevel = 'normal' | 'urgent' | 'very_urgent';

/**
 * 可行性评估
 */
export type Feasibility = 'feasible' | 'difficult' | 'infeasible';

/**
 * 跟进方式
 */
export type FollowUpType = 'phone' | 'email' | 'visit' | 'other';

/**
 * 跟进记录
 */
export interface FollowUpRecord {
    id: string;
    date: string;
    type: FollowUpType;
    content: string;
    nextAction?: string;
    operator: string;
}

/**
 * 附件
 */
export interface Attachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadTime: string;
    uploadBy: string;
}

/**
 * 咨询单接口
 */
export interface IConsultation {
    id?: number;
    consultationNo?: string;
    createTime?: string;
    updatedAt?: string;

    // 客户信息
    clientCompany: string;
    clientContact: string;
    clientTel: string;
    clientEmail?: string;
    clientAddress?: string;

    // 咨询内容
    sampleName: string;
    sampleModel?: string;
    sampleMaterial?: string;
    estimatedQuantity?: number;

    testItems: string[];
    testPurpose: TestPurpose;
    urgencyLevel: UrgencyLevel;
    expectedDeadline?: string;

    // 客户需求
    clientRequirements?: string;
    budgetRange?: string;

    // 跟进信息
    status: ConsultationStatus;
    follower: string;
    followerId?: number;
    followUpRecords: FollowUpRecord[];

    // 评估信息
    feasibility?: Feasibility;
    feasibilityNote?: string;
    estimatedPrice?: number;

    // 转化信息
    quotationId?: number;
    quotationNo?: string;

    // 附件信息
    attachments?: Attachment[];

    // 元数据
    createdBy: string;
}

/**
 * 咨询单查询参数
 */
export interface ConsultationQuery {
    current?: number;
    size?: number;
    consultationNo?: string;
    clientCompany?: string;
    status?: string;
}

/**
 * 咨询单API服务
 */
export const consultationApi = {
    /**
     * 分页查询咨询单
     */
    page: (params: ConsultationQuery) =>
        request.get<PageResult<IConsultation>>('/consultation/page', params),

    /**
     * 获取咨询单详情
     */
    getById: (id: number) =>
        request.get<IConsultation>(`/consultation/${id}`),

    /**
     * 新增咨询单
     */
    create: (data: IConsultation) =>
        request.post<IConsultation>('/consultation', data),

    /**
     * 更新咨询单
     */
    update: (data: IConsultation) =>
        request.put<void>('/consultation', data),

    /**
     * 删除咨询单
     */
    delete: (id: number) =>
        request.delete<void>(`/consultation/${id}`),

    /**
     * 关闭咨询
     */
    close: (id: number) =>
        request.post<void>(`/consultation/${id}/close`),

    /**
     * 添加跟进记录
     */
    addFollowUp: (id: number, followUp: Omit<FollowUpRecord, 'id'>) =>
        request.post<void>(`/consultation/${id}/follow-up`, {
            ...followUp,
            id: `F${Date.now()}`
        }),

    /**
     * 更新可行性评估
     */
    updateFeasibility: (
        id: number,
        feasibility: Feasibility,
        feasibilityNote?: string,
        estimatedPrice?: number
    ) =>
        request.post<void>(`/consultation/${id}/feasibility`, null, {
            params: { feasibility, feasibilityNote, estimatedPrice }
        }),

    /**
     * 关联报价单
     */
    linkQuotation: (id: number, quotationId: number, quotationNo: string) =>
        request.post<void>(`/consultation/${id}/link-quotation`, null, {
            params: { quotationId, quotationNo }
        }),

    /**
     * 获取所有咨询单列表
     */
    list: () =>
        request.get<IConsultation[]>('/consultation/list'),
};

export default consultationApi;
