package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 检测任务实体
 */
@Data
@TableName("biz_test_task")
public class TestTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 任务编号
     */
    private String taskNo;

    /**
     * 样品ID
     */
    private Long sampleId;

    /**
     * 样品编号
     */
    private String sampleNo;

    /**
     * 样品名称
     */
    private String sampleName;

    /**
     * 委托单ID
     */
    private Long entrustmentId;

    /**
     * 委托单号
     */
    private String entrustmentNo;

    /**
     * 检测参数（JSON格式）
     */
    private String parameters;

    /**
     * 检测方法
     */
    private String testMethod;

    /**
     * 检测标准
     */
    private String testStandard;

    /**
     * 负责人ID
     */
    private Long assigneeId;

    /**
     * 负责人
     */
    private String assignee;

    /**
     * 分配日期
     */
    private LocalDate assignDate;

    /**
     * 截止日期
     */
    private LocalDate dueDate;

    /**
     * 完成日期
     */
    private LocalDate completedDate;

    /**
     * 设备ID
     */
    private Long deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 进度 0-100
     */
    private Integer progress;

    /**
     * 优先级: normal-普通, urgent-紧急
     */
    private String priority;

    /**
     * 状态: pending-待开始, in_progress-进行中, completed-已完成, transferred-已转交
     */
    private String status;

    /**
     * 是否委外
     */
    private Boolean isOutsourced;

    /**
     * 委外单号
     */
    private String outsourceNo;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 创建人
     */
    private String createBy;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
