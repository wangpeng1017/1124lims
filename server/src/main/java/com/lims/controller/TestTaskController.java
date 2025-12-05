package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.TestTask;
import com.lims.service.TestTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 任务管理Controller
 */
@Tag(name = "任务管理", description = "检测任务CRUD接口")
@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TestTaskController {

    private final TestTaskService taskService;

    @Operation(summary = "分页查询所有任务")
    @GetMapping("/page")
    public Result<PageResult<TestTask>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String taskNo,
            @RequestParam(required = false) String sampleName,
            @RequestParam(required = false) String assignee,
            @RequestParam(required = false) String status) {
        
        Page<TestTask> result = taskService.pageList(current, size, taskNo, sampleName, assignee, status);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "查询我的任务")
    @GetMapping("/my")
    public Result<PageResult<TestTask>> myTasks(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam Long userId,
            @RequestParam(required = false) String status) {
        
        Page<TestTask> result = taskService.myTasks(current, size, userId, status);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取任务详情")
    @GetMapping("/{id}")
    public Result<TestTask> getById(@PathVariable Long id) {
        return Result.success(taskService.getById(id));
    }

    @Operation(summary = "新增任务")
    @PostMapping
    public Result<TestTask> create(@RequestBody TestTask task) {
        TestTask created = taskService.createTask(task);
        return Result.success("创建成功", created);
    }

    @Operation(summary = "更新任务")
    @PutMapping
    public Result<Void> update(@RequestBody TestTask task) {
        taskService.updateById(task);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除任务")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        taskService.removeById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "分配任务")
    @PostMapping("/{id}/assign")
    public Result<Void> assign(
            @PathVariable Long id,
            @RequestParam Long assigneeId,
            @RequestParam String assigneeName) {
        taskService.assignTask(id, assigneeId, assigneeName);
        return Result.successMsg("分配成功");
    }

    @Operation(summary = "批量分配任务")
    @PostMapping("/batch-assign")
    public Result<Void> batchAssign(
            @RequestBody List<Long> taskIds,
            @RequestParam Long assigneeId,
            @RequestParam String assigneeName) {
        taskService.batchAssign(taskIds, assigneeId, assigneeName);
        return Result.successMsg("批量分配成功");
    }

    @Operation(summary = "开始任务")
    @PostMapping("/{id}/start")
    public Result<Void> start(@PathVariable Long id) {
        taskService.startTask(id);
        return Result.successMsg("任务已开始");
    }

    @Operation(summary = "完成任务")
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id) {
        taskService.completeTask(id);
        return Result.successMsg("任务已完成");
    }

    @Operation(summary = "转交任务")
    @PostMapping("/{id}/transfer")
    public Result<Void> transfer(
            @PathVariable Long id,
            @RequestParam Long newAssigneeId,
            @RequestParam String newAssigneeName,
            @RequestParam String reason) {
        taskService.transferTask(id, newAssigneeId, newAssigneeName, reason);
        return Result.successMsg("转交成功");
    }

    @Operation(summary = "更新任务进度")
    @PutMapping("/{id}/progress")
    public Result<Void> updateProgress(@PathVariable Long id, @RequestParam Integer progress) {
        TestTask task = new TestTask();
        task.setId(id);
        task.setProgress(progress);
        taskService.updateById(task);
        return Result.successMsg("进度更新成功");
    }
}
