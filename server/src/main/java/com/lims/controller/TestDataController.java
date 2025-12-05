package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.TestData;
import com.lims.entity.TestTask;
import com.lims.mapper.TestDataMapper;
import com.lims.service.TestTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 数据录入Controller
 */
@Tag(name = "数据录入", description = "检测数据录入和审核")
@RestController
@RequestMapping("/test-data")
@RequiredArgsConstructor
public class TestDataController {

    private final TestDataMapper testDataMapper;
    private final TestTaskService taskService;

    @Operation(summary = "分页查询录入数据")
    @GetMapping("/page")
    public Result<PageResult<TestData>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String taskNo,
            @RequestParam(required = false) String sampleNo,
            @RequestParam(required = false) String status) {
        
        Page<TestData> page = new Page<>(current, size);
        LambdaQueryWrapper<TestData> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(taskNo), TestData::getTaskNo, taskNo)
               .like(StringUtils.hasText(sampleNo), TestData::getSampleNo, sampleNo)
               .eq(StringUtils.hasText(status), TestData::getStatus, status)
               .orderByDesc(TestData::getCreateTime);
        
        Page<TestData> result = testDataMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取录入数据详情")
    @GetMapping("/{id}")
    public Result<TestData> getById(@PathVariable Long id) {
        return Result.success(testDataMapper.selectById(id));
    }

    @Operation(summary = "根据任务获取录入数据")
    @GetMapping("/by-task/{taskId}")
    public Result<TestData> getByTask(@PathVariable Long taskId) {
        TestData data = testDataMapper.selectOne(new LambdaQueryWrapper<TestData>()
                .eq(TestData::getTaskId, taskId)
                .last("LIMIT 1"));
        return Result.success(data);
    }

    @Operation(summary = "保存录入数据（草稿）")
    @PostMapping("/save")
    public Result<TestData> save(@RequestBody TestData testData) {
        testData.setStatus("draft");
        testData.setTestTime(LocalDateTime.now());
        
        if (testData.getId() != null) {
            testDataMapper.updateById(testData);
        } else {
            testDataMapper.insert(testData);
        }
        
        // 更新任务进度
        if (testData.getTaskId() != null) {
            TestTask task = new TestTask();
            task.setId(testData.getTaskId());
            task.setProgress(50);
            task.setStatus("in_progress");
            taskService.updateById(task);
        }
        
        return Result.success("保存成功", testData);
    }

    @Operation(summary = "提交录入数据")
    @PostMapping("/submit")
    public Result<Void> submit(@RequestBody TestData testData) {
        testData.setStatus("submitted");
        testData.setTestTime(LocalDateTime.now());
        
        if (testData.getId() != null) {
            testDataMapper.updateById(testData);
        } else {
            testDataMapper.insert(testData);
        }
        
        // 更新任务进度
        if (testData.getTaskId() != null) {
            TestTask task = new TestTask();
            task.setId(testData.getTaskId());
            task.setProgress(80);
            taskService.updateById(task);
        }
        
        return Result.successMsg("提交成功");
    }

    @Operation(summary = "审核录入数据")
    @PostMapping("/{id}/review")
    public Result<Void> review(
            @PathVariable Long id,
            @RequestParam Long reviewerId,
            @RequestParam String reviewerName,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        
        TestData data = testDataMapper.selectById(id);
        if (data != null) {
            data.setReviewerId(reviewerId);
            data.setReviewer(reviewerName);
            data.setReviewTime(LocalDateTime.now());
            data.setReviewComment(comment);
            data.setStatus(approved ? "approved" : "rejected");
            testDataMapper.updateById(data);
            
            // 如果审核通过，更新任务为完成
            if (approved && data.getTaskId() != null) {
                taskService.completeTask(data.getTaskId());
            }
        }
        
        return Result.successMsg(approved ? "审核通过" : "审核驳回");
    }

    @Operation(summary = "待审核列表")
    @GetMapping("/pending-review")
    public Result<List<TestData>> getPendingReview() {
        List<TestData> list = testDataMapper.selectList(new LambdaQueryWrapper<TestData>()
                .eq(TestData::getStatus, "submitted")
                .orderByAsc(TestData::getCreateTime));
        return Result.success(list);
    }

    @Operation(summary = "删除录入数据")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        testDataMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "更新计算结果")
    @PutMapping("/{id}/result")
    public Result<Void> updateResult(@PathVariable Long id, @RequestBody String resultContent) {
        TestData data = new TestData();
        data.setId(id);
        data.setResultContent(resultContent);
        testDataMapper.updateById(data);
        return Result.successMsg("计算结果已保存");
    }
}
