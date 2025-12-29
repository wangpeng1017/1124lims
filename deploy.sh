#!/bin/bash
# LIMS 部署脚本 - 用于 Leaflow 平台

set -e

echo "======================================"
echo "LIMS 部署脚本"
echo "======================================"

# 配置变量
GITHUB_USER="wangpeng1017"
IMAGE_TAG="latest"
CLIENT_IMAGE="ghcr.io/${GITHUB_USER}/lims-client:${IMAGE_TAG}"
SERVER_IMAGE="ghcr.io/${GITHUB_USER}/lims-server:${IMAGE_TAG}"

# 1. 登录 GitHub Container Registry
echo ""
echo "步骤 1: 登录 ghcr.io"
echo "请运行: echo <YOUR_GITHUB_TOKEN> | docker login ghcr.io -u ${GITHUB_USER} --password-stdin"
echo ""

# 2. 构建并推送前端镜像
echo "步骤 2: 构建前端镜像"
cd client
docker build -t ${CLIENT_IMAGE} .
docker push ${CLIENT_IMAGE}
echo "前端镜像已推送: ${CLIENT_IMAGE}"
cd ..

# 3. 构建并推送后端镜像
echo ""
echo "步骤 3: 构建后端镜像"
cd server
docker build -t ${SERVER_IMAGE} .
docker push ${SERVER_IMAGE}
echo "后端镜像已推送: ${SERVER_IMAGE}"
cd ..

echo ""
echo "======================================"
echo "镜像构建完成！"
echo "======================================"
echo ""
echo "接下来请在 Leaflow 平台上操作:"
echo ""
echo "1. 创建 ghcr.io 镜像拉取密钥 (Secret -> docker-registry 类型)"
echo "   - 名称: ghcr-secret"
echo "   - Server: ghcr.io"
echo "   - Username: ${GITHUB_USER}"
echo "   - Password: 你的 GitHub Personal Access Token"
echo ""
echo "2. 按顺序 Apply 以下 YAML 文件:"
echo "   - k8s/configmap.yaml"
echo "   - k8s/secret.yaml"
echo "   - k8s/mysql.yaml"
echo "   - k8s/redis.yaml"
echo "   - k8s/minio.yaml"
echo "   - k8s/server.yaml"
echo "   - k8s/client.yaml"
echo "   - k8s/ingress.yaml"
echo ""
echo "3. 等待 MySQL 启动后，执行数据库初始化:"
echo "   连接 MySQL 终端，运行 init.sql"
echo ""
