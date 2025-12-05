package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.TestReport;
import com.lims.service.TestReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 报告管理Controller
 */
@Tag(name = "报告管理", description = "检测报告CRUD接口")
@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class TestReportController {

    private final TestReportService reportService;

    @Operation(summary = "分页查询报告")
    @GetMapping("/page")
    public Result<PageResult<TestReport>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String reportNo,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<TestReport> result = reportService.pageList(current, size, reportNo, clientName, status);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取报告详情")
    @GetMapping("/{id}")
    public Result<TestReport> getById(@PathVariable Long id) {
        return Result.success(reportService.getById(id));
    }

    @Operation(summary = "新增报告")
    @PostMapping
    public Result<TestReport> create(@RequestBody TestReport report) {
        TestReport created = reportService.createReport(report);
        return Result.success("创建成功", created);
    }

    @Operation(summary = "更新报告")
    @PutMapping
    public Result<Void> update(@RequestBody TestReport report) {
        reportService.updateById(report);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除报告")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        reportService.removeById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "提交审核")
    @PostMapping("/{id}/submit-review")
    public Result<Void> submitReview(@PathVariable Long id) {
        reportService.submitReview(id);
        return Result.successMsg("已提交审核");
    }

    @Operation(summary = "审核报告")
    @PostMapping("/{id}/review")
    public Result<Void> review(
            @PathVariable Long id,
            @RequestParam Long reviewerId,
            @RequestParam String reviewerName,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        reportService.review(id, reviewerId, reviewerName, approved, comment);
        return Result.successMsg(approved ? "审核通过" : "审核驳回");
    }

    @Operation(summary = "批准报告")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam Long approverId,
            @RequestParam String approverName) {
        reportService.approve(id, approverId, approverName);
        return Result.successMsg("批准成功");
    }

    @Operation(summary = "发布报告")
    @PostMapping("/{id}/issue")
    public Result<Void> issue(@PathVariable Long id) {
        reportService.issue(id);
        return Result.successMsg("发布成功");
    }

    @Operation(summary = "添加签名盖章")
    @PostMapping("/{id}/signature-stamp")
    public Result<Void> addSignatureAndStamp(
            @PathVariable Long id,
            @RequestParam(required = false) String signatureImage,
            @RequestParam(required = false) String stampImage) {
        reportService.addSignatureAndStamp(id, signatureImage, stampImage);
        return Result.successMsg("签章添加成功");
    }

    @Operation(summary = "根据任务查询报告")
    @GetMapping("/by-task/{taskId}")
    public Result<TestReport> getByTask(@PathVariable Long taskId) {
        TestReport report = reportService.lambdaQuery()
                .eq(TestReport::getTaskId, taskId)
                .one();
        return Result.success(report);
    }

    @Operation(summary = "根据委托单查询报告列表")
    @GetMapping("/by-entrustment/{entrustmentId}")
    public Result<java.util.List<TestReport>> getByEntrustment(@PathVariable Long entrustmentId) {
        java.util.List<TestReport> reports = reportService.lambdaQuery()
                .eq(TestReport::getEntrustmentId, entrustmentId)
                .list();
        return Result.success(reports);
    }
}
