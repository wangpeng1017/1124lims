# LIMS Next.js 重写方案

> 最后更新: 2026-01-04 | 版本: 1.0

---

## 一、技术栈选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Next.js 15 (App Router) | 全栈框架，前后端一体 |
| **语言** | TypeScript | 类型安全，AI 友好 |
| **UI** | Ant Design 5 + Tailwind | 企业级组件库 |
| **ORM** | Prisma | 类型安全，自动迁移 |
| **数据库** | MySQL 8 | 与现有兼容 |
| **认证** | NextAuth.js v5 | 简单易用的认证方案 |
| **状态** | Zustand | 轻量级状态管理 |
| **部署** | Docker | Windows Server 2019 兼容 |

---

## 二、项目结构

```
lims-next/
├── prisma/
│   └── schema.prisma          # 数据库模型（单文件定义所有表）
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # 认证相关页面
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/       # 主应用页面
│   │   │   ├── layout.tsx     # 带侧边栏的布局
│   │   │   ├── page.tsx       # 仪表盘首页
│   │   │   ├── entrustment/   # 委托管理
│   │   │   ├── sample/        # 样品管理
│   │   │   ├── test/          # 检测管理
│   │   │   ├── report/        # 报告管理
│   │   │   ├── device/        # 设备管理
│   │   │   ├── consumable/    # 耗材管理
│   │   │   ├── outsource/     # 外包管理
│   │   │   ├── finance/       # 财务管理
│   │   │   ├── approval/      # 审批中心
│   │   │   ├── system/        # 系统设置
│   │   │   └── statistics/    # 统计报表
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # 认证 API
│   │   │   └── [...]/         # 各模块 API
│   │   └── layout.tsx         # 根布局
│   ├── components/            # 通用组件
│   │   ├── ui/                # 基础 UI 组件
│   │   └── business/          # 业务组件
│   ├── lib/                   # 工具库
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── auth.ts            # NextAuth 配置
│   │   └── utils.ts           # 工具函数
│   └── types/                 # TypeScript 类型
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── package.json
```

---

## 三、数据模型设计（Prisma Schema）

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ==================== 系统管理 ====================

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  password    String
  name        String
  phone       String?
  email       String?
  avatar      String?
  deptId      String?
  dept        Dept?    @relation(fields: [deptId], references: [id])
  roles       UserRole[]
  status      Int      @default(1)  // 1=启用 0=禁用
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关联
  createdEntrustments  Entrustment[] @relation("CreatedBy")
  assignedTasks        TestTask[]    @relation("AssignedTo")
  approvalLogs         ApprovalLog[]
  todos                Todo[]
}

model Dept {
  id        String   @id @default(cuid())
  name      String
  parentId  String?
  parent    Dept?    @relation("DeptTree", fields: [parentId], references: [id])
  children  Dept[]   @relation("DeptTree")
  users     User[]
  sort      Int      @default(0)
  status    Int      @default(1)
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  code        String   @unique
  description String?
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id       String   @id @default(cuid())
  name     String
  code     String   @unique
  parentId String?
  type     Int      // 1=菜单 2=按钮
  roles    RolePermission[]
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}

// ==================== 委托管理 ====================

model Client {
  id           String   @id @default(cuid())
  name         String                    // 客户名称
  shortName    String?                   // 简称
  type         String?                   // 客户类型
  contact      String?                   // 联系人
  phone        String?
  email        String?
  address      String?
  creditCode   String?                   // 统一社会信用代码
  status       Int      @default(1)
  createdAt    DateTime @default(now())

  consultations Consultation[]
  entrustments  Entrustment[]
  quotations    Quotation[]
  contracts     Contract[]
}

