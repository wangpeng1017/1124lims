import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { IClientReport, IClientReportTemplate } from '../../mock/report';
import CoverPage from './CoverPage';
import InfoPage from './InfoPage';
import ResultPage from './ResultPage';

// 注册中文字体
Font.register({
    family: 'SimSun',
    src: '/fonts/simsun.ttf',
});

Font.register({
    family: 'SimHei',
    src: '/fonts/simhei.ttf',
});

// 通用样式
export const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'SimSun',
        fontSize: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    logo: {
        width: 80,
        height: 40,
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    companyNameEn: {
        fontSize: 8,
        color: '#666',
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        marginVertical: 30,
        fontFamily: 'SimHei',
        letterSpacing: 10,
    },
    fieldRow: {
        flexDirection: 'row',
        marginVertical: 8,
        alignItems: 'flex-start',
    },
    fieldLabel: {
        width: 100,
        fontSize: 10,
    },
    fieldValue: {
        flex: 1,
        fontSize: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 2,
    },
    declarationBox: {
        marginTop: 40,
        padding: 10,
        fontSize: 8,
        lineHeight: 1.8,
    },
    declarationItem: {
        marginBottom: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    tableCell: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#333',
        fontSize: 9,
    },
    tableCellLabel: {
        width: '25%',
        backgroundColor: '#f5f5f5',
    },
    tableCellValue: {
        width: '25%',
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 20,
    },
    signatureItem: {
        width: '30%',
        textAlign: 'center',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
    },
});

interface ClientReportPDFProps {
    report: IClientReport;
    template: IClientReportTemplate;
    testResults?: Array<{
        sampleNo: string;
        description: string;
        images?: Array<{ url: string; caption: string }>;
    }>;
}

const ClientReportPDF: React.FC<ClientReportPDFProps> = ({ report, template, testResults }) => {
    return (
        <Document>
            <CoverPage report={report} template={template} />
            <InfoPage report={report} template={template} />
            {testResults && testResults.length > 0 && (
                <ResultPage report={report} template={template} testResults={testResults} />
            )}
        </Document>
    );
};

export default ClientReportPDF;
