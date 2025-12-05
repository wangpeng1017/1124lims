package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lims.entity.TestTask;
import com.lims.mapper.TestTaskMapper;
import com.lims.service.TestTaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 检测任务Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TestTaskServiceImpl extends ServiceImpl<TestTaskMapper, TestTask> implements TestTaskService {

    @Override
    public Page<TestTask> pageList(Integer current, Integer size, String taskNo, String sampleName, String assignee, String status) {
        Page<TestTask> page = new Page<>(current, size);
        LambdaQueryWrapper<TestTask> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(taskNo), TestTask::getTaskNo, taskNo)
               .like(StringUtils.hasText(sampleName), TestTask::getSampleName, sampleName)
               .like(StringUtils.hasText(assignee), TestTask::getAssignee, assignee)
               .eq(StringUtils.hasText(status), TestTask::getStatus, status)
               .eq(TestTask::getIsOutsourced, false) // 只查内部任务
               .orderByDesc(TestTask::getCreateTime);
        return page(page, wrapper);
    }

    @Override
    public TestTask createTask(TestTask task) {
        task.setTaskNo(generateTaskNo());
        task.setStatus("pending");
        task.setProgress(0);
        task.setIsOutsourced(false);
        save(task);
        return task;
    }

    @Override
    public void assignTask(Long taskId, Long assigneeId, String assigneeName) {
        TestTask task = new TestTask();
        task.setId(taskId);
        task.setAssigneeId(assigneeId);
        task.setAssignee(assigneeName);
        task.setAssignDate(LocalDate.now());
        updateById(task);
    }

    @Override
    public void batchAssign(List<Long> taskIds, Long assigneeId, String assigneeName) {
        for (Long taskId : taskIds) {
            assignTask(taskId, assigneeId, assigneeName);
        }
    }

    @Override
    public void startTask(Long taskId) {
        TestTask task = new TestTask();
        task.setId(taskId);
        task.setStatus("in_progress");
        task.setProgress(10);
        updateById(task);
    }

    @Override
    public void completeTask(Long taskId) {
        TestTask task = new TestTask();
        task.setId(taskId);
        task.setStatus("completed");
        task.setProgress(100);
        task.setCompletedDate(LocalDate.now());
        updateById(task);
    }

    @Override
    public void transferTask(Long taskId, Long newAssigneeId, String newAssigneeName, String reason) {
        TestTask task = new TestTask();
        task.setId(taskId);
        task.setAssigneeId(newAssigneeId);
        task.setAssignee(newAssigneeName);
        task.setRemark("转交原因: " + reason);
        updateById(task);
    }

    @Override
    public String generateTaskNo() {
        // 格式: RW + 年月日 + 4位序号
        String prefix = "RW" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        LambdaQueryWrapper<TestTask> wrapper = new LambdaQueryWrapper<>();
        wrapper.likeRight(TestTask::getTaskNo, prefix)
               .orderByDesc(TestTask::getTaskNo)
               .last("LIMIT 1");
        TestTask last = getOne(wrapper);
        
        int seq = 1;
        if (last != null && last.getTaskNo() != null) {
            String lastNo = last.getTaskNo();
            seq = Integer.parseInt(lastNo.substring(lastNo.length() - 4)) + 1;
        }
        
        return prefix + String.format("%04d", seq);
    }

    @Override
    public Page<TestTask> myTasks(Integer current, Integer size, Long userId, String status) {
        Page<TestTask> page = new Page<>(current, size);
        LambdaQueryWrapper<TestTask> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TestTask::getAssigneeId, userId)
               .eq(StringUtils.hasText(status), TestTask::getStatus, status)
               .eq(TestTask::getIsOutsourced, false)
               .orderByDesc(TestTask::getCreateTime);
        return page(page, wrapper);
    }
}
