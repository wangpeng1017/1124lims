package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.lims.common.Result;
import com.lims.entity.*;
import com.lims.mapper.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 仪表盘统计Controller
 */
@Tag(name = "仪表盘", description = "首页数据统计接口")
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final EntrustmentMapper entrustmentMapper;
    private final SampleMapper sampleMapper;
    private final TestTaskMapper taskMapper;
    private final TestReportMapper reportMapper;
    private final ClientMapper clientMapper;
    private final DeviceMapper deviceMapper;

    @Operation(summary = "获取概览统计")
    @GetMapping("/overview")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<OverviewStats> getOverview() {
        OverviewStats stats = new OverviewStats();
        
        // 今日委托
        stats.setTodayEntrustments(entrustmentMapper.selectCount(new LambdaQueryWrapper<Entrustment>()
                .apply("DATE(create_time) = CURDATE()")));
        
        // 待检样品
        stats.setPendingSamples(sampleMapper.selectCount(new LambdaQueryWrapper<Sample>()
                .eq(Sample::getStatus, "pending")));
        
        // 进行中任务
        stats.setInProgressTasks(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "in_progress")));
        
        // 待审核报告
        stats.setPendingReports(reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "pending_review")));
        
        // 客户总数
        stats.setTotalClients(clientMapper.selectCount(new LambdaQueryWrapper<Client>()
                .eq(Client::getStatus, 1)));
        
        // 设备总数
        stats.setTotalDevices(deviceMapper.selectCount(new LambdaQueryWrapper<Device>()
                .in(Device::getStatus, "running", "idle")));
        
        return Result.success(stats);
    }

    @Operation(summary = "获取任务统计")
    @GetMapping("/task-stats")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<Map<String, Long>> getTaskStats() {
        Map<String, Long> stats = new HashMap<>();
        
        stats.put("pending", taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "pending")));
        stats.put("in_progress", taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "in_progress")));
        stats.put("completed", taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "completed")));
        
        return Result.success(stats);
    }

    @Operation(summary = "获取报告统计")
    @GetMapping("/report-stats")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<Map<String, Long>> getReportStats() {
        Map<String, Long> stats = new HashMap<>();
        
        stats.put("draft", reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "draft")));
        stats.put("pending_review", reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "pending_review")));
        stats.put("approved", reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "approved")));
        stats.put("issued", reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "issued")));
        
        return Result.success(stats);
    }

    @Operation(summary = "获取本周工作量趋势")
    @GetMapping("/weekly-trend")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<List<Map<String, Object>>> getWeeklyTrend() {
        // 简化实现：返回最近7天每天的任务完成数
        // 实际需要自定义SQL查询
        return Result.success();
    }

    @Operation(summary = "获取待办事项")
    @GetMapping("/todos")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<TodoList> getTodos(@RequestParam(required = false) Long userId) {
        TodoList todos = new TodoList();
        
        // 待接收任务
        todos.setPendingTasks(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "pending")
                .isNull(TestTask::getAssigneeId)));
        
        // 待审核报告
        todos.setPendingReportReviews(reportMapper.selectCount(new LambdaQueryWrapper<TestReport>()
                .eq(TestReport::getStatus, "pending_review")));
        
        // 即将到期任务（3天内）
        LocalDate deadline = LocalDate.now().plusDays(3);
        todos.setUpcomingDeadlines(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getStatus, "in_progress")
                .le(TestTask::getDueDate, deadline)));
        
        // 即将定检设备（30天内）
        LocalDate calibrationDue = LocalDate.now().plusDays(30);
        todos.setCalibrationDue(deviceMapper.selectCount(new LambdaQueryWrapper<Device>()
                .le(Device::getNextCalibrationDate, calibrationDue)
                .in(Device::getStatus, "running", "idle")));
        
        return Result.success(todos);
    }

    @Operation(summary = "获取我的工作统计")
    @GetMapping("/my-stats")
    @PreAuthorize("@ss.hasPermission('dashboard:view')")
    public Result<MyWorkStats> getMyStats(@RequestParam Long userId) {
        MyWorkStats stats = new MyWorkStats();
        
        // 我的待办任务
        stats.setMyPendingTasks(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getAssigneeId, userId)
                .eq(TestTask::getStatus, "in_progress")));
        
        // 本周完成任务
        stats.setWeeklyCompleted(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getAssigneeId, userId)
                .eq(TestTask::getStatus, "completed")
                .apply("YEARWEEK(completed_date, 1) = YEARWEEK(CURDATE(), 1)")));
        
        // 本月完成任务
        stats.setMonthlyCompleted(taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                .eq(TestTask::getAssigneeId, userId)
                .eq(TestTask::getStatus, "completed")
                .apply("YEAR(completed_date) = YEAR(CURDATE()) AND MONTH(completed_date) = MONTH(CURDATE())")));
        
        return Result.success(stats);
    }

    // ========== VO类 ==========
    
    @Data
    public static class OverviewStats {
        private Long todayEntrustments;
        private Long pendingSamples;
        private Long inProgressTasks;
        private Long pendingReports;
        private Long totalClients;
        private Long totalDevices;
    }

    @Data
    public static class TodoList {
        private Long pendingTasks;
        private Long pendingReportReviews;
        private Long upcomingDeadlines;
        private Long calibrationDue;
    }

    @Data
    public static class MyWorkStats {
        private Long myPendingTasks;
        private Long weeklyCompleted;
        private Long monthlyCompleted;
    }
}
