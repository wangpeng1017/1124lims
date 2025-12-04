import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { IContract } from '../mock/contract';

// 注册中文字体（实际项目中需要引入字体文件）
// Font.register({
//   family: 'SimSun',
//   src: '/fonts/SimSun.ttf'
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1px solid #000',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottom: '0.5px solid #ccc',
  },
  col1: { width: '40%' },
  col2: { width: '25%' },
  col3: { width: '15%' },
  col4: { width: '20%' },
  terms: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 1.5,
  },
  termsTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLine: {
    marginTop: 40,
    borderTop: '1px solid #000',
    paddingTop: 5,
  },
});

interface ContractPDFProps {
  contract: IContract;
}

const ContractPDF: React.FC<ContractPDFProps> = ({ contract }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 标题 */}
        <Text style={styles.title}>{contract.contractName}</Text>

        {/* 合同编号 */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>合同编号:</Text>
            <Text style={styles.value}>{contract.contractNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>签订日期:</Text>
            <Text style={styles.value}>{contract.signDate}</Text>
          </View>
        </View>

        {/* 甲方信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>甲方（委托方）</Text>
          <View style={styles.row}>
            <Text style={styles.label}>公司名称:</Text>
            <Text style={styles.value}>{contract.partyA.company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>联系人:</Text>
            <Text style={styles.value}>{contract.partyA.contact}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>联系电话:</Text>
            <Text style={styles.value}>{contract.partyA.tel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>地址:</Text>
            <Text style={styles.value}>{contract.partyA.address}</Text>
          </View>
          {contract.partyA.taxId && (
            <View style={styles.row}>
              <Text style={styles.label}>税号:</Text>
              <Text style={styles.value}>{contract.partyA.taxId}</Text>
            </View>
          )}
          {contract.partyA.bankName && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>开户银行:</Text>
                <Text style={styles.value}>{contract.partyA.bankName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>银行账号:</Text>
                <Text style={styles.value}>{contract.partyA.bankAccount}</Text>
              </View>
            </>
          )}
        </View>

        {/* 乙方信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>乙方（服务方）</Text>
          <View style={styles.row}>
            <Text style={styles.label}>公司名称:</Text>
            <Text style={styles.value}>{contract.partyB.company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>联系人:</Text>
            <Text style={styles.value}>{contract.partyB.contact}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>联系电话:</Text>
            <Text style={styles.value}>{contract.partyB.tel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>地址:</Text>
            <Text style={styles.value}>{contract.partyB.address}</Text>
          </View>
          {contract.partyB.taxId && (
            <View style={styles.row}>
              <Text style={styles.label}>税号:</Text>
              <Text style={styles.value}>{contract.partyB.taxId}</Text>
            </View>
          )}
          {contract.partyB.bankName && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>开户银行:</Text>
                <Text style={styles.value}>{contract.partyB.bankName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>银行账号:</Text>
                <Text style={styles.value}>{contract.partyB.bankAccount}</Text>
              </View>
            </>
          )}
        </View>

        {/* 合同内容 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>合同内容</Text>
          <View style={styles.row}>
            <Text style={styles.label}>样品名称:</Text>
            <Text style={styles.value}>{contract.sampleName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>合同金额:</Text>
            <Text style={styles.value}>¥{contract.contractAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* 检测项目表格 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>检测项目明细</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>检测项目</Text>
              <Text style={styles.col2}>检测标准</Text>
              <Text style={styles.col3}>数量</Text>
              <Text style={styles.col4}>金额</Text>
            </View>
            {contract.testItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.serviceItem}</Text>
                <Text style={styles.col2}>{item.methodStandard}</Text>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>¥{item.totalPrice.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* 第二页：合同条款 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>合同条款</Text>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>一、付款条款</Text>
          <Text>{contract.terms.paymentTerms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>二、交付条款</Text>
          <Text>{contract.terms.deliveryTerms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>三、质量条款</Text>
          <Text>{contract.terms.qualityTerms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>四、保密条款</Text>
          <Text>{contract.terms.confidentialityTerms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>五、违约责任</Text>
          <Text>{contract.terms.liabilityTerms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsTitle}>六、争议解决</Text>
          <Text>{contract.terms.disputeResolution}</Text>
        </View>

        {/* 合同日期 */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={styles.row}>
            <Text style={styles.label}>生效日期:</Text>
            <Text style={styles.value}>{contract.effectiveDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>到期日期:</Text>
            <Text style={styles.value}>{contract.expiryDate}</Text>
          </View>
        </View>

        {/* 签字栏 */}
        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text>甲方（盖章）：</Text>
            <View style={styles.signatureLine}>
              <Text>{contract.partyA.company}</Text>
            </View>
            <Text style={{ marginTop: 10 }}>代表签字：_______________</Text>
            <Text style={{ marginTop: 10 }}>日期：{contract.signDate}</Text>
          </View>

          <View style={styles.signatureBlock}>
            <Text>乙方（盖章）：</Text>
            <View style={styles.signatureLine}>
              <Text>{contract.partyB.company}</Text>
            </View>
            <Text style={{ marginTop: 10 }}>代表签字：_______________</Text>
            <Text style={{ marginTop: 10 }}>日期：{contract.signDate}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPDF;
