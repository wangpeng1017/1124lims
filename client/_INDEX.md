# client/ - 前端应用索引

> React 19 + TypeScript + Ant Design 6 + Vite 构建的 LIMS 前端
> ⚠️ 文件夹变化时请更新此文件

## 目录结构

| 目录 | 地位 | 功能 |
|------|------|------|
| `src/pages/` | 核心 | 业务页面组件 |
| `src/components/` | 核心 | 公共组件库 |
| `src/hooks/` | 辅助 | 自定义 Hooks |
| `src/layouts/` | 辅助 | 页面布局组件 |
| `src/mock/` | 开发 | Mock 数据 |

## 页面模块 (src/pages/)

| 模块 | 功能 | 主要文件 |
|------|------|----------|
| `Login/` | 登录认证 | index.tsx |
| `Dashboard.tsx` | 工作台仪表盘 | - |
| `MyTodos.tsx` | 待办事项 | - |
| `Entrustment/` | 委托管理 | 咨询/报价/合同/委托单 |
| `SampleManagement/` | 样品管理 | 收样/登记/追踪/领用 |
| `DeviceManagement/` | 设备管理 | 台账/保养/维修/定检 |
| `ReportManagement/` | 报告管理 | 生成/审批/模板 |
| `FinanceManagement/` | 财务管理 | 应收/收款/开票 |
| `PersonnelManagement/` | 人员管理 | 部门/员工/能力 |
| `SupplierManagement/` | 供应商管理 | 信息/评价/统计 |
| `OutsourcingManagement/` | 委外管理 | 委外任务 |
| `ConsumablesManagement/` | 耗材管理 | 库存/出入库 |
| `StatisticsReport/` | 统计报表 | 多维度统计 |
| `ApprovalCenter/` | 审批中心 | 流程审批 |
| `PublicReportQuery/` | 公开报告查询 | 报告验真 |
| `SystemDocuments/` | 体系文件 | 文档管理 |

## 公共组件 (src/components/)

| 组件 | 功能 |
|------|------|
| `ClientReportPDF/` | 客户报告 PDF 生成 |
| `FortuneSheet/` | Excel 在线表格 |
| `ContractPDF.tsx` | 合同 PDF |
| `QuotationPDF.tsx` | 报价单 PDF |
| `PersonSelector.tsx` | 人员选择器 |
| `DynamicFormRenderer.tsx` | 动态表单渲染 |
| `TaskDetailDrawer.tsx` | 任务详情抽屉 |

## 入口文件

| 文件 | 功能 |
|------|------|
| `main.tsx` | 应用入口 |
| `App.tsx` | 路由配置 |
| `vite.config.ts` | 构建配置 |

## 开发命令

```bash
npm install     # 安装依赖
npm run dev     # 开发 :5173
npm run build   # 构建
npm run lint    # 代码检查
```
