package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 委外订单实体
 */
@Data
@TableName("biz_outsource_order")
public class OutsourceOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 委外单号
     */
    private String orderNo;

    /**
     * 供应商ID
     */
    private Long supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 关联委托单ID
     */
    private Long entrustmentId;

    /**
     * 关联委托单号
     */
    private String entrustmentNo;

    /**
     * 委外类型: order-按订单 parameter-按参数
     */
    private String outsourceType;

    /**
     * 委外项目（JSON格式）
     */
    private String items;

    /**
     * 委外金额
     */
    private BigDecimal amount;

    /**
     * 预计完成日期
     */
    private LocalDate expectedDate;

    /**
     * 实际完成日期
     */
    private LocalDate completedDate;

    /**
     * 状态: draft-草稿 pending-待审批 approved-已批准 in_progress-进行中 completed-已完成 cancelled-已取消
     */
    private String status;

    /**
     * 审核人ID
     */
    private Long approverId;

    /**
     * 审核人
     */
    private String approver;

    /**
     * 审核时间
     */
    private LocalDateTime approveTime;

    /**
     * 结果附件
     */
    private String resultAttachment;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建人ID
     */
    private Long creatorId;

    /**
     * 创建人
     */
    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
