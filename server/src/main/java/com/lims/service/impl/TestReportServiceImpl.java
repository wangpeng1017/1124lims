package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lims.entity.TestReport;
import com.lims.mapper.TestReportMapper;
import com.lims.service.TestReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 检测报告Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TestReportServiceImpl extends ServiceImpl<TestReportMapper, TestReport> implements TestReportService {

    @Override
    public Page<TestReport> pageList(Integer current, Integer size, String reportNo, String clientName, String status) {
        Page<TestReport> page = new Page<>(current, size);
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(reportNo), TestReport::getReportNo, reportNo)
               .like(StringUtils.hasText(clientName), TestReport::getClientName, clientName)
               .eq(StringUtils.hasText(status), TestReport::getStatus, status)
               .orderByDesc(TestReport::getCreateTime);
        return page(page, wrapper);
    }

    @Override
    public TestReport createReport(TestReport report) {
        report.setReportNo(generateReportNo());
        report.setStatus("draft");
        save(report);
        return report;
    }

    @Override
    public void submitReview(Long reportId) {
        TestReport report = new TestReport();
        report.setId(reportId);
        report.setStatus("pending_review");
        updateById(report);
    }

    @Override
    public void review(Long reportId, Long reviewerId, String reviewerName, boolean approved, String comment) {
        TestReport report = getById(reportId);
        if (report != null) {
            report.setReviewerId(reviewerId);
            report.setReviewer(reviewerName);
            report.setReviewDate(LocalDate.now());
            report.setStatus(approved ? "reviewed" : "draft");
            if (!approved) {
                report.setRemark(comment);
            }
            updateById(report);
        }
    }

    @Override
    public void approve(Long reportId, Long approverId, String approverName) {
        TestReport report = getById(reportId);
        if (report != null) {
            report.setApproverId(approverId);
            report.setApprover(approverName);
            report.setApproveDate(LocalDate.now());
            report.setStatus("approved");
            updateById(report);
        }
    }

    @Override
    public void issue(Long reportId) {
        TestReport report = new TestReport();
        report.setId(reportId);
        report.setStatus("issued");
        report.setIssuedDate(LocalDate.now());
        updateById(report);
    }

    @Override
    public void addSignatureAndStamp(Long reportId, String signatureImage, String stampImage) {
        TestReport report = new TestReport();
        report.setId(reportId);
        report.setSignatureImage(signatureImage);
        report.setStampImage(stampImage);
        updateById(report);
    }

    @Override
    public String generateReportNo() {
        // 格式: BG + 年月日 + 4位序号
        String prefix = "BG" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.likeRight(TestReport::getReportNo, prefix)
               .orderByDesc(TestReport::getReportNo)
               .last("LIMIT 1");
        TestReport last = getOne(wrapper);
        
        int seq = 1;
        if (last != null && last.getReportNo() != null) {
            String lastNo = last.getReportNo();
            seq = Integer.parseInt(lastNo.substring(lastNo.length() - 4)) + 1;
        }
        
        return prefix + String.format("%04d", seq);
    }
}
