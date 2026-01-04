@echo off
REM ========================================
REM 2LIMS Docker 日志查看脚本
REM 文件名: logs-docker.bat
REM ========================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
REM    2LIMS 日志查看工具
REM ========================================
echo.
echo 请选择要查看的服务日志:
echo.
echo   1. 所有服务
echo   2. 后端服务 (backend)
echo   3. 数据库服务 (mysql)
echo   4. Web服务器 (nginx)
echo   5. 退出
echo.

set /p CHOICE="请输入选项 (1-5): "

if "%CHOICE%"=="1" (
    echo.
    echo [显示] 所有服务日志 (按 Ctrl+C 退出)
    echo.
    docker-compose logs -f
) else if "%CHOICE%"=="2" (
    echo.
    echo [显示] 后端服务日志 (按 Ctrl+C 退出)
    echo.
    docker-compose logs -f backend
) else if "%CHOICE%"=="3" (
    echo.
    echo [显示] 数据库日志 (按 Ctrl+C 退出)
    echo.
    docker-compose logs -f mysql
) else if "%CHOICE%"=="4" (
    echo.
    echo [显示] Web服务器日志 (按 Ctrl+C 退出)
    echo.
    docker-compose logs -f nginx
) else if "%CHOICE%"=="5" (
    exit /b 0
) else (
    echo.
    echo [错误] 无效的选项
    pause
)
