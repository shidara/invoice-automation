import type { Invoice } from './types';

/**
 * 請求書PDFを API から取得し、ブラウザでダウンロードさせる（UI 側の責務）。
 * ファイル名は invoice-{invoiceNumber}.pdf。
 */
export async function downloadInvoicePdf(invoice: Invoice): Promise<void> {
  const res = await fetch('/api/invoice/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });

  if (!res.ok) {
    throw new Error('PDFの生成に失敗しました。時間をおいて再度お試しください。');
  }

  const blob = await res.blob();
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
