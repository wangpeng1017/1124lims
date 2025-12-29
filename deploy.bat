@echo off
REM LIMS 部署脚本 - Windows 版本

echo ======================================
echo LIMS 部署脚本
echo ======================================

set GITHUB_USER=wangpeng1017
set IMAGE_TAG=latest
set CLIENT_IMAGE=ghcr.io/%GITHUB_USER%/lims-client:%IMAGE_TAG%
set SERVER_IMAGE=ghcr.io/%GITHUB_USER%/lims-server:%IMAGE_TAG%

echo.
echo 步骤 1: 请先登录 ghcr.io
echo 运行: echo YOUR_GITHUB_TOKEN ^| docker login ghcr.io -u %GITHUB_USER% --password-stdin
echo.
pause

echo.
echo 步骤 2: 构建前端镜像
cd client
docker build -t %CLIENT_IMAGE% .
if %errorlevel% neq 0 (
    echo 前端构建失败!
    exit /b 1
)
docker push %CLIENT_IMAGE%
echo 前端镜像已推送: %CLIENT_IMAGE%
cd ..

echo.
echo 步骤 3: 构建后端镜像
cd server
docker build -t %SERVER_IMAGE% .
if %errorlevel% neq 0 (
    echo 后端构建失败!
    exit /b 1
)
docker push %SERVER_IMAGE%
echo 后端镜像已推送: %SERVER_IMAGE%
cd ..

echo.
echo ======================================
echo 镜像构建完成!
echo ======================================
echo.
echo 接下来请在 Leaflow 平台上操作:
echo.
echo 1. 创建 ghcr.io 镜像拉取密钥 (Secrets - docker-registry 类型)
echo    - 名称: ghcr-secret
echo    - Server: ghcr.io
echo    - Username: %GITHUB_USER%
echo    - Password: 你的 GitHub Personal Access Token
echo.
echo 2. 按顺序 Apply 以下 YAML 文件:
echo    - k8s/configmap.yaml
echo    - k8s/secret.yaml
echo    - k8s/mysql.yaml
echo    - k8s/redis.yaml
echo    - k8s/minio.yaml
echo    - k8s/server.yaml
echo    - k8s/client.yaml
echo    - k8s/ingress.yaml
echo.
pause
