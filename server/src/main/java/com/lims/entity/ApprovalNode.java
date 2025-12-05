package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 审批节点实体
 */
@Data
@TableName("sys_approval_node")
public class ApprovalNode implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 流程ID
     */
    private Long flowId;

    /**
     * 节点名称
     */
    private String nodeName;

    /**
     * 节点顺序
     */
    private Integer nodeOrder;

    /**
     * 审批人类型: role-角色 user-指定用户 dept-部门
     */
    private String approverType;

    /**
     * 审批人ID列表（逗号分隔）
     */
    private String approverIds;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
