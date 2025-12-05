import { request, ApiResponse, PageResult } from './api';

// 委托单接口定义
export interface Entrustment {
    id: number;
    entrustmentNo: string;
    contractNo?: string;
    clientId?: number;
    clientName: string;
    contactPerson: string;
    contactPhone?: string;
    sampleDate: string;
    follower: string;
    followerId?: number;
    sampleName: string;
    sampleModel?: string;
    sampleMaterial?: string;
    sampleQuantity: number;
    isSampleReturn: boolean;
    testItems: string;
    estimatedAmount?: number;
    expectedDate?: string;
    remark?: string;
    status: string;
    createTime?: string;
}

// 委托单API服务
export const entrustmentApi = {
    // 分页查询
    page: (params: {
        current?: number;
        size?: number;
        entrustmentNo?: string;
        clientName?: string;
        status?: string;
    }): Promise<ApiResponse<PageResult<Entrustment>>> => {
        return request.get('/entrustment/page', params);
    },

    // 获取详情
    getById: (id: number): Promise<ApiResponse<Entrustment>> => {
        return request.get(`/entrustment/${id}`);
    },

    // 新增
    create: (data: Partial<Entrustment>): Promise<ApiResponse<Entrustment>> => {
        return request.post('/entrustment', data);
    },

    // 更新
    update: (data: Partial<Entrustment>): Promise<ApiResponse<void>> => {
        return request.put('/entrustment', data);
    },

    // 删除
    delete: (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/entrustment/${id}`);
    },

    // 审核
    approve: (id: number, approved: boolean, comment?: string): Promise<ApiResponse<void>> => {
        return request.post(`/entrustment/${id}/approve`, null, {
            params: { approved, comment },
        });
    },
};

// 样品接口定义
export interface Sample {
    id: number;
    sampleNo: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    name: string;
    spec?: string;
    material?: string;
    quantity: number;
    unit?: string;
    receiptDate?: string;
    receiptPerson?: string;
    storageLocation?: string;
    status: string;
}

// 样品API服务
export const sampleApi = {
    page: (params: {
        current?: number;
        size?: number;
        sampleNo?: string;
        name?: string;
        status?: string;
    }): Promise<ApiResponse<PageResult<Sample>>> => {
        return request.get('/sample/page', params);
    },

    getById: (id: number): Promise<ApiResponse<Sample>> => {
        return request.get(`/sample/${id}`);
    },

    create: (data: Partial<Sample>): Promise<ApiResponse<Sample>> => {
        return request.post('/sample', data);
    },

    update: (data: Partial<Sample>): Promise<ApiResponse<void>> => {
        return request.put('/sample', data);
    },

    delete: (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/sample/${id}`);
    },

    getByEntrustment: (entrustmentId: number): Promise<ApiResponse<Sample[]>> => {
        return request.get(`/sample/by-entrustment/${entrustmentId}`);
    },
};

// 检测任务接口定义
export interface TestTask {
    id: number;
    taskNo: string;
    sampleId?: number;
    sampleNo?: string;
    sampleName?: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    parameters?: string;
    testMethod?: string;
    testStandard?: string;
    assigneeId?: number;
    assignee?: string;
    assignDate?: string;
    dueDate?: string;
    completedDate?: string;
    deviceId?: number;
    deviceName?: string;
    progress: number;
    priority: string;
    status: string;
    isOutsourced: boolean;
    createTime?: string;
}

// 任务API服务
export const taskApi = {
    page: (params: {
        current?: number;
        size?: number;
        taskNo?: string;
        sampleName?: string;
        assignee?: string;
        status?: string;
    }): Promise<ApiResponse<PageResult<TestTask>>> => {
        return request.get('/task/page', params);
    },

    getById: (id: number): Promise<ApiResponse<TestTask>> => {
        return request.get(`/task/${id}`);
    },

    create: (data: Partial<TestTask>): Promise<ApiResponse<TestTask>> => {
        return request.post('/task', data);
    },

    assign: (taskId: number, assigneeId: number, assigneeName: string): Promise<ApiResponse<void>> => {
        return request.post(`/task/${taskId}/assign`, null, {
            params: { assigneeId, assigneeName },
        });
    },

    batchAssign: (taskIds: number[], assigneeId: number, assigneeName: string): Promise<ApiResponse<void>> => {
        return request.post('/task/batch-assign', { taskIds, assigneeId, assigneeName });
    },

    start: (taskId: number): Promise<ApiResponse<void>> => {
        return request.post(`/task/${taskId}/start`);
    },

    complete: (taskId: number): Promise<ApiResponse<void>> => {
        return request.post(`/task/${taskId}/complete`);
    },

    transfer: (taskId: number, newAssigneeId: number, newAssigneeName: string, reason: string): Promise<ApiResponse<void>> => {
        return request.post(`/task/${taskId}/transfer`, null, {
            params: { newAssigneeId, newAssigneeName, reason },
        });
    },

    myTasks: (params: {
        current?: number;
        size?: number;
        status?: string;
    }): Promise<ApiResponse<PageResult<TestTask>>> => {
        return request.get('/task/my-tasks', params);
    },
};

