# server/ - 后端模块

> 📍 [返回根目录](../CLAUDE.md) > server/

## 模块概述

基于 Spring Boot 3.2 + MyBatis-Plus 的 LIMS 后端 REST API 服务。

## 目录结构

```
server/
├── src/main/java/com/lims/
│   ├── annotation/       # 自定义注解
│   │   └── DataScope.java    # 数据权限注解
│   ├── aspect/           # AOP 切面
│   │   └── DataScopeAspect.java
│   ├── common/           # 公共类
│   │   ├── Result.java       # 统一响应
│   │   ├── PageResult.java   # 分页响应
│   │   └── BusinessException.java
│   ├── config/           # 配置类
│   │   ├── SecurityConfig.java
│   │   ├── MinioConfig.java
│   │   └── MybatisPlusConfig.java
│   ├── controller/       # REST 控制器
│   │   ├── AuthController.java
│   │   ├── EntrustmentController.java
│   │   ├── SampleController.java
│   │   └── ...
│   ├── entity/           # 实体类
│   ├── mapper/           # MyBatis Mapper
│   ├── service/          # 业务服务
│   └── LimsApplication.java  # 启动类
├── src/main/resources/
│   ├── application.yml   # 配置文件
│   └── db/init.sql       # 数据库初始化
└── pom.xml
```

## 关键依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.2.0 | 基础框架 |
| MyBatis-Plus | 3.5.5 | ORM |
| Spring Security | - | 认证授权 |
| JWT (jjwt) | 0.12.3 | Token |
| MinIO | 8.5.7 | 文件存储 |
| Knife4j | 4.3.0 | API 文档 |
| EasyExcel | 3.3.3 | Excel 处理 |
| Hutool | 5.8.23 | 工具类 |

## API 控制器

| 控制器 | 路径前缀 | 功能 |
|--------|----------|------|
| AuthController | /api/auth | 认证登录 |
| EntrustmentController | /api/entrustment | 委托管理 |
| SampleController | /api/sample | 样品管理 |
| DeviceController | /api/device | 设备管理 |
| ContractController | /api/contract | 合同管理 |
| QuotationController | /api/quotation | 报价管理 |
| FinanceController | /api/finance | 财务管理 |
| StatisticsController | /api/statistics | 统计报表 |

## 统一响应格式

```java
public class Result<T> {
    private int code;      // 状态码
    private String msg;    // 消息
    private T data;        // 数据
}
```

## 开发命令

```bash
mvn spring-boot:run           # 启动开发服务器 :8080
mvn clean package -DskipTests # 打包
mvn test                      # 运行测试
```

## 配置说明

主要配置在 `application.yml`:
- 数据库: MySQL 8.0
- 缓存: Redis 7
- 文件: MinIO
- JWT: 密钥配置

## 开发规范

1. **API**: RESTful 风格，统一 `/api/` 前缀
2. **响应**: 统一使用 `Result<T>` 包装
3. **异常**: 全局异常处理，抛出 `BusinessException`
4. **日志**: SLF4J + Logback
