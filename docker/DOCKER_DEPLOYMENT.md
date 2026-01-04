# 2LIMS 系统 Docker 部署指南

> 极简部署方案 - 5分钟完成系统部署

---

## 为什么选择 Docker 部署？

### 传统部署 vs Docker 部署

| 对比项 | 传统部署 | Docker 部署 |
|--------|----------|-------------|
| 安装时间 | 30-60分钟 | 2-5分钟 |
| 环境配置 | 手动安装 JDK/MySQL/Nginx | 一键启动 |
| 依赖冲突 | 可能发生 | 完全隔离 |
| 迁移难度 | 复杂 | 复制配置文件即可 |
| 更新升级 | 需要手动操作 | 重新构建镜像即可 |
| 资源占用 | 较高 | 较低 |

---

## 前置条件

### 必需软件

| 软件 | 版本要求 | 用途 |
|------|----------|------|
| **Docker Desktop** | 最新版 | 容器运行环境 |

### Docker Desktop 下载

1. 官网下载: https://www.docker.com/products/docker-desktop/
2. 下载 Windows 版本
3. 双击安装，使用默认设置

---

## 快速开始（5分钟部署）

### 第一步：准备部署文件

将以下文件/目录复制到服务器（如 `C:\lims-docker\`）：

```
C:\lims-docker\
├── docker-compose.yml              # Docker 编排文件
├── docker\
│   └── nginx.conf                   # Nginx 配置
├── server\
│   └── lims-server-1.0.0.jar       # 后端 jar 包
├── client\
│   └── dist\                        # 前端构建产物
│       ├── index.html
│       └── assets\
└── database\
    └── migration\                   # 数据库初始化脚本（可选）
```

### 第二步：启动系统

```cmd
# 打开 PowerShell 或命令提示符
cd C:\lims-docker

# 启动所有服务（首次启动会自动下载镜像，约需2-5分钟）
docker-compose up -d

# 查看启动日志
docker-compose logs -f

# 看到 "Started LimsApplication" 表示启动成功
```

### 第三步：访问系统

打开浏览器访问：`http://localhost` 或 `http://服务器IP`

**默认账号**: admin / admin123

---

## 常用命令

### 服务管理

```cmd
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f nginx
```

### 进入容器

```cmd
# 进入后端容器
docker exec -it lims-backend bash

# 进入 MySQL 容器
docker exec -it lims-mysql mysql -uroot -pRoot@123

# 进入 Nginx 容器
docker exec -it lims-nginx sh
```

### 数据库操作

```cmd
# 在宿主机直接连接 MySQL
docker exec -it lims-mysql mysql -uroot -pRoot@123 lims

# 导入 SQL 文件
docker exec -i lims-mysql mysql -uroot -pRoot@123 lims < backup.sql

# 备份数据库
docker exec lims-mysql mysqldump -uroot -pRoot@123 lims > backup.sql
```

---

## 更新升级

### 更新应用代码

```cmd
# 1. 停止服务
docker-compose down

# 2. 替换文件
#    - server/lims-server-1.0.0.jar
#    - client/dist/

# 3. 重新启动
docker-compose up -d

# 4. 清理旧镜像（可选）
docker image prune -a
```

---

## 数据持久化

### 数据备份

```cmd
# 备份 MySQL 数据
docker exec lims-mysql mysqldump -uroot -pRoot@123 lims > backup_%date%.sql

# 备份上传文件
xcopy C:\lims-docker\uploads C:\backup\uploads\ /E /I /Y
```

### 数据恢复

```cmd
# 恢复 MySQL 数据
docker exec -i lims-mysql mysql -uroot -pRoot@123 lims < backup.sql
```

---

## 常见问题

### Q1: Docker 启动失败

**检查 Docker Desktop 是否运行**
```cmd
docker version
```

### Q2: 端口被占用

**修改 docker-compose.yml 中的端口映射**
```yaml
# 如果 80 端口被占用，改为 8080
ports:
  - "8080:80"
```

### Q3: 数据库连接失败

**等待 MySQL 完全启动**
```cmd
# 查看 MySQL 健康状态
docker-compose ps

# 重启后端服务
docker-compose restart backend
```

### Q4: 内存不足

**调整 Docker 资源限制**
1. 打开 Docker Desktop
2. Settings → Resources
3. 增加 Memory（建议 4GB+）
4. 点击 "Apply & Restart"

---

## Windows Server 安装 Docker Desktop

### 1. 系统要求

- Windows Server 2019/2022
- 启用 Hyper-V 和 Containers 功能

### 2. 启用必要功能

```powershell
# 以管理员身份运行 PowerShell

# 启用 Hyper-V
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart

# 启用 Containers
Enable-WindowsOptionalFeature -Online -FeatureName Containers -All -NoRestart

# 重启服务器
Restart-Computer
```

### 3. 安装 Docker Desktop

1. 下载 Docker Desktop for Windows
2. 双击安装
3. 首次启动会提示安装 WSL 2，按提示操作
4. 安装完成后重启

---

## 卸载清理

```cmd
# 停止并删除容器
docker-compose down

# 删除数据卷（会清空数据库！）
docker-compose down -v

# 删除镜像
docker rmi $(docker images -q)

# 完全清理 Docker Desktop
# Docker Desktop → Settings → Troubleshoot → Clean / Purge data
```

---

## 生产环境建议

### 1. 修改默认密码

```yaml
# docker-compose.yml 中修改
environment:
  MYSQL_ROOT_PASSWORD: 【设置强密码】
```

### 2. 配置 HTTPS

```yaml
# 添加 443 端口映射
ports:
  - "443:443"

# 挂载 SSL 证书
volumes:
  - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem
  - ./ssl/key.pem:/etc/nginx/ssl/key.pem
```

### 3. 定期备份数据

```cmd
# 创建备份脚本 backup-docker.bat
@echo off
set BACKUP_DIR=C:\lims-backup
set DATE=%date:~0,4%%date:~5,2%%date:~8,2%

mkdir "%BACKUP_DIR%" 2>nul

docker exec lims-mysql mysqldump -uroot -pRoot@123 lims > "%BACKUP_DIR%\lims_%DATE%.sql"

echo 备份完成: %BACKUP_DIR%\lims_%DATE%.sql
```

### 4. 配置日志轮转

```yaml
# docker-compose.yml 中添加
volumes:
  - ./logs:/var/log/nginx
```

---

## 支持的操作系统

| 操作系统 | 支持情况 | 说明 |
|----------|----------|------|
| Windows Server 2019/2022 | ✅ 完全支持 | 需安装 Docker Desktop |
| Windows 10/11 Pro | ✅ 完全支持 | 需安装 Docker Desktop |
| Linux (Ubuntu/CentOS) | ✅ 完全支持 | 使用 Docker Engine |
| macOS | ✅ 完全支持 | 使用 Docker Desktop |
