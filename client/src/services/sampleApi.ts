/**
 * 样品管理 API 服务
 */
import { request, type PageResult } from './api';

export interface ISample {
    id?: number;
    sampleNo?: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    name?: string;
    spec?: string;
    material?: string;
    quantity?: number;
    unit?: string;
    receiptDate?: string;
    receiptPerson?: string;
    receiptPersonId?: number;
    storageLocation?: string;
    photos?: string;
    status?: string;
    isOutsourced?: boolean;
    outsourceSupplierId?: number;
    outsourceSupplierName?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
}

export interface SampleQuery {
    current?: number;
    size?: number;
    sampleNo?: string;
    name?: string;
    entrustmentNo?: string;
    status?: string;
}

export const sampleApi = {
    // 分页查询样品
    page: (params: SampleQuery) =>
        request.get<PageResult<ISample>>('/sample/page', params),

    // 获取样品详情
    getById: (id: number) =>
        request.get<ISample>(`/sample/${id}`),

    // 新增样品
    create: (data: ISample) =>
        request.post<ISample>('/sample', data),

    // 更新样品
    update: (data: ISample) =>
        request.put<void>('/sample', data),

    // 删除样品
    delete: (id: number) =>
        request.delete<void>(`/sample/${id}`),

    // 根据委托单获取样品列表
    getByEntrustment: (entrustmentId: number) =>
        request.get<ISample[]>(`/sample/by-entrustment/${entrustmentId}`),

    // 更新样品状态
    updateStatus: (id: number, status: string) =>
        request.put<void>(`/sample/${id}/status`, null, { params: { status } }),

    // 样品登记（接收）
    receive: (entrustmentId: number, samples: ISample[]) =>
        request.post<ISample[]>(`/sample/receive`, { entrustmentId, samples }),
};

export default sampleApi;
