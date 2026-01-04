@echo off
REM ========================================
REM 2LIMS Docker 一键启动脚本
REM 文件名: start-docker.bat
REM ========================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
REM    2LIMS Docker 快速部署
REM ========================================
echo.

REM 设置变量
set DOCKER_COMPOSE_FILE=docker-compose.yml
set LOG_DIR=logs

REM ========================================
REM 1. 检查 Docker 是否安装
REM ========================================
echo [检查] Docker 环境...
docker --version >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [成功] Docker 已安装

    REM 检查 Docker 是否运行
    docker ps >nul 2>&1
    if "%ERRORLEVEL%"=="0" (
        echo [正常] Docker 服务正在运行
    ) else (
        echo [提示] 请先启动 Docker Desktop
        pause
        exit /b 1
    )
) else (
    echo [错误] 未找到 Docker
    echo.
    echo 请先安装 Docker Desktop:
    echo 1. 访问 https://www.docker.com/products/docker-desktop/
    echo 2. 下载并安装 Docker Desktop for Windows
    echo 3. 启动 Docker Desktop
    echo.
    pause
    exit /b 1
)

echo.

REM ========================================
REM 2. 检查部署文件
REM ========================================
echo [检查] 部署文件...

if not exist "%DOCKER_COMPOSE_FILE%" (
    echo [错误] 未找到 docker-compose.yml
    pause
    exit /b 1
)

if not exist "server\lims-server-1.0.0.jar" (
    echo [警告] 未找到后端 jar 包，请确保文件已正确部署
)

if not exist "client\dist\index.html" (
    echo [警告] 未找到前端文件，请确保文件已正确部署
)

echo [完成] 部署文件检查完成
echo.

REM ========================================
REM 3. 创建必要目录
REM ========================================
echo [准备] 创建必要目录...
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "uploads" mkdir "uploads"
if not exist "reports" mkdir "reports"
echo [完成] 目录创建完成
echo.

REM ========================================
REM 4. 启动服务
REM ========================================
echo [启动] 正在启动服务...
echo.

REM 启动 Docker Compose
docker-compose up -d

echo.
echo ========================================
REM    服务启动中，请稍候...
REM ========================================

echo.
echo [等待] 等待服务启动（约30秒）...
timeout /t 30 /nobreak >nul

REM ========================================
REM 5. 检查服务状态
REM ========================================
echo.
echo ========================================
REM    服务状态检查
REM ========================================
echo.

docker-compose ps

echo.
echo [检查] 服务健康状态...

REM 检查 MySQL
docker ps | findstr "lims-mysql" >nul
if "%ERRORLEVEL%"=="0" (
    echo [正常] MySQL 容器正在运行
) else (
    echo [错误] MySQL 容器未运行
)

REM 检查后端
docker ps | findstr "lims-backend" >nul
if "%ERRORLEVEL%"=="0" (
    echo [正常] 后端容器正在运行
) else (
    echo [错误] 后端容器未运行
)

REM 检查 Nginx
docker ps | findstr "lims-nginx" >nul
if "%ERRORLEVEL%"=="0" (
    echo [正常] Nginx 容器正在运行
) else (
    echo [错误] Nginx 容器未运行
)

echo.
echo ========================================
REM    部署完成
REM ========================================
echo.
echo 访问地址:
echo   - 本地访问: http://localhost
echo   - 局域网访问: http://[服务器IP]
echo.
echo 默认账号: admin / admin123
echo.
echo 常用命令:
echo   查看日志: docker-compose logs -f
echo   停止服务: docker-compose down
echo   重启服务: docker-compose restart
echo.
echo 按任意键打开浏览器...
pause >nul

REM 自动打开浏览器
start http://localhost
