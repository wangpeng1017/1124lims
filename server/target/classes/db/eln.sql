-- ELN模板和数据录入表
-- 追加到 business.sql

USE lims;

-- ELN检测模板表
CREATE TABLE IF NOT EXISTS biz_eln_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '模板名称',
    code VARCHAR(50) COMMENT '模板编码',
    test_method VARCHAR(200) COMMENT '检测方法',
    test_standard VARCHAR(200) COMMENT '检测标准',
    test_parameter VARCHAR(200) COMMENT '检测参数',
    template_content TEXT COMMENT '模板内容JSON',
    version VARCHAR(20) DEFAULT '1.0' COMMENT '版本号',
    status TINYINT DEFAULT 1 COMMENT '状态',
    description TEXT COMMENT '描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    create_by VARCHAR(50),
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ELN检测模板表';

-- 检测数据录入表
CREATE TABLE IF NOT EXISTS biz_test_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT COMMENT '任务ID',
    task_no VARCHAR(50) COMMENT '任务编号',
    sample_id BIGINT COMMENT '样品ID',
    sample_no VARCHAR(50) COMMENT '样品编号',
    template_id BIGINT COMMENT '模板ID',
    template_name VARCHAR(200) COMMENT '模板名称',
    data_content TEXT COMMENT '录入数据JSON',
    result_content TEXT COMMENT '计算结果JSON',
    device_id BIGINT COMMENT '设备ID',
    device_name VARCHAR(100) COMMENT '设备名称',
    env_temperature VARCHAR(50) COMMENT '环境温度',
    env_humidity VARCHAR(50) COMMENT '环境湿度',
    tester_id BIGINT COMMENT '检测员ID',
    tester VARCHAR(50) COMMENT '检测员',
    test_time DATETIME COMMENT '检测时间',
    status VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft/submitted/approved/rejected',
    reviewer_id BIGINT COMMENT '审核员ID',
    reviewer VARCHAR(50) COMMENT '审核员',
    review_time DATETIME COMMENT '审核时间',
    review_comment TEXT COMMENT '审核意见',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='检测数据录入表';

-- 插入示例ELN模板
INSERT INTO biz_eln_template (name, code, test_method, test_standard, test_parameter, template_content, description) VALUES
('抗压强度检测模板', 'TPL_COMP_STRENGTH', '压力试验', 'GB/T 50081-2019', '抗压强度', 
'{"fields":[{"name":"sampleSize","label":"试件尺寸(mm)","type":"text","required":true},{"name":"loadValue","label":"破坏荷载(kN)","type":"number","required":true},{"name":"area","label":"承压面积(mm²)","type":"number","required":true}],"formulas":[{"name":"strength","label":"抗压强度(MPa)","formula":"loadValue*1000/area"}]}',
'混凝土抗压强度检测模板'),

('抗折强度检测模板', 'TPL_FLEX_STRENGTH', '弯曲试验', 'GB/T 50081-2019', '抗折强度',
'{"fields":[{"name":"span","label":"跨距(mm)","type":"number","required":true},{"name":"loadValue","label":"破坏荷载(kN)","type":"number","required":true},{"name":"width","label":"试件宽度(mm)","type":"number","required":true},{"name":"height","label":"试件高度(mm)","type":"number","required":true}],"formulas":[{"name":"strength","label":"抗折强度(MPa)","formula":"loadValue*span*1000/(width*height*height)"}]}',
'抗折强度检测模板'),

('拉伸试验模板', 'TPL_TENSILE', '拉伸试验', 'GB/T 228.1-2021', '抗拉强度',
'{"fields":[{"name":"originalArea","label":"原始横截面积(mm²)","type":"number","required":true},{"name":"maxLoad","label":"最大力(kN)","type":"number","required":true},{"name":"yieldLoad","label":"屈服力(kN)","type":"number"},{"name":"originalLength","label":"原始标距(mm)","type":"number"},{"name":"finalLength","label":"断后标距(mm)","type":"number"}],"formulas":[{"name":"tensileStrength","label":"抗拉强度(MPa)","formula":"maxLoad*1000/originalArea"},{"name":"yieldStrength","label":"屈服强度(MPa)","formula":"yieldLoad*1000/originalArea"},{"name":"elongation","label":"断后伸长率(%)","formula":"(finalLength-originalLength)/originalLength*100"}]}',
'金属材料拉伸试验模板');
