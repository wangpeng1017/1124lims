# ============================================
# 2LIMS 自动化部署包打包脚本
# 文件名: build-deployment-package.ps1
# 说明: 自动构建前后端并打包成部署包
# ============================================

param(
    [string]$Version = "1.0.0",
    [string]$OutputPath = ".\deployment-packages",
    [switch]$SkipBuild = $false,
    [switch]$DockerOnly = $false,
    [switch]$WindowsOnly = $false
)

$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Step { Write-ColorOutput Cyan "`n=== $args ===" }
function Write-Success { Write-ColorOutput Green "✓ $args" }
function Write-Warning { Write-ColorOutput Yellow "⚠ $args" }
function Write-Error { Write-ColorOutput Red "✗ $args" }

# 获取脚本目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-ColorOutput Cyan "========================================"
Write-ColorOutput Cyan "    2LIMS 部署包打包工具 v$Version"
Write-ColorOutput Cyan "========================================"
Write-Host ""

# 设置路径
$ServerDir = "$ProjectRoot\server"
$ClientDir = "$ProjectRoot\client"
$DockerDir = "$ProjectRoot\docker"
$DeployDir = "$ProjectRoot\deploy"

# 检查必要目录
Write-Step "检查项目结构"
$RequiredDirs = @($ServerDir, $ClientDir, $DockerDir, $DeployDir)
foreach ($dir in $RequiredDirs) {
    if (-not (Test-Path $dir)) {
        Write-Error "缺少必要目录: $dir"
        exit 1
    }
}
Write-Success "项目结构检查完成"

# 创建输出目录
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$PackageDir = "$OutputPath\2LIMS-deploy-v$Version-$Timestamp"
New-Item -ItemType Directory -Force -Path $PackageDir | Out-Null
Write-Success "输出目录: $PackageDir"

# ============================================
# 1. 构建后端
# ============================================
if (-not $SkipBuild) {
    Write-Step "构建后端服务"

    Push-Location $ServerDir

    # 检查 Maven
    try {
        mvn --version | Out-Null
    } catch {
        Write-Error "Maven 未安装或未添加到 PATH"
        Pop-Location
        exit 1
    }

    # 清理并打包
    Write-Host "执行: mvn clean package -DskipTests"
    $Result = mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Error "后端构建失败"
        Pop-Location
        exit 1
    }

    Pop-Location
    Write-Success "后端构建完成"

    # 查找生成的 JAR 文件
    $JarFile = Get-ChildItem -Path "$ServerDir\target" -Filter "*.jar" | Where-Object { $_.Name -notlike "*-sources.jar" -and $_.Name -notlike "*-javadoc.jar" } | Select-Object -First 1
    if (-not $JarFile) {
        Write-Error "未找到编译后的 JAR 文件"
        exit 1
    }

    # 复制 JAR 到部署包
    $ServerPackageDir = "$PackageDir\server"
    New-Item -ItemType Directory -Force -Path $ServerPackageDir | Out-Null
    Copy-Item -Path $JarFile.FullName -Destination "$ServerPackageDir\lims-server-$Version.jar"
    Write-Success "已复制: $($JarFile.Name) -> server/lims-server-$Version.jar"
}

# ============================================
# 2. 构建前端
# ============================================
if (-not $SkipBuild) {
    Write-Step "构建前端"

    Push-Location $ClientDir

    # 检查 Node.js
    try {
        node --version | Out-Null
    } catch {
        Write-Error "Node.js 未安装或未添加到 PATH"
        Pop-Location
        exit 1
    }

    # 安装依赖（如果需要）
    if (-not (Test-Path "$ClientDir\node_modules")) {
        Write-Host "安装前端依赖..."
        npm install
    }

    # 构建前端
    Write-Host "执行: npm run build"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "前端构建失败"
        Pop-Location
        exit 1
    }

    Pop-Location
    Write-Success "前端构建完成"

    # 复制前端构建产物
    $ClientPackageDir = "$PackageDir\client"
    if (Test-Path "$ClientDir\dist") {
        Copy-Item -Path "$ClientDir\dist" -Destination "$ClientPackageDir" -Recurse
        Write-Success "已复制: client/dist -> client/"
    } else {
        Write-Warning "未找到前端构建产物目录: client/dist"
    }
}