// 检测报告接口定义
export interface TestReport {
    id: number;
    reportNo: string;
    entrustmentId?: number;
    entrustmentNo?: string;
    sampleId?: number;
    sampleNo?: string;
    sampleName?: string;
    taskId?: number;
    taskNo?: string;
    clientName?: string;
    testItems?: string;
    testResults?: string;
    conclusion?: string;
    testerId?: number;
    tester?: string;
    reviewerId?: number;
    reviewer?: string;
    reviewDate?: string;
    approverId?: number;
    approver?: string;
    approveDate?: string;
    status: string;
    issuedDate?: string;
    createTime?: string;
}

// 报告API服务
export const reportApi = {
    page: (params: {
        current?: number;
        size?: number;
        reportNo?: string;
        clientName?: string;
        status?: string;
    }): Promise<ApiResponse<PageResult<TestReport>>> => {
        return request.get('/report/page', params);
    },

    getById: (id: number): Promise<ApiResponse<TestReport>> => {
        return request.get(`/report/${id}`);
    },

    create: (data: Partial<TestReport>): Promise<ApiResponse<TestReport>> => {
        return request.post('/report', data);
    },

    submitReview: (reportId: number): Promise<ApiResponse<void>> => {
        return request.post(`/report/${reportId}/submit-review`);
    },

    review: (reportId: number, reviewerId: number, reviewerName: string, approved: boolean, comment?: string): Promise<ApiResponse<void>> => {
        return request.post(`/report/${reportId}/review`, null, {
            params: { reviewerId, reviewerName, approved, comment },
        });
    },

    approve: (reportId: number, approverId: number, approverName: string): Promise<ApiResponse<void>> => {
        return request.post(`/report/${reportId}/approve`, null, {
            params: { approverId, approverName },
        });
    },

    issue: (reportId: number): Promise<ApiResponse<void>> => {
        return request.post(`/report/${reportId}/issue`);
    },
};

// 设备接口定义
export interface Device {
    id: number;
    code: string;
    name: string;
    model?: string;
    manufacturer?: string;
    serialNumber?: string;
    assetType?: string;
    status: string;
    location?: string;
    department?: string;
    purchaseDate?: string;
    commissioningDate?: string;
    nextCalibrationDate?: string;
    responsiblePerson?: string;
    utilization?: number;
    operatingHours?: number;
}

// 设备API服务
export const deviceApi = {
    page: (params: {
        current?: number;
        size?: number;
        code?: string;
        name?: string;
        status?: string;
    }): Promise<ApiResponse<PageResult<Device>>> => {
        return request.get('/device/page', params);
    },

    getById: (id: number): Promise<ApiResponse<Device>> => {
        return request.get(`/device/${id}`);
    },

    list: (): Promise<ApiResponse<Device[]>> => {
        return request.get('/device/list');
    },

    create: (data: Partial<Device>): Promise<ApiResponse<Device>> => {
        return request.post('/device', data);
    },

    update: (data: Partial<Device>): Promise<ApiResponse<void>> => {
        return request.put('/device', data);
    },

    delete: (id: number): Promise<ApiResponse<void>> => {
        return request.delete(`/device/${id}`);
    },
};

// 用户接口定义
export interface User {
    id: number;
    username: string;
    realName: string;
    email?: string;
    phone?: string;
    avatar?: string;
    deptId?: number;
    status: number;
    roles?: string[];
}

// 认证API服务
export const authApi = {
    login: (username: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
        return request.post('/auth/login', { username, password });
    },

    logout: (): Promise<ApiResponse<void>> => {
        return request.post('/auth/logout');
    },

    getCurrentUser: (): Promise<ApiResponse<User>> => {
        return request.get('/auth/current-user');
    },
};

// 仪表盘API服务
export const dashboardApi = {
    getStatistics: (): Promise<ApiResponse<any>> => {
        return request.get('/dashboard/statistics');
    },

    getRecentEntrustments: (limit?: number): Promise<ApiResponse<Entrustment[]>> => {
        return request.get('/dashboard/recent-entrustments', { limit });
    },

    getTodos: (): Promise<ApiResponse<any[]>> => {
        return request.get('/dashboard/todos');
    },
};
