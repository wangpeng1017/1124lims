-- ============================================
-- 客户报告模板表
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

-- ============================================
-- 初始化默认模板数据
-- ============================================

INSERT INTO biz_client_report_template (template_code, name, is_default, company_info, pages, declarations, status, version, description) VALUES
(
    'TPL-DEFAULT-001',
    '通用检测报告模板',
    1,
    '{
        "logoUrl": "/assets/altc-logo.png",
        "nameCn": "江苏国轻检测技术有限公司",
        "nameEn": "Jiangsu Guoqing Testing Technology Co.,Ltd",
        "address": "江苏省扬州市邗江区金山路99号B栋1-3层",
        "postalCode": "225000",
        "phone": "0514-80585092"
    }',
    '[
        {
            "id": "cover",
            "type": "cover",
            "name": "封面页",
            "layout": [
                {"id": "logo", "type": "image", "x": 0, "y": 0, "w": 12, "h": 2, "config": {"imageUrl": "/assets/altc-logo.png"}},
                {"id": "title", "type": "text", "x": 0, "y": 3, "w": 12, "h": 2, "config": {"content": "检 测 报 告", "fontSize": 36, "fontWeight": "bold", "textAlign": "center"}},
                {"id": "reportNo", "type": "field", "x": 0, "y": 6, "w": 12, "h": 1, "config": {"fieldKey": "reportNo", "fieldLabel": "报告编号"}},
                {"id": "sampleName", "type": "field", "x": 0, "y": 7, "w": 12, "h": 1, "config": {"fieldKey": "sampleName", "fieldLabel": "样品名称"}},
                {"id": "clientName", "type": "field", "x": 0, "y": 8, "w": 12, "h": 1, "config": {"fieldKey": "clientName", "fieldLabel": "委托单位"}},
                {"id": "declarations", "type": "declaration", "x": 0, "y": 10, "w": 12, "h": 4, "config": {}}
            ]
        },
        {
            "id": "info",
            "type": "info",
            "name": "检测信息页",
            "layout": [
                {"id": "header", "type": "header", "x": 0, "y": 0, "w": 12, "h": 1, "config": {}},
                {"id": "infoTable", "type": "table", "x": 0, "y": 2, "w": 12, "h": 8, "config": {"fields": ["sampleName", "sampleNo", "clientName", "testItems", "testStandards", "testDate"]}},
                {"id": "signatures", "type": "signature", "x": 0, "y": 12, "w": 12, "h": 2, "config": {"roles": ["编制", "审核", "批准"]}}
            ]
        }
    ]',
    '[
        "1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；",
        "2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；",
        "3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；",
        "4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。"
    ]',
    1,
    '1.0',
    '系统默认通用报告模板'
),
(
    'TPL-CHERY-001',
    '奇瑞汽车金相检测报告模板',
    0,
    '{
        "logoUrl": "/assets/altc-logo.png",
        "nameCn": "江苏国轻检测技术有限公司",
        "nameEn": "Jiangsu Guoqing Testing Technology Co.,Ltd",
        "address": "江苏省扬州市邗江区金山路99号B栋1-3层",
        "postalCode": "225000",
        "phone": "0514-80585092"
    }',
    '[
        {
            "id": "cover",
            "type": "cover",
            "name": "封面页",
            "layout": [
                {"id": "logo", "type": "image", "x": 0, "y": 0, "w": 12, "h": 2, "config": {"imageUrl": "/assets/altc-logo.png"}},
                {"id": "title", "type": "text", "x": 0, "y": 3, "w": 12, "h": 2, "config": {"content": "检 测 报 告", "fontSize": 36, "fontWeight": "bold", "textAlign": "center"}},
                {"id": "reportNo", "type": "field", "x": 0, "y": 6, "w": 12, "h": 1, "config": {"fieldKey": "reportNo", "fieldLabel": "报告编号"}},
                {"id": "sampleName", "type": "field", "x": 0, "y": 7, "w": 12, "h": 1, "config": {"fieldKey": "sampleName", "fieldLabel": "样品名称"}},
                {"id": "testItem", "type": "field", "x": 0, "y": 8, "w": 12, "h": 1, "config": {"fieldKey": "testItems", "fieldLabel": "检测项目"}},
                {"id": "clientName", "type": "field", "x": 0, "y": 9, "w": 12, "h": 1, "config": {"fieldKey": "clientName", "fieldLabel": "委托单位"}},
                {"id": "clientAddress", "type": "field", "x": 0, "y": 10, "w": 12, "h": 1, "config": {"fieldKey": "clientAddress", "fieldLabel": "委托单位地址"}},
                {"id": "declarations", "type": "declaration", "x": 0, "y": 12, "w": 12, "h": 4, "config": {}}
            ]
        },
        {
            "id": "info",
            "type": "info",
            "name": "检测信息页",
            "layout": [
                {"id": "header", "type": "header", "x": 0, "y": 0, "w": 12, "h": 1, "config": {}},
                {"id": "infoTable", "type": "table", "x": 0, "y": 2, "w": 12, "h": 8, "config": {"fields": ["sampleName", "sampleNo", "specification", "clientName", "sampleStatus", "sampleQuantity", "receivedDate", "testCategory", "entrustmentId", "testItems", "testStandards", "testDate"]}},
                {"id": "resultSummary", "type": "text", "x": 0, "y": 11, "w": 12, "h": 2, "config": {"content": "实测结果见数据页。", "textAlign": "left"}},
                {"id": "signatures", "type": "signature", "x": 0, "y": 14, "w": 12, "h": 2, "config": {"roles": ["编制", "审核", "批准"]}}
            ]
        },
        {
            "id": "result",
            "type": "result",
            "name": "检测结果页",
            "layout": [
                {"id": "header", "type": "header", "x": 0, "y": 0, "w": 12, "h": 1, "config": {}},
                {"id": "resultTitle", "type": "text", "x": 0, "y": 2, "w": 12, "h": 1, "config": {"content": "检测结果:", "fontWeight": "bold"}},
                {"id": "resultDesc", "type": "field", "x": 0, "y": 3, "w": 12, "h": 3, "config": {"fieldKey": "resultDescription"}},
                {"id": "imageTable", "type": "table", "x": 0, "y": 7, "w": 12, "h": 8, "config": {"type": "image", "columns": ["样品编号", "金相"]}}
            ]
        }
    ]',
    '[
        "1.本报告样品名称、批号（标识）、原样编号由送检方提供，本公司不负责真伪；本报告只对送检样品负责；",
        "2.若对本报告有异议，请于报告发出之日起15日内向本公司提出，逾期不予受理；",
        "3.本报告任何涂改增删无效，复印件未加盖本单位印章无效；单独抽出某些页导致误解或用于其他用途而造成的后果，本公司不负任何法律责任；",
        "4.未经本公司同意，任何单位或个人不得引用本报告及本公司的名义作广告宣传。"
    ]',
    1,
    '1.0',
    '奇瑞汽车专用金相检测报告模板'
);
