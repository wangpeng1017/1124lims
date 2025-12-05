-- 供应商和委外订单表

USE lims;

-- 供应商表
CREATE TABLE IF NOT EXISTS biz_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL COMMENT '供应商编码',
    name VARCHAR(200) NOT NULL COMMENT '供应商名称',
    short_name VARCHAR(100) COMMENT '供应商简称',
    type VARCHAR(20) DEFAULT 'lab' COMMENT '类型: lab/manufacturer/service',
    qualification_level VARCHAR(10) DEFAULT 'B' COMMENT '资质等级: A/B/C',
    qualification_cert VARCHAR(500) COMMENT '资质证书',
    qualification_expiry VARCHAR(20) COMMENT '资质有效期',
    capabilities TEXT COMMENT '服务能力JSON',
    contact_person VARCHAR(50) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    address VARCHAR(500) COMMENT '地址',
    score INT DEFAULT 80 COMMENT '评价分数',
    status TINYINT DEFAULT 1 COMMENT '状态',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- 委外订单表
CREATE TABLE IF NOT EXISTS biz_outsource_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL COMMENT '委外单号',
    supplier_id BIGINT COMMENT '供应商ID',
    supplier_name VARCHAR(200) COMMENT '供应商名称',
    entrustment_id BIGINT COMMENT '关联委托单ID',
    entrustment_no VARCHAR(50) COMMENT '关联委托单号',
    outsource_type VARCHAR(20) DEFAULT 'order' COMMENT '委外类型: order/parameter',
    items TEXT COMMENT '委外项目JSON',
    amount DECIMAL(12,2) DEFAULT 0 COMMENT '委外金额',
    expected_date DATE COMMENT '预计完成日期',
    completed_date DATE COMMENT '实际完成日期',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态',
    approver_id BIGINT COMMENT '审核人ID',
    approver VARCHAR(50) COMMENT '审核人',
    approve_time DATETIME COMMENT '审核时间',
    result_attachment VARCHAR(500) COMMENT '结果附件',
    remark TEXT COMMENT '备注',
    creator_id BIGINT COMMENT '创建人ID',
    creator VARCHAR(50) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='委外订单表';

-- 插入示例供应商
INSERT INTO biz_supplier (code, name, short_name, type, qualification_level, capabilities, contact_person, phone, score) VALUES
('GYS202412050001', '国家建筑材料测试中心', '国家建材中心', 'lab', 'A', '["抗压强度","抗折强度","氯离子含量"]', '张工', '010-12345678', 95),
('GYS202412050002', '省级质量监督检测院', '省质检院', 'lab', 'A', '["钢筋拉伸","混凝土配合比","水泥细度"]', '李工', '021-87654321', 90),
('GYS202412050003', '第三方检测有限公司', '第三方检测', 'lab', 'B', '["基础测试","环境测试"]', '王经理', '0755-11111111', 85);
