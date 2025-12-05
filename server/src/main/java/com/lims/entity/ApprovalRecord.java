package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 审批记录实体
 */
@Data
@TableName("sys_approval_record")
public class ApprovalRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 流程ID
     */
    private Long flowId;

    /**
     * 业务类型
     */
    private String businessType;

    /**
     * 业务ID
     */
    private Long businessId;

    /**
     * 业务编号
     */
    private String businessNo;

    /**
     * 当前节点ID
     */
    private Long currentNodeId;

    /**
     * 当前节点顺序
     */
    private Integer currentNodeOrder;

    /**
     * 状态: pending-待审批 approved-已通过 rejected-已拒绝 cancelled-已取消
     */
    private String status;

    /**
     * 发起人ID
     */
    private Long initiatorId;

    /**
     * 发起人姓名
     */
    private String initiatorName;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
