package com.lims.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 登录用户详情
 * 实现 Spring Security 的 UserDetails 接口
 */
@Data
public class LoginUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 角色ID列表
     */
    private List<Long> roleIds;

    /**
     * 角色编码列表 (如: admin, tester)
     */
    private Set<String> roleCodes;

    /**
     * 权限编码列表 (如: entrustment:create, sample:delete)
     */
    private Set<String> permissions;

    /**
     * 数据权限范围 (取多角色中最宽的)
     * 1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义
     */
    private Integer dataScope;

    /**
     * 自定义数据权限部门ID列表
     */
    private List<Long> dataScopeDeptIds;

    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;

    /**
     * 获取权限列表
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 将角色和权限都转换为 GrantedAuthority
        Set<GrantedAuthority> authorities = roleCodes.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toSet());
        
        // 添加具体权限
        if (permissions != null) {
            permissions.stream()
                    .map(SimpleGrantedAuthority::new)
                    .forEach(authorities::add);
        }
        
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status != null && status == 1;
    }

    /**
     * 检查是否是管理员
     */
    public boolean isAdmin() {
        return roleCodes != null && roleCodes.contains("admin");
    }

    /**
     * 检查是否有指定权限
     *
     * @param permission 权限编码
     * @return 是否有权限
     */
    public boolean hasPermission(String permission) {
        if (isAdmin()) {
            return true; // 管理员拥有所有权限
        }
        return permissions != null && permissions.contains(permission);
    }

    /**
     * 检查是否有指定角色
     *
     * @param roleCode 角色编码
     * @return 是否有角色
     */
    public boolean hasRole(String roleCode) {
        return roleCodes != null && roleCodes.contains(roleCode);
    }
}
