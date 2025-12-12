package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.lims.common.Result;
import com.lims.dto.PublicReportVO;
import com.lims.entity.TestReport;
import com.lims.mapper.TestReportMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 公开报告查询Controller（无需认证）
 */
@Tag(name = "公开接口", description = "报告真伪查询（无需登录）")
@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class PublicReportController {

    private final TestReportMapper reportMapper;

    /**
     * 报告状态映射
     */
    private static final Map<String, String> STATUS_TEXT_MAP = new HashMap<>();
    static {
        STATUS_TEXT_MAP.put("draft", "草稿");
        STATUS_TEXT_MAP.put("pending_review", "待审核");
        STATUS_TEXT_MAP.put("reviewed", "已审核");
        STATUS_TEXT_MAP.put("approved", "已批准");
        STATUS_TEXT_MAP.put("issued", "已发布");
    }

    @Operation(summary = "验证报告真伪")
    @GetMapping("/report/verify")
    public Result<PublicReportVO> verifyReport(
            @RequestParam String reportNo,
            @RequestParam String code) {

        log.info("报告真伪查询 - reportNo: {}, code: {}", reportNo, code);

        // 根据报告编号查询
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TestReport::getReportNo, reportNo);
        TestReport report = reportMapper.selectOne(wrapper);

        if (report == null) {
            log.warn("报告不存在: {}", reportNo);
            return Result.error("报告不存在，请核实报告编号");
        }

        // 验证码校验
        if (report.getVerificationCode() == null ||
            !report.getVerificationCode().equals(code)) {
            log.warn("验证码错误 - reportNo: {}", reportNo);
            return Result.error("验证码错误，该报告可能为伪造");
        }

        // 转换为公开VO
        PublicReportVO vo = convertToPublicVO(report);
        log.info("报告验证成功 - reportNo: {}", reportNo);

        return Result.success("验证成功，报告真实有效", vo);
    }

    @Operation(summary = "根据报告编号查询报告信息")
    @GetMapping("/report/query/{reportNo}")
    public Result<PublicReportVO> queryReport(@PathVariable String reportNo) {

        log.info("公开查询报告 - reportNo: {}", reportNo);

        // 根据报告编号查询
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TestReport::getReportNo, reportNo);
        TestReport report = reportMapper.selectOne(wrapper);

        if (report == null) {
            return Result.error("报告不存在");
        }

        // 只返回已发布的报告信息
        if (!"issued".equals(report.getStatus())) {
            return Result.error("该报告尚未发布，无法查询");
        }

        PublicReportVO vo = convertToPublicVO(report);
        return Result.success(vo);
    }

    @Operation(summary = "检查报告是否存在")
    @GetMapping("/report/exists")
    public Result<Boolean> checkReportExists(@RequestParam String reportNo) {
        LambdaQueryWrapper<TestReport> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TestReport::getReportNo, reportNo);
        boolean exists = reportMapper.exists(wrapper);
        return Result.success(exists);
    }

    /**
     * 将实体转换为公开VO
     */
    private PublicReportVO convertToPublicVO(TestReport report) {
        PublicReportVO vo = new PublicReportVO();
        vo.setReportNo(report.getReportNo());
        vo.setSampleName(report.getSampleName());
        vo.setClientName(report.getClientName());
        vo.setTestItems(report.getTestItems());
        vo.setConclusion(report.getConclusion());
        vo.setTester(report.getTester());
        vo.setReviewer(report.getReviewer());
        vo.setApprover(report.getApprover());
        vo.setIssuedDate(report.getIssuedDate());
        vo.setStatus(report.getStatus());
        vo.setStatusText(STATUS_TEXT_MAP.getOrDefault(report.getStatus(), report.getStatus()));
        vo.setValid("issued".equals(report.getStatus()));
        return vo;
    }
}
