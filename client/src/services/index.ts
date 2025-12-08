// 服务层统一导出

// API客户端
export { default as api, request } from './api';
export type { ApiResponse, PageResult } from './api';

// 业务API服务 (原有)
export { entrustmentApi, sampleApi, taskApi, reportApi, deviceApi, authApi, dashboardApi } from './businessApi';
export type { Entrustment, Sample, TestTask, TestReport, Device, User } from './businessApi';

// 新增API服务
export { default as entrustmentApiNew } from './entrustmentApi';
export type { IEntrustment, EntrustmentQuery } from './entrustmentApi';
export { default as sampleApiNew } from './sampleApi';
export type { ISample, SampleQuery } from './sampleApi';
export { default as taskApiNew } from './taskApi';
export type { ITestTask, TaskQuery } from './taskApi';
export { default as reportApiNew } from './reportApi';
export type { ITestReport, ReportQuery } from './reportApi';
export { default as financeApi } from './financeApi';
export type { IReceivable, IPayment, IInvoice } from './financeApi';
export { default as statisticsApi } from './statisticsApi';
export type { EntrustmentStats, TaskCompletionStats, TrendItem } from './statisticsApi';

// 数据服务Hooks
export {
    useEntrustmentService,
    useSampleService,
    useTaskService,
    useReportService,
    useDeviceService,
    useAuthService,
    useDashboardService,
    useFinanceService,
    useStatisticsService
} from './useDataService';
export type { PageParams, PageData } from './useDataService';
