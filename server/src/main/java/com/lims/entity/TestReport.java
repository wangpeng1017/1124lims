package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 检测报告实体
 */
@Data
@TableName("biz_test_report")
public class TestReport implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 报告编号
     */
    private String reportNo;

    /**
     * 委托单ID
     */
    private Long entrustmentId;

    /**
     * 委托单号
     */
    private String entrustmentNo;

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
     * 任务ID
     */
    private Long taskId;

    /**
     * 任务编号
     */
    private String taskNo;

    /**
     * 客户名称
     */
    private String clientName;

    /**
     * 检测项目
     */
    private String testItems;

    /**
     * 检测结果（JSON格式）
     */
    private String testResults;

    /**
     * 结论
     */
    private String conclusion;

    /**
     * 检测员ID
     */
    private Long testerId;

    /**
     * 检测员
     */
    private String tester;

    /**
     * 审核员ID
     */
    private Long reviewerId;

    /**
     * 审核员
     */
    private String reviewer;

    /**
     * 审核日期
     */
    private LocalDate reviewDate;

    /**
     * 批准人ID
     */
    private Long approverId;

    /**
     * 批准人
     */
    private String approver;

    /**
     * 批准日期
     */
    private LocalDate approveDate;

    /**
     * 报告模板ID
     */
    private Long templateId;

    /**
     * 报告文件路径
     */
    private String filePath;

    /**
     * 签名图片
     */
    private String signatureImage;

    /**
     * 盖章图片
     */
    private String stampImage;

    /**
     * 状态: draft-草稿, pending_review-待审核, reviewed-已审核, approved-已批准, issued-已发布
     */
    private String status;

    /**
     * 发布日期
     */
    private LocalDate issuedDate;

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
