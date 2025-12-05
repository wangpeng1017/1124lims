package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Entrustment;
import com.lims.service.EntrustmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 委托管理Controller
 */
@Tag(name = "委托管理", description = "委托单CRUD接口")
@RestController
@RequestMapping("/entrustment")
@RequiredArgsConstructor
public class EntrustmentController {

    private final EntrustmentService entrustmentService;

    @Operation(summary = "分页查询委托单")
    @GetMapping("/page")
    public Result<PageResult<Entrustment>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String entrustmentNo,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<Entrustment> result = entrustmentService.pageList(current, size, entrustmentNo, clientName, status);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取委托单详情")
    @GetMapping("/{id}")
    public Result<Entrustment> getById(@PathVariable Long id) {
        return Result.success(entrustmentService.getById(id));
    }

    @Operation(summary = "新增委托单")
    @PostMapping
    public Result<Entrustment> create(@RequestBody Entrustment entrustment) {
        Entrustment created = entrustmentService.createEntrustment(entrustment);
        return Result.success("创建成功", created);
    }

    @Operation(summary = "更新委托单")
    @PutMapping
    public Result<Void> update(@RequestBody Entrustment entrustment) {
        entrustmentService.updateById(entrustment);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除委托单")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        entrustmentService.removeById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "审核委托单")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        entrustmentService.approve(id, approved, comment);
        return Result.successMsg(approved ? "审核通过" : "审核拒绝");
    }

    @Operation(summary = "获取统计数据")
    @GetMapping("/statistics")
    public Result<Object> statistics() {
        // TODO: 实现统计逻辑
        return Result.success();
    }
}
