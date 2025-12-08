package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Supplier;
import com.lims.mapper.SupplierMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 供应商管理Controller
 */
@Tag(name = "供应商管理", description = "供应商CRUD接口")
@RestController
@RequestMapping("/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierMapper supplierMapper;

    @Operation(summary = "分页查询供应商")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('supplier:list')")
    public Result<PageResult<Supplier>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String qualificationLevel) {
        
        Page<Supplier> page = new Page<>(current, size);
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), Supplier::getName, name)
               .eq(StringUtils.hasText(type), Supplier::getType, type)
               .eq(StringUtils.hasText(qualificationLevel), Supplier::getQualificationLevel, qualificationLevel)
               .eq(Supplier::getStatus, 1)
               .orderByDesc(Supplier::getScore)
               .orderByDesc(Supplier::getCreateTime);
        
        Page<Supplier> result = supplierMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取所有供应商（下拉选择）")
    @GetMapping("/list")
    @PreAuthorize("@ss.hasPermission('supplier:list')")
    public Result<List<Supplier>> list() {
        List<Supplier> list = supplierMapper.selectList(new LambdaQueryWrapper<Supplier>()
                .eq(Supplier::getStatus, 1)
                .orderByDesc(Supplier::getScore));
        return Result.success(list);
    }

    @Operation(summary = "根据检测能力查询供应商")
    @GetMapping("/by-capability")
    public Result<List<Supplier>> getByCapability(@RequestParam String capability) {
        List<Supplier> list = supplierMapper.selectList(new LambdaQueryWrapper<Supplier>()
                .like(Supplier::getCapabilities, capability)
                .eq(Supplier::getStatus, 1)
                .orderByDesc(Supplier::getScore));
        return Result.success(list);
    }

    @Operation(summary = "获取供应商详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('supplier:query')")
    public Result<Supplier> getById(@PathVariable Long id) {
        return Result.success(supplierMapper.selectById(id));
    }

    @Operation(summary = "新增供应商")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('supplier:create')")
    public Result<Void> create(@RequestBody Supplier supplier) {
        supplier.setCode(generateSupplierCode());
        supplier.setStatus(1);
        if (supplier.getScore() == null) {
            supplier.setScore(80);
        }
        supplierMapper.insert(supplier);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新供应商")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('supplier:update')")
    public Result<Void> update(@RequestBody Supplier supplier) {
        supplierMapper.updateById(supplier);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除供应商")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('supplier:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        supplierMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换供应商状态")
    @PutMapping("/{id}/status")
    @PreAuthorize("@ss.hasPermission('supplier:update')")
    public Result<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Supplier supplier = new Supplier();
        supplier.setId(id);
        supplier.setStatus(status);
        supplierMapper.updateById(supplier);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "更新供应商评分")
    @PutMapping("/{id}/score")
    @PreAuthorize("@ss.hasPermission('supplier:update')")
    public Result<Void> updateScore(@PathVariable Long id, @RequestParam Integer score) {
        Supplier supplier = new Supplier();
        supplier.setId(id);
        supplier.setScore(score);
        supplierMapper.updateById(supplier);
        return Result.successMsg("评分更新成功");
    }

    private String generateSupplierCode() {
        String prefix = "GYS" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = supplierMapper.selectCount(new LambdaQueryWrapper<Supplier>()
                .likeRight(Supplier::getCode, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
