package com.lims.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Set;

/**
 * 权限校验服务
 * 提供 @PreAuthorize("@ss.hasPermission('xxx')") 注解使用的权限检查方法
 * 
 * 使用示例:
 * @PreAuthorize("@ss.hasPermission('entrustment:create')")
 * @PreAuthorize("@ss.hasAnyPermission('sample:create', 'sample:update')")
 * @PreAuthorize("@ss.hasRole('admin')")
 */
@Service("ss")
@RequiredArgsConstructor
public class PermissionService {

    /**
     * 检查是否有指定权限
     *
     * @param permission 权限编码，格式: 模块:操作，如 entrustment:create
     * @return 是否有权限
     */
    public boolean hasPermission(String permission) {
        LoginUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        // 管理员拥有所有权限
        if (user.isAdmin()) {
            return true;
        }
        return user.hasPermission(permission);
    }

    /**
     * 检查是否有任一权限
     *
     * @param permissions 权限编码数组
     * @return 是否有任一权限
     */
    public boolean hasAnyPermission(String... permissions) {
        LoginUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        if (user.isAdmin()) {
            return true;
        }
        for (String permission : permissions) {
            if (user.hasPermission(permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查是否有所有权限
     *
     * @param permissions 权限编码数组
     * @return 是否有所有权限
     */
    public boolean hasAllPermissions(String... permissions) {
        LoginUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        if (user.isAdmin()) {
            return true;
        }
        for (String permission : permissions) {
            if (!user.hasPermission(permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 检查是否有指定角色
     *
     * @param roleCode 角色编码
     * @return 是否有角色
     */
    public boolean hasRole(String roleCode) {
        LoginUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        return user.hasRole(roleCode);
    }

    /**
     * 检查是否有任一角色
     *
     * @param roleCodes 角色编码数组
     * @return 是否有任一角色
     */
    public boolean hasAnyRole(String... roleCodes) {
        LoginUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        for (String roleCode : roleCodes) {
            if (user.hasRole(roleCode)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查是否是管理员
     *
     * @return 是否是管理员
     */
    public boolean isAdmin() {
        LoginUserDetails user = getCurrentUser();
        return user != null && user.isAdmin();
    }

    /**
     * 获取当前登录用户
     *
     * @return 当前用户，未登录返回 null
     */
    public LoginUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof LoginUserDetails) {
            return (LoginUserDetails) principal;
        }
        return null;
    }

    /**
     * 获取当前用户ID
     *
     * @return 用户ID，未登录返回 null
     */
    public Long getCurrentUserId() {
        LoginUserDetails user = getCurrentUser();
        return user != null ? user.getUserId() : null;
    }

    /**
     * 获取当前用户部门ID
     *
     * @return 部门ID，未登录返回 null
     */
    public Long getCurrentDeptId() {
        LoginUserDetails user = getCurrentUser();
        return user != null ? user.getDeptId() : null;
    }

    /**
     * 获取当前用户数据权限范围
     *
     * @return 数据权限范围 1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义
     */
    public Integer getDataScope() {
        LoginUserDetails user = getCurrentUser();
        return user != null ? user.getDataScope() : 4;
    }

    /**
     * 获取当前用户所有权限
     *
     * @return 权限集合
     */
    public Set<String> getPermissions() {
        LoginUserDetails user = getCurrentUser();
        return user != null ? user.getPermissions() : Set.of();
    }
}
