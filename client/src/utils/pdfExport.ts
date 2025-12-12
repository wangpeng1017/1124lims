import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ClientReportPDF from '../components/ClientReportPDF';
import type { IClientReport, IClientReportTemplate } from '../mock/report';

/**
 * 测试结果项
 */
export interface ITestResultItem {
    sampleNo: string;
    description: string;
    images?: Array<{ url: string; caption: string }>;
}

/**
 * 导出报告为PDF
 * @param report 报告数据
 * @param template 模板数据
 * @param testResults 测试结果（可选）
 * @param filename 文件名（可选，默认使用报告编号）
 */
export async function exportReportPDF(
    report: IClientReport,
    template: IClientReportTemplate,
    testResults?: ITestResultItem[],
    filename?: string
): Promise<void> {
    try {
        // 创建PDF文档
        const doc = React.createElement(ClientReportPDF, {
            report,
            template,
            testResults,
        });

        // 生成PDF blob
        const blob = await pdf(doc).toBlob();

        // 下载文件
        const finalFilename = filename || `${report.reportNo || 'report'}.pdf`;
        saveAs(blob, finalFilename);

        return Promise.resolve();
    } catch (error) {
        console.error('PDF导出失败:', error);
        throw new Error('PDF导出失败，请重试');
    }
}

/**
 * 生成PDF预览URL
 * @param report 报告数据
 * @param template 模板数据
 * @param testResults 测试结果（可选）
 * @returns PDF预览URL
 */
export async function generatePDFPreviewUrl(
    report: IClientReport,
    template: IClientReportTemplate,
    testResults?: ITestResultItem[]
): Promise<string> {
    try {
        const doc = React.createElement(ClientReportPDF, {
            report,
            template,
            testResults,
        });

        const blob = await pdf(doc).toBlob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('PDF预览生成失败:', error);
        throw new Error('PDF预览生成失败');
    }
}

/**
 * 批量导出报告为PDF（压缩包）
 * @param reports 报告列表
 * @param template 模板
 */
export async function exportReportsPDFBatch(
    reports: Array<{ report: IClientReport; testResults?: ITestResultItem[] }>,
    template: IClientReportTemplate
): Promise<void> {
    // 批量导出较复杂，需要JSZip支持
    // 这里简化处理，逐个下载
    for (const item of reports) {
        await exportReportPDF(item.report, template, item.testResults);
        // 添加延迟避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
