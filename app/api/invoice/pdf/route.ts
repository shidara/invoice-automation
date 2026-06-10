import { renderInvoicePdf } from '@/lib/pdf/renderInvoicePdf';
import { validateInvoice } from '@/features/invoice/validation';
import type { Invoice } from '@/features/invoice/types';

// react-pdf は Node API に依存するため Node ランタイムで実行する。
export const runtime = 'nodejs';

export async function POST(request: Request) {
  let invoice: Invoice;
  try {
    invoice = (await request.json()) as Invoice;
  } catch {
    return Response.json({ message: 'リクエストの形式が正しくありません' }, { status: 400 });
  }

  const { valid } = validateInvoice(invoice);
  if (!valid) {
    return Response.json({ message: '入力内容が正しくありません' }, { status: 400 });
  }

  const pdf = await renderInvoicePdf(invoice);

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    },
  });
}
