package com.lims.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 公开报告信息VO（限制字段，用于二维码查询）
 */
@Data
public class PublicReportVO {

    /**
     * 报告编号
     */
    private String reportNo;

    /**
     * 样品名称
     */
    private String sampleName;

    /**
     * 客户名称
     */
    private String clientName;

    /**
     * 检测项目
     */
    private String testItems;

    /**
     * 结论
     */
    private String conclusion;

    /**
     * 检测员
     */
    private String tester;

    /**
     * 审核员
     */
    private String reviewer;

    /**
     * 批准人
     */
    private String approver;

    /**
     * 发布日期
     */
    private LocalDate issuedDate;

    /**
     * 状态
     */
    private String status;

    /**
     * 状态文本
     */
    private String statusText;

    /**
     * 是否有效（已发布状态）
     */
    private Boolean valid;
}
