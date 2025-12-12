package com.lims.service;

/**
 * 报告导出服务接口
 */
public interface ReportExportService {

    /**
     * 导出报告为Word文档
     *
     * @param reportId 报告ID
     * @return Word文档字节数组
     */
    byte[] exportToWord(Long reportId);

    /**
     * 导出报告为PDF文档（后端生成）
     *
     * @param reportId 报告ID
     * @return PDF文档字节数组
     */
    byte[] exportToPdf(Long reportId);

    /**
     * 批量导出报告为Word文档（ZIP压缩包）
     *
     * @param reportIds 报告ID列表
     * @return ZIP文件字节数组
     */
    byte[] batchExportToWord(Long[] reportIds);
}
