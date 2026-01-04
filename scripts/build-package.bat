@echo off
REM ============================================
REM 2LIMS 部署包打包脚本 (简化版)
REM 文件名: build-package.bat
REM ============================================

SETLOCAL EnableDelayedExpansion

SET VERSION=1.0.0
SET OUTPUT_DIR=.\deployment-packages
SET PROJECT_ROOT=%~dp0..
SET SERVER_DIR=%PROJECT_ROOT%\server
SET CLIENT_DIR=%PROJECT_ROOT%\client
SET DOCKER_DIR=%PROJECT_ROOT%\docker
SET DEPLOY_DIR=%PROJECT_ROOT%\deploy

REM 获取时间戳
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
SET TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%
SET PACKAGE_DIR=%OUTPUT_DIR%\2LIMS-deploy-v%VERSION%-%TIMESTAMP%

echo.
echo ========================================
echo     2LIMS 部署包打包工具 v%VERSION%
echo ========================================
echo.

REM 检查项目目录
if not exist "%SERVER_DIR%" (
    echo [错误] 未找到 server 目录
    pause
    exit /b 1
)
if not exist "%CLIENT_DIR%" (
    echo [错误] 未找到 client 目录
    pause
    exit /b 1
)

REM 创建输出目录
echo [准备] 创建输出目录: %PACKAGE_DIR%
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"
mkdir "%PACKAGE_DIR%"

REM ============================================
REM 1. 构建后端
REM ============================================
echo.
echo [1/6] 构建后端服务...
cd /d "%SERVER_DIR%"
call mvn clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo [错误] 后端构建失败
    pause
    exit /b 1
)

REM 复制 JAR 文件
echo [复制] 后端 JAR 文件
mkdir "%PACKAGE_DIR%\server"
for %%f in ("%SERVER_DIR%\target\*.jar") do (
    if not "%%~nxf"=="*-sources.jar" if not "%%~nxf"=="*-javadoc.jar" (
        copy "%%f" "%PACKAGE_DIR%\server\lims-server-%VERSION%.jar" >nul
        echo 已复制: %%~nxf
    )
)

REM ============================================
REM 2. 构建前端
REM ============================================
echo.
echo [2/6] 构建前端...
cd /d "%CLIENT_DIR%"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [错误] 前端构建失败
    pause
    exit /b 1
)

REM 复制前端文件
echo [复制] 前端构建文件
xcopy /E /I /Y "%CLIENT_DIR%\dist" "%PACKAGE_DIR%\client\dist" >nul

REM ============================================
REM 3. 复制数据库脚本
REM ============================================
echo.
echo [3/6] 复制数据库脚本...
mkdir "%PACKAGE_DIR%\database"
mkdir "%PACKAGE_DIR%\database\migration"

copy "%SERVER_DIR%\src\main\resources\db\init.sql" "%PACKAGE_DIR%\database\" >nul 2>&1
copy "%SERVER_DIR%\src\main\resources\db\data.sql" "%PACKAGE_DIR%\database\" >nul 2>&1
copy "%SERVER_DIR%\src\main\resources\db\testdata.sql" "%PACKAGE_DIR%\database\" >nul 2>&1
copy "%SERVER_DIR%\src\main\resources\db\business.sql" "%PACKAGE_DIR%\database\" >nul 2>&1
copy "%SERVER_DIR%\src\main\resources\db\permissions_full.sql" "%PACKAGE_DIR%\database\migration\" >nul 2>&1
echo 已复制数据库脚本

REM ============================================
REM 4. 复制 Docker 部署文件
REM ============================================
echo.
echo [4/6] 复制 Docker 部署文件...
mkdir "%PACKAGE_DIR%\docker"
copy "%DOCKER_DIR%\docker-compose.yml" "%PACKAGE_DIR%\docker\" >nul 2>&1
copy "%DOCKER_DIR%\nginx.conf" "%PACKAGE_DIR%\docker\" >nul 2>&1
copy "%DOCKER_DIR%\start-docker.bat" "%PACKAGE_DIR%\docker\" >nul 2>&1
copy "%DOCKER_DIR%\stop-docker.bat" "%PACKAGE_DIR%\docker\" >nul 2>&1
copy "%DOCKER_DIR%\logs-docker.bat" "%PACKAGE_DIR%\docker\" >nul 2>&1
copy "%DOCKER_DIR%\DOCKER_DEPLOYMENT.md" "%PACKAGE_DIR%\docker\" >nul 2>&1
echo 已复制 Docker 部署文件

REM ============================================
REM 5. 复制 Windows 部署文件
REM ============================================
echo.
echo [5/6] 复制 Windows 部署文件...
mkdir "%PACKAGE_DIR%\windows"
copy "%DEPLOY_DIR%\windows\nginx.conf" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\windows\start-lims.bat" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\windows\stop-lims.bat" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\windows\install-as-service.bat" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\windows\application.yml.template" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\windows\TROUBLESHOOTING.md" "%PACKAGE_DIR%\windows\" >nul 2>&1
copy "%DEPLOY_DIR%\WINDOWS_DEPLOYMENT.md" "%PACKAGE_DIR%\windows\" >nul 2>&1
echo 已复制 Windows 部署文件

REM ============================================
REM 6. 复制文档
REM ============================================
echo.
echo [6/6] 复制部署文档...
copy "%DEPLOY_DIR%\README.md" "%PACKAGE_DIR%\" >nul 2>&1

REM 创建快速开始文档
echo # 2LIMS 快速部署指南 > "%PACKAGE_DIR%\QUICKSTART.md"
echo. >> "%PACKAGE_DIR%\QUICKSTART.md"
echo ## 版本: %VERSION% >> "%PACKAGE_DIR%\QUICKSTART.md"
echo ## 打包时间: %date% %time% >> "%PACKAGE_DIR%\QUICKSTART.md"
echo. >> "%PACKAGE_DIR%\QUICKSTART.md"
echo ## 默认管理员账号 >> "%PACKAGE_DIR%\QUICKSTART.md"
echo - 用户名: admin >> "%PACKAGE_DIR%\QUICKSTART.md"
echo - 密码: admin123 >> "%PACKAGE_DIR%\QUICKSTART.md"
echo - 权限: 拥有系统所有操作和数据访问权限 >> "%PACKAGE_DIR%\QUICKSTART.md"
echo. >> "%PACKAGE_DIR%\QUICKSTART.md"
echo ## 快速开始 (Docker) >> "%PACKAGE_DIR%\QUICKSTART.md"
echo 1. 解压部署包 >> "%PACKAGE_DIR%\QUICKSTART.md"
echo 2. 双击运行 docker\start-docker.bat >> "%PACKAGE_DIR%\QUICKSTART.md"
echo 3. 等待30秒，浏览器自动打开 http://localhost >> "%PACKAGE_DIR%\QUICKSTART.md"
echo. >> "%PACKAGE_DIR%\QUICKSTART.md"
echo 详细说明请参考 README.md >> "%PACKAGE_DIR%\QUICKSTART.md"

echo 已复制部署文档

REM ============================================
REM 完成
REM ============================================
echo.
echo ========================================
echo     打包完成！
echo ========================================
echo.
echo 部署包位置: %PACKAGE_DIR%
echo.
echo 目录结构:
dir /B "%PACKAGE_DIR%"
echo.

pause
