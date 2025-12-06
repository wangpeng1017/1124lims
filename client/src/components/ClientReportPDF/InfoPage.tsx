import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { IClientReport, IClientReportTemplate } from '../../mock/report';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'SimSun',
        fontSize: 9,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#4a90d9',
    },
    logo: {
        marginRight: 10,
    },
    companyNameCn: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2a5298',
    },
    companyNameEn: {
        fontSize: 8,
        color: '#666',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 15,
        fontFamily: 'SimHei',
        letterSpacing: 8,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        minHeight: 24,
    },
    tableCell: {
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: '#333',
        fontSize: 9,
        justifyContent: 'center',
    },
    tableCellLabel: {
        width: '18%',
        backgroundColor: '#fafafa',
    },
    tableCellValue: {
        width: '32%',
    },
    tableCellFull: {
        width: '82%',
    },
    resultSection: {
        marginTop: 20,
        minHeight: 100,
    },
    resultLabel: {
        fontSize: 10,
        marginBottom: 10,
    },
    resultContent: {
        fontSize: 9,
        lineHeight: 1.5,
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        paddingTop: 20,
    },
    signatureItem: {
        width: '30%',
        flexDirection: 'row',
    },
    signatureLabel: {
        fontSize: 9,
    },
    signatureLine: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginLeft: 5,
        minWidth: 60,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
    },
    stampPlaceholder: {
        position: 'absolute',
        right: 60,
        bottom: 180,
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#cc0000',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stampText: {
        fontSize: 7,
        color: '#cc0000',
    },
});

interface InfoPageProps {
    report: IClientReport;
    template: IClientReportTemplate;
}

const InfoPage: React.FC<InfoPageProps> = ({ report, template }) => {
    const { companyInfo } = template;

    // 字段映射
    const fieldLabels: Record<string, string> = {
        sampleName: '样品名称',
        sampleNo: '样品编号',
        specification: '型号规格',
        clientName: '委托单位',
        sampleStatus: '样品描述/状态',
        sampleQuantity: '样品数量',
        receivedDate: '送样日期',
        testCategory: '检测类别',
        entrustmentId: '委托编号',
        testItems: '检测项目',
        testStandards: '检测依据',
        testDate: '检测日期',
    };

    const getFieldValue = (key: string): string => {
        switch (key) {
            case 'sampleName': return report.sampleName || '';
            case 'sampleNo': return report.sampleNo || '';
            case 'specification': return report.specification || '/';
            case 'clientName': return report.clientName || '';
            case 'sampleStatus': return report.sampleStatus || '完好';
            case 'sampleQuantity': return report.sampleQuantity || '';
            case 'receivedDate': return report.receivedDate || '';
            case 'testCategory': return report.testCategory || '委托检测';
            case 'entrustmentId': return report.entrustmentId || '';
            case 'testItems': return report.testItems?.join('、') || '';
            case 'testStandards': return report.testStandards?.join(' ') || '';
            case 'testDate': return `${report.testDateRange?.start || ''} ~ ${report.testDateRange?.end || ''}`;
            default: return '';
        }
    };

    return (
        <Page size="A4" style={styles.page}>
            {/* 页眉 */}
            <View style={styles.header}>
                <View style={styles.logo}>
                    <Text style={{ fontSize: 16, color: '#2a5298', fontWeight: 'bold' }}>ALTC</Text>
                </View>
                <View>
                    <Text style={styles.companyNameCn}>{companyInfo.nameCn}</Text>
                    <Text style={styles.companyNameEn}>{companyInfo.nameEn}</Text>
                </View>
            </View>

            {/* 标题 */}
            <Text style={styles.title}>检 测 报 告</Text>

            {/* 信息表格 */}
            <View style={styles.table}>
                {/* 第1行：样品名称 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.sampleName}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('sampleName')}</Text>
                    </View>
                </View>

                {/* 第2行：样品编号 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.sampleNo}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('sampleNo')}</Text>
                    </View>
                </View>

                {/* 第3行：型号规格 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.specification}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('specification')}</Text>
                    </View>
                </View>

                {/* 第4行：委托单位 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.clientName}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('clientName')}</Text>
                    </View>
                </View>

                {/* 第5行：样品状态 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.sampleStatus}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('sampleStatus')}</Text>
                    </View>
                </View>

                {/* 第6行：样品数量 + 送样日期 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.sampleQuantity}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellValue]}>
                        <Text>{getFieldValue('sampleQuantity')}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.receivedDate}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellValue, { borderRightWidth: 0 }]}>
                        <Text>{getFieldValue('receivedDate')}</Text>
                    </View>
                </View>

                {/* 第7行：检测类别 + 委托编号 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.testCategory}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellValue]}>
                        <Text>{getFieldValue('testCategory')}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.entrustmentId}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellValue, { borderRightWidth: 0 }]}>
                        <Text>{getFieldValue('entrustmentId')}</Text>
                    </View>
                </View>

                {/* 第8行：检测项目 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.testItems}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('testItems')}</Text>
                    </View>
                </View>

                {/* 第9行：检测依据 */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.testStandards}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('testStandards')}</Text>
                    </View>
                </View>

                {/* 第10行：检测日期 */}
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <View style={[styles.tableCell, styles.tableCellLabel]}>
                        <Text>{fieldLabels.testDate}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableCellFull]}>
                        <Text>{getFieldValue('testDate')}</Text>
                    </View>
                </View>
            </View>

            {/* 检测结果区域 */}
            <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>检测结果</Text>
                <Text style={styles.resultContent}>实测结果见数据页。</Text>
            </View>

            {/* 印章占位 */}
            <View style={styles.stampPlaceholder}>
                <Text style={styles.stampText}>检测专用章</Text>
            </View>

            {/* 签章区 */}
            <View style={styles.signatureSection}>
                <View style={styles.signatureItem}>
                    <Text style={styles.signatureLabel}>编制:</Text>
                    <View style={styles.signatureLine} />
                </View>
                <View style={styles.signatureItem}>
                    <Text style={styles.signatureLabel}>审核:</Text>
                    <View style={styles.signatureLine} />
                </View>
                <View style={styles.signatureItem}>
                    <Text style={styles.signatureLabel}>批准:</Text>
                    <View style={styles.signatureLine} />
                </View>
            </View>

            {/* 页码 */}
            <Text style={styles.pageNumber}>第 1 页 共 3 页</Text>
        </Page>
    );
};

export default InfoPage;
