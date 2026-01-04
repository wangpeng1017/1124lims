@echo off
REM ========================================
REM 2LIMS 系统启动脚本
REM 文件名: start-lims.bat
REM ========================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
echo    2LIMS 系统启动中...
echo ========================================
echo.

REM 设置变量
set APP_HOME=C:\lims-app
set JAR_FILE=%APP_HOME%\server\lims-server-1.0.0.jar
set NGINX_HOME=C:\nginx
set LOG_DIR=%APP_HOME%\logs

REM 检查目录是否存在
if not exist "%APP_HOME%" (
    echo [错误] 应用目录不存在: %APP_HOME%
    echo 请先确认应用程序已正确部署
    pause
    exit /b 1
)

REM 创建日志目录
if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
    echo [创建] 日志目录: %LOG_DIR%
)

REM ========================================
REM 1. 检查后端是否已运行
REM ========================================
echo [检查] 后端服务状态...
tasklist /FI "IMAGENAME eq java.exe" 2>NUL | find /I/N "java.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [跳过] 后端服务已在运行
    goto :start_nginx
) else (
    echo [启动] 后端服务...
    cd /d "%APP_HOME%\server"

    REM 使用 start 命令在后台启动Java应用
    start /B "" java -Xms512m -Xmx1024m -jar "%JAR_FILE%" >"%LOG_DIR%\backend.log" 2>&1

    REM 等待后端启动
    echo [等待] 后端服务启动中...
    timeout /t 10 /nobreak >nul

    REM 检查是否启动成功
    tasklist /FI "IMAGENAME eq java.exe" 2>NUL | find /I/N "java.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo [成功] 后端服务启动成功
    ) else (
        echo [警告] 后端服务启动可能失败，请查看日志: %LOG_DIR%\backend.log
    )
)

:start_nginx
REM ========================================
REM 2. 启动 Nginx
REM ========================================
echo.
echo [检查] Nginx 状态...
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I/N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [跳过] Nginx 已在运行，执行重载...
    cd /d "%NGINX_HOME%"
    nginx.exe -s reload
    echo [成功] Nginx 配置已重载
) else (
    echo [启动] Nginx...
    cd /d "%NGINX_HOME%"
    start "" nginx.exe
    timeout /t 3 /nobreak >nul
    echo [成功] Nginx 启动成功
)

REM ========================================
REM 3. 检查服务状态
REM ========================================
echo.
echo ========================================
echo    服务状态检查
echo ========================================
echo.

REM 检查端口占用
echo [端口] 检查服务端口...
netstat -ano | findstr ":8081" >nul
if "%ERRORLEVEL%"=="0" (
    echo [正常] 后端端口 8081 已监听
) else (
    echo [错误] 后端端口 8081 未监听，请检查后端服务
)

netstat -ano | findstr ":80 " >nul
if "%ERRORLEVEL%"=="0" (
    echo [正常] Web端口 80 已监听
) else (
    echo [错误] Web端口 80 未监听，请检查Nginx
)

echo.
echo ========================================
echo    系统启动完成
echo ========================================
echo.
echo 访问地址:
echo   - 本地访问: http://localhost
echo   - 局域网访问: http://[服务器IP]
echo.
echo 日志位置: %LOG_DIR%
echo.
echo 按任意键关闭此窗口...
pause >nul
