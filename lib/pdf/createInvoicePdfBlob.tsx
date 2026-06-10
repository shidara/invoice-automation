import { pdf, Font } from '@react-pdf/renderer';
import InvoicePdf from '@/features/invoice/InvoicePdf';
import type { Invoice } from '@/features/invoice/types';

/**
 * 請求書PDFの生成責務（クライアント側）。
 * フォント登録と Blob 生成をここに閉じ込める。
 * レイアウトは InvoicePdf、ダウンロードは UI 側が担当する。
 *
 * 静的ホスティング（GitHub Pages）で動かすため、PDF生成はブラウザ内で行う。
 * フォントは public/fonts/ から URL 取得する（basePath を考慮）。
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
let fontsRegistered = false;

function registerFonts(): void {
  if (fontsRegistered) return;
  Font.register({
    family: 'NotoSansJP',
    fonts: [
      { src: `${BASE_PATH}/fonts/NotoSansJP-Regular.otf`, fontWeight: 'normal' },
      { src: `${BASE_PATH}/fonts/NotoSansJP-Bold.otf`, fontWeight: 'bold' },
    ],
  });
  // CJK の不自然な途中改行を防ぐ
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

/** 請求書から PDF Blob を生成する。 */
export async function createInvoicePdfBlob(invoice: Invoice): Promise<Blob> {
  registerFonts();
  return pdf(<InvoicePdf invoice={invoice} />).toBlob();
}
