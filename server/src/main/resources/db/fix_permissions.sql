-- 修复403权限问题 - 添加缺失的API权限
USE lims;

-- 插入缺失的API权限
INSERT IGNORE INTO sys_permission (permission_name, permission_code, parent_id, type, sort) VALUES
('首页-查看', 'dashboard:view', 1, 2, 1),
('待办-查看', 'todo:view', 0, 3, 1),
('待办-管理', 'todo:manage', 0, 3, 2),
('咨询-查看', 'consultation:view', 0, 3, 3),
('咨询-管理', 'consultation:manage', 0, 3, 4),
('咨询-查询', 'consultation:query', 0, 3, 5),
('报价单-查看', 'quotation:view', 0, 3, 6),
('报价单-管理', 'quotation:manage', 0, 3, 7),
('报价单-查询', 'quotation:query', 0, 3, 8);

-- 为管理员角色分配所有权限（包括新添加的）
INSERT IGNORE INTO sys_role_permission (role_id, permission_id)
SELECT 1, id FROM sys_permission;

-- 验证管理员权限配置
SELECT
    u.username,
    u.real_name,
    r.role_code,
    COUNT(rp.permission_id) as permission_count
FROM sys_user u
JOIN sys_user_role ur ON u.id = ur.user_id
JOIN sys_role r ON ur.role_id = r.id
LEFT JOIN sys_role_permission rp ON r.id = rp.role_id
WHERE u.username = 'admin'
GROUP BY u.id, r.id;
