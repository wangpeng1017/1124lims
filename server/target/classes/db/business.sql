-- LIMS 业务表初始化脚本
-- 在 init.sql 之后执行

USE lims;

-- ============================================
-- 业务管理模块
-- ============================================

-- 客户单位表
CREATE TABLE IF NOT EXISTS biz_client (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '客户ID',
    name VARCHAR(200) NOT NULL COMMENT '客户名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    address VARCHAR(500) COMMENT '地址',
    tax_id VARCHAR(50) COMMENT '税号',
    invoice_address VARCHAR(500) COMMENT '发票地址',
    invoice_phone VARCHAR(20) COMMENT '发票电话',
    bank_name VARCHAR(200) COMMENT '开户银行',
    bank_account VARCHAR(100) COMMENT '银行账号',
    status VARCHAR(20) DEFAULT 'approved' COMMENT '状态: draft/pending/approved/rejected',
    creator VARCHAR(50) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户单位表';

-- 委托单表
CREATE TABLE IF NOT EXISTS biz_entrustment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '委托ID',
    entrustment_no VARCHAR(50) NOT NULL COMMENT '委托编号',
    contract_no VARCHAR(50) COMMENT '合同编号',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(200) COMMENT '客户名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    sample_date DATE COMMENT '送样日期',
    follower VARCHAR(50) COMMENT '跟单人',
    follower_id BIGINT COMMENT '跟单人ID',
    sample_name VARCHAR(200) COMMENT '样品名称',
    sample_model VARCHAR(200) COMMENT '样品型号',
    sample_material VARCHAR(200) COMMENT '样品材质',
    sample_quantity INT DEFAULT 1 COMMENT '样品数量',
    is_sample_return TINYINT DEFAULT 0 COMMENT '是否返还样品',
    test_items TEXT COMMENT '检测项目汇总',
    estimated_amount DECIMAL(12,2) COMMENT '预计费用',
    expected_date DATE COMMENT '期望完成日期',
    remark TEXT COMMENT '备注',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/approved/testing/completed/cancelled',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    create_by VARCHAR(50),
    update_by VARCHAR(50),
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_entrustment_no (entrustment_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='委托单表';

-- ============================================
-- 样品管理模块
-- ============================================

-- 样品表
CREATE TABLE IF NOT EXISTS biz_sample (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '样品ID',
    sample_no VARCHAR(50) NOT NULL COMMENT '样品编号',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    name VARCHAR(200) NOT NULL COMMENT '样品名称',
    spec VARCHAR(200) COMMENT '规格型号',
    material VARCHAR(100) COMMENT '材质',
    quantity INT DEFAULT 1 COMMENT '数量',
    unit VARCHAR(20) COMMENT '单位',
    receipt_date DATE COMMENT '收样日期',
    receipt_person VARCHAR(50) COMMENT '收样人',
    receipt_person_id BIGINT COMMENT '收样人ID',
    storage_location VARCHAR(100) COMMENT '存放位置',
    photos TEXT COMMENT '照片路径',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/testing/completed/returned/destroyed',
    is_outsourced TINYINT DEFAULT 0 COMMENT '是否委外',
    outsource_supplier_id BIGINT COMMENT '委外供应商ID',
    outsource_supplier_name VARCHAR(200) COMMENT '委外供应商名称',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_sample_no (sample_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='样品表';

-- ============================================
-- 任务管理模块
-- ============================================

-- 检测任务表
CREATE TABLE IF NOT EXISTS biz_test_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID',
    task_no VARCHAR(50) NOT NULL COMMENT '任务编号',
    sample_id BIGINT COMMENT '样品ID',
    sample_no VARCHAR(50) COMMENT '样品编号',
    sample_name VARCHAR(200) COMMENT '样品名称',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    parameters TEXT COMMENT '检测参数JSON',
    test_method VARCHAR(200) COMMENT '检测方法',
    test_standard VARCHAR(200) COMMENT '检测标准',
    assignee_id BIGINT COMMENT '负责人ID',
    assignee VARCHAR(50) COMMENT '负责人',
    assign_date DATE COMMENT '分配日期',
    due_date DATE COMMENT '截止日期',
    completed_date DATE COMMENT '完成日期',
    device_id BIGINT COMMENT '设备ID',
    device_name VARCHAR(100) COMMENT '设备名称',
    progress INT DEFAULT 0 COMMENT '进度0-100',
    priority VARCHAR(20) DEFAULT 'normal' COMMENT '优先级: normal/urgent',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/in_progress/completed/transferred',
    is_outsourced TINYINT DEFAULT 0 COMMENT '是否委外',
    outsource_no VARCHAR(50) COMMENT '委外单号',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    create_by VARCHAR(50),
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_task_no (task_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测任务表';

-- ============================================
-- 报告管理模块
-- ============================================

-- 检测报告表
CREATE TABLE IF NOT EXISTS biz_test_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '报告ID',
    report_no VARCHAR(50) NOT NULL COMMENT '报告编号',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    sample_id BIGINT COMMENT '样品ID',
    sample_no VARCHAR(50) COMMENT '样品编号',
    sample_name VARCHAR(200) COMMENT '样品名称',
    task_id BIGINT COMMENT '任务ID',
    task_no VARCHAR(50) COMMENT '任务编号',
    client_name VARCHAR(200) COMMENT '客户名称',
    test_items TEXT COMMENT '检测项目',
    test_results TEXT COMMENT '检测结果JSON',
    conclusion TEXT COMMENT '结论',
    tester_id BIGINT COMMENT '检测员ID',
    tester VARCHAR(50) COMMENT '检测员',
    reviewer_id BIGINT COMMENT '审核员ID',
    reviewer VARCHAR(50) COMMENT '审核员',
    review_date DATE COMMENT '审核日期',
    approver_id BIGINT COMMENT '批准人ID',
    approver VARCHAR(50) COMMENT '批准人',
    approve_date DATE COMMENT '批准日期',
    template_id BIGINT COMMENT '报告模板ID',
    file_path VARCHAR(500) COMMENT '报告文件路径',
    signature_image VARCHAR(500) COMMENT '签名图片',
    stamp_image VARCHAR(500) COMMENT '盖章图片',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft/pending_review/reviewed/approved/issued',
    issued_date DATE COMMENT '发布日期',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    create_by VARCHAR(50),
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_report_no (report_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测报告表';

-- ============================================
-- 设备管理模块
-- ============================================

-- 设备信息表
CREATE TABLE IF NOT EXISTS biz_device (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '设备ID',
    code VARCHAR(50) NOT NULL COMMENT '设备编号',
    name VARCHAR(200) NOT NULL COMMENT '设备名称',
    model VARCHAR(200) COMMENT '型号',
    manufacturer VARCHAR(200) COMMENT '生产厂家',
    serial_number VARCHAR(100) COMMENT '出厂编号',
    asset_type VARCHAR(20) COMMENT '资产类型: instrument/device/glassware',
    status VARCHAR(20) DEFAULT 'running' COMMENT '状态: running/maintenance/repair/idle/scrapped',
    location VARCHAR(200) COMMENT '存放位置',
    department VARCHAR(100) COMMENT '所属部门',
    purchase_date DATE COMMENT '购入日期',
    commissioning_date DATE COMMENT '投运日期',
    next_calibration_date DATE COMMENT '下次定检日期',
    responsible_person VARCHAR(50) COMMENT '负责人',
    responsible_person_id BIGINT COMMENT '负责人ID',
    utilization DECIMAL(5,2) DEFAULT 0 COMMENT '利用率',
    operating_hours DECIMAL(10,2) DEFAULT 0 COMMENT '运行工时',
    specifications TEXT COMMENT '技术参数',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_device_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备信息表';

-- ============================================
-- 审批流模块
-- ============================================

-- 审批流程定义表
CREATE TABLE IF NOT EXISTS sys_approval_flow (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flow_name VARCHAR(100) NOT NULL COMMENT '流程名称',
    flow_code VARCHAR(50) NOT NULL COMMENT '流程编码',
    business_type VARCHAR(50) COMMENT '业务类型: entrustment/report/outsource',
    description VARCHAR(500) COMMENT '描述',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_flow_code (flow_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批流程定义表';

-- 审批节点表
CREATE TABLE IF NOT EXISTS sys_approval_node (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flow_id BIGINT NOT NULL COMMENT '流程ID',
    node_name VARCHAR(100) NOT NULL COMMENT '节点名称',
    node_order INT NOT NULL COMMENT '节点顺序',
    approver_type VARCHAR(20) COMMENT '审批人类型: role/user/dept',
    approver_ids VARCHAR(500) COMMENT '审批人ID列表',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批节点表';

-- 审批记录表
CREATE TABLE IF NOT EXISTS sys_approval_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flow_id BIGINT NOT NULL COMMENT '流程ID',
    business_type VARCHAR(50) COMMENT '业务类型',
    business_id BIGINT COMMENT '业务ID',
    business_no VARCHAR(50) COMMENT '业务编号',
    current_node_id BIGINT COMMENT '当前节点ID',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/approved/rejected/cancelled',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批记录表';

-- 审批操作日志表
CREATE TABLE IF NOT EXISTS sys_approval_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    record_id BIGINT NOT NULL COMMENT '审批记录ID',
    node_id BIGINT COMMENT '节点ID',
    approver_id BIGINT COMMENT '审批人ID',
    approver_name VARCHAR(50) COMMENT '审批人姓名',
    action VARCHAR(20) COMMENT '操作: approve/reject/transfer',
    comment TEXT COMMENT '审批意见',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批操作日志表';

-- ============================================
-- 签名盖章管理
-- ============================================

-- 签名盖章配置表
CREATE TABLE IF NOT EXISTS sys_signature (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '名称',
    type VARCHAR(20) NOT NULL COMMENT '类型: signature/stamp',
    image_path VARCHAR(500) NOT NULL COMMENT '图片路径',
    user_id BIGINT COMMENT '关联用户ID',
    role_code VARCHAR(50) COMMENT '关联角色编码',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签名盖章配置表';
