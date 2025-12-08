-- LIMS 业务数据预置脚本
-- 基于前端 mock 数据转换

USE lims;

-- ============================================
-- 客户数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_client (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '客户名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(255) COMMENT '地址',
    tax_id VARCHAR(50) COMMENT '税号',
    invoice_address VARCHAR(255) COMMENT '开票地址',
    invoice_phone VARCHAR(20) COMMENT '开票电话',
    bank_name VARCHAR(100) COMMENT '开户银行',
    bank_account VARCHAR(50) COMMENT '银行账号',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    creator VARCHAR(50) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表';

INSERT INTO biz_client (id, name, contact_person, contact_phone, address, tax_id, invoice_address, invoice_phone, bank_name, bank_account, creator) VALUES
(1, '奇瑞汽车股份有限公司', '王经理', '13800138001', '安徽省芜湖市经济技术开发区长春路8号', '91340200713920435C', '安徽省芜湖市经济技术开发区长春路8号', '0553-5961111', '中国工商银行芜湖分行', '1307023009022100123', 'admin'),
(2, '上海汽车集团股份有限公司', '李主管', '13900139002', '上海市静安区威海路489号', '91310000132260250X', '上海市静安区威海路489号', '021-22011888', '上海银行总行营业部', '31628800003029888', 'admin'),
(3, '比亚迪汽车工业有限公司', '赵工', '13700137003', '深圳市坪山区比亚迪路3009号', '91440300791705886F', '深圳市坪山区比亚迪路3009号', '0755-89888888', '中国建设银行深圳坪山支行', '44201583400052500888', 'admin'),
(4, '长城汽车股份有限公司', '孙经理', '13600136004', '河北省保定市朝阳南大街2266号', '91130600726236824F', '河北省保定市朝阳南大街2266号', '0312-2196666', '中国银行保定分行', '100147896325', 'admin');

-- ============================================
-- 合同数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_contract (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_no VARCHAR(50) NOT NULL COMMENT '合同编号',
    name VARCHAR(200) COMMENT '合同名称',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    amount DECIMAL(12,2) COMMENT '合同金额',
    sign_date DATE COMMENT '签订日期',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态',
    attachment VARCHAR(255) COMMENT '附件',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合同表';

INSERT INTO biz_contract (id, contract_no, name, client_id, client_name, amount, sign_date, status) VALUES
(1, 'HT20231101', '年度检测服务合同', 1, '奇瑞汽车股份有限公司', 500000.00, '2023-01-01', 'signed'),
(2, 'HT20231102', '专项检测合同', 2, '上海汽车集团股份有限公司', 200000.00, '2023-06-15', 'pending');

-- ============================================
-- 委托单数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_entrustment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entrustment_no VARCHAR(50) NOT NULL COMMENT '委托编号',
    contract_no VARCHAR(50) COMMENT '合同编号',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    sample_date DATE COMMENT '送样日期',
    follower VARCHAR(50) COMMENT '跟单人',
    follower_id BIGINT COMMENT '跟单人ID',
    sample_name VARCHAR(100) COMMENT '样品名称',
    sample_model VARCHAR(100) COMMENT '样品型号',
    sample_material VARCHAR(100) COMMENT '样品材质',
    sample_quantity INT COMMENT '样品数量',
    is_sample_return TINYINT DEFAULT 0 COMMENT '是否返还样品',
    test_items TEXT COMMENT '检测项目',
    estimated_amount DECIMAL(12,2) COMMENT '预计费用',
    expected_date DATE COMMENT '期望完成日期',
    remark TEXT COMMENT '备注',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    create_by VARCHAR(50),
    update_by VARCHAR(50),
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='委托单表';

INSERT INTO biz_entrustment (id, entrustment_no, contract_no, client_id, client_name, contact_person, sample_date, follower, sample_name, sample_model, sample_material, sample_quantity, is_sample_return, test_items, status) VALUES
(1, 'WT20231101001', 'HT20231101', 1, '奇瑞汽车股份有限公司', '张经理', '2023-11-01', '李四', 'C30混凝土试块', '150*150*150mm', 'C30', 3, 0, '抗压强度', 'completed'),
(2, 'WT20231102002', NULL, 2, '上海汽车集团股份有限公司', NULL, '2023-11-02', '王五', 'HRB400E钢筋', NULL, NULL, NULL, 0, '屈服强度、抗拉强度、伸长率', 'testing'),
(3, 'WT20231103003', NULL, 3, '比亚迪汽车工业有限公司', NULL, '2023-11-03', '赵六', '水泥', NULL, NULL, NULL, 0, '凝结时间、安定性、强度', 'testing'),
(4, 'WT20231104004', NULL, 4, '长城汽车股份有限公司', NULL, '2023-11-04', '张三', '砂石料', NULL, NULL, NULL, 0, '颗粒级配、含泥量', 'pending'),
(5, 'WT20231105005', NULL, 1, '奇瑞汽车股份有限公司', NULL, '2023-11-05', '李四', '沥青混合料', NULL, NULL, NULL, 0, '马歇尔稳定度、流值', 'pending');

-- ============================================
-- 样品数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_sample (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sample_no VARCHAR(50) NOT NULL COMMENT '样品编号',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    name VARCHAR(100) COMMENT '样品名称',
    spec VARCHAR(100) COMMENT '规格型号',
    material VARCHAR(100) COMMENT '材质',
    quantity INT COMMENT '数量',
    unit VARCHAR(20) COMMENT '单位',
    receipt_date DATE COMMENT '收样日期',
    receipt_person VARCHAR(50) COMMENT '收样人',
    receipt_person_id BIGINT COMMENT '收样人ID',
    storage_location VARCHAR(100) COMMENT '存放位置',
    photos TEXT COMMENT '照片路径',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态',
    is_outsourced TINYINT DEFAULT 0 COMMENT '是否委外',
    outsource_supplier_id BIGINT COMMENT '委外供应商ID',
    outsource_supplier_name VARCHAR(100) COMMENT '委外供应商名称',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='样品表';

INSERT INTO biz_sample (id, sample_no, entrustment_id, entrustment_no, name, spec, quantity, unit, receipt_date, receipt_person, status) VALUES
(1, 'S20231101001', 1, 'WT20231101001', '钢筋混凝土试件', 'C30', 3, '个', '2023-11-01', '张三', 'testing'),
(2, 'S20231101002', 1, 'WT20231101001', '水泥试样', 'P.O 42.5', 5, 'kg', '2023-11-01', '张三', 'received'),
(3, 'S20231102001', 2, 'WT20231102001', '砂石料', '中砂', 10, 'kg', '2023-11-02', '李四', 'assigned'),
(4, 'S20231103001', 3, 'WT20231103001', '沥青混合料', 'AC-13C', 2, '个', '2023-11-03', '张三', 'pending'),
(5, 'S20231103002', 3, 'WT20231103001', '沥青混合料', 'AC-20C', 2, '个', '2023-11-03', '张三', 'pending'),
(6, 'S20231104001', 4, 'WT20231104001', '钢绞线', '1x7-15.20-1860', 5, '个', '2023-11-04', '李四', 'received'),
(7, 'S20231105001', 5, 'WT20231105001', '土工布', '200g/m2', 10, '个', '2023-11-05', '王五', 'testing'),
(8, 'S20231106001', NULL, 'WT20231106001', '防水卷材', 'SBS I PY PE 3.0', 3, '个', '2023-11-06', '赵六', 'completed'),
(9, 'S20231107001', NULL, 'WT20231107001', '外加剂', '聚羧酸减水剂', 1, 'L', '2023-11-07', '张三', 'returned'),
(10, 'S20231108001', NULL, 'WT20231108001', '粉煤灰', 'F类 II级', 5, 'kg', '2023-11-08', '李四', 'destroyed');

-- ============================================
-- 设备数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_device (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL COMMENT '设备编号',
    name VARCHAR(100) NOT NULL COMMENT '设备名称',
    model VARCHAR(100) COMMENT '型号',
    manufacturer VARCHAR(100) COMMENT '制造商',
    serial_number VARCHAR(100) COMMENT '出厂编号',
    asset_type VARCHAR(20) DEFAULT 'device' COMMENT '资产类型',
    status VARCHAR(20) DEFAULT 'idle' COMMENT '状态',
    location VARCHAR(100) COMMENT '存放位置',
    department VARCHAR(50) COMMENT '所属部门',
    purchase_date DATE COMMENT '采购日期',
    commissioning_date DATE COMMENT '启用日期',
    last_calibration_date DATE COMMENT '上次定检日期',
    next_calibration_date DATE COMMENT '下次定检日期',
    responsible_person VARCHAR(50) COMMENT '负责人',
    responsible_person_id BIGINT COMMENT '负责人ID',
    utilization INT DEFAULT 0 COMMENT '利用率',
    operating_hours INT DEFAULT 0 COMMENT '运行时长',
    specifications TEXT COMMENT '技术规格',
    remarks TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备表';

INSERT INTO biz_device (id, code, name, model, manufacturer, serial_number, asset_type, status, location, department, purchase_date, commissioning_date, next_calibration_date, responsible_person, utilization, operating_hours) VALUES
(1, 'ALTCCS-2022001', '火花源原子发射光谱仪', 'SPECTRO MAXx', 'SPECTRO', 'SN2022001', 'instrument', 'running', '光谱室', '检测部', '2022-01-15', '2022-02-01', '2024-02-01', '张三', 30, 1200),
(2, 'ALTCCS-2022005', '全自动显微维氏硬度计', 'THVS-1MDX-AXYZF', 'Time Group', 'SN2022005', 'instrument', 'running', '硬度室', '检测部', '2022-03-10', '2022-03-20', '2024-03-20', '李四', 20, 500),
(3, 'ALTCCS-2022006', '布氏硬度计', 'THB-3000S', 'Time Group', 'SN2022006', 'instrument', 'running', '硬度室', '检测部', '2022-03-12', '2022-03-22', '2024-03-22', '张三', 20, 450),
(4, 'ALTCCS-2022008', '洛氏硬度计', 'THR-150DT', 'Time Group', 'SN2022008', 'instrument', 'running', '硬度室', '检测部', '2022-03-15', '2022-03-25', '2024-03-25', '李四', 20, 480),
(5, 'ALTCCS-2022013', '金相显微镜', 'AE2000MET', 'Motic', 'SN2022013', 'instrument', 'running', '金相室', '检测部', '2022-04-01', '2022-04-10', '2024-04-10', '张三', 30, 800),
(6, 'ALTCCS-2022026', '水平燃烧测试仪', 'TTech-GB8410-T', 'TTech', 'SN2022026', 'device', 'running', '燃烧室', '检测部', '2022-05-05', '2022-05-15', '2024-05-15', '李四', 20, 300),
(7, 'ALTCCS-2022027', '垂直燃烧测试仪', 'TTech-GB32086-T', 'TTech', 'SN2022027', 'device', 'running', '燃烧室', '检测部', '2022-05-06', '2022-05-16', '2024-05-16', '张三', 20, 320),
(8, 'ALTCCS-2022035', '盐雾试验箱（中性）', 'QS-ST-720optA', 'Q-LAB', 'SN2022035', 'device', 'running', '环境实验室', '检测部', '2022-06-01', '2022-06-10', '2024-06-10', '李四', 60, 2000),
(9, 'ALTCCS-2022052', '2T电子万能试验机', 'CMT4204', 'SANS', 'SN2022052', 'device', 'running', '力学室', '检测部', '2022-07-01', '2022-07-10', '2024-07-10', '张三', 50, 1500),
(10, 'ALTCCS-2022053', '5T电子万能试验机', 'E45.504', 'MTS', 'SN2022053', 'device', 'running', '力学室', '检测部', '2022-07-05', '2022-07-15', '2024-07-15', '李四', 50, 1600),
(11, 'ALTCCS-2022055', '熔体流动速率试验机', 'ZRE1452', 'Zwick', 'SN2022055', 'device', 'running', '物理室', '检测部', '2022-08-01', '2022-08-10', '2024-08-10', '张三', 30, 600),
(12, 'ALTCCS-2022056', '热变形维卡试验机', 'ZWK1302-B', 'Zwick', 'SN2022056', 'device', 'running', '物理室', '检测部', '2022-08-05', '2022-08-15', '2024-08-15', '李四', 30, 650),
(13, 'ALTCCS-2022061', '电子天平', 'MSA2203S-1CE-DE', 'Sartorius', 'SN2022061', 'instrument', 'running', '天平室', '检测部', '2022-09-01', '2022-09-05', '2024-09-05', '张三', 40, 1000),
(14, 'ALTCCS-2022063', '摆锤冲击试验机', 'ZBC7550-B', 'Zwick', 'SN2022063', 'device', 'running', '力学室', '检测部', '2022-09-10', '2022-09-20', '2024-09-20', '李四', 30, 400),
(15, 'ALTCCS-2022066', '数显游标卡尺', '500-196-30', 'Mitutoyo', 'SN2022066', 'instrument', 'running', '尺寸室', '检测部', '2022-10-01', '2022-10-05', '2024-10-05', '张三', 50, 800);

-- ============================================
-- 任务数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_test_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_no VARCHAR(50) NOT NULL COMMENT '任务编号',
    sample_id BIGINT COMMENT '样品ID',
    sample_no VARCHAR(50) COMMENT '样品编号',
    sample_name VARCHAR(100) COMMENT '样品名称',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    test_items TEXT COMMENT '检测项目',
    assignee_id BIGINT COMMENT '检测员ID',
    assignee VARCHAR(50) COMMENT '检测员',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态',
    priority VARCHAR(10) DEFAULT 'normal' COMMENT '优先级',
    due_date DATE COMMENT '截止日期',
    start_date DATE COMMENT '开始日期',
    completed_date DATE COMMENT '完成日期',
    progress INT DEFAULT 0 COMMENT '进度',
    is_outsourced TINYINT DEFAULT 0 COMMENT '是否委外',
    outsource_supplier_id BIGINT COMMENT '委外供应商ID',
    outsource_supplier_name VARCHAR(100) COMMENT '委外供应商名称',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测任务表';

INSERT INTO biz_test_task (id, task_no, sample_id, sample_no, sample_name, entrustment_id, entrustment_no, test_items, assignee_id, assignee, status, priority, due_date, start_date, progress) VALUES
(1, 'TASK20231101001', 1, 'S20231101001', '钢筋混凝土试件', 1, 'WT20231101001', '抗压强度', 3, '王五', 'in_progress', 'high', '2023-11-10', '2023-11-02', 60),
(2, 'TASK20231102001', 3, 'S20231102001', '砂石料', 2, 'WT20231102001', '级配分析', 4, '赵六', 'pending', 'normal', '2023-11-12', NULL, 0),
(3, 'TASK20231103001', 7, 'S20231105001', '土工布', 5, 'WT20231105001', '拉伸强度、撕裂强度', 3, '王五', 'in_progress', 'normal', '2023-11-15', '2023-11-06', 30);

-- ============================================
-- 报告数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_test_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_no VARCHAR(50) NOT NULL COMMENT '报告编号',
    task_id BIGINT COMMENT '任务ID',
    task_no VARCHAR(50) COMMENT '任务编号',
    entrustment_id BIGINT COMMENT '委托单ID',
    entrustment_no VARCHAR(50) COMMENT '委托单号',
    client_id BIGINT COMMENT '客户ID',
    client_name VARCHAR(100) COMMENT '客户名称',
    sample_name VARCHAR(100) COMMENT '样品名称',
    test_items TEXT COMMENT '检测项目',
    conclusion TEXT COMMENT '结论',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态',
    compiler_id BIGINT COMMENT '编制人ID',
    compiler VARCHAR(50) COMMENT '编制人',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewer VARCHAR(50) COMMENT '审核人',
    review_time DATETIME COMMENT '审核时间',
    approver_id BIGINT COMMENT '批准人ID',
    approver VARCHAR(50) COMMENT '批准人',
    approve_time DATETIME COMMENT '批准时间',
    issue_date DATE COMMENT '签发日期',
    signature_image VARCHAR(255) COMMENT '签名图片',
    stamp_image VARCHAR(255) COMMENT '盖章图片',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测报告表';

INSERT INTO biz_test_report (id, report_no, task_id, task_no, entrustment_id, entrustment_no, client_id, client_name, sample_name, test_items, conclusion, status, compiler, reviewer, approver) VALUES
(1, 'RPT-20231125-001', 1, 'TASK20231101001', 1, 'WT20231101001', 1, '奇瑞汽车股份有限公司', '钢筋混凝土试件', '抗压强度', '样品符合GB/T 50081-2019标准要求', 'issued', '王五', '李四', '张三'),
(2, 'RPT-20231125-002', 2, 'TASK20231102001', 2, 'WT20231102001', 2, '建筑材料公司', '砂石料', '级配分析', NULL, 'pending_review', '赵六', NULL, NULL);

-- ============================================
-- 供应商数据
-- ============================================

CREATE TABLE IF NOT EXISTS biz_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    code VARCHAR(50) COMMENT '供应商编号',
    type VARCHAR(20) COMMENT '类型：laboratory/equipment/consumable',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(255) COMMENT '地址',
    qualifications TEXT COMMENT '资质信息',
    status TINYINT DEFAULT 1 COMMENT '状态',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

INSERT INTO biz_supplier (id, name, code, type, contact_person, contact_phone, address, status) VALUES
(1, '华测检测认证集团', 'SUP001', 'laboratory', '张经理', '13800138001', '深圳市南山区高新技术产业园', 1),
(2, '谱尼测试集团', 'SUP002', 'laboratory', '李主管', '13900139002', '北京市海淀区知春路', 1),
(3, '安捷伦科技', 'SUP003', 'equipment', '王工', '13700137003', '上海市浦东新区张江高科技园区', 1),
(4, '岛津企业管理', 'SUP004', 'equipment', '赵经理', '13600136004', '上海市静安区铜仁路', 1);
