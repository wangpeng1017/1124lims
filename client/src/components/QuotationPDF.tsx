import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Quotation } from '../mock/quotationData';

// 注册中文字体 - 使用微软雅黑(通过CDN)
Font.register({
    family: 'Microsoft YaHei',
    src: 'https://cdn.jsdelivr.net/gh/max32002/microsoft-yahei@1.0/Microsoft-YaHei.ttf'
});

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Microsoft YaHei' },
    header: { marginBottom: 20, textAlign: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 12, color: '#666' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, backgroundColor: '#f0f0f0', padding: 5 },
    row: { flexDirection: 'row', marginBottom: 5 },
    label: { width: '30%', fontWeight: 'bold' },
    value: { width: '70%' },
    table: { marginTop: 10, marginBottom: 10 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#e0e0e0', padding: 5, fontWeight: 'bold', borderBottom: '1pt solid #000' },
    tableRow: { flexDirection: 'row', padding: 5, borderBottom: '1pt solid #ccc' },
    col1: { width: '5%', textAlign: 'center' },
    col2: { width: '25%' },
    col3: { width: '25%' },
    col4: { width: '10%', textAlign: 'center' },
    col5: { width: '15%', textAlign: 'right' },
    col6: { width: '20%', textAlign: 'right' },
    summary: { marginTop: 10, alignItems: 'flex-end' },
    summaryRow: { flexDirection: 'row', marginBottom: 5, width: '50%' },
    summaryLabel: { width: '60%', fontWeight: 'bold', textAlign: 'right', paddingRight: 10 },
    summaryValue: { width: '40%', textAlign: 'right' },
    footer: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
    signatureBox: { width: '45%' },
    signatureLabel: { marginBottom: 30, fontWeight: 'bold' },
    signatureLine: { borderTop: '1pt solid #000', marginTop: 5, paddingTop: 5, fontSize: 8, color: '#666' },
    remark: { marginTop: 15, padding: 10, backgroundColor: '#f9f9f9', borderLeft: '3pt solid #666' },
    remarkTitle: { fontWeight: 'bold', marginBottom: 5 }
});

interface QuotationPDFProps {
    quotation: Quotation;
}

const QuotationPDF: React.FC<QuotationPDFProps> = ({ quotation }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>报价单 (Quotation)</Text>
                <Text style={styles.subtitle}>报价单号: {quotation.quotationNo}</Text>
                <Text style={styles.subtitle}>日期: {quotation.createDate}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>服务方信息 (Service Provider)</Text>
                <View style={styles.row}><Text style={styles.label}>公司名称:</Text><Text style={styles.value}>{quotation.serviceCompany}</Text></View>
                <View style={styles.row}><Text style={styles.label}>联系人:</Text><Text style={styles.value}>{quotation.serviceContact}</Text></View>
                <View style={styles.row}><Text style={styles.label}>电话:</Text><Text style={styles.value}>{quotation.serviceTel}</Text></View>
                <View style={styles.row}><Text style={styles.label}>邮箱:</Text><Text style={styles.value}>{quotation.serviceEmail}</Text></View>
                <View style={styles.row}><Text style={styles.label}>地址:</Text><Text style={styles.value}>{quotation.serviceAddress}</Text></View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>委托方信息 (Client)</Text>
                <View style={styles.row}><Text style={styles.label}>公司名称:</Text><Text style={styles.value}>{quotation.clientCompany}</Text></View>
                <View style={styles.row}><Text style={styles.label}>联系人:</Text><Text style={styles.value}>{quotation.clientContact}</Text></View>
                <View style={styles.row}><Text style={styles.label}>电话:</Text><Text style={styles.value}>{quotation.clientTel}</Text></View>
                <View style={styles.row}><Text style={styles.label}>邮箱:</Text><Text style={styles.value}>{quotation.clientEmail}</Text></View>
                <View style={styles.row}><Text style={styles.label}>地址:</Text><Text style={styles.value}>{quotation.clientAddress}</Text></View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>样品信息 (Sample)</Text>
                <View style={styles.row}><Text style={styles.label}>样品名称:</Text><Text style={styles.value}>{quotation.sampleName}</Text></View>
            </View>

            <View style={styles.table}>
                <Text style={styles.sectionTitle}>检测项目明细 (Test Items)</Text>
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>#</Text>
                    <Text style={styles.col2}>检测项目</Text>
                    <Text style={styles.col3}>检测标准</Text>
                    <Text style={styles.col4}>数量</Text>
                    <Text style={styles.col5}>单价(¥)</Text>
                    <Text style={styles.col6}>总价(¥)</Text>
                </View>
                {quotation.items.map((item, index) => (
                    <View key={item.id} style={styles.tableRow}>
                        <Text style={styles.col1}>{index + 1}</Text>
                        <Text style={styles.col2}>{item.serviceItem}</Text>
                        <Text style={styles.col3}>{item.methodStandard}</Text>
                        <Text style={styles.col4}>{item.quantity}</Text>
                        <Text style={styles.col5}>{item.unitPrice.toFixed(2)}</Text>
                        <Text style={styles.col6}>{item.totalPrice.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.summary}>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>报价合计:</Text><Text style={styles.summaryValue}>¥{quotation.subtotal.toFixed(2)}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>含税合计(6%):</Text><Text style={styles.summaryValue}>¥{quotation.taxTotal.toFixed(2)}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>优惠后合计:</Text><Text style={styles.summaryValue}>¥{quotation.discountTotal.toFixed(2)}</Text></View>
            </View>

            {quotation.clientRemark && (
                <View style={styles.remark}>
                    <Text style={styles.remarkTitle}>客户要求备注:</Text>
                    <Text>{quotation.clientRemark}</Text>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>服务方签章:</Text>
                    <View style={styles.signatureLine}><Text>日期: ______________</Text></View>
                </View>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>委托方签章:</Text>
                    <View style={styles.signatureLine}><Text>日期: ______________</Text></View>
                </View>
            </View>

            <View style={{ marginTop: 20, fontSize: 8, color: '#999', textAlign: 'center' }}>
                <Text>本报价单自签发之日起30天内有效</Text>
                <Text>如有疑问,请联系: {quotation.serviceContact} ({quotation.serviceTel})</Text>
            </View>
        </Page>
    </Document>
);

export default QuotationPDF;
