import React from 'react';
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
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
    resultTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    resultDescription: {
        fontSize: 9,
        lineHeight: 1.6,
        marginBottom: 15,
        textIndent: 20,
    },
    tableTitle: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 8,
    },
    imageTable: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
    },
    imageTableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#f5f5f5',
    },
    imageTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        minHeight: 150,
    },
    imageTableCell: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sampleNoCell: {
        width: '15%',
    },
    imageCell: {
        width: '85%',
    },
    imagePlaceholder: {
        width: 100,
        height: 80,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    imagePlaceholderText: {
        fontSize: 8,
        color: '#666',
    },
    imageCaption: {
        fontSize: 8,
        textAlign: 'center',
        marginTop: 3,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 5,
    },
    imageBox: {
        margin: 5,
        alignItems: 'center',
    },
    samplePhotoSection: {
        marginTop: 20,
    },
    samplePhotoLabel: {
        fontSize: 9,
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
        bottom: 80,
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

interface TestResult {
    sampleNo: string;
    description: string;
    images?: Array<{ url: string; caption: string }>;
}

interface ResultPageProps {
    report: IClientReport;
    template: IClientReportTemplate;
    testResults: TestResult[];
}

const ResultPage: React.FC<ResultPageProps> = ({ report, template, testResults }) => {
    const { companyInfo } = template;

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

            {/* 检测结果标题 */}
            <Text style={styles.resultTitle}>检测结果:</Text>

            {/* 检测结果描述 */}
            {testResults.map((result, index) => (
                <Text key={index} style={styles.resultDescription}>
                    {result.description}
                </Text>
            ))}

            {/* 结果图片表格 */}
            <Text style={styles.tableTitle}>表1 测试结果图片</Text>
            <View style={styles.imageTable}>
                {/* 表头 */}
                <View style={styles.imageTableHeader}>
                    <View style={[styles.imageTableCell, styles.sampleNoCell]}>
                        <Text>样品编号</Text>
                    </View>
                    <View style={[styles.imageTableCell, styles.imageCell, { borderRightWidth: 0 }]}>
                        <Text>金相</Text>
                    </View>
                </View>

                {/* 数据行 */}
                {testResults.map((result, index) => (
                    <View key={index} style={[styles.imageTableRow, index === testResults.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                        <View style={[styles.imageTableCell, styles.sampleNoCell]}>
                            <Text>{result.sampleNo}</Text>
                        </View>
                        <View style={[styles.imageTableCell, styles.imageCell, { borderRightWidth: 0 }]}>
                            <View style={styles.imagesContainer}>
                                {result.images && result.images.length > 0 ? (
                                    result.images.map((img, imgIndex) => (
                                        <View key={imgIndex} style={styles.imageBox}>
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.imagePlaceholderText}>[图片]</Text>
                                            </View>
                                            <Text style={styles.imageCaption}>{img.caption}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <>
                                        <View style={styles.imageBox}>
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.imagePlaceholderText}>[图1]</Text>
                                            </View>
                                            <Text style={styles.imageCaption}>图1 抛光态 100X</Text>
                                        </View>
                                        <View style={styles.imageBox}>
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.imagePlaceholderText}>[图2a]</Text>
                                            </View>
                                            <Text style={styles.imageCaption}>图2 a)腐蚀态 100X</Text>
                                        </View>
                                        <View style={styles.imageBox}>
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.imagePlaceholderText}>[图2b]</Text>
                                            </View>
                                            <Text style={styles.imageCaption}>图2 b)腐蚀态 500X</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* 样品照片区域 */}
            <View style={styles.samplePhotoSection}>
                <Text style={styles.samplePhotoLabel}>样品照片:</Text>
            </View>

            {/* 印章占位 */}
            <View style={styles.stampPlaceholder}>
                <Text style={styles.stampText}>骑缝章</Text>
            </View>

            {/* 页码 */}
            <Text style={styles.pageNumber}>第 2 页 共 3 页</Text>
        </Page>
    );
};

export default ResultPage;
