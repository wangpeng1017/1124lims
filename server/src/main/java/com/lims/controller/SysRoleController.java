package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.SysRole;
import com.lims.mapper.SysRoleMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理Controller
 */
@Tag(name = "角色管理", description = "角色CRUD接口")
@RestController
@RequestMapping("/system/role")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleMapper roleMapper;

    @Operation(summary = "分页查询角色列表")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('system:role:list')")
    public Result<PageResult<SysRole>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) String roleCode,
            @RequestParam(required = false) Integer status) {
        
        Page<SysRole> page = new Page<>(current, size);
        LambdaQueryWrapper<SysRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(roleName), SysRole::getRoleName, roleName)
               .like(StringUtils.hasText(roleCode), SysRole::getRoleCode, roleCode)
               .eq(status != null, SysRole::getStatus, status)
               .orderByAsc(SysRole::getCreateTime);
        
        Page<SysRole> result = roleMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取全部角色列表")
    @GetMapping("/list")
    public Result<List<SysRole>> list() {
        List<SysRole> list = roleMapper.selectList(
                new LambdaQueryWrapper<SysRole>()
                        .eq(SysRole::getStatus, 1)
                        .orderByAsc(SysRole::getCreateTime)
        );
        return Result.success(list);
    }

    @Operation(summary = "获取角色详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system:role:query')")
    public Result<SysRole> getById(@PathVariable Long id) {
        return Result.success(roleMapper.selectById(id));
    }

    @Operation(summary = "新增角色")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('system:role:create')")
    public Result<Void> create(@RequestBody SysRole role) {
        // 检查角色编码是否已存在
        Long count = roleMapper.selectCount(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getRoleCode, role.getRoleCode())
        );
        if (count > 0) {
            return Result.error("角色编码已存在");
        }
        roleMapper.insert(role);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新角色")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('system:role:update')")
    public Result<Void> update(@RequestBody SysRole role) {
        // 检查角色编码是否被其他角色使用
        Long count = roleMapper.selectCount(
                new LambdaQueryWrapper<SysRole>()
                        .eq(SysRole::getRoleCode, role.getRoleCode())
                        .ne(SysRole::getId, role.getId())
        );
        if (count > 0) {
            return Result.error("角色编码已被使用");
        }
        roleMapper.updateById(role);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除角色")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system:role:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        // TODO: 检查角色是否被用户使用
        roleMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "修改角色状态")
    @PutMapping("/{id}/status")
    @PreAuthorize("@ss.hasPermission('system:role:update')")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        SysRole role = new SysRole();
        role.setId(id);
        role.setStatus(status);
        roleMapper.updateById(role);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "设置角色数据权限")
    @PutMapping("/{id}/data-scope")
    @PreAuthorize("@ss.hasPermission('system:role:update')")
    public Result<Void> updateDataScope(
            @PathVariable Long id,
            @RequestParam Integer dataScope,
            @RequestParam(required = false) String deptIds) {
        SysRole role = new SysRole();
        role.setId(id);
        role.setDataScope(dataScope);
        role.setDeptIds(deptIds);
        roleMapper.updateById(role);
        return Result.successMsg("数据权限设置成功");
    }
}
