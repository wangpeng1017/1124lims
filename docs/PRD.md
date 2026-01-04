# LIMS 实验室信息管理系统 产品需求文档 (PRD)

> 最后更新: 2026-01-04 | 版本: 1.2

---

## 一、项目概述

### 1.1 项目愿景
基于现代化技术栈打造的企业级实验室信息管理系统，覆盖实验室检测业务全流程：从委托咨询、样品登记、任务分配、检测数据录入、报告生成到财务管理与统计分析。

### 1.2 目标用户
| 角色 | 描述 | 核心诉求 |
|------|------|----------|
| 实验室管理员 | 系统管理、流程配置 | 高效管理实验室运营 |
| 检测人员 | 执行检测任务、录入数据 | 便捷的任务管理和数据录入 |
| 报告审核员 | 审批检测报告 | 规范的三级审批流程 |
| 财务人员 | 管理应收账款、开票 | 清晰的财务数据追踪 |
| 客户 | 委托检测、查询报告 | 便捷的委托和报告查询 |

### 1.3 业务流程图
```
委托咨询 → 报价 → 合同签订 → 委托单创建
                                    ↓
                              样品收样登记
                                    ↓
                              任务分配（内部/委外）
                                    ↓
                              检测数据录入
                                    ↓
                              报告生成 → 三级审批 → 报告出具
                                    ↓
                              财务结算（应收/收款/开票）
```

---

## 二、功能清单

### 状态说明
- 🔴 待开发 | 🟡 开发中 | 🟢 已完成 | ⚫ 已废弃

### 功能总览

