@echo off
REM ========================================
REM 2LIMS Docker 停止脚本
REM 文件名: stop-docker.bat
REM ========================================

echo.
echo ========================================
REM    停止 2LIMS Docker 服务
REM ========================================
echo.

echo [停止] 正在停止所有容器...
echo.

docker-compose down

echo.
echo [完成] 所有服务已停止
echo.
echo 提示:
echo   - 数据已保留在 Docker 卷中
echo   - 重新运行 start-docker.bat 可再次启动
echo   - 使用 docker-compose down -v 可完全清除数据
echo.
pause
