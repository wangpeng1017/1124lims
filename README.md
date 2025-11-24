# LIMS - Laboratory Information Management System

## 项目简介
这是一个基于 React + TypeScript + Ant Design 的实验室信息管理系统（LIMS）前端Demo。

## 技术栈
- **框架**: React 18 + Vite
- **语言**: TypeScript
- **UI库**: Ant Design 5
- **路由**: React Router v6
- **图表**: ECharts + echarts-for-react

## 核心功能模块
1. **设备管理** - 设备列表、状态监控、利用率分析
2. **环境管理** - 实验室环境监控（温湿度）
3. **易耗品管理** - 库存管理、低库存预警
4. **方法管理** - 检测标准方法管理
5. **委托信息** - 检测委托单管理

## 本地开发

### 安装依赖
```bash
cd client
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 在线演示
https://1124lims.vercel.app/

## 项目结构
```
client/
├── src/
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面组件
│   │   ├── DeviceManagement/
│   │   ├── EnvironmentManagement/
│   │   ├── Consumables/
│   │   ├── MethodManagement/
│   │   └── Entrustment/
│   ├── mock/           # 模拟数据
│   └── App.tsx         # 主应用
└── package.json
```

## 开发计划
- [x] Phase 1: 前端Demo开发
- [ ] Phase 2: 后端API开发
- [ ] Phase 3: 数据库集成
