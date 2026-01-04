# Entrustment 业务管理模块

> 委托业务全流程：咨询 → 报价 → 合同 → 委托单
> ⚠️ 文件夹变化时请更新此文件

## 业务流程

```
委托咨询 ──→ 报价单 ──→ 委托合同 ──→ 委托单
   ↑           ↑           ↑           ↑
   └───────────┴───────────┴───────────┘
              双向关联 + 重复检查
```

## 文件清单

| 文件名 | 地位 | 功能 |
|--------|------|------|
| index.tsx | 核心 | 委托单管理主页面，支持从合同创建 |
| EntrustmentConsultation.tsx | 核心 | 委托咨询列表，可生成报价单 |
| ConsultationForm.tsx | 组件 | 咨询单新建/编辑表单 |
| ConsultationDetailDrawer.tsx | 组件 | 咨询单详情抽屉，可生成报价单 |
| FollowUpModal.tsx | 组件 | 跟进记录弹窗 |
| QuotationManagement.tsx | 核心 | 报价单管理，可生成合同 |
| QuotationForm.tsx | 组件 | 报价单新建/编辑表单 |
| QuotationDetailDrawer.tsx | 组件 | 报价单详情抽屉 |
| ContractManagement.tsx | 核心 | 合同管理，可生成委托单 |
| EntrustmentContract.tsx | 废弃 | 旧版合同管理（未使用） |
| ClientUnit.tsx | 辅助 | 客户单位管理 |
| EntrustmentFill.tsx | 辅助 | 外部填写页面 |

## 关联数据结构

| 接口 | 位置 | 说明 |
|------|------|------|
| IConsultation | mock/consultation.ts | 咨询单 |
| Quotation | mock/quotationData.ts | 报价单 |
| IContract | mock/contract.ts | 合同（主用） |
| IEntrustmentRecord | mock/entrustment.ts | 委托单 |
| IEntrustmentContract | mock/entrustment.ts | 合同（废弃） |

## 最近变更

- 2026-01-04: 修复业务流转逻辑，添加双向关联和重复检查
