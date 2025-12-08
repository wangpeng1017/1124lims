/**
 * 财务管理 API 服务
 */
import { request, type PageResult } from './api';

// 应收记录
export interface IReceivable {
    id?: number;
    entrustmentId?: number;
    entrustmentNo?: string;
    contractId?: number;
    contractNo?: string;
    clientId?: number;
    clientName?: string;
    amount?: number;
    paidAmount?: number;
    unpaidAmount?: number;
    paymentType?: 'prepay' | 'postpay';
    dueDate?: string;
    status?: 'pending' | 'partial' | 'paid' | 'overdue';
    remark?: string;
    createTime?: string;
}

// 收款记录
export interface IPayment {
    id?: number;
    paymentNo?: string;
    receivableId?: number;
    entrustmentId?: number;
    clientId?: number;
    clientName?: string;
    amount?: number;
    paymentDate?: string;
    paymentMethod?: 'bank' | 'cash' | 'check' | 'other';
    bankAccount?: string;
    handlerId?: number;
    handler?: string;
    remark?: string;
    createTime?: string;
}

// 发票
export interface IInvoice {
    id?: number;
    invoiceNo?: string;
    invoiceType?: 'normal' | 'special';
    clientId?: number;
    clientName?: string;
    taxNo?: string;
    amount?: number;
    taxRate?: number;
    taxAmount?: number;
    invoiceDate?: string;
    status?: 'draft' | 'issued' | 'cancelled';
    entrustmentIds?: string;
    creator?: string;
    remark?: string;
    createTime?: string;
}

// 应收统计
export interface IReceivableStats {
    totalAmount: number;
    paidTotal: number;
    unpaidTotal: number;
    overdueCount: number;
    totalCount: number;
}

export const financeApi = {
    // ===== 应收管理 =====
    receivable: {
        page: (params: { current?: number; size?: number; clientName?: string; status?: string }) =>
            request.get<PageResult<IReceivable>>('/finance/receivable/page', params),

        create: (data: IReceivable) =>
            request.post<IReceivable>('/finance/receivable', data),

        update: (data: IReceivable) =>
            request.put<void>('/finance/receivable', data),

        delete: (id: number) =>
            request.delete<void>(`/finance/receivable/${id}`),

        statistics: () =>
            request.get<IReceivableStats>('/finance/receivable/statistics'),
    },

    // ===== 收款管理 =====
    payment: {
        page: (params: { current?: number; size?: number; clientName?: string; paymentMethod?: string }) =>
            request.get<PageResult<IPayment>>('/finance/payment/page', params),

        create: (data: IPayment) =>
            request.post<IPayment>('/finance/payment', data),

        delete: (id: number) =>
            request.delete<void>(`/finance/payment/${id}`),
    },

    // ===== 发票管理 =====
    invoice: {
        page: (params: { current?: number; size?: number; invoiceNo?: string; clientName?: string; status?: string }) =>
            request.get<PageResult<IInvoice>>('/finance/invoice/page', params),

        create: (data: IInvoice) =>
            request.post<IInvoice>('/finance/invoice', data),

        update: (data: IInvoice) =>
            request.put<void>('/finance/invoice', data),

        delete: (id: number) =>
            request.delete<void>(`/finance/invoice/${id}`),

        issue: (id: number) =>
            request.post<void>(`/finance/invoice/${id}/issue`),

        cancel: (id: number) =>
            request.post<void>(`/finance/invoice/${id}/cancel`),
    },
};

export default financeApi;
