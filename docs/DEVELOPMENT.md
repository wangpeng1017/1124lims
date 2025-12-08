# LIMS 开发指南

## 项目结构

```
2LIMS/
├── client/                     # 前端 React 应用
│   ├── src/
│   │   ├── components/         # 通用组件
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── layouts/            # 布局组件
│   │   ├── mock/               # Mock 数据 (已弃用)
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API 服务层
│   │   │   ├── api.ts          # Axios 封装
│   │   │   ├── businessApi.ts  # 业务 API
│   │   │   ├── entrustmentApi.ts
│   │   │   ├── sampleApi.ts
│   │   │   ├── taskApi.ts
│   │   │   ├── reportApi.ts
│   │   │   ├── financeApi.ts
│   │   │   ├── statisticsApi.ts
│   │   │   └── useDataService.ts # React Hooks
│   │   └── App.tsx             # 路由配置
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                     # 后端 Spring Boot
│   ├── src/main/java/com/lims/
│   │   ├── config/             # 配置类
│   │   ├── controller/         # 控制器 (22个)
│   │   ├── entity/             # 实体类
│   │   ├── mapper/             # MyBatis Mapper
│   │   ├── service/            # 服务层
│   │   └── security/           # 安全配置
│   ├── src/main/resources/
│   │   ├── db/
│   │   │   ├── init.sql        # 建表脚本
│   │   │   └── data.sql        # 预置数据
│   │   └── application.yml
│   └── Dockerfile
│
├── docs/                       # 文档
│   ├── FEATURES.md             # 功能说明
│   └── DEVELOPMENT.md          # 开发指南
│
└── docker-compose.yml          # Docker 编排
```

## 快速开始

### 本地开发

```bash
# 1. 启动基础服务
docker-compose up -d mysql redis minio

# 2. 启动后端
cd server
mvn spring-boot:run

# 3. 启动前端
cd client
npm install
npm run dev
```

### Docker 部署

```bash
docker-compose up -d --build
```

## 前端开发

### 添加新页面

1. 在 `src/pages/` 下创建页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/layouts/MainLayout.tsx` 添加菜单项

### 调用 API

```typescript
// 方式1: 使用 Hooks
import { useEntrustmentService } from '@/services';

const { loading, data, fetchList, create, update, remove } = useEntrustmentService();

useEffect(() => {
    fetchList({ current: 1, size: 10 });
}, []);

// 方式2: 直接调用
import { entrustmentApi } from '@/services/entrustmentApi';

const res = await entrustmentApi.page({ current: 1, size: 10 });
```

## 后端开发

### 添加新模块

1. 创建 Entity: `entity/BizXxx.java`
2. 创建 Mapper: `mapper/BizXxxMapper.java`
3. 创建 Service: `service/XxxService.java`
4. 创建 Controller: `controller/XxxController.java`
5. 添加权限注解: `@PreAuthorize("hasAuthority('xxx:list')")`

### API 规范

```java
@RestController
@RequestMapping("/xxx")
public class XxxController {
    
    @GetMapping("/page")
    @PreAuthorize("hasAuthority('xxx:list')")
    public Result<IPage<Xxx>> page(XxxQuery query) { }
    
    @PostMapping
    @PreAuthorize("hasAuthority('xxx:create')")
    public Result<Void> create(@RequestBody Xxx entity) { }
    
    @PutMapping
    @PreAuthorize("hasAuthority('xxx:update')")  
    public Result<Void> update(@RequestBody Xxx entity) { }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('xxx:delete')")
    public Result<Void> delete(@PathVariable Long id) { }
}
```

## 环境变量

### 前端

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 地址 | `/api` |

### 后端

| 变量 | 说明 |
|------|------|
| `SPRING_DATASOURCE_URL` | MySQL 连接 |
| `SPRING_DATASOURCE_USERNAME` | 数据库用户 |
| `SPRING_DATASOURCE_PASSWORD` | 数据库密码 |
| `SPRING_DATA_REDIS_HOST` | Redis 地址 |
| `MINIO_ENDPOINT` | MinIO 地址 |

## Git 提交规范

```
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 常见问题

### Q: 前端 API 返回 401?
A: 检查 localStorage 中的 token 是否有效

### Q: 后端启动失败?
A: 确认 MySQL 已启动且连接配置正确

### Q: Docker 镜像拉取慢?
A: 配置 Docker 镜像加速器
