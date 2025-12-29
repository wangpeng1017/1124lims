# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LIMS (实验室信息管理系统) - A full-stack Laboratory Information Management System for managing laboratory workflows, samples, testing tasks, reports, and equipment.

## Tech Stack

**Frontend (client/)**
- React 19 + TypeScript + Vite 7
- Ant Design 6
- React Router 7

**Backend (server/)**
- Spring Boot 3.2.0 + Java 17
- MyBatis-Plus 3.5.5
- MySQL 8.0 + Redis 7
- Spring Security + JWT
- MinIO (file storage)
- Knife4j (API docs)

## Development Commands

### Frontend (client/)
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start dev server (default: http://localhost:5173)
npm run build        # Production build
npm run lint         # Run ESLint
```

### Backend (server/)
```bash
cd server
mvn spring-boot:run                    # Start dev server (http://localhost:8080/api)
mvn clean package -DskipTests          # Build JAR
java -jar target/lims-server-1.0.0.jar # Run JAR
```

### Docker
```bash
docker-compose up -d mysql redis minio  # Start infrastructure
docker-compose up -d --build            # Full deployment
```

### Database
```bash
mysql -u root -p < server/src/main/resources/db/init.sql  # Initialize schema
```

## Architecture

```
2LIMS/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       ├── layouts/            # MainLayout with sidebar/header
│       ├── pages/              # Page components (grouped by module)
│       ├── services/           # API layer (axios-based)
│       │   ├── api.ts          # Axios instance with interceptors
│       │   └── *Api.ts         # Domain-specific API modules
│       └── App.tsx             # Route definitions
│
├── server/                     # Spring Boot backend
│   └── src/main/java/com/lims/
│       ├── controller/         # REST controllers with @PreAuthorize
│       ├── entity/             # JPA/MyBatis entities (Biz*, Sys*, Fin*)
│       ├── mapper/             # MyBatis mapper interfaces
│       ├── service/            # Business logic layer
│       ├── security/           # JWT filter, UserDetailsService
│       ├── config/             # CORS, Security, MinIO config
│       └── common/             # Result wrapper, ResultCode enum
│
└── docs/                       # Documentation
    ├── FEATURES.md             # Module/API reference
    └── DEVELOPMENT.md          # Dev setup guide
```

## Key Patterns

### Frontend API Calls
```typescript
// Using hooks (preferred)
import { useEntrustmentService } from '@/services';
const { loading, data, fetchList, create } = useEntrustmentService();

// Direct API calls
import { entrustmentApi } from '@/services/entrustmentApi';
const res = await entrustmentApi.page({ current: 1, size: 10 });
```

### Backend Controller Convention
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
}
```

### Adding New Features
1. **Backend**: Entity → Mapper → Service → Controller (add `@PreAuthorize`)
2. **Frontend**: Page in `pages/` → Route in `App.tsx` → Menu in `MainLayout.tsx`

## Environment Variables

**Frontend** (`.env.development`):
- `VITE_API_BASE_URL` - API base URL (default: `/api`)

**Backend** (environment or `application.yml`):
- `SPRING_DATASOURCE_URL` / `USERNAME` / `PASSWORD`
- `SPRING_DATA_REDIS_HOST`
- `MINIO_ENDPOINT` / `ACCESS_KEY` / `SECRET_KEY`

## Business Modules

| Module | Frontend Routes | Backend Controller |
|--------|-----------------|-------------------|
| Entrustment | `/entrustment/*` | EntrustmentController |
| Sample | `/sample-management/*` | SampleController |
| Task | `/task-management/*` | TestTaskController |
| Report | `/report-management/*` | TestReportController |
| Device | `/device-management/*` | DeviceController |
| Finance | `/finance-management/*` | FinanceController |
| System | `/system-settings/*` | SysUser/Role/DeptController |

## API Documentation

After starting backend: http://localhost:8080/api/doc.html

## Default Credentials

- Username: `admin`
- Password: `admin123`
