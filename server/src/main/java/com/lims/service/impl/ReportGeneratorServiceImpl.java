package com.lims.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.lims.entity.TestData;
import com.lims.entity.TestTask;
import com.lims.mapper.TestDataMapper;
import com.lims.mapper.TestTaskMapper;
import com.lims.service.ReportGeneratorService;
import com.lims.util.LibreOfficeConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 报告生成服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportGeneratorServiceImpl implements ReportGeneratorService {

    private final TestTaskMapper testTaskMapper;
    private final TestDataMapper testDataMapper;
    private final LibreOfficeConverter libreOfficeConverter;

    @Value("${report.output-dir:/tmp/lims/reports}")
    private String outputDir;

    @Value("${report.template-dir:/tmp/lims/templates}")
    private String templateDir;

    @Override
    public String generateReport(Long taskId) throws Exception {
        TestTask task = testTaskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在: " + taskId);
        }

        // 查询该任务的检测数据
        TestData testData = testDataMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<TestData>()
                .eq(TestData::getTaskId, taskId)
                .orderByDesc(TestData::getCreateTime)
                .last("LIMIT 1")
        );

        if (testData == null) {
            throw new RuntimeException("未找到检测数据");
        }

        return generateReportByTestData(testData.getId());
    }

    @Override
    public String generateReportByTestData(Long testDataId) throws Exception {
        TestData testData = testDataMapper.selectById(testDataId);
        if (testData == null) {
            throw new RuntimeException("检测数据不存在: " + testDataId);
        }

        // 确保输出目录存在
        File outDir = new File(outputDir);
        if (!outDir.exists()) {
            outDir.mkdirs();
        }

        // 生成唯一文件名
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String excelFileName = String.format("report_%s_%s.xlsx", testDataId, timestamp);
        String excelPath = outputDir + File.separator + excelFileName;

        // 解析检测数据 JSON
        List<List<Object>> dataList = parseTestData(testData.getDataContent());

        // 使用 EasyExcel 生成 Excel
        EasyExcel.write(excelPath)
            .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
            .sheet("检测报告")
            .doWrite(dataList);

        log.info("Excel 报告生成成功: {}", excelPath);

        // 使用 LibreOffice 转换为 PDF
        String pdfPath = libreOfficeConverter.convertToPdf(excelPath, outputDir);

        // 删除临时 Excel 文件
        new File(excelPath).delete();

        return pdfPath;
    }

    /**
     * 解析检测数据 JSON 为二维列表
     */
    private List<List<Object>> parseTestData(String dataContent) {
        List<List<Object>> result = new ArrayList<>();

        if (dataContent == null || dataContent.isEmpty()) {
            return result;
        }

        try {
            // 简单解析 Fortune-sheet JSON 格式
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> data = mapper.readValue(dataContent, Map.class);

            List<Map<String, Object>> sheets = (List<Map<String, Object>>) data.get("sheets");
            if (sheets != null && !sheets.isEmpty()) {
                Map<String, Object> sheet = sheets.get(0);
                List<Map<String, Object>> celldata = (List<Map<String, Object>>) sheet.get("celldata");

                if (celldata != null) {
                    // 找出最大行列
                    int maxRow = 0, maxCol = 0;
                    for (Map<String, Object> cell : celldata) {
                        int r = ((Number) cell.get("r")).intValue();
                        int c = ((Number) cell.get("c")).intValue();
                        maxRow = Math.max(maxRow, r);
                        maxCol = Math.max(maxCol, c);
                    }

                    // 初始化二维数组
                    Object[][] matrix = new Object[maxRow + 1][maxCol + 1];
                    for (Map<String, Object> cell : celldata) {
                        int r = ((Number) cell.get("r")).intValue();
                        int c = ((Number) cell.get("c")).intValue();
                        Object v = cell.get("v");
                        if (v instanceof Map) {
                            matrix[r][c] = ((Map<?, ?>) v).get("v");
                        } else {
                            matrix[r][c] = v;
                        }
                    }

                    // 转换为 List
                    for (Object[] row : matrix) {
                        result.add(Arrays.asList(row));
                    }
                }
            }
        } catch (Exception e) {
            log.error("解析检测数据失败", e);
        }

        return result;
    }
}
