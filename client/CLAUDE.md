# client/ - 前端应用模块

[根目录](../CLAUDE.md) > **client**

> React 19 + TypeScript 5 + Ant Design 6 前端应用
> 最后更新：2025-12-31 13:26:09

---

## 变更记录 (Changelog)

| 日期 | 内容 | 操作人 |
|------|------|--------|
| 2025-12-31 | 初始化前端模块文档 | AI 初始化架构师 |

---

## 模块职责

提供 LIMS 系统的完整 Web UI 界面，包括：
- 业务管理（委托、合同、客户）
- 样品管理（收样、台账、流转）
- 任务管理（任务分配、我的任务）
- 检测管理（数据录入、ELN 实验记录）
- 报告管理（报告生成、审批、查验）
- 设备管理（设备台账、维护计划）
- 供应商管理（供应商信息、评价）
- 财务管理（应收账款、收款开票）
- 统计报表（委托统计、样品统计、任务统计）
- 系统设置（用户、角色、部门、权限、审批流程）

---

## 入口与启动

### 入口文件
- **主入口**：`src/main.tsx` - 挂载 React 根组件
- **应用组件**：`src/App.tsx` - 定义路由结构
- **主布局**：`src/layouts/MainLayout.tsx` - 侧边栏 + Header + Content

### 启动命令

```bash
# 开发模式（热更新）
npm run dev
# 访问 http://localhost:5173

# 生产构建
npm run build
# 输出到 dist/

# 代码检查
npm run lint

# 预览构建产物
npm run preview
```

### 环境变量

创建 `.env.development` 文件（已忽略在 .gitignore 中）：
```bash
VITE_API_BASE_URL=/api
```

---

## 对外接口（路由）

### 公开路由（无需登录）

| 路由 | 组件 | 功能 |
|------|------|------|
| `/login` | `pages/Login/index.tsx` | 用户登录 |
| `/report/verify` | `pages/PublicReportQuery/index.tsx` | 公开报告查验 |
| `/fill/:entrustmentId` | `pages/Entrustment/EntrustmentFill.tsx` | 委托单填写（客户端） |

### 主应用路由（需登录）

所有路由包裹在 `MainLayout` 中，基础路径为 `/`：

| 一级菜单 | 路由前缀 | 子路由 | 组件 |
|----------|----------|--------|------|
| 首页 | `/dashboard` | - | `pages/Dashboard.tsx` |
| 业务管理 | `/entrustment` | `/consultation` | `EntrustmentConsultation.tsx` |
| | | `/quotation` | `QuotationManagement.tsx` |
| | | `/order` | `Entrustment/index.tsx` |
| | | `/contract` | `ContractManagement.tsx` |
| | | `/client` | `ClientUnit.tsx` |
| 样品管理 | `/sample-management` | `/receipt` | `SampleRegistration.tsx` |
| | | `/details` | `SampleDetails.tsx` |
| | | `/my-samples` | `MySamples.tsx` |
| 任务管理 | `/task-management` | `/all-tasks` | `AllTasks.tsx` |
| | | `/my-tasks` | `MyTasks.tsx` |
| 委外管理 | `/outsourcing-management` | `/all` | `AllOutsourcing.tsx` |
| | | `/my` | `MyOutsourcing.tsx` |
| 检测管理 | `/test-management` | `/data-entry` | `DataEntry.tsx` |
| 报告管理 | `/report-management` | `/test-reports` | `TestReports.tsx` |
| | | `/client-reports` | `ClientReports.tsx` |
| | | `/client-templates` | `ClientReportTemplates.tsx` |
| | | `/template-editor/:id?` | `TemplateEditor.tsx` |
| | | `/approval` | `ReportApproval.tsx` |
| | | `/records` | `ReportRecords.tsx` |
| | | `/report-templates` | `ReportTemplates.tsx` |
| | | `/categories` | `BasicData/ReportCategories.tsx` |
| 设备管理 | `/device-management` | `/info` | `DeviceInfo.tsx` |
| | | `/maintenance` | `MaintenancePlan.tsx` |
| | | `/repair` | `RepairManagement.tsx` |
| | | `/calibration` | `CalibrationPlan.tsx` |
| 财务管理 | `/finance-management` | `/receivables` | `Receivables.tsx` |
| | | `/payment-records` | `PaymentRecords.tsx` |
| | | `/invoices` | `InvoiceManagement.tsx` |
| | | `/cost-module` | `CostModule.tsx` |
| 耗材管理 | `/consumables-management` | `/info` | `ConsumableInfo.tsx` |
| | | `/transactions` | `StockTransactions.tsx` |
| 供应商管理 | `/supplier-management` | `/info` | `SupplierInfo.tsx` |
| | | `/category` | `SupplierCategory.tsx` |
| | | `/template` | `EvaluationTemplate.tsx` |
| | | `/evaluation` | `PerformanceEvaluation.tsx` |
| 统计报表 | `/statistics-report` | `/entrustment` | `EntrustmentStats.tsx` |
| | | `/sample` | `SampleStats.tsx` |
| | | `/task` | `TaskStats.tsx` |
| 系统文档 | `/system-documents` | - | `SystemDocuments/index.tsx` |
| 系统设置 | `/system-settings` | `/users` | `UserManagement.tsx` |
| | | `/roles` | `RoleManagement.tsx` |
| | | `/departments` | `DepartmentManagement.tsx` |
| | | `/permission` | `PermissionConfig.tsx` |
| 审批工作流 | `/approval-workflow` | - | `ApprovalWorkflowConfig.tsx` |
| 审批中心 | `/approval-center` | - | `ApprovalCenter/index.tsx` |