| ID | 模块 | 功能 | 状态 | 优先级 | 对应代码 |
|----|------|------|------|--------|----------|
| **业务管理** |
| F001 | 业务管理 | 委托咨询 | 🟢 | P0 | client/src/pages/Entrustment/EntrustmentConsultation.tsx |
| F002 | 业务管理 | 报价管理 | 🟢 | P0 | client/src/pages/Entrustment/QuotationManagement.tsx |
| F003 | 业务管理 | 委托单管理 | 🟢 | P0 | client/src/pages/Entrustment/index.tsx |
| F004 | 业务管理 | 合同管理 | 🟢 | P0 | client/src/pages/Entrustment/ContractManagement.tsx |
| F005 | 业务管理 | 客户单位管理 | 🟢 | P0 | client/src/pages/Entrustment/ClientUnit.tsx |
| **样品管理** |
| F006 | 样品管理 | 样品收样登记 | 🟢 | P0 | client/src/pages/SampleManagement/SampleRegistration.tsx |
| F007 | 样品管理 | 样品明细 | 🟢 | P0 | client/src/pages/SampleManagement/SampleDetails.tsx |
| F008 | 样品管理 | 我的样品 | 🟢 | P1 | client/src/pages/SampleManagement/MySamples.tsx |
| F009 | 样品管理 | 样品流转记录 | 🟢 | P1 | client/src/pages/SampleManagement/TransferRecords.tsx |
| F010 | 样品管理 | 样品任务分配 | 🟢 | P0 | client/src/pages/SampleManagement/SampleTaskAssignment.tsx |
| **任务管理** |
| F011 | 任务管理 | 全部任务 | 🟢 | P0 | client/src/pages/TaskManagement/AllTasks.tsx |
| F012 | 任务管理 | 我的任务 | 🟢 | P0 | client/src/pages/TaskManagement/MyTasks.tsx |
| F013 | 任务管理 | 委外任务-全部 | 🟢 | P1 | client/src/pages/OutsourcingManagement/AllOutsourcing.tsx |
| F014 | 任务管理 | 委外任务-我的 | 🟢 | P1 | client/src/pages/OutsourcingManagement/MyOutsourcing.tsx |
| **检测管理** |
| F015 | 检测管理 | 检测任务列表 | 🟢 | P0 | client/src/pages/TestManagement/TestTasks.tsx |
| F016 | 检测管理 | 我的检测任务 | 🟢 | P0 | client/src/pages/TestManagement/MyTasks.tsx |
| F017 | 检测管理 | 数据录入(ELN) | 🟢 | P0 | client/src/pages/TestManagement/DataEntry.tsx |
| **报告管理** |
| F018 | 报告管理 | 检测报告 | 🟢 | P0 | client/src/pages/ReportManagement/TestReports.tsx |
| F019 | 报告管理 | 客户报告 | 🟢 | P0 | client/src/pages/ReportManagement/ClientReports.tsx |
| F020 | 报告管理 | 报告审批 | 🟢 | P0 | client/src/pages/ReportManagement/ReportApproval.tsx |
| F021 | 报告管理 | 出具记录 | 🟢 | P1 | client/src/pages/ReportManagement/ReportRecords.tsx |
| F022 | 报告管理 | 报告模板管理 | 🟢 | P1 | client/src/pages/ReportManagement/ReportTemplates.tsx |
| F023 | 报告管理 | 模板编辑器 | 🟢 | P1 | client/src/pages/ReportManagement/TemplateEditor.tsx |
| F024 | 报告管理 | 客户报告模板 | 🟢 | P2 | client/src/pages/ReportManagement/ClientReportTemplates.tsx |
| **设备管理** |
| F025 | 设备管理 | 设备信息台账 | 🟢 | P1 | client/src/pages/DeviceManagement/DeviceInfo.tsx |
| F026 | 设备管理 | 保养计划 | 🟢 | P2 | client/src/pages/DeviceManagement/MaintenancePlan.tsx |
| F027 | 设备管理 | 维修管理 | 🟢 | P2 | client/src/pages/DeviceManagement/RepairManagement.tsx |
| F028 | 设备管理 | 定检计划 | 🟢 | P2 | client/src/pages/DeviceManagement/CalibrationPlan.tsx |
| **财务管理** |
| F029 | 财务管理 | 应收账款 | 🟢 | P1 | client/src/pages/FinanceManagement/Receivables.tsx |
| F030 | 财务管理 | 收款记录 | 🟢 | P1 | client/src/pages/FinanceManagement/PaymentRecords.tsx |
| F031 | 财务管理 | 开票管理 | 🟢 | P1 | client/src/pages/FinanceManagement/InvoiceManagement.tsx |
| F032 | 财务管理 | 成本模块 | 🟢 | P2 | client/src/pages/FinanceManagement/CostModule.tsx |
| **耗材管理** |
| F033 | 耗材管理 | 耗材信息 | 🟢 | P2 | client/src/pages/ConsumablesManagement/ConsumableInfo.tsx |
| F034 | 耗材管理 | 出入库记录 | 🟢 | P2 | client/src/pages/ConsumablesManagement/StockTransactions.tsx |
| **供应商管理** |
| F035 | 供应商管理 | 供应商信息 | 🟢 | P2 | client/src/pages/SupplierManagement/SupplierInfo.tsx |
| F036 | 供应商管理 | 供应商分类 | 🟢 | P2 | client/src/pages/SupplierManagement/SupplierCategory.tsx |
| F037 | 供应商管理 | 评价模板 | 🟢 | P2 | client/src/pages/SupplierManagement/EvaluationTemplate.tsx |
| F038 | 供应商管理 | 绩效考评 | 🟢 | P2 | client/src/pages/SupplierManagement/PerformanceEvaluation.tsx |
| F039 | 供应商管理 | 供应商统计 | 🟢 | P3 | client/src/pages/SupplierManagement/SupplierStatistics.tsx |
| **人员管理** |
| F040 | 人员管理 | 部门信息 | 🟢 | P1 | client/src/pages/PersonnelManagement/DepartmentInfo.tsx |
| F041 | 人员管理 | 员工列表 | 🟢 | P1 | client/src/pages/PersonnelManagement/EmployeeList.tsx |
| F042 | 人员管理 | 岗位信息 | 🟢 | P2 | client/src/pages/PersonnelManagement/StationInfo.tsx |
| F043 | 人员管理 | 能力值管理 | 🟢 | P2 | client/src/pages/PersonnelManagement/CapabilityValue.tsx |
| F044 | 人员管理 | 能力评审 | 🟢 | P2 | client/src/pages/PersonnelManagement/CapabilityReview.tsx |
| **统计报表** |
| F045 | 统计报表 | 综合看板 | 🟢 | P1 | client/src/pages/StatisticsReport/index.tsx |
| F046 | 统计报表 | 委托统计 | 🟢 | P1 | client/src/pages/StatisticsReport/EntrustmentStats.tsx |
| F047 | 统计报表 | 样品统计 | 🟢 | P1 | client/src/pages/StatisticsReport/SampleStats.tsx |
| F048 | 统计报表 | 任务统计 | 🟢 | P1 | client/src/pages/StatisticsReport/TaskStats.tsx |
| F049 | 统计报表 | 设备利用率 | 🟢 | P2 | client/src/pages/StatisticsReport/DeviceUtilization.tsx |
| **系统设置** |
| F050 | 系统设置 | 用户管理 | 🟢 | P0 | client/src/pages/SystemSettings/UserManagement.tsx |
| F051 | 系统设置 | 角色管理 | 🟢 | P0 | client/src/pages/SystemSettings/RoleManagement.tsx |
| F052 | 系统设置 | 部门管理 | 🟢 | P0 | client/src/pages/SystemSettings/DepartmentManagement.tsx |
| F053 | 系统设置 | 权限配置 | 🟢 | P0 | client/src/pages/SystemSettings/PermissionConfig.tsx |
| F054 | 系统设置 | 审批流程配置 | 🟢 | P1 | client/src/pages/SystemSettings/ApprovalWorkflowConfig.tsx |
| F055 | 系统设置 | 检测标准 | 🟢 | P1 | client/src/pages/SystemSettings/BasicData/InspectionStandards.tsx |
| F056 | 系统设置 | 检测模板 | 🟢 | P1 | client/src/pages/SystemSettings/BasicData/TestTemplateManagement.tsx |
| F057 | 系统设置 | 报告分类 | 🟢 | P2 | client/src/pages/SystemSettings/BasicData/ReportCategories.tsx |
| **其他功能** |
| F058 | 其他 | 仪表盘 | 🟢 | P0 | client/src/pages/Dashboard.tsx |
| F059 | 其他 | 审批中心 | 🟢 | P0 | client/src/pages/ApprovalCenter/index.tsx |
| F060 | 其他 | 我的待办 | 🟢 | P1 | client/src/pages/MyTodos.tsx |
| F061 | 其他 | 体系文档 | 🟢 | P2 | client/src/pages/SystemDocuments/index.tsx |
| F062 | 其他 | 公开报告查询 | 🟢 | P1 | client/src/pages/PublicReportQuery/index.tsx |
| F063 | 其他 | 登录页面 | 🟢 | P0 | client/src/pages/Login/index.tsx |
| **待开发功能** |
| F064 | 系统 | 消息通知 | 🔴 | P1 | - |
| F065 | 系统 | 操作日志 | 🔴 | P1 | - |
| F066 | 系统 | 数据导出 | 🔴 | P2 | - |
| F067 | 系统 | 打印优化 | 🔴 | P2 | - |
| F068 | 系统 | 移动端适配 | 🔴 | P3 | - |
| F069 | 系统 | 数据备份 | 🔴 | P3 | - |

