-- LIMS 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS lims DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lims;

-- ============================================
-- 系统管理模块
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像',
    dept_id BIGINT COMMENT '部门ID',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    last_login_time DATETIME COMMENT '最后登录时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL COMMENT '角色编码',
    description VARCHAR(255) COMMENT '角色描述',
    data_scope TINYINT DEFAULT 1 COMMENT '数据权限范围 1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义',
    dept_ids VARCHAR(500) DEFAULT NULL COMMENT '自定义数据权限部门ID列表',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    UNIQUE KEY uk_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 部门表
CREATE TABLE IF NOT EXISTS sys_dept (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '部门ID',
    dept_name VARCHAR(50) NOT NULL COMMENT '部门名称',
    dept_code VARCHAR(50) COMMENT '部门编码',
    parent_id BIGINT DEFAULT 0 COMMENT '父部门ID',
    ancestors VARCHAR(500) DEFAULT '' COMMENT '祖先部门ID路径，如 0,1,2',
    sort INT DEFAULT 0 COMMENT '排序',
    leader VARCHAR(50) COMMENT '负责人',
    phone VARCHAR(20) COMMENT '联系电话',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    UNIQUE KEY uk_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 权限表
CREATE TABLE IF NOT EXISTS sys_permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    permission_name VARCHAR(50) NOT NULL COMMENT '权限名称',
    permission_code VARCHAR(100) NOT NULL COMMENT '权限编码',
    parent_id BIGINT DEFAULT 0 COMMENT '父权限ID',
    type TINYINT COMMENT '类型 1-菜单 2-按钮 3-接口',
    path VARCHAR(255) COMMENT '路由路径',
    icon VARCHAR(100) COMMENT '图标',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_permission_code (permission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS sys_role_permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    UNIQUE KEY uk_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认部门
INSERT INTO sys_dept (dept_name, dept_code, parent_id, ancestors, sort) VALUES 
('总公司', 'ROOT', 0, '0', 1),
('检测部', 'TESTING', 1, '0,1', 1),
('市场部', 'MARKETING', 1, '0,1', 2),
('财务部', 'FINANCE', 1, '0,1', 3),
('行政部', 'ADMIN', 1, '0,1', 4);

-- 插入默认角色 (包含数据权限范围)
-- data_scope: 1-全部数据 2-本部门及以下 3-本部门 4-仅本人 5-自定义
INSERT INTO sys_role (role_name, role_code, description, data_scope) VALUES
('系统管理员', 'admin', '拥有系统所有权限和数据访问权限（data_scope=1全部数据）', 1),
('实验室主管', 'lab_manager', '负责实验室业务管理', 2),
('检测人员', 'tester', '负责任务执行和数据录入', 4),
('销售人员', 'sales', '负责委托管理和客户管理', 3),
('财务人员', 'finance', '负责财务结算', 3);

-- 插入默认管理员 (密码: admin123, BCrypt加密)
-- 管理员账号: admin / admin123
-- 权限说明:
--   1. 代码层面: PermissionService.hasPermission() 对 admin 角色直接返回 true
--   2. 数据层面: data_scope=1 表示可访问全部数据
--   3. 角色关联: 已关联 admin 角色(role_id=1)
INSERT INTO sys_user (username, password, real_name, email, phone, dept_id, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKs5gE6Q0nP1N9I4s7w4m7kT.KQ.', '系统管理员', 'admin@lims.com', '13800138000', 1, 1);

-- 关联管理员角色
INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 插入基础权限 (菜单权限)
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, icon, sort) VALUES 
('首页', 'dashboard', 0, 1, '/dashboard', 'HomeOutlined', 1),
('业务管理', 'entrustment', 0, 1, '/entrustment', 'FileTextOutlined', 2),
('样品管理', 'sample', 0, 1, '/sample', 'ExperimentOutlined', 3),
('任务管理', 'task', 0, 1, '/task', 'UnorderedListOutlined', 4),
('试验管理', 'test', 0, 1, '/test', 'ToolOutlined', 5),
('报告管理', 'report', 0, 1, '/report', 'FileProtectOutlined', 6),
('设备管理', 'device', 0, 1, '/device', 'DesktopOutlined', 7),
('系统设置', 'system', 0, 1, '/system', 'SettingOutlined', 99);

-- 插入操作权限 (按钮权限)
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, sort) VALUES
('首页-查看', 'dashboard:view', 1, 2, 1),
('委托单-新增', 'entrustment:create', 2, 2, 1),
('委托单-编辑', 'entrustment:update', 2, 2, 2),
('委托单-删除', 'entrustment:delete', 2, 2, 3),
('委托单-导出', 'entrustment:export', 2, 2, 4),
('样品-新增', 'sample:create', 3, 2, 1),
('样品-编辑', 'sample:update', 3, 2, 2),
('样品-删除', 'sample:delete', 3, 2, 3),
('任务-分配', 'task:assign', 4, 2, 1),
('任务-执行', 'task:execute', 4, 2, 2),
('报告-审批', 'report:approve', 6, 2, 1),
('报告-签发', 'report:issue', 6, 2, 2),
('用户管理', 'system:user', 8, 2, 1),
('角色管理', 'system:role', 8, 2, 2),
('权限管理', 'system:permission', 8, 2, 3);

-- 插入额外API权限
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, sort) VALUES
('待办-查看', 'todo:view', 0, 3, 1),
('待办-管理', 'todo:manage', 0, 3, 2),
('咨询-查看', 'consultation:view', 0, 3, 3),
('咨询-管理', 'consultation:manage', 0, 3, 4),
('报价单-查看', 'quotation:view', 0, 3, 5),
('报价单-管理', 'quotation:manage', 0, 3, 6);

