import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from './types';
import { itemAmount, calcSubtotal, calcTotal } from './calc';
import { formatJPY } from '@/lib/format';

/**
 * 請求書PDFのレイアウト責務のみを持つコンポーネント。
 * フォント登録や buffer 生成は lib/pdf 側が担当する。
 * フォントファミリ 'NotoSansJP' は呼び出し前に登録されている前提。
 */

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 10,
    color: '#1a1a1a',
    paddingVertical: 40,
    paddingHorizontal: 44,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  meta: {
    fontSize: 10,
    textAlign: 'right',
  },
  parties: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  party: {
    width: '48%',
  },
  partyLabel: {
    fontSize: 9,
    color: '#6750A4',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  partyName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  partyLine: {
    fontSize: 9.5,
    color: '#333',
  },
  subject: {
    fontSize: 11,
    color: '#444',
    marginBottom: 12,
  },
  totalBox: {
    backgroundColor: '#F3F0FA',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalBoxLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalBoxValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#6750A4',
    paddingBottom: 6,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingVertical: 6,
  },
  colName: { flexGrow: 1, flexBasis: 0 },
  colUnit: { width: 90, textAlign: 'right' },
  colQty: { width: 50, textAlign: 'right' },
  colAmount: { width: 90, textAlign: 'right' },
  summary: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    marginTop: 2,
  },
  summaryTotalLabel: { fontSize: 12, fontWeight: 'bold' },
  summaryTotalValue: { fontSize: 12, fontWeight: 'bold' },
  infoSection: {
    marginTop: 24,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 10,
    color: '#444',
  },
});

export interface InvoicePdfProps {
  invoice: Invoice;
}

export default function InvoicePdf({ invoice }: InvoicePdfProps) {
  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>請求書</Text>
          <View style={styles.meta}>
            <Text>請求書番号: {invoice.invoiceNumber}</Text>
            <Text>発行日: {invoice.issuedAt}</Text>
            <Text>振込期日: {invoice.dueAt}</Text>
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>請求先</Text>
            <Text style={styles.partyName}>{invoice.clientName} 御中</Text>
            <Text style={styles.partyLine}>{invoice.clientAddress}</Text>
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>差出人</Text>
            <Text style={styles.partyLine}>{invoice.issuerAddress}</Text>
            {invoice.issuerTel.trim() !== '' && (
              <Text style={styles.partyLine}>TEL: {invoice.issuerTel}</Text>
            )}
            {invoice.issuerContact.trim() !== '' && (
              <Text style={styles.partyLine}>担当: {invoice.issuerContact}</Text>
            )}
          </View>
        </View>

        {invoice.title.trim() !== '' && (
          <Text style={styles.subject}>件名: {invoice.title}</Text>
        )}

        <View style={styles.totalBox}>
          <Text style={styles.totalBoxLabel}>ご請求金額</Text>
          <Text style={styles.totalBoxValue}>{formatJPY(total)}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colName}>品目</Text>
          <Text style={styles.colUnit}>単価</Text>
          <Text style={styles.colQty}>数量</Text>
          <Text style={styles.colAmount}>金額</Text>
        </View>

        {invoice.items.map((item, index) => (
          <View key={index} style={styles.row} wrap={false}>
            <Text style={styles.colName}>{item.name}</Text>
            <Text style={styles.colUnit}>{formatJPY(item.unitPrice)}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colAmount}>{formatJPY(itemAmount(item))}</Text>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>小計</Text>
            <Text>{formatJPY(subtotal)}</Text>
          </View>
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>合計</Text>
            <Text style={styles.summaryTotalValue}>{formatJPY(total)}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>お振込先</Text>
          <Text style={styles.infoBody}>{invoice.bankInfo}</Text>
        </View>

        {invoice.note.trim() !== '' && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>備考</Text>
            <Text style={styles.infoBody}>{invoice.note}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