# ============================================
# 3. 复制数据库脚本
# ============================================
Write-Step "复制数据库脚本"

$DatabasePackageDir = "$PackageDir\database"
New-Item -ItemType Directory -Force -Path $DatabasePackageDir | Out-Null
$MigrationDir = "$DatabasePackageDir\migration"
New-Item -ItemType Directory -Force -Path $MigrationDir | Out-Null

# 复制初始化脚本
$InitScripts = @("init.sql", "data.sql", "testdata.sql", "business.sql")
foreach ($script in $InitScripts) {
    $SourcePath = "$ServerDir\src\main\resources\db\$script"
    if (Test-Path $SourcePath) {
        Copy-Item -Path $SourcePath -Destination "$DatabasePackageDir\$script"
        Write-Success "已复制: db/$script"
    }
}

# 复制完整权限脚本
if (Test-Path "$ServerDir\src\main\resources\db\permissions_full.sql") {
    Copy-Item -Path "$ServerDir\src\main\resources\db\permissions_full.sql" -Destination "$MigrationDir\"
    Write-Success "已复制: permissions_full.sql"
}

# 复制迁移脚本（如果有）
if (Test-Path "$ServerDir\src\main\resources\db\migration") {
    Get-ChildItem -Path "$ServerDir\src\main\resources\db\migration" -Filter "*.sql" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "$MigrationDir\"
    }
    $Count = (Get-ChildItem -Path "$MigrationDir" -Filter "*.sql").Count
    if ($Count -gt 0) {
        Write-Success "已复制 $Count 个迁移脚本"
    }
}

# ============================================
# 4. 复制 Docker 部署文件
# ============================================
if (-not $WindowsOnly) {
    Write-Step "复制 Docker 部署文件"

    $DockerPackageDir = "$PackageDir\docker"
    New-Item -ItemType Directory -Force -Path $DockerPackageDir | Out-Null

    $DockerFiles = @(
        "docker-compose.yml",
        "nginx.conf",
        "start-docker.bat",
        "stop-docker.bat",
        "logs-docker.bat",
        "DOCKER_DEPLOYMENT.md"
    )

    foreach ($file in $DockerFiles) {
        $SourcePath = "$DockerDir\$file"
        if (Test-Path $SourcePath) {
            Copy-Item -Path $SourcePath -Destination "$DockerPackageDir\$file"
            Write-Success "已复制: docker/$file"
        }
    }
}

# ============================================
# 5. 复制 Windows 部署文件
# ============================================
if (-not $DockerOnly) {
    Write-Step "复制 Windows 部署文件"

    $WindowsPackageDir = "$PackageDir\windows"
    New-Item -ItemType Directory -Force -Path $WindowsPackageDir | Out-Null

    $WindowsFiles = @(
        "nginx.conf",
        "start-lims.bat",
        "stop-lims.bat",
        "install-as-service.bat",
        "application.yml.template",
        "TROUBLESHOOTING.md"
    )

    foreach ($file in $WindowsFiles) {
        $SourcePath = "$DeployDir\windows\$file"
        if (Test-Path $SourcePath) {
            Copy-Item -Path $SourcePath -Destination "$WindowsPackageDir\$file"
            Write-Success "已复制: windows/$file"
        }
    }

    # 复制 Windows 部署文档
    if (Test-Path "$DeployDir\WINDOWS_DEPLOYMENT.md") {
        Copy-Item -Path "$DeployDir\WINDOWS_DEPLOYMENT.md" -Destination "$WindowsPackageDir\WINDOWS_DEPLOYMENT.md"
        Write-Success "已复制: WINDOWS_DEPLOYMENT.md"
    }
}

# ============================================
# 6. 复制部署文档
# ============================================
Write-Step "复制部署文档"

$DocsPackageDir = "$PackageDir\docs"
New-Item -ItemType Directory -Force -Path $DocsPackageDir | Out-Null

if (Test-Path "$DeployDir\README.md") {
    Copy-Item -Path "$DeployDir\README.md" -Destination "$PackageDir\README.md"
    Write-Success "已复制: README.md"
}

# 创建快速开始指南
$QuickStartContent = @"
# 2LIMS 快速部署指南

