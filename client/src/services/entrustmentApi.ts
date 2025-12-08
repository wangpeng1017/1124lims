/**
 * 委托单管理 API 服务
 */
import { request, type PageResult } from './api';

export interface IEntrustment {
    id?: number;
    entrustmentNo?: string;
    contractNo?: string;
    clientId?: number;
    clientName?: string;
    contactPerson?: string;
    contactPhone?: string;
    sampleDate?: string;
    follower?: string;
    followerId?: number;
    sampleName?: string;
    sampleModel?: string;
    sampleMaterial?: string;
    sampleQuantity?: number;
    isSampleReturn?: boolean;
    testItems?: string;
    estimatedAmount?: number;
    expectedDate?: string;
    remark?: string;
    status?: string;
    createTime?: string;
    updateTime?: string;
}

export interface EntrustmentQuery {
    current?: number;
    size?: number;
    entrustmentNo?: string;
    clientName?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export const entrustmentApi = {
    // 分页查询委托单
    page: (params: EntrustmentQuery) =>
        request.get<PageResult<IEntrustment>>('/entrustment/page', params),

    // 获取委托单详情
    getById: (id: number) =>
        request.get<IEntrustment>(`/entrustment/${id}`),

    // 新增委托单
    create: (data: IEntrustment) =>
        request.post<IEntrustment>('/entrustment', data),

    // 更新委托单
    update: (data: IEntrustment) =>
        request.put<void>('/entrustment', data),

    // 删除委托单
    delete: (id: number) =>
        request.delete<void>(`/entrustment/${id}`),

    // 提交审批
    submit: (id: number) =>
        request.post<void>(`/entrustment/${id}/submit`),

    // 审批委托单
    approve: (id: number, approved: boolean, comment?: string) =>
        request.post<void>(`/entrustment/${id}/approve`, null, {
            params: { approved, comment }
        }),

    // 根据客户查询委托单
    getByClient: (clientId: number) =>
        request.get<IEntrustment[]>(`/entrustment/by-client/${clientId}`),
};

export default entrustmentApi;
