# LIMS - 实验室信息管理系统 (DEMO)

> **Laboratory Information Management System - 演示版本**

> **注意**: 本项目为功能演示 DEMO，所有数据均为 Mock 数据，不连接真实后端服务。

## 在线演示

https://1124lims.vercel.app/

## 项目说明

这是一个 **纯前端演示版本** 的 LIMS 系统，用于展示系统功能和 UI 设计。项目部署在 Vercel 平台，所有数据均为内置的 Mock 数据。

### DEMO 特性

- 🎨 **完整 UI**: 展示所有模块的界面设计和交互流程
- 📊 **Mock 数据**: 内置丰富的测试数据，覆盖各种业务场景
- 🚀 **即开即用**: 无需配置后端，打开即可体验
- 📱 **响应式设计**: 支持桌面端和移动端访问

### 限制说明

- ⚠️ 所有数据均为模拟数据，不保存任何修改
- ⚠️ 不支持文件上传/下载功能
- ⚠️ 不支持 PDF 报告生成
- ⚠️ 不支持实时协作功能

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design 5 + Vite |
| 部署 | Vercel (纯静态前端) |
| 数据 | Mock 数据 (内置) |

## 核心功能演示

### 业务管理
- 委托咨询 → 报价单 → 委托合同 → 委托单
- 客户单位管理

### 样品管理
- 收样登记
- 样品台账
- 我的样品

### 任务管理
- 全部任务
- 我的任务
- 任务分配与进度跟踪

### 检测管理
- 数据录入
- 检测模板管理

### 报告管理
- 任务报告
- 客户报告
- 报告模板
- 报告审批

### 设备管理
- 设备档案
- 保养计划
- 检修管理
- 仪器定检

### 耗材管理
- 耗材信息
- 出入库管理

### 供应商管理
- 供应商分类
- 供应商信息
- 绩效评价

### 财务管理
- 委托应收
- 收款记录
- 开票管理

### 统计报表
- 委托单统计
- 样品统计
- 任务完成率

### 系统设置
- 用户管理
- 角色管理
- 部门管理
- 权限配置

## 本地运行

```bash
# 克隆项目
git clone https://github.com/wangpeng1017/1124lims.git
cd 1124lims/client

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

## 构建部署

```bash
# 构建生产版本
npm run build

# 输出目录: client/dist/
# 可部署到任何静态网站托管服务
```

## Mock 数据说明

Mock 数据位于 `client/src/mock/` 目录下，包含：

- `entrustment.ts` - 委托单数据 (10条不同状态的测试数据)
- `consultation.ts` - 咨询单数据
- `quotationData.ts` - 报价单数据
- `contract.ts` - 合同数据
- `sample.ts` - 样品数据
- `test.ts` - 检测任务数据
- `report.ts` - 报告数据
- `devices.ts` - 设备数据
- `consumables.ts` - 耗材数据
- `supplier.ts` - 供应商数据
- `finance.ts` - 财务数据
- `personnel.ts` - 人员数据
- `system.ts` - 系统配置数据

## 完整版本

完整版 LIMS 系统包含后端服务和完整功能，如需了解请联系。

## License

MIT

---

**演示环境**: https://1124lims.vercel.app/