## 版本信息
- 版本: $Version
- 打包时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 部署方式

### 方式一：Docker 部署（推荐）

**前置要求**:
- Docker Desktop 已安装并运行

**部署步骤**:
1. 解压部署包到目标目录（如 `C:\lims-docker\`）
2. 双击运行 `docker\start-docker.bat`
3. 等待约 30 秒，浏览器自动打开
4. 使用 `admin` / `admin123` 登录

**快速命令**:
```cmd
cd docker
start-docker.bat
```

### 方式二：Windows 原生部署

**前置要求**:
- JDK 17
- MySQL 8.0
- Nginx（可选，用于静态资源）

**部署步骤**:
1. 解压部署包到目标目录（如 `C:\lims-app\`）
2. 安装并配置 MySQL 8.0
3. 导入 `database/init.sql` 和 `data.sql`
4. 修改 `windows/application.yml.template` 中的数据库配置
5. 双击运行 `windows\start-lims.bat`

详细步骤请参考 `windows/WINDOWS_DEPLOYMENT.md`

## 默认账号

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 系统管理员 | admin | admin123 | 全部数据和操作权限 |

**管理员权限说明**:
- 代码层面: `PermissionService.hasPermission()` 对 admin 角色直接返回 `true`
- 数据层面: `data_scope=1` 表示可访问全部数据
- 可执行系统中任何操作，包括用户管理、角色管理、权限配置等

## 常见问题

### Q: Docker 启动失败？
A: 检查 Docker Desktop 是否运行，使用 `docker ps` 查看容器状态

### Q: 数据库连接失败？
A: 检查 MySQL 服务是否启动，用户名密码是否正确

### Q: 端口被占用？
A: 修改 `docker-compose.yml` 或 `application.yml` 中的端口配置

## 技术支持

如遇问题，请联系技术支持并提供:
1. 部署方式（Docker / Windows）
2. 错误截图
3. 日志文件
"@

$QuickStartContent | Out-File -FilePath "$PackageDir\QUICKSTART.md" -Encoding UTF8
Write-Success "已创建: QUICKSTART.md"

# ============================================
# 7. 生成版本信息文件
# ============================================
$VersionInfo = @{
    version = $Version
    buildTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    buildNumber = $Timestamp
    gitCommit = try { git -C $ProjectRoot rev-parse --short HEAD } catch { "N/A" }
    gitBranch = try { git -C $ProjectRoot rev-parse --abbrev-ref HEAD } catch { "N/A" }
}

$VersionInfo | ConvertTo-Json | Out-File -FilePath "$PackageDir\version.json" -Encoding UTF8
Write-Success "已创建: version.json"

# ============================================
# 8. 创建 ZIP 压缩包
# ============================================
Write-Step "创建压缩包"

$ZipPath = "$OutputPath\2LIMS-deploy-v$Version-$Timestamp.zip"

# 检查是否有 7-Zip
$SevenZip = "C:\Program Files\7-Zip\7z.exe"
if (Test-Path $SevenZip) {
    & $SevenZip a -tzip $ZipPath $PackageDir\* | Out-Null
    Write-Success "7-Zip 压缩完成"
} elseif (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipPath -Force
    Write-Success "PowerShell 压缩完成"
} else {
    Write-Warning "未找到压缩工具，跳过压缩步骤"
    $ZipPath = $PackageDir
}

# ============================================
# 完成
# ============================================
Write-Step "打包完成"

Write-Host "`n部署包信息:"
Write-Host "  版本: $Version"
Write-Host "  时间: $Timestamp"
Write-Host "  位置: $ZipPath"
Write-Host ""

# 显示文件清单
Write-Host "部署包内容:"
Get-ChildItem -Path $PackageDir -Recurse -File | ForEach-Object {
    $RelativePath = $_.FullName.Substring($PackageDir.Length + 1)
    Write-Host "  - $RelativePath"
}

Write-Host ""
Write-Success "部署包打包完成！"
Write-Host "`n下一步:"
Write-Host "  1. 将压缩包传输到目标服务器"
Write-Host "  2. 解压到目标目录"
Write-Host "  3. 查看 QUICKSTART.md 开始部署"
Write-Host ""
