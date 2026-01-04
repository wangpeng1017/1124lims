package com.lims.controller;

import com.lims.common.Result;
import com.lims.entity.SysPermission;
import com.lims.entity.SysRolePermission;
import com.lims.mapper.SysPermissionMapper;
import com.lims.mapper.SysRolePermissionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * 临时权限修复Controller
 * 部署后可删除
 */
@RestController
@RequestMapping("/admin/fix")
@RequiredArgsConstructor
public class PermissionFixController {

    private final SysPermissionMapper permissionMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    /**
     * 修复403权限问题 - 添加缺失的API权限
     */
    @PostMapping("/permissions")
    public Result<String> fixPermissions() {
        // 需要添加的权限列表
        List<PermissionToCreate> permissionsToAdd = Arrays.asList(
            new PermissionToCreate("首页-查看", "dashboard:view", 1L, (byte) 2, 1),
            new PermissionToCreate("待办-查看", "todo:view", 0L, (byte) 3, 1),
            new PermissionToCreate("待办-管理", "todo:manage", 0L, (byte) 3, 2),
            new PermissionToCreate("咨询-查看", "consultation:view", 0L, (byte) 3, 3),
            new PermissionToCreate("咨询-管理", "consultation:manage", 0L, (byte) 3, 4),
            new PermissionToCreate("咨询-查询", "consultation:query", 0L, (byte) 3, 5),
            new PermissionToCreate("报价单-查看", "quotation:view", 0L, (byte) 3, 6),
            new PermissionToCreate("报价单-管理", "quotation:manage", 0L, (byte) 3, 7),
            new PermissionToCreate("报价单-查询", "quotation:query", 0L, (byte) 3, 8)
        );

        int addedCount = 0;
        for (PermissionToCreate p : permissionsToAdd) {
            // 检查权限是否已存在
            Long existingId = permissionMapper.selectByCode(p.permissionCode);
            if (existingId == null) {
                SysPermission permission = new SysPermission();
                permission.setPermissionName(p.permissionName);
                permission.setPermissionCode(p.permissionCode);
                permission.setParentId(p.parentId);
                permission.setType(p.type);
                permission.setSort(p.sort);
                permission.setStatus(1);
                permission.setCreateTime(LocalDateTime.now());
                permissionMapper.insert(permission);
                addedCount++;
            }
        }

        // 为管理员角色分配所有权限
        List<SysPermission> allPermissions = permissionMapper.selectList(null);
        for (SysPermission permission : allPermissions) {
            // 检查是否已分配
            Long roleId = 1L; // admin role id
            if (!rolePermissionMapper.exists(roleId, permission.getId())) {
                SysRolePermission rp = new SysRolePermission();
                rp.setRoleId(roleId);
                rp.setPermissionId(permission.getId());
                rolePermissionMapper.insert(rp);
            }
        }

        return Result.success("成功添加 " + addedCount + " 个权限");
    }

    private record PermissionToCreate(
        String permissionName,
        String permissionCode,
        Long parentId,
        Byte type,
        Integer sort
    ) {}
}
