package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 审批操作日志实体
 */
@Data
@TableName("sys_approval_log")
public class ApprovalLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 审批记录ID
     */
    private Long recordId;

    /**
     * 节点ID
     */
    private Long nodeId;

    /**
     * 节点名称
     */
    private String nodeName;

    /**
     * 审批人ID
     */
    private Long approverId;

    /**
     * 审批人姓名
     */
    private String approverName;

    /**
     * 操作: approve-通过 reject-拒绝 transfer-转交
     */
    private String action;

    /**
     * 审批意见
     */
    private String comment;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
