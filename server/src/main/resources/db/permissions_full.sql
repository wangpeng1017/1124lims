-- ============================================
-- 完整权限初始化脚本
-- 为管理员角色分配所有模块的完整权限
-- ============================================

USE lims;

-- 清理现有权限数据（保留表结构）
DELETE FROM sys_role_permission WHERE role_id = 1;
DELETE FROM sys_permission WHERE id > 148; -- 保留基础权限，添加新权限

-- ============================================
-- 1. 委托管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('委托单管理', 'entrustment', 0, 1, '/entrustment', 10),
('委托单-查询', 'entrustment:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 1),
('委托单-新增', 'entrustment:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 2),
('委托单-编辑', 'entrustment:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 3),
('委托单-删除', 'entrustment:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 4),
('委托单-导出', 'entrustment:export', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 5),
('委托单-提交审批', 'entrustment:submit', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='entrustment' LIMIT 1) AS tmp), 2, 6);

-- 咨询管理
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('咨询管理', 'consultation', 0, 1, '/entrustment/consultation', 11),
('咨询-查询', 'consultation:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 1),
('咨询-新增', 'consultation:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 2),
('咨询-编辑', 'consultation:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 3),
('咨询-删除', 'consultation:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 4),
('咨询-关闭', 'consultation:close', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 5),
('咨询-添加跟进', 'consultation:follow', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consultation' LIMIT 1) AS tmp), 2, 6);

-- 报价单管理
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('报价单管理', 'quotation', 0, 1, '/entrustment/quotation', 12),
('报价单-查询', 'quotation:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 1),
('报价单-新增', 'quotation:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 2),
('报价单-编辑', 'quotation:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 3),
('报价单-删除', 'quotation:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 4),
('报价单-审核', 'quotation:approve', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 5),
('报价单-导出', 'quotation:export', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='quotation' LIMIT 1) AS tmp), 2, 6);

-- 合同管理
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('合同管理', 'contract', 0, 1, '/entrustment/contract', 13),
('合同-查询', 'contract:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='contract' LIMIT 1) AS tmp), 2, 1),
('合同-新增', 'contract:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='contract' LIMIT 1) AS tmp), 2, 2),
('合同-编辑', 'contract:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='contract' LIMIT 1) AS tmp), 2, 3),
('合同-删除', 'contract:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='contract' LIMIT 1) AS tmp), 2, 4),
('合同-签订', 'contract:sign', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='contract' LIMIT 1) AS tmp), 2, 5);

-- 客户管理
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('客户管理', 'client', 0, 1, '/entrustment/client', 14),
('客户-查询', 'client:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='client' LIMIT 1) AS tmp), 2, 1),
('客户-新增', 'client:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='client' LIMIT 1) AS tmp), 2, 2),
('客户-编辑', 'client:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='client' LIMIT 1) AS tmp), 2, 3),
('客户-删除', 'client:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='client' LIMIT 1) AS tmp), 2, 4),
('客户-导出', 'client:export', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='client' LIMIT 1) AS tmp), 2, 5);

-- ============================================
-- 2. 样品管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('样品管理', 'sample', 0, 1, '/sample', 20),
('样品-查询', 'sample:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 1),
('样品-新增', 'sample:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 2),
('样品-编辑', 'sample:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 3),
('样品-删除', 'sample:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 4),
('样品-接收', 'sample:receive', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 5),
('样品-流转', 'sample:transfer', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 6),
('样品-返还', 'sample:return', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 7),
('样品-处置', 'sample:destroy', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='sample' LIMIT 1) AS tmp), 2, 8);

-- ============================================
-- 3. 任务管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('任务管理', 'task', 0, 1, '/task', 30),
('任务-查询', 'task:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='task' LIMIT 1) AS tmp), 2, 1),
('任务-分配', 'task:assign', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='task' LIMIT 1) AS tmp), 2, 2),
('任务-执行', 'task:execute', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='task' LIMIT 1) AS tmp), 2, 3),
('任务-完成', 'task:complete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='task' LIMIT 1) AS tmp), 2, 4),
('任务-取消', 'task:cancel', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='task' LIMIT 1) AS tmp), 2, 5);

-- ============================================
-- 4. 检测管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('检测管理', 'test', 0, 1, '/test', 40),
('检测-查询', 'test:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='test' LIMIT 1) AS tmp), 2, 1),
('检测-数据录入', 'test:dataentry', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='test' LIMIT 1) AS tmp), 2, 2),
('检测-编辑', 'test:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='test' LIMIT 1) AS tmp), 2, 3),
('检测-审核', 'test:review', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='test' LIMIT 1) AS tmp), 2, 4);

-- ============================================
-- 5. 报告管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('报告管理', 'report', 0, 1, '/report', 50),
('报告-查询', 'report:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 1),
('报告-生成', 'report:generate', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 2),
('报告-编辑', 'report:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 3),
('报告-删除', 'report:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 4),
('报告-审核', 'report:review', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 5),
('报告-批准', 'report:approve', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 6),
('报告-签发', 'report:issue', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 7),
('报告-导出', 'report:export', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 8),
('报告-打印', 'report:print', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 9),
('报告模板-管理', 'report:template', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='report' LIMIT 1) AS tmp), 2, 10);

-- ============================================
-- 6. 设备管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('设备管理', 'device', 0, 1, '/device', 60),
('设备-查询', 'device:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 1),
('设备-新增', 'device:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 2),
('设备-编辑', 'device:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 3),
('设备-删除', 'device:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 4),
('设备-维护', 'device:maintain', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 5),
('设备-校准', 'device:calibrate', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 6),
('设备-维修', 'device:repair', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 7),
('设备-报废', 'device:scrap', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='device' LIMIT 1) AS tmp), 2, 8);

-- ============================================
-- 7. 财务管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('财务管理', 'finance', 0, 1, '/finance', 70),
('应收-查询', 'finance:receivable:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 1),
('应收-新增', 'finance:receivable:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 2),
('应收-编辑', 'finance:receivable:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 3),
('应收-删除', 'finance:receivable:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 4),
('收款-查询', 'finance:payment:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 5),
('收款-登记', 'finance:payment:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 6),
('发票-查询', 'finance:invoice:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 7),
('发票-开具', 'finance:invoice:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 8),
('成本-查询', 'finance:cost:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 9),
('成本-编辑', 'finance:cost:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='finance' LIMIT 1) AS tmp), 2, 10);

-- ============================================
-- 8. 供应商管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('供应商管理', 'supplier', 0, 1, '/supplier', 80),
('供应商-查询', 'supplier:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='supplier' LIMIT 1) AS tmp), 2, 1),
('供应商-新增', 'supplier:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='supplier' LIMIT 1) AS tmp), 2, 2),
('供应商-编辑', 'supplier:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='supplier' LIMIT 1) AS tmp), 2, 3),
('供应商-删除', 'supplier:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='supplier' LIMIT 1) AS tmp), 2, 4),
('供应商-评价', 'supplier:evaluate', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='supplier' LIMIT 1) AS tmp), 2, 5);

-- ============================================
-- 9. 委外管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('委外管理', 'outsource', 0, 1, '/outsource', 90),
('委外-查询', 'outsource:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='outsource' LIMIT 1) AS tmp), 2, 1),
('委外-新增', 'outsource:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='outsource' LIMIT 1) AS tmp), 2, 2),
('委外-编辑', 'outsource:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='outsource' LIMIT 1) AS tmp), 2, 3),
('委外-删除', 'outsource:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='outsource' LIMIT 1) AS tmp), 2, 4),
('委外-结算', 'outsource:settle', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='outsource' LIMIT 1) AS tmp), 2, 5);

-- ============================================
-- 10. 人员管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('人员管理', 'personnel', 0, 1, '/personnel', 100),
('人员-查询', 'personnel:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='personnel' LIMIT 1) AS tmp), 2, 1),
('人员-新增', 'personnel:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='personnel' LIMIT 1) AS tmp), 2, 2),
('人员-编辑', 'personnel:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='personnel' LIMIT 1) AS tmp), 2, 3),
('人员-删除', 'personnel:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='personnel' LIMIT 1) AS tmp), 2, 4),
('人员-能力评价', 'personnel:capability', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='personnel' LIMIT 1) AS tmp), 2, 5);

-- ============================================
-- 11. 耗材管理模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('耗材管理', 'consumable', 0, 1, '/consumable', 110),
('耗材-查询', 'consumable:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 1),
('耗材-新增', 'consumable:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 2),
('耗材-编辑', 'consumable:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 3),
('耗材-删除', 'consumable:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 4),
('耗材-入库', 'consumable:in', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 5),
('耗材-出库', 'consumable:out', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='consumable' LIMIT 1) AS tmp), 2, 6);

-- ============================================
-- 12. 统计报表模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('统计报表', 'statistics', 0, 1, '/statistics', 120),
('统计-委托统计', 'statistics:entrustment', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='statistics' LIMIT 1) AS tmp), 2, 1),
('统计-样品统计', 'statistics:sample', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='statistics' LIMIT 1) AS tmp), 2, 2),
('统计-任务统计', 'statistics:task', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='statistics' LIMIT 1) AS tmp), 2, 3),
('统计-设备利用率', 'statistics:device', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='statistics' LIMIT 1) AS tmp), 2, 4);

-- ============================================
-- 13. 系统设置模块权限（扩展）
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, sort) VALUES
('部门-查询', 'system:dept:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 4),
('部门-新增', 'system:dept:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 5),
('部门-编辑', 'system:dept:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 6),
('部门-删除', 'system:dept:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 7),
('审批流程-管理', 'system:workflow', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 8),
('基础数据-管理', 'system:basicdata', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 9),
('检测标准-管理', 'system:standard', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 10),
('报告模板-管理', 'system:reporttemplate', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='system' LIMIT 1) AS tmp), 2, 11);

-- ============================================
-- 14. 其他模块权限
-- ============================================
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('文档管理', 'document', 0, 1, '/document', 130),
('文档-查询', 'document:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='document' LIMIT 1) AS tmp), 2, 1),
('文档-新增', 'document:create', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='document' LIMIT 1) AS tmp), 2, 2),
('文档-编辑', 'document:update', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='document' LIMIT 1) AS tmp), 2, 3),
('文档-删除', 'document:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='document' LIMIT 1) AS tmp), 2, 4);

-- 待办事项
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('待办事项', 'todo', 0, 1, '/todo', 140),
('待办-查询', 'todo:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='todo' LIMIT 1) AS tmp), 2, 1),
('待办-处理', 'todo:handle', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='todo' LIMIT 1) AS tmp), 2, 2);

-- 签名管理
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('签名管理', 'signature', 0, 1, '/signature', 150),
('签名-上传', 'signature:upload', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='signature' LIMIT 1) AS tmp), 2, 1),
('签名-删除', 'signature:delete', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='signature' LIMIT 1) AS tmp), 2, 2);

-- 公共报告查询
INSERT INTO sys_permission (permission_name, permission_code, parent_id, type, path, sort) VALUES
('公共报告查询', 'public:report', 0, 1, '/public/report', 160),
('公共报告-查询', 'public:report:query', (SELECT id FROM (SELECT id FROM sys_permission WHERE permission_code='public:report' LIMIT 1) AS tmp), 2, 1);

-- ============================================
-- 为管理员角色分配所有权限
-- ============================================
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT 1, id FROM sys_permission;

-- ============================================
-- 确认管理员账号配置
-- ============================================
-- 用户名: admin
-- 密码: admin123
-- 角色: 系统管理员 (admin)
-- 数据权限: 全部数据 (data_scope = 1)

-- 验证查询
-- SELECT u.username, u.real_name, r.role_code, r.data_scope, COUNT(rp.permission_id) as permission_count
-- FROM sys_user u
-- JOIN sys_user_role ur ON u.id = ur.user_id
-- JOIN sys_role r ON ur.role_id = r.id
-- LEFT JOIN sys_role_permission rp ON r.id = rp.role_id
-- WHERE u.username = 'admin'
-- GROUP BY u.id, r.id;