---

## 三、功能详情

### F001: 委托咨询
- **用户故事**: 作为业务人员，我希望记录客户的检测咨询信息，以便后续跟进转化
- **验收标准**:
  - [x] 支持新建咨询记录
  - [x] 记录客户联系方式和咨询内容
  - [x] 支持咨询转报价/委托
  - [x] 咨询列表查询和筛选
- **关联接口**: EntrustmentController

### F003: 委托单管理
- **用户故事**: 作为业务人员，我希望创建和管理委托单，跟踪检测业务全流程
- **验收标准**:
  - [x] 新建/编辑委托单
  - [x] 项目明细录入
  - [x] 任务分配（内部/委外）
  - [x] 状态流转管理
  - [x] 关联合同和样品
- **关联接口**: EntrustmentController

### F017: 数据录入(ELN)
- **用户故事**: 作为检测人员，我希望在电子实验记录中录入检测数据
- **验收标准**:
  - [x] Fortune-sheet 表格编辑
  - [x] 检测数据保存
  - [x] 设备关联
  - [x] 数据自动计算
- **技术备注**: 使用 Fortune-sheet 组件实现在线表格编辑
- **关联接口**: TestDataController, ElnTemplateController

### F020: 报告审批
- **用户故事**: 作为审核员，我希望对检测报告进行三级审批
- **验收标准**:
  - [x] 编制人提交
  - [x] 审核人审核
  - [x] 批准人批准
  - [x] 驳回与修改
  - [x] 审批记录追踪
