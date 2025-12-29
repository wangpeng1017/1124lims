package com.lims.controller;

import com.lims.common.Result;
import com.lims.service.ReportGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 报告生成控制器
 */
@Slf4j
@RestController
@RequestMapping("/report-generator")
@RequiredArgsConstructor
@Tag(name = "报告生成", description = "PDF报告生成接口")
public class ReportGeneratorController {

    private final ReportGeneratorService reportGeneratorService;

    @Operation(summary = "根据任务ID生成报告")
    @PostMapping("/generate/{taskId}")
    public Result<String> generateReport(@PathVariable Long taskId) {
        try {
            String pdfPath = reportGeneratorService.generateReport(taskId);
            return Result.success(pdfPath);
        } catch (Exception e) {
            log.error("报告生成失败", e);
            return Result.error("报告生成失败: " + e.getMessage());
        }
    }

    @Operation(summary = "根据检测数据ID生成报告")
    @PostMapping("/generate-by-data/{testDataId}")
    public Result<String> generateReportByTestData(@PathVariable Long testDataId) {
        try {
            String pdfPath = reportGeneratorService.generateReportByTestData(testDataId);
            return Result.success(pdfPath);
        } catch (Exception e) {
            log.error("报告生成失败", e);
            return Result.error("报告生成失败: " + e.getMessage());
        }
    }

    @Operation(summary = "下载报告")
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadReport(@RequestParam String path) {
        try {
            File file = new File(path);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(file);
            String filename = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
        } catch (Exception e) {
            log.error("下载报告失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
