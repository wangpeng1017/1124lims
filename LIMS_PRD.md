# LIMS (Laboratory Information Management System) Product Requirement Document

## 1. Project Overview
**Project Name**: Intelligent LIMS
**Objective**: To build a comprehensive Laboratory Information Management System to manage laboratory workflows, resources, and data efficiently.
**Phases**:
- **Phase 1 (Current)**: Frontend Demo Development. Focus on UI/UX, data visualization, and core module interaction using mock data.
- **Phase 2 (Future)**: Backend & Database Development. Full implementation of business logic, persistence, and integration.

## 2. User Roles
- **Lab Manager**: Oversees all operations, manages devices, environment, and personnel.
- **Lab Technician**: Executes tests, records data, manages samples and consumables.
- **Administrator**: System configuration and user management.

## 3. Functional Modules (Phase 1 Priority)

### 3.1 Method Management (方法管理)
**Goal**: Manage inspection standards and test methods.
**Data Fields**:
- Sequence No. (序号)
- Standard Name (标准名称)
- Standard No. (标准编号)
- Validity (标准有效性) - e.g., "现行有效"
- Remarks (备注) - e.g., "CNAS"
**Features**:
- List view with filtering/searching.
- Status highlighting (Valid/Invalid).

### 3.2 Environment Management (环境管理)
**Goal**: Monitor and record laboratory environmental conditions.
**Data Fields**:
- Location (位置) - e.g., "一层", "二层"
- Room Name (名称)
- Temperature (温度)
- Humidity (湿度)
**Features**:
- Dashboard view of current conditions.
- Grouping by Floor/Location.

### 3.3 Device Management (设备管理)
**Goal**: Track equipment status, usage, and calibration.
**Data Fields**:
- Sequence No. (序号)
- Name & Model (名称及型号)
- Device ID (编号)
- Status (状态) - e.g., "运行", "维修"
- Utilization Rate (利用率)
**Features**:
- Equipment list with status indicators.
- Utilization charts (Phase 1 visual).

### 3.4 Entrustment Information (委托信息)
**Goal**: Manage test requests (orders) and sample tracking.
**Data Fields**:
- Sequence No. (序号)
- Entrustment ID (委托编号)
- Report ID (检测报告编号)
- Sample Date (送样时间)
- Test Date (试验时间)
- Sample Name (样件名称)
- Test Items (试验项目)
- Follower (跟单人)
**Features**:
- Order tracking table.
- Detail view for specific orders.
- Filtering by Date, Follower, or Sample Name.

### 3.5 Consumables Management (易耗品管理)
**Goal**: Inventory management for reagents and consumables.
**Data Fields**:
- Material ID (物料编号)
- Name (名称)
- Spec/Model (规格型号)
- Unit (单位)
- Total In (累计入库)
- Total Out (累计出库)
- Current Stock (当前库存)
- Category (类别) - e.g., "低值易耗品", "原材料"
- Location (库位)
**Features**:
- Inventory list with low-stock warnings (visual).
- Stock movement history (mock).

## 4. Technical Requirements (Phase 1)
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **UI Library**: Ant Design (v5) - Chosen for maturity and enterprise suitability.
- **Styling**: CSS Modules or Tailwind CSS (for layout).
- **Routing**: React Router v6.
- **State Management**: React Context or Zustand (simple for demo).
- **Mock Data**: JSON/TypeScript constants derived from provided business data.

## 5. UI/UX Guidelines
- **Theme**: Professional, Clean, Enterprise Blue/White.
- **Navigation**: Left Sidebar for modules, Top Header for user info/global actions.
- **Responsiveness**: Desktop-first, adaptable to tablet.