---

## 关键依赖与配置

### 核心依赖

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6",
    "antd": "^6.0.0",
    "@ant-design/icons": "^6.1.0",
    "axios": "^1.13.2",
    "dayjs": "^1.11.19",
    "@fortune-sheet/react": "^1.0.4",  // 在线表格
    "echarts-for-react": "^3.0.5",     // 图表
    "@react-pdf/renderer": "^4.3.1",   // PDF 生成
    "html2canvas": "^1.4.1",           // 截图
    "mammoth": "^1.11.0",              // Word 预览
    "react-barcode": "^1.6.1",         // 条形码
    "xlsx": "^0.18.5"                  // Excel 导入导出
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1"
  }
}
```

### Vite 配置

`vite.config.ts`：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 默认端口 5173
  // 生产构建输出 dist/
})
```

### ESLint 配置

`eslint.config.js` - 使用 Flat Config 格式（ESLint 9+）

---

## 数据模型（TypeScript 接口）

### 通用接口

```typescript
// src/services/api.ts
interface Result<T> {
  code: number
  message: string
  data: T
}

interface PageParams {
  current: number
  size: number
}

interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
}
```

### 业务实体（部分示例）

```typescript
// 委托单
interface Entrustment {
  id: number
  entrustmentNo: string
  clientId: number
  clientName: string
  status: 'draft' | 'pending' | 'in_progress' | 'completed'
  createTime: string
  // ...
}

// 样品
interface Sample {
  id: number
  sampleNo: string
  sampleName: string
  entrustmentId: number
  status: 'received' | 'testing' | 'completed'
  // ...
}

// 检测任务
interface TestTask {
  id: number
  taskNo: string
  sampleId: number
  assigneeId: number
  status: 'pending' | 'in_progress' | 'completed'
  // ...
}

// 检测报告
interface TestReport {
  id: number
  reportNo: string
  entrustmentId: number
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected'
  // ...
}
```

---

## 测试与质量

### 测试现状

- **单元测试**：❌ 未配置（TODO：引入 Vitest）
- **集成测试**：✅ 使用 Mock 数据（`src/mock/*.ts`）
- **E2E 测试**：❌ 未配置

### 代码质量工具

- **ESLint**：已配置 `eslint-plugin-react-hooks` 和 `typescript-eslint`
- **TypeScript 严格模式**：部分启用（`tsconfig.json`）
- **格式化**：未配置 Prettier（建议添加）

### 运行检查

```bash
# ESLint 检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit
```

---

## 常见问题 (FAQ)

### 1. API 请求失败 401 Unauthorized

**原因**：Token 过期或未登录

**解决**：
```typescript
// src/services/api.ts 已自动处理
// 拦截器会在 401 时清除 token 并跳转登录页
```

### 2. Fortune-sheet 表格数据如何提交？

**示例**：
```typescript
import FortuneSheet from '@/components/FortuneSheet'

const [sheetData, setSheetData] = useState([])

// 提交时获取数据
const handleSubmit = () => {
  const data = sheetRef.current?.getData()
  testDataApi.save({ sheetData: JSON.stringify(data) })
}
```

### 3. 如何添加新菜单？

**步骤**：
1. 在 `App.tsx` 添加路由
2. 在 `MainLayout.tsx` 的 `items` 数组添加菜单项
3. 创建对应的页面组件

### 4. 如何调用后端 API？

