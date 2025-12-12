import { request } from './api';
import type { ApiResponse } from './api';

/**
 * 公开报告信息
 */
export interface IPublicReport {
    reportNo: string;
    sampleName: string;
    clientName: string;
    testItems: string;
    conclusion: string;
    tester: string;
    reviewer: string;
    approver: string;
    issuedDate: string;
    status: string;
    statusText: string;
    valid: boolean;
}

/**
 * 公开API服务（无需认证）
 */
const publicApi = {
    /**
     * 验证报告真伪
     */
    verifyReport: (reportNo: string, code: string): Promise<ApiResponse<IPublicReport>> => {
        return request.get('/public/report/verify', { reportNo, code });
    },

    /**
     * 查询报告信息
     */
    queryReport: (reportNo: string): Promise<ApiResponse<IPublicReport>> => {
        return request.get(`/public/report/query/${reportNo}`);
    },

    /**
     * 检查报告是否存在
     */
    checkExists: (reportNo: string): Promise<ApiResponse<boolean>> => {
        return request.get('/public/report/exists', { reportNo });
    },
};

export default publicApi;
