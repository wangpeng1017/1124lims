package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.TestReport;

/**
 * 检测报告Service接口
 */
public interface TestReportService extends IService<TestReport> {

    /**
     * 分页查询报告
     */
    Page<TestReport> pageList(Integer current, Integer size, String reportNo, String clientName, String status);

    /**
     * 创建报告
     */
    TestReport createReport(TestReport report);

    /**
     * 提交审核
     */
    void submitReview(Long reportId);

    /**
     * 审核报告
     */
    void review(Long reportId, Long reviewerId, String reviewerName, boolean approved, String comment);

    /**
     * 批准报告
     */
    void approve(Long reportId, Long approverId, String approverName);

    /**
     * 发布报告
     */
    void issue(Long reportId);

    /**
     * 添加签名盖章
     */
    void addSignatureAndStamp(Long reportId, String signatureImage, String stampImage);

    /**
     * 生成报告编号
     */
    String generateReportNo();
}
