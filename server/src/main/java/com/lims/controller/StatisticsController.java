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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 统计报表Controller
 */
@Tag(name = "统计报表", description = "委托/样品/任务/财务统计接口")
@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final EntrustmentMapper entrustmentMapper;
    private final SampleMapper sampleMapper;
    private final TestTaskMapper taskMapper;
    private final TestReportMapper reportMapper;
    private final ClientMapper clientMapper;

    // ==================== 委托单统计 ====================

    @Operation(summary = "委托单统计总览")
    @GetMapping("/entrustment/overview")
    @PreAuthorize("@ss.hasPermission('statistics:entrustment:list')")
    public Result<Map<String, Object>> entrustmentOverview(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LambdaQueryWrapper<Entrustment> wrapper = buildDateWrapper(startDate, endDate);
        List<Entrustment> list = entrustmentMapper.selectList(wrapper);
        
        Map<String, Object> result = new HashMap<>();
        result.put("total", list.size());
        
        // 按状态分组
        Map<String, Long> byStatus = list.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getStatus() != null ? e.getStatus() : "unknown",
                        Collectors.counting()));
        result.put("byStatus", byStatus);
        
        // 金额统计
        BigDecimal totalAmount = list.stream()
                .map(e -> e.getEstimatedAmount() != null ? e.getEstimatedAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        result.put("totalAmount", totalAmount);
        
        return Result.success(result);
    }

    @Operation(summary = "委托单趋势统计")
    @GetMapping("/entrustment/trend")
    @PreAuthorize("@ss.hasPermission('statistics:entrustment:list')")
    public Result<List<Map<String, Object>>> entrustmentTrend(
            @RequestParam(defaultValue = "7") Integer days) {
        
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            Long count = entrustmentMapper.selectCount(new LambdaQueryWrapper<Entrustment>()
                    .apply("DATE(create_time) = {0}", dateStr));
            
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("count", count);
            trend.add(item);
        }
        
        return Result.success(trend);
    }

    @Operation(summary = "按客户统计委托")
    @GetMapping("/entrustment/by-client")
    @PreAuthorize("@ss.hasPermission('statistics:entrustment:list')")
    public Result<List<Map<String, Object>>> entrustmentByClient(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") Integer limit) {
        
        LambdaQueryWrapper<Entrustment> wrapper = buildDateWrapper(startDate, endDate);
        List<Entrustment> list = entrustmentMapper.selectList(wrapper);
        
        Map<String, Long> byClient = list.stream()
                .filter(e -> e.getClientName() != null)
                .collect(Collectors.groupingBy(Entrustment::getClientName, Collectors.counting()));
        
        List<Map<String, Object>> result = byClient.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("clientName", e.getKey());
                    item.put("count", e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
        
        return Result.success(result);
    }

    // ==================== 样品统计 ====================

    @Operation(summary = "样品统计总览")
    @GetMapping("/sample/overview")
    @PreAuthorize("@ss.hasPermission('statistics:sample:list')")
    public Result<Map<String, Object>> sampleOverview(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<Sample> list = sampleMapper.selectList(buildSampleDateWrapper(startDate, endDate));
        
        Map<String, Object> result = new HashMap<>();
        result.put("total", list.size());
        
        // 按状态分组
        Map<String, Long> byStatus = list.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getStatus() != null ? s.getStatus() : "unknown",
                        Collectors.counting()));
        result.put("byStatus", byStatus);
        
        return Result.success(result);
    }

    @Operation(summary = "样品接收趋势")
    @GetMapping("/sample/trend")
    @PreAuthorize("@ss.hasPermission('statistics:sample:list')")
    public Result<List<Map<String, Object>>> sampleTrend(
            @RequestParam(defaultValue = "7") Integer days) {
        
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            Long count = sampleMapper.selectCount(new LambdaQueryWrapper<Sample>()
                    .apply("DATE(receipt_date) = {0}", dateStr));
            
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("count", count);
            trend.add(item);
        }
        
        return Result.success(trend);
    }

    // ==================== 任务统计 ====================

    @Operation(summary = "任务完成率统计")
    @GetMapping("/task/completion-rate")
    @PreAuthorize("@ss.hasPermission('statistics:task:list')")
    public Result<Map<String, Object>> taskCompletionRate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<TestTask> list = taskMapper.selectList(buildTaskDateWrapper(startDate, endDate));
        
        long total = list.size();
        long completed = list.stream().filter(t -> "completed".equals(t.getStatus())).count();
        long onTime = list.stream()
                .filter(t -> "completed".equals(t.getStatus()))
                .filter(t -> t.getCompletedDate() != null && t.getDueDate() != null)
                .filter(t -> !t.getCompletedDate().isAfter(t.getDueDate()))
                .count();
        long overdue = list.stream()
                .filter(t -> "completed".equals(t.getStatus()))
                .filter(t -> t.getCompletedDate() != null && t.getDueDate() != null)
                .filter(t -> t.getCompletedDate().isAfter(t.getDueDate()))
                .count();
        
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("completed", completed);
        result.put("completionRate", total > 0 ? (double) completed / total * 100 : 0);
        result.put("onTimeCount", onTime);
        result.put("onTimeRate", completed > 0 ? (double) onTime / completed * 100 : 0);
        result.put("overdueCount", overdue);
        
        return Result.success(result);
    }

    @Operation(summary = "任务完成趋势")
    @GetMapping("/task/trend")
    @PreAuthorize("@ss.hasPermission('statistics:task:list')")
    public Result<List<Map<String, Object>>> taskTrend(
            @RequestParam(defaultValue = "7") Integer days) {
        
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            
            Long completed = taskMapper.selectCount(new LambdaQueryWrapper<TestTask>()
                    .eq(TestTask::getStatus, "completed")
                    .apply("DATE(completed_date) = {0}", dateStr));
            
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("completed", completed);
            trend.add(item);
        }
        
        return Result.success(trend);
    }

    @Operation(summary = "检测员工作量统计")
    @GetMapping("/task/by-tester")
    @PreAuthorize("@ss.hasPermission('statistics:task:list')")
    public Result<List<Map<String, Object>>> taskByTester(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LambdaQueryWrapper<TestTask> wrapper = buildTaskDateWrapper(startDate, endDate);
        wrapper.eq(TestTask::getStatus, "completed");
        List<TestTask> list = taskMapper.selectList(wrapper);
        
        Map<String, Long> byTester = list.stream()
                .filter(t -> t.getAssignee() != null)
                .collect(Collectors.groupingBy(TestTask::getAssignee, Collectors.counting()));
        
        List<Map<String, Object>> result = byTester.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("tester", e.getKey());
                    item.put("completedCount", e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
        
        return Result.success(result);
    }

    // ==================== 报告统计 ====================

    @Operation(summary = "报告统计总览")
    @GetMapping("/report/overview")
    @PreAuthorize("@ss.hasPermission('statistics:report:list')")
    public Result<Map<String, Object>> reportOverview(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<TestReport> list = reportMapper.selectList(buildReportDateWrapper(startDate, endDate));
        
        Map<String, Object> result = new HashMap<>();
        result.put("total", list.size());
        
        // 按状态分组
        Map<String, Long> byStatus = list.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus() != null ? r.getStatus() : "unknown",
                        Collectors.counting()));
        result.put("byStatus", byStatus);
        
        // 已发布数量
        long issued = list.stream().filter(r -> "issued".equals(r.getStatus())).count();
        result.put("issuedCount", issued);
        result.put("issueRate", list.size() > 0 ? (double) issued / list.size() * 100 : 0);
        
        return Result.success(result);
    }

    // ==================== 工具方法 ====================

    private LambdaQueryWrapper<Entrustment> buildDateWrapper(String startDate, String endDate) {
        LambdaQueryWrapper<Entrustment> wrapper = new LambdaQueryWrapper<>();
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(Entrustment::getCreateTime, LocalDate.parse(startDate).atStartOfDay());
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(Entrustment::getCreateTime, LocalDate.parse(endDate).plusDays(1).atStartOfDay());
        }
        wrapper.orderByDesc(Entrustment::getCreateTime);
        return wrapper;
    }

    private LambdaQueryWrapper<Sample> buildSampleDateWrapper(String startDate, String endDate) {
        LambdaQueryWrapper<Sample> wrapper = new LambdaQueryWrapper<>();
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(Sample::getReceiptDate, LocalDate.parse(startDate));
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(Sample::getReceiptDate, LocalDate.parse(endDate));
        }
        return wrapper;
    }

    private LambdaQueryWrapper<TestTask> buildTaskDateWrapper(String startDate, String endDate) {
        LambdaQueryWrapper<TestTask> wrapper = new LambdaQueryWrapper<>();
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(TestTask::getCreateTime, LocalDate.parse(startDate).atStartOfDay());
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(TestTask::getCreateTime, LocalDate.parse(endDate).plusDays(1).atStartOfDay());
        }
        return wrapper;
    }

    private LambdaQueryWrapper<TestReport> buildReportDateWrapper(String startDate, String endDate) {
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(TestReport::getCreateTime, LocalDate.parse(startDate).atStartOfDay());
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(TestReport::getCreateTime, LocalDate.parse(endDate).plusDays(1).atStartOfDay());
        }
        return wrapper;
    }
}
