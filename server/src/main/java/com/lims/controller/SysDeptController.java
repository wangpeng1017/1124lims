package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.lims.common.Result;
import com.lims.entity.SysDept;
import com.lims.mapper.SysDeptMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 部门管理Controller
 */
@Tag(name = "部门管理", description = "部门CRUD接口")
@RestController
@RequestMapping("/system/dept")
@RequiredArgsConstructor
public class SysDeptController {

    private final SysDeptMapper deptMapper;

    @Operation(summary = "获取部门列表(树形)")
    @GetMapping("/list")
    @PreAuthorize("@ss.hasPermission('system:dept:list')")
    public Result<List<SysDept>> list(
            @RequestParam(required = false) String deptName,
            @RequestParam(required = false) Integer status) {
        
        LambdaQueryWrapper<SysDept> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(deptName), SysDept::getDeptName, deptName)
               .eq(status != null, SysDept::getStatus, status)
               .orderByAsc(SysDept::getSort);
        
        List<SysDept> list = deptMapper.selectList(wrapper);
        return Result.success(list);
    }

    @Operation(summary = "获取部门详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system:dept:query')")
    public Result<SysDept> getById(@PathVariable Long id) {
        return Result.success(deptMapper.selectById(id));
    }

    @Operation(summary = "新增部门")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('system:dept:create')")
    public Result<Void> create(@RequestBody SysDept dept) {
        // 设置祖先路径
        if (dept.getParentId() != null && dept.getParentId() > 0) {
            SysDept parent = deptMapper.selectById(dept.getParentId());
            if (parent != null) {
                dept.setAncestors(parent.getAncestors() + "," + parent.getId());
            }
        } else {
            dept.setParentId(0L);
            dept.setAncestors("0");
        }
        deptMapper.insert(dept);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新部门")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('system:dept:update')")
    public Result<Void> update(@RequestBody SysDept dept) {
        // 如果父部门变化，需要更新祖先路径
        SysDept old = deptMapper.selectById(dept.getId());
        if (old != null && !old.getParentId().equals(dept.getParentId())) {
            if (dept.getParentId() != null && dept.getParentId() > 0) {
                SysDept parent = deptMapper.selectById(dept.getParentId());
                if (parent != null) {
                    dept.setAncestors(parent.getAncestors() + "," + parent.getId());
                }
            } else {
                dept.setParentId(0L);
                dept.setAncestors("0");
            }
        }
        deptMapper.updateById(dept);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除部门")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system:dept:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        // 检查是否有子部门
        Long childCount = deptMapper.selectCount(
                new LambdaQueryWrapper<SysDept>().eq(SysDept::getParentId, id)
        );
        if (childCount > 0) {
            return Result.error("存在下级部门，不能删除");
        }
        deptMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "获取部门树形下拉选项")
    @GetMapping("/tree")
    public Result<List<SysDept>> tree() {
        List<SysDept> list = deptMapper.selectList(
                new LambdaQueryWrapper<SysDept>()
                        .eq(SysDept::getStatus, 1)
                        .orderByAsc(SysDept::getSort)
        );
        return Result.success(list);
    }
}