-- 为管理员角色分配所有权限
INSERT INTO sys_role_permission (role_id, permission_id) 
SELECT 1, id FROM sys_permission;

-- ============================================
-- 财务管理模块
-- ============================================

-- 应收记录表
CREATE TABLE IF NOT EXISTS fin_receivable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    entrustment_id BIGINT COMMENT '关联委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    contract_id BIGINT COMMENT '关联合同ID',
    contract_no VARCHAR(50) COMMENT '合同编号',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    amount DECIMAL(12,2) DEFAULT 0 COMMENT '应收金额',
    paid_amount DECIMAL(12,2) DEFAULT 0 COMMENT '已收金额',
    unpaid_amount DECIMAL(12,2) DEFAULT 0 COMMENT '未收金额',
    payment_type VARCHAR(20) DEFAULT 'postpay' COMMENT '账期类型：prepay预付/postpay后付',
    due_date DATE COMMENT '到期日期',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending待收/partial部分/paid已收/overdue逾期',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='财务应收记录表';

-- 收款记录表
CREATE TABLE IF NOT EXISTS fin_payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    payment_no VARCHAR(50) COMMENT '收款编号',
    receivable_id BIGINT COMMENT '关联应收记录ID',
    entrustment_id BIGINT COMMENT '关联委托单ID',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    amount DECIMAL(12,2) DEFAULT 0 COMMENT '收款金额',
    payment_date DATE COMMENT '收款日期',
    payment_method VARCHAR(20) DEFAULT 'bank' COMMENT '收款方式：bank银行/cash现金/check支票/other其他',
    bank_account VARCHAR(50) COMMENT '银行账号',
    handler_id BIGINT COMMENT '经办人ID',
    handler VARCHAR(50) COMMENT '经办人',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收款记录表';

-- 发票记录表
CREATE TABLE IF NOT EXISTS fin_invoice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    invoice_no VARCHAR(50) COMMENT '发票号码',
    invoice_type VARCHAR(20) DEFAULT 'normal' COMMENT '发票类型：normal普通/special专用',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    tax_no VARCHAR(50) COMMENT '纳税人识别号',
    amount DECIMAL(12,2) DEFAULT 0 COMMENT '开票金额',
    tax_rate DECIMAL(5,2) DEFAULT 0 COMMENT '税率',
    tax_amount DECIMAL(12,2) DEFAULT 0 COMMENT '税额',
    invoice_date DATE COMMENT '开票日期',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态：draft草稿/issued已开/cancelled作废',
    entrustment_ids VARCHAR(500) COMMENT '关联委托单IDs',
    creator VARCHAR(50) COMMENT '开票人',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='发票记录表';

