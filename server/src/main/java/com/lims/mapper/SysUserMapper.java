package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 用户Mapper
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {

    /**
     * 根据用户名查询用户
     */
    SysUser selectByUsername(@Param("username") String username);

    /**
     * 查询用户角色编码列表
     */
    List<String> selectRoleCodesByUserId(@Param("userId") Long userId);

    /**
     * 查询用户角色详情 (包含 id, role_code, data_scope)
     */
    @Select("SELECT r.id, r.role_code, r.role_name, IFNULL(r.data_scope, 1) as data_scope " +
            "FROM sys_role r " +
            "JOIN sys_user_role ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND r.status = 1 AND r.deleted = 0")
    List<Map<String, Object>> selectUserRoles(@Param("userId") Long userId);

    /**
     * 查询用户权限编码列表
     */
    @Select("SELECT DISTINCT p.permission_code " +
            "FROM sys_permission p " +
            "JOIN sys_role_permission rp ON p.id = rp.permission_id " +
            "JOIN sys_user_role ur ON rp.role_id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND p.status = 1 AND p.deleted = 0")
    Set<String> selectUserPermissions(@Param("userId") Long userId);
}