**推荐方式**：
```typescript
// 1. 在 services/xxxApi.ts 定义接口
export const entrustmentApi = {
  page: (params) => request.get('/entrustment/page', { params }),
  create: (data) => request.post('/entrustment', data)
}

// 2. 在组件中使用
import { entrustmentApi } from '@/services/entrustmentApi'

const { data } = await entrustmentApi.page({ current: 1, size: 10 })
```

### 5. PDF 报告如何生成？

**两种方式**：

A. 使用 `@react-pdf/renderer`（前端生成）：
```typescript
import { PDFViewer, Document, Page } from '@react-pdf/renderer'
import ClientReportPDF from '@/components/ClientReportPDF'

<PDFViewer>
  <ClientReportPDF data={reportData} />
</PDFViewer>
```

B. 使用后端 API（LibreOffice 生成）：
```typescript
const res = await reportApi.generate({ reportId })
window.open(res.data.fileUrl)
```

---

## 相关文件清单

### 核心文件

| 文件 | 功能 |
|------|------|
| `src/main.tsx` | React 应用入口 |
| `src/App.tsx` | 路由定义 |
| `src/layouts/MainLayout.tsx` | 主布局（侧边栏 + Header） |
| `src/services/api.ts` | Axios 实例 + 拦截器 |
| `src/hooks/useAuth.ts` | 认证 Hook（登录、登出、权限） |
| `vite.config.ts` | Vite 构建配置 |
| `package.json` | 依赖与脚本 |
| `tsconfig.json` | TypeScript 配置 |
| `eslint.config.js` | ESLint 配置 |

### 业务模块文件分布

| 模块 | 页面目录 | API 服务 | Mock 数据 |
|------|----------|----------|-----------|
| 委托管理 | `pages/Entrustment/` | `services/entrustmentApi.ts` | `mock/entrustment.ts` |
| 样品管理 | `pages/SampleManagement/` | `services/sampleApi.ts` | `mock/sample.ts` |
| 任务管理 | `pages/TaskManagement/` | `services/taskApi.ts` | `mock/test.ts` |
| 报告管理 | `pages/ReportManagement/` | `services/reportApi.ts` | `mock/report.ts` |
| 设备管理 | `pages/DeviceManagement/` | `services/api.ts` | `mock/devices.ts` |
| 财务管理 | `pages/FinanceManagement/` | `services/financeApi.ts` | `mock/finance.ts` |
| 系统设置 | `pages/SystemSettings/` | `services/api.ts` | `mock/system.ts` |

### 通用组件

| 组件 | 路径 | 功能 |
|------|------|------|
| FortuneSheet | `components/FortuneSheet/` | 在线表格编辑器 |
| ClientReportPDF | `components/ClientReportPDF/` | 客户报告 PDF 模板 |
| ContractPDF | `components/ContractPDF.tsx` | 合同 PDF 模板 |
| QuotationPDF | `components/QuotationPDF.tsx` | 报价单 PDF 模板 |
| PersonSelector | `components/PersonSelector.tsx` | 人员选择器 |
| DynamicFormRenderer | `components/DynamicFormRenderer.tsx` | 动态表单渲染 |
| TaskDetailDrawer | `components/TaskDetailDrawer.tsx` | 任务详情抽屉 |

---

## 统计信息

- **总文件数（TypeScript/TSX）**：126 个
- **代码行数**：约 31,371 行
- **页面组件数**：约 80+ 个
- **API 服务模块数**：15+ 个
- **Mock 数据文件数**：20+ 个

---

## 待办与改进

### 高优先级

- [ ] 引入 Vitest 并编写单元测试
- [ ] 配置 Prettier 统一代码格式
- [ ] 优化 Fortune-sheet 大数据渲染性能
- [ ] 添加错误边界组件（Error Boundary）
- [ ] 优化打包体积（代码分割、按需加载）

### 中优先级

- [ ] 将 Mock 数据替换为真实 API 调用
- [ ] 统一状态管理（考虑引入 Zustand 或 Redux Toolkit）
- [ ] 添加 PWA 支持（Service Worker）
- [ ] 国际化支持（i18n）

### 低优先级

- [ ] 暗色主题支持
- [ ] 移动端适配
- [ ] 添加 Storybook

---

## 参考资源

- **React 文档**：https://react.dev/
- **Ant Design 文档**：https://ant.design/
- **Vite 文档**：https://vitejs.dev/
- **Fortune-sheet 文档**：https://github.com/ruilisi/fortune-sheet
- **ECharts 文档**：https://echarts.apache.org/
