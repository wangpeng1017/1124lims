import React from 'react';
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { IClientReport, IClientReportTemplate } from '../../mock/report';

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'SimSun',
        fontSize: 10,
        position: 'relative',
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 60,
        height: 35,
        marginRight: 10,
    },
    companyInfo: {
        flex: 1,
    },
    companyNameCn: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2a5298',
    },
    companyNameEn: {
        fontSize: 9,
        color: '#666',
        marginTop: 2,
    },
    divider: {
        height: 2,
        backgroundColor: '#4a90d9',
        marginVertical: 15,
    },
    title: {
        fontSize: 36,
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 80,
        fontFamily: 'SimHei',
        letterSpacing: 20,
    },
    fieldSection: {
        marginTop: 20,
    },
    fieldRow: {
        flexDirection: 'row',
        marginVertical: 12,
        alignItems: 'flex-start',
    },
    fieldLabel: {
        width: 100,
        fontSize: 12,
        textAlign: 'left',
    },
    fieldValue: {
        flex: 1,
        fontSize: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 3,
        marginLeft: 20,
    },
    declarationBox: {
        marginTop: 60,
        paddingTop: 20,
    },
    declarationTitle: {
        fontSize: 10,
        marginBottom: 8,
    },
    declarationItem: {
        fontSize: 8,
        lineHeight: 1.6,
        marginBottom: 3,
        textIndent: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 50,
        right: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    stampPlaceholder: {
        position: 'absolute',
        right: 80,
        bottom: 200,
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#cc0000',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stampText: {
        fontSize: 8,
        color: '#cc0000',
    },
});

interface CoverPageProps {
    report: IClientReport;
    template: IClientReportTemplate;
}

const CoverPage: React.FC<CoverPageProps> = ({ report, template }) => {
    const { companyInfo, declarations } = template;

    return (
        <Page size="A4" style={styles.page}>
            {/* 页眉：Logo + 公司名 */}
            <View style={styles.headerSection}>
                <View style={styles.logo}>
                    <Text style={{ fontSize: 20, color: '#2a5298', fontWeight: 'bold' }}>ALTC</Text>
                </View>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyNameCn}>{companyInfo.nameCn}</Text>
                    <Text style={styles.companyNameEn}>{companyInfo.nameEn}</Text>
                </View>
            </View>

            {/* 分隔线 */}
            <View style={styles.divider} />

            {/* 标题 */}
            <Text style={styles.title}>检 测 报 告</Text>

            {/* 报告信息字段 */}
            <View style={styles.fieldSection}>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>报 告 编 号:</Text>
                    <Text style={styles.fieldValue}>{report.reportNo}</Text>
                </View>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>样 品 名 称:</Text>
                    <Text style={styles.fieldValue}>{report.sampleName}</Text>
                </View>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>检 测 项 目:</Text>
                    <Text style={styles.fieldValue}>{report.testItems?.join('、') || ''}</Text>
                </View>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>委 托 单 位:</Text>
                    <Text style={styles.fieldValue}>{report.clientName}</Text>
                </View>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>委托单位地址:</Text>
                    <Text style={styles.fieldValue}>{report.clientAddress || ''}</Text>
                </View>
            </View>

            {/* 声明 */}
            <View style={styles.declarationBox}>
                <Text style={styles.declarationTitle}>说明:</Text>
                {declarations.map((item, index) => (
                    <Text key={index} style={styles.declarationItem}>{item}</Text>
                ))}
            </View>

            {/* 印章占位（审批后添加） */}
            <View style={styles.stampPlaceholder}>
                <Text style={styles.stampText}>印章</Text>
            </View>

            {/* 页脚 */}
            <View style={styles.footer}>
                <Text>单位: {companyInfo.nameCn}</Text>
                <Text>邮编(P.C.): {companyInfo.postalCode}</Text>
            </View>
            <View style={[styles.footer, { bottom: 28 }]}>
                <Text>地址: {companyInfo.address}</Text>
                <Text>电话(Tel): {companyInfo.phone}</Text>
            </View>
        </Page>
    );
};

export default CoverPage;
