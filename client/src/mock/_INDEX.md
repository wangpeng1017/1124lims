# Mock 数据模块

> 前端 Mock 数据和类型定义
> ⚠️ 文件夹变化时请更新此文件

## 文件清单

| 文件名 | 功能 | 关联页面 |
|--------|------|----------|
| **业务管理** |
| consultation.ts | 咨询单数据和类型 | EntrustmentConsultation |
| quotationData.ts | 报价单数据和类型 | QuotationManagement |
| contract.ts | 合同数据和类型（主用） | ContractManagement |
| entrustment.ts | 委托单数据和类型 | Entrustment/index |
| **样品管理** |
| sample.ts | 样品数据 | SampleManagement |
| **任务管理** |
| test.ts | 检测任务数据 | TestManagement |
| outsourcing.ts | 委外任务数据 | OutsourcingManagement |
| **报告管理** |
| report.ts | 报告数据 | ReportManagement |
| testTemplates.ts | 检测模板 | TemplateEditor |
| **设备管理** |
| devices.ts | 设备数据 | DeviceManagement |
| **财务管理** |
| finance.ts | 财务数据 | FinanceManagement |
| **基础数据** |
| personnel.ts | 人员数据 | PersonnelManagement |
| supplier.ts | 供应商数据 | SupplierManagement |
| consumables.ts | 耗材数据 | ConsumablesManagement |
| basicParameters.ts | 检测参数 | 多处引用 |
| **系统** |
| auth.ts | 认证数据 | Login |
| system.ts | 系统配置 | SystemSettings |
| systemDocuments.ts | 系统文档 | DocumentManagement |
| environment.ts | 环境数据 | EnvironmentManagement |
| todo.ts | 待办数据 | TodoManagement |

## 业务关联关系

```
consultation.ts ──→ quotationData.ts ──→ contract.ts ──→ entrustment.ts
     咨询单              报价单              合同            委托单
```

## 最近变更

- 2026-01-04: entrustment.ts 扩展关联字段，contract.ts 添加委托单关联
