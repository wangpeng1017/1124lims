# LIMS Server

实验室信息管理系统 - 后端服务

## 技术栈

- **框架**: Spring Boot 3.2.0
- **语言**: Java 17
- **ORM**: MyBatis-Plus 3.5.5
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **文件存储**: MinIO
- **API文档**: Knife4j (Swagger)
- **安全**: Spring Security + JWT

## 项目结构

```
server/
├── src/main/java/com/lims/
│   ├── common/          # 通用类（Result、ResultCode等）
│   ├── config/          # 配置类
│   ├── controller/      # 控制器
│   ├── dto/             # 数据传输对象
│   ├── entity/          # 实体类
│   ├── exception/       # 异常处理
│   ├── mapper/          # MyBatis Mapper
│   ├── service/         # 服务层
│   └── util/            # 工具类
├── src/main/resources/
│   ├── mapper/          # Mapper XML
│   ├── db/              # 数据库脚本
│   └── application.yml  # 应用配置
└── pom.xml
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0
- Redis 7.x

### 2. 数据库初始化

```bash
mysql -u root -p < src/main/resources/db/init.sql
```

### 3. 修改配置

编辑 `src/main/resources/application.yml`，修改数据库连接信息。

### 4. 运行项目

```bash
# 方式1: Maven
mvn spring-boot:run

# 方式2: 打包后运行
mvn clean package -DskipTests
java -jar target/lims-server-1.0.0.jar
```

### 5. Docker运行

```bash
# 构建镜像
docker build -t lims-server .

# 运行容器
docker run -d -p 8080:8080 --name lims-server lims-server
```

## API文档

启动后访问: http://localhost:8080/api/doc.html

## 默认账号

- 用户名: admin
- 密码: admin123
