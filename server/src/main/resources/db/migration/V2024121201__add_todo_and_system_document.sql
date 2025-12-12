-- =====================================================
-- 2LIMS 功能扩展数据库脚本
-- 版本: V2024121201
-- 功能: 添加待办事项表、体系文件表、报告二维码字段
-- =====================================================

-- -----------------------------------------------------
-- 1. 待办事项表 (biz_todo)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS biz_todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    type VARCHAR(50) NOT NULL COMMENT '类型: quotation_approval, report_approval, task_assignment, sample_receipt, device_calibration',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    priority VARCHAR(20) DEFAULT 'normal' COMMENT '优先级: urgent, high, normal, low',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending, in_progress, completed, overdue',
    due_date DATE COMMENT '截止日期',
    created_by VARCHAR(50) COMMENT '创建人',
    assigned_to VARCHAR(50) COMMENT '被指派人姓名',
    assignee_id BIGINT COMMENT '被指派人ID',
    related_id BIGINT COMMENT '关联业务ID',
    related_no VARCHAR(50) COMMENT '关联业务编号',
    related_type VARCHAR(50) COMMENT '关联业务类型: entrustment, quotation, report, task, device',
    link VARCHAR(200) COMMENT '跳转链接',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
    INDEX idx_assignee_id (assignee_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_type (type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办事项表';

-- -----------------------------------------------------
-- 2. 体系文件表 (biz_system_document)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS biz_system_document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(200) NOT NULL COMMENT '文件名称',
    version VARCHAR(20) NOT NULL COMMENT '版本号，如 V1.0',
    description TEXT COMMENT '文件描述',
    file_path VARCHAR(500) NOT NULL COMMENT '文件存储路径(MinIO)',
    original_name VARCHAR(200) NOT NULL COMMENT '原始文件名',
    file_size BIGINT COMMENT '文件大小(字节)',
    content_type VARCHAR(100) COMMENT '文件MIME类型',
    category VARCHAR(50) COMMENT '分类: manual-质量手册, procedure-程序文件, sop-作业指导书, regulation-管理制度, plan-计划',
    uploader_id BIGINT COMMENT '上传人ID',
    uploader VARCHAR(50) COMMENT '上传人姓名',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='体系文件表';

-- -----------------------------------------------------
-- 3. 报告表添加二维码相关字段
-- -----------------------------------------------------
ALTER TABLE biz_test_report
    ADD COLUMN verification_code VARCHAR(32) COMMENT '防伪验证码' AFTER stamp_image,
    ADD COLUMN qr_code_url VARCHAR(255) COMMENT '二维码图片URL' AFTER verification_code;

ALTER TABLE biz_test_report ADD INDEX idx_verification_code (verification_code);

-- -----------------------------------------------------
-- 4. 插入示例待办数据（可选）
-- -----------------------------------------------------
INSERT INTO biz_todo (type, title, description, priority, status, due_date, created_by, assigned_to, assignee_id, related_type, link) VALUES
('quotation_approval', '报价单待审批 - BJ20241210001', '客户: 奇瑞汽车股份有限公司，金额: ¥15,000', 'high', 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'system', '张经理', 1, 'quotation', '/entrustment/quotation'),
('report_approval', '检测报告待审核 - BG20241210001', '样品: 铝合金试样，检测项目: 金相分析', 'normal', 'pending', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'system', '李主任', 2, 'report', '/report-management/approval'),
('task_assignment', '新任务待分配 - RW20241210001', '委托单: WT20241210001，样品数: 3', 'urgent', 'pending', CURDATE(), 'system', '王工程师', 3, 'task', '/task-management/all-tasks'),
('device_calibration', '设备定检提醒 - 万能试验机', '设备编号: EQ-001，下次检定日期: 2024-12-20', 'high', 'pending', '2024-12-20', 'system', '设备管理员', 4, 'device', '/device-management/calibration');

-- -----------------------------------------------------
-- 5. 插入示例体系文件数据（可选）
-- -----------------------------------------------------
INSERT INTO biz_system_document (name, version, description, file_path, original_name, file_size, content_type, category, uploader, uploader_id) VALUES
('质量手册', 'V1.0', '实验室质量管理体系文件', 'documents/quality-manual-v1.0.pdf', '质量手册V1.0.pdf', 2048000, 'application/pdf', 'manual', '管理员', 1),
('程序文件汇编', 'V2.0', '包含所有程序文件的汇编版本', 'documents/procedures-v2.0.pdf', '程序文件汇编V2.0.pdf', 5120000, 'application/pdf', 'procedure', '管理员', 1),
('金相检测作业指导书', 'V1.0', '金相检测操作规程和要求', 'documents/sop-metallography-v1.0.pdf', '金相检测作业指导书.pdf', 1024000, 'application/pdf', 'sop', '技术负责人', 2),
('设备管理制度', 'V1.5', '设备采购、使用、维护管理规定', 'documents/device-regulation-v1.5.pdf', '设备管理制度V1.5.pdf', 512000, 'application/pdf', 'regulation', '管理员', 1),
('2024年人员培训计划', 'V1.0', '年度培训计划安排', 'documents/training-plan-2024.xlsx', '2024年人员培训计划.xlsx', 256000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'plan', '人事主管', 3);
