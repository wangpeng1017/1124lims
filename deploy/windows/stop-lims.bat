@echo off
REM ========================================
REM 2LIMS 系统停止脚本
REM 文件名: stop-lims.bat
REM ========================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
echo    2LIMS 系统停止中...
echo ========================================
echo.

REM ========================================
REM 1. 停止 Nginx
REM ========================================
echo [停止] Nginx...
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I/N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    cd /d C:\nginx
    nginx.exe -s quit 2>nul
    timeout /t 3 /nobreak >nul

    REM 如果优雅停止失败，强制停止
    tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I/N "nginx.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo [强制] 正在强制停止 Nginx...
        taskkill /F /IM nginx.exe >nul 2>&1
    )
    echo [成功] Nginx 已停止
) else (
    echo [跳过] Nginx 未在运行
)

REM ========================================
REM 2. 停止后端服务
REM ========================================
echo.
echo [停止] 后端服务...
tasklist /FI "IMAGENAME eq java.exe" 2>NUL | find /I/N "java.exe">NUL
if "%ERRORLEVEL%"=="0" (
    REM 查找并停止LIMS后端进程（通过jar文件名判断）
    for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq java.exe" /V ^| findstr "lims-server"') do (
        set JAVA_PID=%%i
        goto :found_java
    )

    :found_java
    if defined JAVA_PID (
        taskkill /F /PID !JAVA_PID! >nul 2>&1
        echo [成功] 后端服务已停止 (PID: !JAVA_PID!)
    ) else (
        REM 如果找不到特定进程，停止所有java（谨慎使用）
        taskkill /F /IM java.exe >nul 2>&1
        echo [警告] 所有Java进程已停止
    )
) else (
    echo [跳过] 后端服务未在运行
)

REM ========================================
REM 3. 验证停止结果
REM ========================================
echo.
echo ========================================
echo    验证停止结果
echo ========================================
echo.

netstat -ano | findstr ":8081" >nul
if "%ERRORLEVEL%"=="0" (
    echo [警告] 端口 8081 仍被占用，可能有其他程序在使用
) else (
    echo [正常] 端口 8081 已释放
)

netstat -ano | findstr ":80 " | findstr "LISTENING" >nul
if "%ERRORLEVEL%"=="0" (
    echo [注意] 端口 80 仍有程序在监听（可能有其他Web服务）
) else (
    echo [正常] 端口 80 已释放
)

echo.
echo ========================================
echo    系统已停止
echo ========================================
echo.
pause
