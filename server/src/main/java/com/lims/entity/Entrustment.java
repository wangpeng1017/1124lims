package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 委托单实体
 */
@Data
@TableName("biz_entrustment")
public class Entrustment implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 委托编号
     */
    private String entrustmentNo;

    /**
     * 合同编号
     */
    private String contractNo;

    /**
     * 客户ID
     */
    private Long clientId;

    /**
     * 客户名称
     */
    private String clientName;

    /**
     * 联系人
     */
    private String contactPerson;

    /**
     * 联系电话
     */
    private String contactPhone;

    /**
     * 送样日期
     */
    private LocalDate sampleDate;

    /**
     * 跟单人
     */
    private String follower;

    /**
     * 跟单人ID
     */
    private Long followerId;

    /**
     * 样品名称
     */
    private String sampleName;

    /**
     * 样品型号
     */
    private String sampleModel;

    /**
     * 样品材质
     */
    private String sampleMaterial;

    /**
     * 样品数量
     */
    private Integer sampleQuantity;

    /**
     * 是否返还样品
     */
    private Boolean isSampleReturn;

    /**
     * 检测项目汇总
     */
    private String testItems;

    /**
     * 预计费用
     */
    private BigDecimal estimatedAmount;

    /**
     * 期望完成日期
     */
    private LocalDate expectedDate;

    /**
     * 备注
     */
    private String remark;

    /**
     * 状态: pending-待审核, approved-已审核, testing-检测中, completed-已完成, cancelled-已取消
     */
    private String status;

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
     * 更新人
     */
    private String updateBy;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
