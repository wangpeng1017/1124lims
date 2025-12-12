package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Todo;
import com.lims.mapper.TodoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 待办事项Controller
 */
@Tag(name = "待办事项", description = "待办事项CRUD接口")
@RestController
@RequestMapping("/todo")
@RequiredArgsConstructor
public class TodoController {

    private final TodoMapper todoMapper;

    @Operation(summary = "分页查询待办事项")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('todo:list')")
    public Result<PageResult<Todo>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId) {

        Page<Todo> page = new Page<>(current, size);
        LambdaQueryWrapper<Todo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StringUtils.hasText(type), Todo::getType, type)
                .eq(StringUtils.hasText(status), Todo::getStatus, status)
                .eq(StringUtils.hasText(priority), Todo::getPriority, priority)
                .eq(assigneeId != null, Todo::getAssigneeId, assigneeId)
                .orderByAsc(Todo::getStatus)
                .orderByDesc(Todo::getPriority)
                .orderByAsc(Todo::getDueDate);

        Page<Todo> result = todoMapper.selectPage(page, wrapper);

        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取我的待办列表")
    @GetMapping("/my")
    @PreAuthorize("@ss.hasPermission('todo:list')")
    public Result<PageResult<Todo>> myTodos(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam Long userId,
            @RequestParam(required = false) String status) {

        Page<Todo> page = new Page<>(current, size);
        LambdaQueryWrapper<Todo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Todo::getAssigneeId, userId)
                .eq(StringUtils.hasText(status), Todo::getStatus, status)
                .ne(!StringUtils.hasText(status), Todo::getStatus, "completed")
                .orderByDesc(Todo::getPriority)
                .orderByAsc(Todo::getDueDate);

        Page<Todo> result = todoMapper.selectPage(page, wrapper);

        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取待办统计")
    @GetMapping("/stats")
    @PreAuthorize("@ss.hasPermission('todo:list')")
    public Result<TodoStats> getStats(@RequestParam(required = false) Long userId) {
        Map<String, Object> statsMap = todoMapper.getStatistics(userId);

        TodoStats stats = new TodoStats();
        stats.setTotal(((Number) statsMap.getOrDefault("total", 0)).longValue());
        stats.setPending(((Number) statsMap.getOrDefault("pending", 0)).longValue());
        stats.setInProgress(((Number) statsMap.getOrDefault("inProgress", 0)).longValue());
        stats.setCompleted(((Number) statsMap.getOrDefault("completed", 0)).longValue());
        stats.setOverdue(((Number) statsMap.getOrDefault("overdue", 0)).longValue());
        stats.setUrgent(((Number) statsMap.getOrDefault("urgent", 0)).longValue());

        return Result.success(stats);
    }

    @Operation(summary = "获取待办详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('todo:query')")
    public Result<Todo> getById(@PathVariable Long id) {
        Todo todo = todoMapper.selectById(id);
        return Result.success(todo);
    }

    @Operation(summary = "创建待办事项")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('todo:create')")
    public Result<Todo> create(@RequestBody Todo todo) {
        if (todo.getStatus() == null) {
            todo.setStatus("pending");
        }
        if (todo.getPriority() == null) {
            todo.setPriority("normal");
        }
        todoMapper.insert(todo);
        return Result.success("创建成功", todo);
    }

    @Operation(summary = "更新待办事项")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('todo:update')")
    public Result<Void> update(@RequestBody Todo todo) {
        todoMapper.updateById(todo);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "更新待办状态")
    @PutMapping("/{id}/status")
    @PreAuthorize("@ss.hasPermission('todo:update')")
    public Result<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        LambdaUpdateWrapper<Todo> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Todo::getId, id)
                .set(Todo::getStatus, status)
                .set(Todo::getUpdateTime, LocalDateTime.now());

        todoMapper.update(null, wrapper);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "开始处理待办")
    @PostMapping("/{id}/start")
    @PreAuthorize("@ss.hasPermission('todo:update')")
    public Result<Void> start(@PathVariable Long id) {
        LambdaUpdateWrapper<Todo> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Todo::getId, id)
                .set(Todo::getStatus, "in_progress")
                .set(Todo::getUpdateTime, LocalDateTime.now());

        todoMapper.update(null, wrapper);
        return Result.successMsg("已开始处理");
    }

    @Operation(summary = "完成待办")
    @PostMapping("/{id}/complete")
    @PreAuthorize("@ss.hasPermission('todo:update')")
    public Result<Void> complete(@PathVariable Long id) {
        LambdaUpdateWrapper<Todo> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Todo::getId, id)
                .set(Todo::getStatus, "completed")
                .set(Todo::getUpdateTime, LocalDateTime.now());

        todoMapper.update(null, wrapper);
        return Result.successMsg("已完成");
    }

    @Operation(summary = "删除待办事项")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('todo:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        todoMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "批量更新待办状态")
    @PostMapping("/batch-update-status")
    @PreAuthorize("@ss.hasPermission('todo:update')")
    public Result<Void> batchUpdateStatus(
            @RequestBody List<Long> ids,
            @RequestParam String status) {

        LambdaUpdateWrapper<Todo> wrapper = new LambdaUpdateWrapper<>();
        wrapper.in(Todo::getId, ids)
                .set(Todo::getStatus, status)
                .set(Todo::getUpdateTime, LocalDateTime.now());

        todoMapper.update(null, wrapper);
        return Result.successMsg("批量更新成功");
    }

    /**
     * 待办统计DTO
     */
    @Data
    public static class TodoStats {
        private Long total;
        private Long pending;
        private Long inProgress;
        private Long completed;
        private Long overdue;
        private Long urgent;
    }
}
