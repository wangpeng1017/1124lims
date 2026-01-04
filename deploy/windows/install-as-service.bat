@echo off
REM ========================================
REM 2LIMS Windows 服务注册脚本
REM 使用 NSSM 将后端注册为 Windows 服务
REM 文件名: install-as-service.bat
REM ========================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
REM    2LIMS Windows 服务安装
REM ========================================
echo.

REM 设置变量
set SERVICE_NAME=LimsBackend
set SERVICE_DISPLAY=LIMS 后端服务
set APP_HOME=C:\lims-app
set JAR_FILE=%APP_HOME%\server\lims-server-1.0.0.jar
set JAVA_exe=C:\Program Files\Eclipse Adoptium\jdk-17.0.9-hotspot\bin\java.exe

REM ========================================
REM 1. 检查 NSSM 是否存在
REM ========================================
echo [检查] NSSM 工具...
set NSSM_PATH=%~dp0nssm.exe

if not exist "%NSSM_PATH%" (
    echo [错误] 未找到 NSSM 工具
    echo.
    echo 请从以下地址下载 NSSM:
    echo https://nssm.cc/release/nssm-2.24.zip
    echo.
    echo 下载后解压，将 nssm.exe 放到当前目录
    echo 或放到系统 PATH 环境变量包含的目录中
    pause
    exit /b 1
)

echo [找到] NSSM 工具: %NSSM_PATH%
echo.

REM ========================================
REM 2. 检查 Java 是否存在
REM ========================================
echo [检查] Java 环境...
if not exist "%JAVA_exe%" (
    echo [警告] 未找到默认Java路径: %JAVA_exe%
    echo [检测] 正在搜索 Java...

    where java >nul 2>&1
    if "%ERRORLEVEL%"=="0" (
        for /f "delims=" %%i in ('where java') do set JAVA_exe=%%i
        echo [找到] Java: !JAVA_exe!
    ) else (
        echo [错误] 未找到 Java，请先安装 JDK 17
        pause
        exit /b 1
    )
) else (
    echo [找到] Java: %JAVA_exe%
)
echo.

REM ========================================
REM 3. 检查应用文件是否存在
REM ========================================
echo [检查] 应用文件...
if not exist "%JAR_FILE%" (
    echo [错误] 未找到应用文件: %JAR_FILE%
    echo 请确认应用程序已正确部署
    pause
    exit /b 1
)
echo [找到] 应用文件: %JAR_FILE%
echo.

REM ========================================
REM 4. 检查服务是否已存在
REM ========================================
echo [检查] 现有服务...
sc query %SERVICE_NAME% >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [警告] 服务 %SERVICE_NAME% 已存在
    echo.
    set /p CONFIRM="是否要重新安装服务？(Y/N): "
    if /i not "%CONFIRM%"=="Y" (
        echo [取消] 安装已取消
        pause
        exit /b 0
    )
    echo [删除] 正在删除旧服务...
    "%NSSM_PATH%" remove %SERVICE_NAME% confirm
    timeout /t 2 /nobreak >nul
)

REM ========================================
REM 5. 创建日志目录
REM ========================================
echo [准备] 创建日志目录...
set LOG_DIR=%APP_HOME%\logs
if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
)
echo [日志目录] %LOG_DIR%
echo.

REM ========================================
REM 6. 安装服务
REM ========================================
echo [安装] 正在安装 Windows 服务...
echo.

REM 安装服务
"%NSSM_PATH%" install %SERVICE_NAME% "%JAVA_exe%" -jar "%JAR_FILE%"
if "%ERRORLEVEL%"=="0" (
    echo [成功] 服务安装成功
) else (
    echo [错误] 服务安装失败
    pause
    exit /b 1
)

REM ========================================
REM 7. 配置服务参数
REM ========================================
echo [配置] 正在配置服务参数...

REM 设置工作目录
"%NSSM_PATH%" set %SERVICE_NAME% AppDirectory "%APP_HOME%\server"

REM 设置标准输出日志
"%NSSM_PATH%" set %SERVICE_NAME% AppStdout "%LOG_DIR%\service-stdout.log"

REM 设置错误输出日志
"%NSSM_PATH%" set %SERVICE_NAME% AppStderr "%LOG_DIR%\service-stderr.log"

REM 设置日志轮转
"%NSSM_PATH%" set %SERVICE_NAME% AppRotateFiles 10
"%NSSM_PATH%" set %SERVICE_NAME% AppRotateBytes 10485760

REM 设置服务启动方式
"%NSSM_PATH%" set %SERVICE_NAME% Start SERVICE_AUTO_START

REM 设置服务描述
"%NSSM_PATH%" set %SERVICE_NAME% Description "2LIMS 实验室信息管理系统后端服务"

echo [成功] 服务配置完成
echo.

REM ========================================
REM 8. 启动服务
REM ========================================
echo [启动] 正在启动服务...
"%NSSM_PATH%" start %SERVICE_NAME%

timeout /t 5 /nobreak >nul

REM 检查服务状态
sc query %SERVICE_NAME% | findstr /C:"STATE"
echo.

echo ========================================
echo    服务安装完成
echo ========================================
echo.
echo 服务名称: %SERVICE_NAME%
echo 显示名称: %SERVICE_DISPLAY%
echo.
echo 管理命令:
echo   启动服务:   net start %SERVICE_NAME%
echo   停止服务:   net stop %SERVICE_NAME%
echo   重启服务:   nssm restart %SERVICE_NAME%
echo   卸载服务:   nssm remove %SERVICE_NAME% confirm
echo.
echo 或使用: services.msc 打开服务管理器图形界面
echo.
pause
