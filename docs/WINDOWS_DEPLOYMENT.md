# 2LIMS 系统Windows Server 2019 部署手册

> 版本: 1.0
> 更新时间: 2026-01-04
> 适用系统: Windows Server 2019 / Windows 10/11

---

## 目录

1. [系统要求](#系统要求)
2. [前置准备](#前置准备)
3. [安装步骤](#安装步骤)
4. [配置说明](#配置说明)
5. [服务管理](#服务管理)
6. [故障排查](#故障排查)

---

## 系统要求

### 硬件要求

| 配置 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 2核 | 4核及以上 |
| 内存 | 4GB | 8GB及以上 |
| 硬盘 | 20GB 可用空间 | 50GB及以上 SSD |
| 网络 | 100Mbps | 1Gbps |

### 软件要求

| 软件 | 版本 | 必需/可选 | 用途 |
|------|------|-----------|------|
| Windows Server | 2019/2022 | 必需 | 操作系统 |
| JDK | 17 (LTS) | 必需 | 运行后端服务 |
| MySQL Server | 8.0+ | 必需 | 数据库 |
| Nginx | 1.20+ | 推荐 | Web服务器 |
| 7-Zip | 最新 | 推荐 | 解压工具 |
| NSSM | 2.24+ | 推荐 | Windows服务管理 |

---

## 前置准备

### 1. 下载安装包

请在部署前下载以下软件：

| 软件 | 下载地址 | 文件大小 |
|------|----------|----------|
| JDK 17 (Eclipse Temurin) | https://adoptium.net/temurin/releases/?version=17 | ~200MB |
| MySQL 8.0 Community | https://dev.mysql.com/downloads/mysql/ | ~400MB |
| Nginx for Windows | http://nginx.org/en/download.html | ~2MB |
| 7-Zip | https://www.7-zip.org/download.html | ~1.5MB |
| NSSM | https://nssm.cc/release/nssm-2.24.zip | ~300KB |

### 2. 准备部署文件

从开发机打包以下文件到部署服务器：

```
lims-deploy-package.zip
├── server/
│   └── lims-server-1.0.0.jar          # 后端可执行文件
├── client/
│   └── dist/                           # 前端静态文件
│       ├── index.html
│       ├── assets/
│       └── ...
├── database/
│   └── migration/                      # 数据库初始化脚本
│       ├── create_biz_consultation_table.sql
│       ├── create_biz_quotation_table.sql
│       └── ...
├── config/
│   ├── nginx.conf                      # Nginx配置模板
│   └── application.yml.template        # 应用配置模板
├── scripts/
│   ├── install-as-service.bat          # 注册Windows服务脚本
│   ├── start-lims.bat                  # 启动脚本
│   └── stop-lims.bat                   # 停止脚本
└── docs/
    └── WINDOWS_DEPLOYMENT.md           # 本文档
```

---

## 安装步骤

### 第一阶段：安装基础软件（约30分钟）

#### 1.1 安装 JDK 17

1. 运行下载的 JDK 安装程序
2. 安装路径建议: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\`
3. 安装完成后配置环境变量：
   - 打开: 控制面板 → 系统 → 高级系统设置 → 环境变量
   - 新建系统变量 `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`
   - 编辑系统变量 `Path`，添加 `%JAVA_HOME%\bin`

4. 验证安装：打开命令提示符
   ```cmd
   java -version
   # 应显示: openjdk version "17.0.x"
   ```

#### 1.2 安装 MySQL 8.0

1. 运行 MySQL Installer
2. 选择 "Developer Default" 安装类型
3. **重要设置**：
   - Root密码: `请记住此密码！`（建议: Lims@2024）
   - Windows Service: 启用
   - 开机自启: 启用
4. 端口: `3306`（默认）
5. 字符集: 选择 `utf8mb4`

6. 验证安装：
   ```cmd
   mysql -uroot -p
   # 输入密码后进入 MySQL 命令行
   ```

#### 1.3 安装 Nginx

1. 解压 nginx-x.x.x.zip 到 `C:\nginx\`
2. **注意**: Nginx 目录路径**不能包含中文和空格**
3. 测试运行：
   ```cmd
   cd C:\nginx
   nginx.exe
   ```
4. 浏览器访问 `http://localhost`，看到 "Welcome to nginx!" 页面即成功
5. 停止 Nginx：
   ```cmd
   nginx.exe -s quit
   ```

#### 1.4 安装 7-Zip（可选）

1. 运行安装程序，使用默认设置即可

---

### 第二阶段：部署应用文件（约15分钟）

#### 2.1 创建目录结构

```cmd
# 在 C 盘根目录创建以下结构
C:\lims-app\
├── server\           # 后端程序
├── client\           # 前端文件
├── database\         # 数据库脚本
├── config\           # 配置文件
├── scripts\          # 脚本文件
└── logs\             # 日志文件
```

#### 2.2 复制文件

1. 将 `lims-server-1.0.0.jar` 复制到 `C:\lims-app\server\`
2. 将 `dist` 目录下的所有内容复制到 `C:\lims-app\client\`
3. 将数据库脚本复制到 `C:\lims-app\database\migration\`
4. 将配置文件复制到 `C:\lims-app\config\`

---

### 第三阶段：初始化数据库（约10分钟）

#### 3.1 创建数据库

使用 MySQL Workbench 或命令行：

```cmd
mysql -uroot -p
# 输入密码后执行:

CREATE DATABASE lims CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lims;

-- 显示创建结果
SHOW DATABASES;
```

#### 3.2 执行数据库脚本

按以下顺序执行 SQL 脚本：

```cmd
mysql -uroot -p lims < C:\lims-app\database\migration\create_biz_consultation_table.sql
mysql -uroot -p lims < C:\lims-app\database\migration\create_biz_quotation_table.sql
# ... 其他表的脚本
```

或在 MySQL Workbench 中逐个打开 `.sql` 文件执行。

---

### 第四阶段：配置应用（约10分钟）

#### 4.1 配置 application.yml

1. 复制 `application.yml.template` 为 `application.yml`
2. 修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lims?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 【填写你的MySQL密码】
```

3. 将 `application.yml` 放到 `C:\lims-app\server\` 目录

#### 4.2 配置 Nginx

1. 编辑 `C:\nginx\conf\nginx.conf`（详见下方配置说明章节）
2. 修改完成后测试配置：
   ```cmd
   cd C:\nginx
   nginx.exe -t
   # 显示 "syntax is OK" 即配置正确
   ```

---

### 第五阶段：启动测试（约10分钟）

#### 5.1 启动后端服务

```cmd
cd C:\lims-app\server
java -jar lims-server-1.0.0.jar
```

**成功标志**：看到类似以下的日志输出：
```
Started LimsApplication in 15.234 seconds
Tomcat started on port(s): 8081 (http)
```

#### 5.2 启动 Nginx

```cmd
cd C:\nginx
nginx.exe
```

#### 5.3 访问测试

1. 打开浏览器访问: `http://localhost` 或 `http://服务器IP`
2. 应看到登录页面
3. 登录测试（默认账号见系统说明）

---

## 配置说明

### Nginx 配置文件 (C:\nginx\conf\nginx.conf)

```nginx
# 详见 Nginx 配置说明章节
```

### application.yml 配置说明

```yaml
server:
  port: 8081                    # 后端服务端口
  servlet:
    context-path: /             # 上下文路径

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lims
    username: root
    password: 【MySQL密码】
    driver-class-name: com.mysql.cj.jdbc.Driver

# 日志配置
logging:
  level:
    com.lims: info
  file:
    name: C:/lims-app/logs/lims.log
```

---

## 服务管理

### 方式一：使用脚本管理

在 `C:\lims-app\scripts\` 目录下：

```cmd
# 启动系统
start-lims.bat

# 停止系统
stop-lims.bat
```

### 方式二：注册为 Windows 服务（推荐）

使用 NSSM 将 Java 应用注册为系统服务：

```cmd
# 下载并解压 NSSM

# 安装为服务
nssm install LimsBackend java -jar "C:\lims-app\server\lims-server-1.0.0.jar"

# 设置工作目录
nssm set LimsBackend AppDirectory C:\lims-app\server

# 设置日志输出
nssm set LimsBackend AppStdout C:\lims-app\logs\stdout.log
nssm set LimsBackend AppStderr C:\lims-app\logs\stderr.log

# 设置服务启动方式
nssm set LimsBackend Start SERVICE_AUTO_START

# 启动服务
nssm start LimsBackend

# 查看服务状态
services.msc
# 找到 "LimsBackend" 服务，右键可以启动/停止/重启
```

### 开机自启动

1. **Nginx**: 创建快捷方式放到 `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp\`
2. **LimsBackend**: 使用 NSSM 安装为服务后自动开机启动

---

## 故障排查

### 问题1: 后端无法启动

**症状**: 运行 `java -jar lims-server-1.0.0.jar` 后报错退出

**排查步骤**:
```cmd
# 1. 检查JDK版本
java -version

# 2. 检查数据库连接
mysql -uroot -p -e "SELECT 1"

# 3. 查看详细日志
java -jar lims-server-1.0.0.jar --logging.level.root=DEBUG
```

**常见原因**:
- JDK版本不是17
- MySQL密码错误
- 数据库未创建
- 8081端口被占用

### 问题2: 页面404 Not Found

**症状**: 浏览器访问显示404

**排查步骤**:
```cmd
# 1. 检查 Nginx 是否运行
tasklist | findstr nginx

# 2. 检查前端文件是否存在
dir C:\lims-app\client\dist\index.html

# 3. 检查 Nginx 配置
cd C:\nginx
nginx.exe -t
```

### 问题3: API请求失败

**症状**: 页面可以打开，但功能不正常，控制台显示API错误

**排查步骤**:
```cmd
# 1. 检查后端是否运行
tasklist | findstr java

# 2. 检查端口
netstat -ano | findstr :8081

# 3. 检查 Nginx 代理配置
# 确认 nginx.conf 中 proxy_pass 配置正确
```

### 问题4: 数据库连接失败

**症状**: 日志显示 "Could not open JDBC Connection"

**解决方案**:
```cmd
# 1. 检查 MySQL 服务
sc query MySQL80

# 2. 检查防火墙
# Windows Defender 防火墙 → 允许应用通过防火墙 → MySQL

# 3. 测试连接
mysql -uroot -p -e "SELECT VERSION();"
```

### 问题5: 端口被占用

**症状**: "Address already in use: 8081"

**解决方案**:
```cmd
# 查找占用端口的进程
netstat -ano | findstr :8081

# 结束进程（PID从上一条命令获取）
taskkill /F /PID [进程ID]

# 或修改 application.yml 中的端口
```

---

## 附录

### A. 常用命令速查

```cmd
# Java 相关
java -version                    # 查看Java版本
jps                              # 查看Java进程

# MySQL 相关
mysql -uroot -p                  # 登录MySQL
mysql -uroot -p lims < file.sql  # 执行SQL脚本

# Nginx 相关
nginx.exe                        # 启动
nginx.exe -s reload              # 重启
nginx.exe -s quit                # 停止
nginx.exe -t                     # 测试配置

# 服务相关
services.msc                     # 服务管理器
sc query [服务名]                 # 查看服务状态
sc start [服务名]                 # 启动服务
sc stop [服务名]                  # 停止服务

# 网络相关
netstat -ano | findstr :8081     # 查看端口占用
ping 127.0.0.1                    # 测试网络
```

### B. 默认账号信息

| 系统 | 用户名 | 默认密码 | 说明 |
|------|--------|----------|------|
| MySQL | root | 安装时设置 | 请妥善保管 |
| 2LIMS | admin | admin123 | 首次登录请修改 |

### C. 目录权限设置

如果遇到权限问题，请确保以下目录有足够权限：

```cmd
# 授予完全控制权限
icacls "C:\lims-app" /grant Users:F /t
```

### D. 备份策略

建议定期备份以下内容：

1. **数据库备份**:
   ```cmd
   mysqldump -uroot -p lims > C:\backup\lims_%date:~0,10%.sql
   ```

2. **应用备份**:
   - `C:\lims-app\server\` 目录
   - `C:\lims-app\config\` 目录

---

## 技术支持

如遇到本文档未覆盖的问题，请联系技术支持，并提供以下信息：

1. 系统版本: `winver`
2. Java版本: `java -version`
3. 错误截图或日志
4. 问题复现步骤

---

**文档版本**: 1.0
**最后更新**: 2026-01-04
