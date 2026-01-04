# server/ - 后端服务索引

> Spring Boot 3.2 + MyBatis-Plus + JWT 构建的 LIMS 后端 API
> ⚠️ 文件夹变化时请更新此文件

## 目录结构 (src/main/java/com/lims/)

| 目录 | 地位 | 功能 |
|------|------|------|
| `controller/` | 核心 | REST API 控制器 |
| `service/` | 核心 | 业务逻辑层 |
| `mapper/` | 核心 | 数据访问层 (MyBatis) |
| `entity/` | 核心 | 数据实体类 |
| `dto/` | 辅助 | 数据传输对象 |
| `config/` | 配置 | Spring 配置类 |
| `security/` | 安全 | JWT 认证授权 |
| `common/` | 公共 | 统一响应/异常 |
| `annotation/` | 辅助 | 自定义注解 |
| `aspect/` | 辅助 | AOP 切面 |
| `exception/` | 辅助 | 异常处理 |
| `util/` | 工具 | 工具类 |

## 控制器 (controller/)

| 控制器 | 路径前缀 | 功能 |
|--------|----------|------|
| AuthController | /api/auth | 登录/注册/Token |
| DashboardController | /api/dashboard | 仪表盘数据 |
| ClientController | /api/client | 客户单位 |
| EntrustmentController | /api/entrustment | 委托管理 |
| QuotationController | /api/quotation | 报价管理 |
| ContractController | /api/contract | 合同管理 |
| SampleController | /api/sample | 样品管理 |
| DeviceController | /api/device | 设备管理 |
| SupplierController | /api/supplier | 供应商管理 |
| OutsourceOrderController | /api/outsource | 委外管理 |
| FinanceController | /api/finance | 财务管理 |
| StatisticsController | /api/statistics | 统计报表 |
| ApprovalController | /api/approval | 审批流程 |
| ReportGeneratorController | /api/report | 报告生成 |
| PublicReportController | /api/public/report | 公开报告查询 |
| FileController | /api/file | 文件上传下载 |
| SignatureController | /api/signature | 电子签名 |
| SysDeptController | /api/dept | 部门管理 |
| ElnTemplateController | /api/eln | ELN 模板 |
| ClientReportTemplateController | /api/client-report-template | 客户报告模板 |

## 配置类 (config/)

| 类 | 功能 |
|----|------|
| SecurityConfig | Spring Security 配置 |
| MinioConfig | MinIO 文件存储配置 |
| MybatisPlusConfig | MyBatis-Plus 配置 |
| OpenApiConfig | Knife4j API 文档配置 |

## 公共类 (common/)

| 类 | 功能 |
|----|------|
| Result<T> | 统一响应封装 |
| PageResult<T> | 分页响应封装 |
| ResultCode | 响应状态码枚举 |
| BusinessException | 业务异常 |

## 入口文件

| 文件 | 功能 |
|------|------|
| `LimsApplication.java` | Spring Boot 启动类 |
| `pom.xml` | Maven 依赖配置 |
| `application.yml` | 应用配置 |

## 开发命令

```bash
mvn spring-boot:run           # 启动 :8080
mvn clean package -DskipTests # 打包
mvn test                      # 测试
```

## API 文档

启动后访问: http://localhost:8080/api/doc.html
