-- 客户、合同、报价表
-- 追加到 business.sql

USE lims;

-- 合同表
CREATE TABLE IF NOT EXISTS biz_contract (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_no VARCHAR(50) NOT NULL COMMENT '合同编号',
    name VARCHAR(200) COMMENT '合同名称',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(200) COMMENT '客户名称',
    entrustment_id BIGINT COMMENT '关联委托单ID',
    entrustment_no VARCHAR(50) COMMENT '关联委托单号',
    contract_type VARCHAR(20) DEFAULT 'single' COMMENT '合同类型: single/framework/yearly',
    amount DECIMAL(12,2) DEFAULT 0 COMMENT '合同金额',
    paid_amount DECIMAL(12,2) DEFAULT 0 COMMENT '已付金额',
    sign_date DATE COMMENT '签订日期',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    attachment_path VARCHAR(500) COMMENT '合同附件',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft/pending/active/completed/cancelled',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_contract_no (contract_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合同表';

-- 报价单表
CREATE TABLE IF NOT EXISTS biz_quotation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_no VARCHAR(50) NOT NULL COMMENT '报价单号',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(200) COMMENT '客户名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    total_amount DECIMAL(12,2) DEFAULT 0 COMMENT '报价总金额',
    discount_amount DECIMAL(12,2) DEFAULT 0 COMMENT '优惠金额',
    actual_amount DECIMAL(12,2) DEFAULT 0 COMMENT '实际金额',
    valid_until DATE COMMENT '有效期至',
    items TEXT COMMENT '报价明细JSON',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft/submitted/approved/rejected/expired',
    remark TEXT COMMENT '备注',
    creator_id BIGINT COMMENT '创建人ID',
    creator VARCHAR(50) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_quotation_no (quotation_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报价单表';
