// 服务层统一导出

// API客户端
export { default as api, request } from './api';
export type { ApiResponse, PageResult } from './api';

// 业务API服务
export { entrustmentApi, sampleApi, taskApi, reportApi, deviceApi, authApi, dashboardApi } from './businessApi';
export type { Entrustment, Sample, TestTask, TestReport, Device, User } from './businessApi';

// 数据服务Hooks
export {
    useEntrustmentService,
    useSampleService,
    useTaskService,
    useReportService,
    useDeviceService,
    useAuthService,
    useDashboardService
} from './useDataService';
export type { PageParams, PageData } from './useDataService';
