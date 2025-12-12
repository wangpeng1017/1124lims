package com.lims.service;

/**
 * 二维码服务接口
 */
public interface QrCodeService {

    /**
     * 生成验证码
     * @return 32位验证码
     */
    String generateVerificationCode();

    /**
     * 生成二维码图片并保存
     * @param content 二维码内容
     * @param fileName 文件名
     * @return 二维码图片URL
     */
    String generateQrCode(String content, String fileName);

    /**
     * 生成报告查询URL
     * @param reportNo 报告编号
     * @param verificationCode 验证码
     * @return 完整查询URL
     */
    String buildVerifyUrl(String reportNo, String verificationCode);

    /**
     * 为报告生成二维码
     * @param reportId 报告ID
     * @param reportNo 报告编号
     * @return 生成的验证码
     */
    String generateReportQrCode(Long reportId, String reportNo);
}
