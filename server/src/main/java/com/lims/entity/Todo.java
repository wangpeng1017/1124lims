package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 待办事项实体
 */
@Data
@TableName("biz_todo")
public class Todo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 类型: quotation_approval, report_approval, task_assignment, sample_receipt, device_calibration
     */
    private String type;

    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String description;

    /**
     * 优先级: urgent, high, normal, low
     */
    private String priority;

    /**
     * 状态: pending, in_progress, completed, overdue
     */
    private String status;

    /**
     * 截止日期
     */
    private LocalDate dueDate;

    /**
     * 创建人
     */
    private String createdBy;

    /**
     * 被指派人姓名
     */
    private String assignedTo;

    /**
     * 被指派人ID
     */
    private Long assigneeId;

    /**
     * 关联业务ID
     */
    private Long relatedId;

    /**
     * 关联业务编号
     */
    private String relatedNo;

    /**
     * 关联业务类型: entrustment, quotation, report, task, device
     */
    private String relatedType;

    /**
     * 跳转链接
     */
    private String link;

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
     * 逻辑删除
     */
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