- **关联接口**: TestReportController, ApprovalController

---

## 四、数据模型概览

| 实体 | 说明 | 主要字段 |
|------|------|----------|
| sys_user | 用户表 | id, username, password, real_name, dept_id |
| sys_role | 角色表 | id, role_name, role_code, data_scope |
| sys_dept | 部门表 | id, dept_name, parent_id, ancestors |
| biz_client | 客户单位表 | id, client_name, contact, credit_code |
| biz_entrustment | 委托单表 | id, entrustment_no, client_id, status |
| biz_contract | 合同表 | id, contract_no, entrustment_id, amount |
| biz_sample | 样品表 | id, sample_no, entrustment_id, sample_name |
| biz_test_task | 检测任务表 | id, task_no, sample_id, assignee_id, status |
| biz_test_data | 检测数据表 | id, task_id, test_items, sheet_data |
| biz_test_report | 检测报告表 | id, report_no, entrustment_id, approval_status |
| biz_device | 设备表 | id, device_no, device_name, status |
| biz_supplier | 供应商表 | id, supplier_name, contact, evaluation_score |
| biz_outsource_order | 委外单表 | id, order_no, supplier_id, task_id |
| fin_receivable | 应收账款表 | id, entrustment_id, total_amount, paid_amount |
| fin_payment | 收款记录表 | id, receivable_id, payment_amount, payment_date |
| fin_invoice | 发票表 | id, receivable_id, invoice_no, invoice_amount |

---

## 五、技术架构

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Ant Design 6 + Vite |
| 后端 | Spring Boot 3.2 + MyBatis-Plus + Spring Security |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 文件存储 | MinIO |
| 报告生成 | EasyExcel + LibreOffice |
| 表格组件 | Fortune-sheet |

---

## 六、部署信息

| 环境 | 地址 | 说明 |
|------|------|------|
| 阿里云生产 | http://8.130.182.148:8082 | 前端入口 |
| 后端 API | http://8.130.182.148:8081/api | 内网访问 |
| Vercel 演示 | https://1124lims.vercel.app | 在线演示 |

---

## 七、变更历史

| 日期 | 版本 | 变更内容 | 操作人 |
|------|------|----------|--------|
| 2026-01-04 | 1.0 | 初始化主需求文档，整理 63 个已完成功能 + 6 个待开发功能 | AI |
| 2026-01-04 | 1.1 | F001 委托咨询优化：客户公司字段改为仅从委托单位库选择（禁止直接输入）；移除紧急程度字段 | AI |
| 2026-01-04 | 1.2 | 业务流转逻辑修复：(1) 扩展委托单数据结构添加完整关联字段 (2) 修复咨询单→报价单双向关联更新 (3) 添加重复转化检查防止重复生成 (4) 修复报价单→合同双向关联更新 (5) 合同页面添加"生成委托单"功能 (6) 委托单页面支持从合同创建并自动填充 (7) 标记 IEntrustmentContract 为废弃 (8) 增强各页面关联导航跳转功能 | AI |