model Consultation {
  id              String   @id @default(cuid())
  consultationNo  String   @unique       // 咨询单号
  clientId        String?
  client          Client?  @relation(fields: [clientId], references: [id])
  clientCompany   String?                // 客户公司（冗余）
  contactPerson   String?                // 联系人
  contactPhone    String?
  sampleInfo      String?  @db.Text      // 样品信息
  testRequirements String? @db.Text      // 检测要求
  feasibility     String?                // 可行性评估
  feasibilityNote String?  @db.Text
  estimatedPrice  Decimal? @db.Decimal(10,2)
  status          String   @default("following") // following/quoted/closed
  followUpRecords String?  @db.Text      // JSON 跟进记录
  quotationId     String?
  quotationNo     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Quotation {
  id           String   @id @default(cuid())
  quotationNo  String   @unique          // 报价单号
  clientId     String?
  client       Client?  @relation(fields: [clientId], references: [id])
  clientName   String?
  contactPerson String?
  contactPhone String?
  items        String?  @db.Text         // JSON 报价项目
  totalAmount  Decimal? @db.Decimal(12,2)
  discount     Decimal? @db.Decimal(5,2)
  finalAmount  Decimal? @db.Decimal(12,2)
  validDays    Int      @default(30)
  status       String   @default("draft") // draft/sent/accepted/rejected
  remark       String?  @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  contracts    Contract[]
}

model Contract {
  id           String   @id @default(cuid())
  contractNo   String   @unique          // 合同编号
  clientId     String?
  client       Client?  @relation(fields: [clientId], references: [id])
  quotationId  String?
  quotation    Quotation? @relation(fields: [quotationId], references: [id])
  clientName   String?
  amount       Decimal? @db.Decimal(12,2)
  signDate     DateTime?
  startDate    DateTime?
  endDate      DateTime?
  status       String   @default("draft") // draft/active/completed/terminated
  attachments  String?  @db.Text         // JSON 附件列表
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  entrustments Entrustment[]
}

model Entrustment {
  id              String   @id @default(cuid())
  entrustmentNo   String   @unique       // 委托单号
  clientId        String?
  client          Client?  @relation(fields: [clientId], references: [id])
  contractId      String?
  contract        Contract? @relation(fields: [contractId], references: [id])
  clientName      String?
  contactPerson   String?
  contactPhone    String?
  sampleName      String?                // 样品名称
  sampleCount     Int?                   // 样品数量
  testItems       String?  @db.Text      // JSON 检测项目
  requirements    String?  @db.Text      // 检测要求
  expectedDate    DateTime?              // 期望完成日期
  status          String   @default("pending") // pending/accepted/testing/completed
  createdById     String?
  createdBy       User?    @relation("CreatedBy", fields: [createdById], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  samples         Sample[]
  receivables     FinanceReceivable[]
}

// ==================== 样品管理 ====================

model Sample {
  id            String   @id @default(cuid())
  sampleNo      String   @unique         // 样品编号
  entrustmentId String?
  entrustment   Entrustment? @relation(fields: [entrustmentId], references: [id])
  name          String                   // 样品名称
  type          String?                  // 样品类型
  specification String?                  // 规格型号
  quantity      String?                  // 数量
  unit          String?                  // 单位
  receivedDate  DateTime?                // 接收日期
  storageLocation String?                // 存放位置
  status        String   @default("received") // received/testing/completed/returned
  remark        String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  testTasks     TestTask[]
}

// ==================== 检测管理 ====================

model TestTask {
  id           String   @id @default(cuid())
  taskNo       String   @unique          // 任务编号
  sampleId     String?
  sample       Sample?  @relation(fields: [sampleId], references: [id])
  testItem     String                    // 检测项目
  testMethod   String?                   // 检测方法
  deviceId     String?
  device       Device?  @relation(fields: [deviceId], references: [id])
  assignedToId String?
  assignedTo   User?    @relation("AssignedTo", fields: [assignedToId], references: [id])
  plannedDate  DateTime?                 // 计划日期
  actualDate   DateTime?                 // 实际完成日期
  status       String   @default("pending") // pending/testing/completed/reviewed
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  testData     TestData[]
  reports      TestReport[]
}

model TestData {
  id         String   @id @default(cuid())
  taskId     String
  task       TestTask @relation(fields: [taskId], references: [id])
  parameter  String                      // 参数名称
  value      String?                     // 检测值
  unit       String?                     // 单位
  standard   String?                     // 标准值
  result     String?                     // 判定结果
  remark     String?
  createdAt  DateTime @default(now())
}

model TestReport {
  id           String   @id @default(cuid())
  reportNo     String   @unique          // 报告编号
  taskId       String?
  task         TestTask? @relation(fields: [taskId], references: [id])
  title        String?                   // 报告标题
  conclusion   String?  @db.Text         // 结论
  content      String?  @db.LongText     // 报告内容 JSON
  status       String   @default("draft") // draft/reviewing/approved/issued
  approvalFlow String?  @db.Text         // 审批流程 JSON
  issuedDate   DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ==================== 设备管理 ====================

model Device {
  id              String   @id @default(cuid())
  deviceNo        String   @unique       // 设备编号
  name            String                 // 设备名称
  model           String?                // 型号
  manufacturer    String?                // 制造商
  serialNumber    String?                // 出厂编号
  purchaseDate    DateTime?              // 购置日期
  location        String?                // 存放位置
  status          String   @default("normal") // normal/maintenance/scrapped
  calibrationDate DateTime?              // 上次校准日期
  nextCalibration DateTime?              // 下次校准日期
  remark          String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  testTasks       TestTask[]
}

// ==================== 外包管理 ====================

model Supplier {
  id           String   @id @default(cuid())
  name         String                    // 供应商名称
  type         String?                   // 类型
  contact      String?
  phone        String?
  email        String?
  address      String?
  qualification String? @db.Text         // 资质信息
  status       Int      @default(1)
  createdAt    DateTime @default(now())

  outsourceOrders OutsourceOrder[]
}

model OutsourceOrder {
  id           String   @id @default(cuid())
  orderNo      String   @unique          // 外包单号
  supplierId   String?
  supplier     Supplier? @relation(fields: [supplierId], references: [id])
  supplierName String?
  items        String?  @db.Text         // JSON 外包项目
  amount       Decimal? @db.Decimal(12,2)
  status       String   @default("pending") // pending/processing/completed
  expectedDate DateTime?
  completedDate DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ==================== 财务管理 ====================

model FinanceReceivable {
  id            String   @id @default(cuid())
  entrustmentId String?
  entrustment   Entrustment? @relation(fields: [entrustmentId], references: [id])
  clientName    String?
  amount        Decimal  @db.Decimal(12,2)
  receivedAmount Decimal @default(0) @db.Decimal(12,2)
  status        String   @default("pending") // pending/partial/completed
  dueDate       DateTime?
  createdAt     DateTime @default(now())

  payments      FinancePayment[]
  invoices      FinanceInvoice[]
}

model FinancePayment {
  id           String   @id @default(cuid())
  receivableId String
  receivable   FinanceReceivable @relation(fields: [receivableId], references: [id])
  amount       Decimal  @db.Decimal(12,2)
  paymentDate  DateTime
  paymentMethod String?
  remark       String?
  createdAt    DateTime @default(now())
}

model FinanceInvoice {
  id           String   @id @default(cuid())
  invoiceNo    String   @unique
  receivableId String?
  receivable   FinanceReceivable? @relation(fields: [receivableId], references: [id])
  amount       Decimal  @db.Decimal(12,2)
  type         String?                   // 发票类型
  status       String   @default("pending") // pending/issued
  issuedDate   DateTime?
  createdAt    DateTime @default(now())
}

// ==================== 审批管理 ====================

model ApprovalFlow {
  id        String   @id @default(cuid())
  name      String                       // 流程名称
  type      String                       // 流程类型
  nodes     String   @db.Text            // JSON 节点配置
  status    Int      @default(1)
  createdAt DateTime @default(now())
}

model ApprovalLog {
  id         String   @id @default(cuid())
  bizType    String                      // 业务类型
  bizId      String                      // 业务ID
  action     String                      // 操作
  comment    String?  @db.Text
  operatorId String
  operator   User     @relation(fields: [operatorId], references: [id])
  createdAt  DateTime @default(now())
}

model Todo {
  id        String   @id @default(cuid())
  title     String
  type      String                       // 待办类型
  bizType   String?                      // 关联业务类型
  bizId     String?                      // 关联业务ID
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  status    String   @default("pending") // pending/completed
  dueDate   DateTime?
  createdAt DateTime @default(now())
}

// ==================== 系统文档 ====================

model SystemDocument {
  id        String   @id @default(cuid())
  title     String
  category  String?
  content   String?  @db.LongText
  version   String?
  status    Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 四、开发计划

### 阶段一：基础框架（1-2天）
- [ ] 初始化 Next.js 15 项目
- [ ] 配置 Prisma + MySQL
- [ ] 配置 NextAuth.js 认证
- [ ] 搭建基础布局（侧边栏、顶栏）
- [ ] 实现登录功能

### 阶段二：核心模块（按优先级）

| 优先级 | 模块 | 预计工作量 |
|--------|------|-----------|
| P0 | 系统设置（用户/角色/权限） | 1天 |
| P0 | 委托管理（咨询/报价/委托） | 2天 |
| P1 | 样品管理 | 1天 |
| P1 | 检测管理 | 2天 |
| P1 | 报告管理 | 2天 |
| P2 | 设备管理 | 1天 |
| P2 | 外包管理 | 1天 |
| P2 | 财务管理 | 1天 |
| P3 | 审批中心 | 1天 |
| P3 | 统计报表 | 1天 |
| P3 | 耗材管理 | 1天 |

### 阶段三：部署上线
- [ ] Docker 镜像构建
- [ ] Windows Server 2019 部署测试
- [ ] 数据迁移脚本

---

## 五、Docker 部署配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  lims:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://lims:lims123@mysql:3306/lims
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=root123
      - MYSQL_DATABASE=lims
      - MYSQL_USER=lims
      - MYSQL_PASSWORD=lims123
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql_data:
```

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 六、与现有系统对比

| 对比项 | Java 版 | Next.js 版 |
|--------|---------|-----------|
| 代码量 | ~50000 行 | ~15000 行（预估） |
| 文件数 | ~200 个 | ~80 个（预估） |
| 构建时间 | 2-3 分钟 | 30 秒 |
| 部署复杂度 | 高（前后端分离） | 低（单服务） |
| AI 修改效率 | 低 | 高 |
| 权限系统 | 复杂 | 简单 |

---

## 七、风险与应对

| 风险 | 应对措施 |
|------|----------|
| 数据迁移 | 编写迁移脚本，保持表结构兼容 |
| 功能遗漏 | 逐模块对照现有功能清单 |
| 性能问题 | Next.js 内置优化，必要时加 Redis |
| 学习成本 | TypeScript 语法简单，AI 辅助开发 |

---

## 八、下一步行动

确认此方案后，我将：
1. 创建 `lims-next` 项目目录
2. 初始化 Next.js 15 + Prisma
3. 实现登录 + 基础布局
4. 逐模块迁移功能
