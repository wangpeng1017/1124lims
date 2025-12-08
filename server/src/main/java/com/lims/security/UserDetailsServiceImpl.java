package com.lims.security;

import com.lims.entity.SysUser;
import com.lims.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 用户详情服务实现
 * 加载用户信息用于认证和授权
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final SysUserMapper userMapper;

    /**
     * 根据用户名加载用户 (Spring Security 标准接口)
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }
        return createLoginUserDetails(user);
    }

    /**
     * 根据用户ID加载用户
     */
    public LoginUserDetails loadUserById(Long userId) {
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            log.warn("用户不存在: {}", userId);
            return null;
        }
        return createLoginUserDetails(user);
    }

    /**
     * 创建登录用户详情
     */
    private LoginUserDetails createLoginUserDetails(SysUser user) {
        LoginUserDetails details = new LoginUserDetails();
        details.setUserId(user.getId());
        details.setUsername(user.getUsername());
        details.setPassword(user.getPassword());
        details.setRealName(user.getRealName());
        details.setDeptId(user.getDeptId());
        details.setStatus(user.getStatus());

        // 查询用户角色
        List<Map<String, Object>> roles = userMapper.selectUserRoles(user.getId());
        if (roles != null && !roles.isEmpty()) {
            List<Long> roleIds = new ArrayList<>();
            Set<String> roleCodes = new HashSet<>();
            Integer minDataScope = 1; // 默认全部数据权限

            for (Map<String, Object> role : roles) {
                Object roleId = role.get("id");
                if (roleId instanceof Long) {
                    roleIds.add((Long) roleId);
                } else if (roleId instanceof Integer) {
                    roleIds.add(((Integer) roleId).longValue());
                }
                
                String roleCode = (String) role.get("role_code");
                if (roleCode != null) {
                    roleCodes.add(roleCode);
                }

                // 获取数据权限范围 (取最宽的)
                Object dataScope = role.get("data_scope");
                if (dataScope instanceof Integer) {
                    int scope = (Integer) dataScope;
                    if (scope < minDataScope) {
                        minDataScope = scope;
                    }
                }
            }

            details.setRoleIds(roleIds);
            details.setRoleCodes(roleCodes);
            details.setDataScope(minDataScope);
        } else {
            details.setRoleIds(Collections.emptyList());
            details.setRoleCodes(Collections.emptySet());
            details.setDataScope(4); // 默认仅本人
        }

        // 查询用户权限
        Set<String> permissions = userMapper.selectUserPermissions(user.getId());
        details.setPermissions(permissions != null ? permissions : Collections.emptySet());

        return details;
    }
}
