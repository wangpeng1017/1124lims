package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Sample;
import com.lims.service.SampleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 样品管理Controller
 */
@Tag(name = "样品管理", description = "样品CRUD接口")
@RestController
@RequestMapping("/sample")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;

    @Operation(summary = "分页查询样品")
    @GetMapping("/page")
    public Result<PageResult<Sample>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sampleNo,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status) {
        
        Page<Sample> result = sampleService.pageList(current, size, sampleNo, name, status);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取样品详情")
    @GetMapping("/{id}")
    public Result<Sample> getById(@PathVariable Long id) {
        return Result.success(sampleService.getById(id));
    }

    @Operation(summary = "批量收样登记")
    @PostMapping("/batch")
    public Result<List<Sample>> batchCreate(
            @RequestParam Long entrustmentId,
            @RequestBody List<Sample> samples) {
        List<Sample> created = sampleService.batchCreate(entrustmentId, samples);
        return Result.success("收样成功", created);
    }

    @Operation(summary = "新增样品")
    @PostMapping
    public Result<Void> create(@RequestBody Sample sample) {
        sample.setSampleNo(sampleService.generateSampleNo());
        sample.setStatus("pending");
        sampleService.save(sample);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新样品")
    @PutMapping
    public Result<Void> update(@RequestBody Sample sample) {
        sampleService.updateById(sample);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除样品")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        sampleService.removeById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "更新样品状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        sampleService.updateStatus(id, status);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "根据委托单查询样品")
    @GetMapping("/by-entrustment/{entrustmentId}")
    public Result<List<Sample>> getByEntrustment(@PathVariable Long entrustmentId) {
        List<Sample> samples = sampleService.lambdaQuery()
                .eq(Sample::getEntrustmentId, entrustmentId)
                .list();
        return Result.success(samples);
    }
}
