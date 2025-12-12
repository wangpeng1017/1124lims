package com.lims.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.lims.entity.TestReport;
import com.lims.mapper.TestReportMapper;
import com.lims.service.FileStorageService;
import com.lims.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 二维码服务实现
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

    private final FileStorageService fileStorageService;
    private final TestReportMapper reportMapper;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    private static final int QR_CODE_SIZE = 200;

    @Override
    public String generateVerificationCode() {
        // 生成32位验证码，使用UUID去掉横线
        return UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public String generateQrCode(String content, String fileName) {
        try {
            // 配置二维码参数
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);

            // 生成二维码
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE, hints);

            // 转换为图片
            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);

            // 转换为字节数组
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();

            // 上传到MinIO
            String qrCodeFileName = fileName + ".png";
            ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
            String filePath = fileStorageService.upload(inputStream, "qrcodes", qrCodeFileName, "image/png");

            log.info("二维码生成成功: {}", filePath);
            return filePath;

        } catch (WriterException | IOException e) {
            log.error("生成二维码失败", e);
            throw new RuntimeException("生成二维码失败: " + e.getMessage());
        }
    }

    @Override
    public String buildVerifyUrl(String reportNo, String verificationCode) {
        // 构建公开查询URL
        return baseUrl + "/report/verify?reportNo=" + reportNo + "&code=" + verificationCode;
    }

    @Override
    public String generateReportQrCode(Long reportId, String reportNo) {
        // 生成验证码
        String verificationCode = generateVerificationCode();

        // 生成二维码内容URL
        String verifyUrl = buildVerifyUrl(reportNo, verificationCode);

        // 生成二维码图片并上传
        String qrCodeFileName = "report_" + reportNo + "_" + System.currentTimeMillis();
        String qrCodeUrl = generateQrCode(verifyUrl, qrCodeFileName);

        // 更新报告记录
        TestReport report = new TestReport();
        report.setId(reportId);
        report.setVerificationCode(verificationCode);
        report.setQrCodeUrl(qrCodeUrl);
        reportMapper.updateById(report);

        log.info("报告二维码生成完成 - reportNo: {}, verificationCode: {}", reportNo, verificationCode);

        return verificationCode;
    }
}