-- ============================================
-- 报告模板模块
-- ============================================

-- 客户报告模板表
CREATE TABLE IF NOT EXISTS biz_client_report_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '模板ID',
    template_code VARCHAR(50) NOT NULL COMMENT '模板编码（唯一标识）',
    name VARCHAR(100) NOT NULL COMMENT '模板名称',
    client_id BIGINT COMMENT '关联客户ID（可选，为空表示通用模板）',
    client_name VARCHAR(100) COMMENT '关联客户名称',
    base_template_id BIGINT COMMENT '继承自哪个模板ID',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认模板 0-否 1-是',
    company_info JSON COMMENT '公司信息（JSON格式）',
    client_logo_url VARCHAR(500) COMMENT '客户Logo URL',
    pages JSON COMMENT '页面配置（JSON格式）',
    declarations JSON COMMENT '声明内容（JSON数组格式）',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    version VARCHAR(20) DEFAULT '1.0' COMMENT '版本号',
    description VARCHAR(500) COMMENT '描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by VARCHAR(50) COMMENT '创建人',
    update_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    UNIQUE KEY uk_template_code (template_code),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户报告模板表';

-- 插入默认模板
INSERT INTO biz_client_report_template (template_code, name, is_default, company_info, pages, declarations, status, version, description) VALUES
(
    'TPL-DEFAULT-001',
    '通用检测报告模板',
    1,
    '{"logoUrl": "/assets/altc-logo.png", "nameCn": "江苏国轻检测技术有限公司", "nameEn": "Jiangsu Guoqing Testing Technology Co.,Ltd", "address": "江苏省扬州市邗江区金山路99号B栋1-3层", "postalCode": "225000", "phone": "0514-80585092"}',
    '[{"id": "cover", "type": "cover", "name": "封面页", "layout": [{"id": "logo", "type": "image", "x": 0, "y": 0, "w": 12, "h": 2, "config": {"imageUrl": "/assets/altc-logo.png"}}, {"id": "title", "type": "text", "x": 0, "y": 3, "w": 12, "h": 2, "config": {"content": "检 测 报 告", "fontSize": 36, "fontWeight": "bold", "textAlign": "center"}}, {"id": "reportNo", "type": "field", "x": 0, "y": 6, "w": 12, "h": 1, "config": {"fieldKey": "reportNo", "fieldLabel": "报告编号"}}, {"id": "sampleName", "type": "field", "x": 0, "y": 7, "w": 12, "h": 1, "config": {"fieldKey": "sampleName", "fieldLabel": "样品名称"}}, {"id": "clientName", "type": "field", "x": 0, "y": 8, "w": 12, "h": 1, "config": {"fieldKey": "clientName", "fieldLabel": "委托单位"}}, {"id": "declarations", "type": "declaration", "x": 0, "y": 10, "w": 12, "h": 4, "config": {}}]}, {"id": "info", "type": "info", "name": "检测信息页", "layout": [{"id": "header", "type": "header", "x": 0, "y": 0, "w": 12, "h": 1, "config": {}}, {"id": "infoTable", "type": "table", "x": 0, "y": 2, "w": 12, "h": 8, "config": {"fields": ["sampleName", "sampleNo", "clientName", "testItems", "testStandards", "testDate"]}}, {"id": "signatures", "type": "signature", "x": 0, "y": 12, "w": 12, "h": 2, "config": {"roles": ["编制", "审核", "批准"]}}]}]',
    '["1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；", "2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；", "3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；", "4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。"]',
    1,
    '1.0',
    '系统默认通用报告模板'
);
