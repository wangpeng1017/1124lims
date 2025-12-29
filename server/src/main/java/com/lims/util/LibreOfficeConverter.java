package com.lims.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * LibreOffice 文档转换工具
 * 用于将 Excel/Word 转换为 PDF
 */
@Slf4j
@Component
public class LibreOfficeConverter {

    @Value("${libreoffice.path:/usr/bin/soffice}")
    private String libreOfficePath;

    @Value("${libreoffice.timeout:60}")
    private int timeout;

    /**
     * 将文件转换为 PDF
     * @param inputFile 输入文件路径
     * @param outputDir 输出目录
     * @return PDF 文件路径
     */
    public String convertToPdf(String inputFile, String outputDir) throws IOException, InterruptedException {
        File input = new File(inputFile);
        if (!input.exists()) {
            throw new IOException("输入文件不存在: " + inputFile);
        }

        File outDir = new File(outputDir);
        if (!outDir.exists()) {
            outDir.mkdirs();
        }

        // LibreOffice 命令行转换
        ProcessBuilder pb = new ProcessBuilder(
            libreOfficePath,
            "--headless",
            "--convert-to", "pdf",
            "--outdir", outputDir,
            inputFile
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        boolean finished = process.waitFor(timeout, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            throw new IOException("LibreOffice 转换超时");
        }

        int exitCode = process.exitValue();
        if (exitCode != 0) {
            throw new IOException("LibreOffice 转换失败，退出码: " + exitCode);
        }

        // 返回生成的 PDF 文件路径
        String baseName = input.getName().replaceFirst("[.][^.]+$", "");
        String pdfPath = outputDir + File.separator + baseName + ".pdf";

        File pdfFile = new File(pdfPath);
        if (!pdfFile.exists()) {
            throw new IOException("PDF 文件生成失败");
        }

        log.info("PDF 转换成功: {}", pdfPath);
        return pdfPath;
    }
}
