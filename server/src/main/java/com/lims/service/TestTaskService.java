package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.TestTask;

import java.util.List;

/**
 * 检测任务Service接口
 */
public interface TestTaskService extends IService<TestTask> {

    /**
     * 分页查询任务
     */
    Page<TestTask> pageList(Integer current, Integer size, String taskNo, String sampleName, String assignee, String status);

    /**
     * 创建任务
     */
    TestTask createTask(TestTask task);

    /**
     * 分配任务
     */
    void assignTask(Long taskId, Long assigneeId, String assigneeName);

    /**
     * 批量分配任务
     */
    void batchAssign(List<Long> taskIds, Long assigneeId, String assigneeName);

    /**
     * 开始任务
     */
    void startTask(Long taskId);

    /**
     * 完成任务
     */
    void completeTask(Long taskId);

    /**
     * 转交任务
     */
    void transferTask(Long taskId, Long newAssigneeId, String newAssigneeName, String reason);

    /**
     * 生成任务编号
     */
    String generateTaskNo();

    /**
     * 查询我的任务
     */
    Page<TestTask> myTasks(Integer current, Integer size, Long userId, String status);
}
