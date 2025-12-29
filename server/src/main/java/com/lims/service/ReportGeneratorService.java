package com.lims.service;

/**
 * 报告生成服务接口
 */
public interface ReportGeneratorService {

    /**
     * 根据任务ID生成PDF报告
     * @param taskId 任务ID
     * @return 生成的PDF文件路径
     */
    String generateReport(Long taskId) throws Exception;

    /**
     * 根据检测数据ID生成PDF报告
     * @param testDataId 检测数据ID
     * @return 生成的PDF文件路径
     */
    String generateReportByTestData(Long testDataId) throws Exception;
}
