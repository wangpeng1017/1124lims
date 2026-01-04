package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 委托咨询实体
 * 用于管理客户咨询的完整生命周期
 */
@Data
@TableName("biz_consultation")
public class Consultation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 咨询单号
     */
    private String consultationNo;

    /**
     * 客户公司名称
     */
    private String clientCompany;

    /**
     * 联系人
     */
    private String clientContact;

    /**
     * 联系电话
     */
    private String clientTel;

    /**
     * 邮箱
     */
    private String clientEmail;

    /**
     * 地址
     */
    private String clientAddress;

    /**
     * 样品名称
     */
    private String sampleName;

    /**
     * 样品型号/规格
     */
    private String sampleModel;

    /**
     * 样品材质
     */
    private String sampleMaterial;

    /**
     * 预计样品数量
     */
    private Integer estimatedQuantity;

    /**
     * 检测项目列表（JSON格式）
     */
    private String testItems;

    /**
     * 检测目的: quality_inspection-质量检验, product_certification-产品认证, rd_testing-研发测试, other-其他
     */
    private String testPurpose;

    /**
     * 紧急程度: normal-普通, urgent-紧急, very_urgent-非常紧急
     */
    private String urgencyLevel;

    /**
     * 期望完成时间
     */
    private String expectedDeadline;

    /**
     * 客户特殊要求
     */
    private String clientRequirements;

    /**
     * 预算范围
     */
    private String budgetRange;

    /**
     * 状态: following-跟进中, quoted-已报价, rejected-已拒绝, closed-已关闭
     */
    private String status;

    /**
     * 跟进人
     */
    private String follower;

    /**
     * 跟进人ID
     */
    private Long followerId;

    /**
     * 跟进记录（JSON格式）
     */
    private String followUpRecords;

    /**
     * 可行性评估: feasible-可行, difficult-困难, infeasible-不可行
     */
    private String feasibility;

    /**
     * 可行性说明
     */
    private String feasibilityNote;

    /**
     * 预估价格
     */
    private Long estimatedPrice;

    /**
     * 关联的报价单ID
     */
    private Long quotationId;

    /**
     * 关联的报价单号
     */
    private String quotationNo;

    /**
     * 附件信息（JSON格式）
     */
    private String attachments;

    /**
     * 创建人
     */
    private String createdBy;

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
