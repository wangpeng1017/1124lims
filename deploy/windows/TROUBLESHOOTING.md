# 2LIMS 系统故障排查手册

> 版本: 1.0
> 适用系统: Windows Server 2019

---

## 目录

1. [安装阶段问题](#安装阶段问题)
2. [启动阶段问题](#启动阶段问题)
3. [运行阶段问题](#运行阶段问题)
4. [性能问题](#性能问题)
5. [备份恢复](#备份恢复)

---

## 安装阶段问题

### 问题1.1: JDK 安装后 java 命令不可用

**症状**: 安装 JDK 后，运行 `java -version` 显示 "'java' 不是内部或外部命令"

**原因**: 环境变量未配置或未重启

**解决方案**:
```cmd
# 1. 检查JAVA_HOME是否存在
dir "C:\Program Files\Eclipse Adoptium\"

# 2. 配置系统环境变量
# 右键 "此电脑" → 属性 → 高级系统设置 → 环境变量
# 新建系统变量:
#   变量名: JAVA_HOME
#   变量值: C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot
#
# 编辑 Path 变量，添加:
#   %JAVA_HOME%\bin

# 3. 验证配置（需要重新打开命令提示符）
echo %JAVA_HOME%
java -version
```

---

### 问题1.2: MySQL 安装失败

**症状**: MySQL 安装过程中报错或安装后无法启动

**解决方案**:
```cmd
# 1. 检查是否已安装 MySQL
sc query MySQL80

# 2. 检查端口占用
netstat -ano | findstr :3306

# 3. 如端口被占用，结束占用进程
taskkill /F /PID [进程ID]

# 4. 清理后重新安装
# - 卸载 MySQL
# - 删除 C:\ProgramData\MySQL
# - 删除 C:\Program Files\MySQL
# - 重新安装
```

---

### 问题1.3: Nginx 启动闪退

**症状**: 双击 nginx.exe 后窗口一闪而过

**解决方案**:
```cmd
# 1. 使用命令行启动，查看错误信息
cd C:\nginx
nginx.exe

# 2. 常见错误：
# - 端口80被占用：修改 nginx.conf 中的 listen 端口
# - 配置文件错误：运行 nginx.exe -t 检查配置
# - 路径含中文/空格：移动到纯英文路径

# 3. 检查错误日志
type C:\nginx\logs\error.log
```

---

## 启动阶段问题

### 问题2.1: 后端启动报错 "Unable to access database"

**症状**: 启动后端时数据库连接失败

**解决方案**:
```cmd
# 1. 检查 MySQL 服务是否运行
sc query MySQL80

# 2. 测试数据库连接
mysql -uroot -p
# 输入密码后应该能进入 MySQL 命令行

# 3. 检查数据库是否创建
mysql -uroot -p -e "SHOW DATABASES LIKE 'lims';"

# 4. 检查 application.yml 配置
# 确认以下配置正确：
# url: jdbc:mysql://localhost:3306/lims
# username: root
# password: 【你的密码】
```

---

### 问题2.2: 后端启动报错 "Address already in use: 8081"

**症状**: 端口 8081 被占用

**解决方案**:
```cmd
# 1. 查找占用端口的进程
netstat -ano | findstr :8081

# 输出示例：
# TCP    0.0.0.0:8081           0.0.0.0:0              LISTENING       1234
#                                                                       ↑
#                                                                  进程ID(PID)

# 2. 查看是哪个程序占用
tasklist /FI "PID eq 1234"

# 3. 如果是旧的 Java 进程，结束它
taskkill /F /PID 1234

# 4. 或者修改 application.yml 中的端口为其他值
# server:
#   port: 8082
```

---

### 问题2.3: 页面显示 404 Not Found

**症状**: 浏览器访问显示 404 错误

**解决方案**:
```cmd
# 1. 检查前端文件是否存在
dir C:\lims-app\client\dist\index.html

# 2. 检查 Nginx 配置中的路径
cd C:\nginx
type conf\nginx.conf | findstr "root"

# 应显示: root   C:/lims-app/client/dist;

# 3. 检查 Nginx 是否运行
tasklist | findstr nginx

# 4. 重启 Nginx
cd C:\nginx
nginx.exe -s reload
```

---

### 问题2.4: API 请求返回 403 Forbidden

**症状**: 页面可以打开，但 API 请求返回 403

**原因**: Spring Security 拦截了未认证的请求

**解决方案**:
```cmd
# 这是正常的安全机制，需要登录后才能访问 API

# 1. 检查是否能正常打开登录页面
# 2. 尝试使用默认账号登录:
#    用户名: admin
#    密码: admin123

# 3. 如果无法登录，检查用户表数据:
mysql -uroot -p lims -e "SELECT id, username FROM sys_user;"
```

---

## 运行阶段问题

### 问题3.1: 上传文件失败

**症状**: 上传文件时报错或文件没有上传成功

**解决方案**:
```cmd
# 1. 检查上传目录是否存在
dir C:\lims-app\uploads

# 2. 检查目录权限
icacls "C:\lims-app\uploads"

# 3. 检查配置中的文件大小限制
# application.yml 中:
# spring:
#   servlet:
#     multipart:
#       max-file-size: 100MB

# 4. 检查 Nginx 上传大小限制
# nginx.conf 中添加:
# client_max_body_size 100m;
```

---

### 问题3.2: 报告下载失败

**症状**: 点击下载报告没有反应或下载失败

**解决方案**:
```cmd
# 1. 检查报告目录
dir C:\lims-app\reports

# 2. 检查日志文件
type C:\lims-app\logs\lims.log | findstr "报告"

# 3. 检查浏览器控制台是否有错误
# 按 F12 打开开发者工具查看 Console
```

---

### 问题3.3: 系统运行缓慢

**症状**: 页面加载慢，操作响应迟钝

**解决方案**:
```cmd
# 1. 检查服务器资源使用情况
# 打开任务管理器 (taskmgr) 查看 CPU/内存/磁盘使用

# 2. 检查数据库性能
mysql -uroot -p -e "SHOW PROCESSLIST;"

# 3. 清理日志文件（日志可能过大）
dir C:\lims-app\logs

# 4. 重启服务
net stop LimsBackend
net start LimsBackend

# 5. 考虑升级硬件配置
```

---

## 性能问题

### 4.1 数据库优化

```sql
-- 1. 检查慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 2. 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 3. 分析表
ANALYZE TABLE biz_consultation;
ANALYZE TABLE biz_quotation;

-- 4. 优化表
OPTIMIZE TABLE biz_consultation;
OPTIMIZE TABLE biz_quotation;
```

### 4.2 JVM 参数优化

```cmd
# 在启动脚本中添加 JVM 参数

java -Xms512m -Xmx1024m ^
     -XX:+UseG1GC ^
     -XX:MaxGCPauseMillis=200 ^
     -XX:+HeapDumpOnOutOfMemoryError ^
     -XX:HeapDumpPath=C:\lims-app\logs ^
     -jar lims-server-1.0.0.jar
```

---

## 备份恢复

### 数据备份

```cmd
REM ===== 数据库备份脚本 =====
REM 保存为 backup.bat

@echo off
set BACKUP_DIR=C:\lims-app\backup
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0,5%

REM 创建备份目录
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM 备份数据库
echo [备份] 正在备份数据库...
mysqldump -uroot -p lims > "%BACKUP_DIR%\lims_%TIMESTAMP%.sql"

echo [完成] 备份完成: %BACKUP_DIR%\lims_%TIMESTAMP%.sql
pause
```

### 数据恢复

```cmd
REM ===== 数据库恢复脚本 =====
REM 使用方法: restore.bat lims_20260104_120000.sql

@echo off
if "%1"=="" (
    echo 用法: restore.bat ^<备份文件名^>
    pause
    exit /b 1
)

set SQL_FILE=%1

if not exist "%SQL_FILE%" (
    echo [错误] 文件不存在: %SQL_FILE%
    pause
    exit /b 1
)

echo [警告] 即将恢复数据库，现有数据将被覆盖！
set /p CONFIRM="确认继续？(Y/N): "
if /i not "%CONFIRM%"=="Y" exit /b 0

echo [恢复] 正在恢复数据库...
mysql -uroot -p lims < "%SQL_FILE%"

echo [完成] 数据库恢复完成
pause
```

---

## 紧急故障处理

### 快速重启所有服务

```cmd
REM ===== 紧急重启脚本 =====
REM 保存为 emergency-restart.bat

@echo off
echo [紧急] 正在重启所有服务...

REM 停止服务
taskkill /F /IM nginx.exe 2>nul
taskkill /F /IM java.exe 2>nul

REM 等待进程完全停止
timeout /t 5 /nobreak >nul

REM 启动服务
cd C:\nginx
start nginx.exe

cd C:\lims-app\server
start /B java -jar lims-server-1.0.0.jar

echo [完成] 服务已重启
echo 请等待 30 秒后访问系统
pause
```

### 完全重置系统

```cmd
REM ===== 系统重置脚本 =====
REM 仅在必要时使用！

@echo off
echo [警告] 此操作将清除所有数据并重新初始化系统！
set /p CONFIRM="确认继续？输入 YES 确认: "
if not "%CONFIRM%"=="YES" exit /b 0

REM 1. 停止所有服务
echo [停止] 停止所有服务...
taskkill /F /IM nginx.exe 2>nul
taskkill /F /IM java.exe 2>nul

REM 2. 删除并重建数据库
echo [重置] 重建数据库...
mysql -uroot -p -e "DROP DATABASE IF EXISTS lims; CREATE DATABASE lims CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

REM 3. 执行初始化脚本
echo [初始化] 执行数据库脚本...
for %%f in (C:\lims-app\database\migration\*.sql) do (
    echo [执行] %%f
    mysql -uroot -p lims < "%%f"
)

REM 4. 重启服务
echo [启动] 重启服务...
call C:\lims-app\scripts\start-lims.bat

echo [完成] 系统已重置
echo 默认账号: admin / admin123
pause
```

---

## 联系支持

当以上方法都无法解决问题时，请收集以下信息联系技术支持：

1. 系统信息
   ```cmd
   systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
   ```

2. Java 版本
   ```cmd
   java -version
   ```

3. 错误日志
   ```
   C:\lims-app\logs\lims.log
   C:\lims-app\logs\service-error.log
   C:\nginx\logs\error.log
   ```

4. 错误截图
   - 完整的错误信息
   - 操作步骤描述

5. 配置文件（隐藏敏感信息）
   - application.yml
   - nginx.conf
