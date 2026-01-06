# Services 模块

> API 服务层，封装前端请求逻辑
> ⚠️ 文件夹变化时请更新此文件

## 文件清单

| 文件名 | 功能 | 说明 |
|--------|------|------|
| api.ts | 核心请求封装 | 直接使用 Mock 数据 (DEMO模式) |
| mockApi.ts | Mock API 服务 | 提供测试数据回退 |
| businessApi.ts | 业务 API 定义 | 委托/样品/任务/报告/设备等 |
| useDataService.ts | 数据获取 Hook | React Hooks 封装 |
| financeApi.ts | 财务 API | 财务相关接口 |
| statisticsApi.ts | 统计 API | 统计报表接口 |

## DEMO 模式说明

本项目为 DEMO 版本，所有 API 请求直接返回 Mock 数据，无需后端服务。

```
组件 → useDataService → businessApi → request → mockApi → Mock数据
```
