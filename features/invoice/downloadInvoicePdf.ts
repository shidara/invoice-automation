import type { Invoice } from './types';
import { createInvoicePdfBlob } from '@/lib/pdf/createInvoicePdfBlob';

/**
 * 請求書PDFをブラウザ内で生成し、ダウンロードさせる（UI 側の責務）。
 * ファイル名は invoice-{invoiceNumber}.pdf。
 */
export async function downloadInvoicePdf(invoice: Invoice): Promise<void> {
  const blob = await createInvoicePdfBlob(invoice);
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
