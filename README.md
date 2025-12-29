# LIMS - 实验室信息管理系统

> **Laboratory Information Management System**

## 项目简介

基于现代化技术栈的实验室信息管理系统，覆盖检测业务全流程。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design 5 + Vite |
| 后端 | Spring Boot 3 + MyBatis-Plus + Spring Security |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 文件存储 | MinIO |
| 部署 | Docker / 直接部署 |
| 报告生成 | EasyExcel + LibreOffice |
| 表格组件 | Fortune-sheet |

## 核心功能

### 业务管理
- ✅ 委托咨询 → 报价 → 合同 → 委托单
- ✅ 客户单位管理

### 样品管理
- ✅ 样品收样/登记
- ✅ 样品明细追踪
- ✅ 样品领用/归还

### 任务管理
- ✅ 任务分配 (手动/自动)
- ✅ 任务进度跟踪
- ✅ 委外任务管理

### 检测管理
- ✅ ELN 电子实验记录
- ✅ 检测数据录入 (Fortune-sheet 表格)
- ✅ PDF 报告生成 (EasyExcel + LibreOffice)

### 报告管理
- ✅ 报告生成/编辑
- ✅ 三级审批流程
- ✅ 报告模板管理

### 设备管理
- ✅ 设备台账
- ✅ 保养/维修/定检计划

### 财务管理
- ✅ 应收账款
- ✅ 收款/开票

### 统计报表
- ✅ 委托/样品/任务统计
- ✅ 趋势分析图表

### 系统管理
- ✅ 用户/角色/权限
- ✅ 部门管理
- ✅ 审批流程配置

## 快速开始

### Docker 一键部署

```bash
# 克隆项目
git clone https://github.com/wangpeng1017/1124lims.git
cd 1124lims

# 启动所有服务
docker-compose up -d

# 访问
# 前端: http://localhost
# 后端: http://localhost:8080
# MinIO: http://localhost:9001
```

### 本地开发

```bash
# 启动基础服务
docker-compose up -d mysql redis minio

# 后端
cd server && mvn spring-boot:run

# 前端
cd client && npm install && npm run dev
```

### 阿里云直接部署

```bash
# 服务器环境要求: Java 17, MariaDB/MySQL, Redis, Nginx, LibreOffice

# 1. 克隆代码
git clone https://github.com/wangpeng1017/1124lims.git /root/lims-app

# 2. 构建后端
cd /root/lims-app/server && mvn clean package -DskipTests

# 3. 构建前端
cd /root/lims-app/client && npm install && npm run build

# 4. 配置 systemd 服务 (/etc/systemd/system/lims.service)
# 5. 配置 nginx 反向代理
# 6. 初始化数据库: mysql lims < server/src/main/resources/db/init.sql

# 访问
# 前端: http://服务器IP:8082
# 后端: http://服务器IP:8081/api
```

## 默认账号

| 用户 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 管理员 |

## 项目文档

- [功能说明](docs/FEATURES.md) - 完整功能列表
- [开发指南](docs/DEVELOPMENT.md) - 开发规范

## 开发进度

- [x] Phase 1: 前端 UI 开发
- [x] Phase 2: 后端 API 开发
- [x] Phase 3: 前后端对接
- [x] Phase 4: Docker 部署
- [ ] Phase 5: 生产优化

## 在线演示

https://1124lims.vercel.app/

## License

MIT
