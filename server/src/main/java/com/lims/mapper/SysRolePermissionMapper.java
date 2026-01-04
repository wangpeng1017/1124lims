package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.SysRolePermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 角色权限关联Mapper
 */
@Mapper
public interface SysRolePermissionMapper extends BaseMapper<SysRolePermission> {

    /**
     * 检查角色权限关联是否存在
     */
    @Select("SELECT 1 FROM sys_role_permission WHERE role_id = #{roleId} AND permission_id = #{permissionId} LIMIT 1")
    Integer exists(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
}
