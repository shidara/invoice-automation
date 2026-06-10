import path from 'node:path';
import { Font, renderToBuffer } from '@react-pdf/renderer';
import InvoicePdf from '@/features/invoice/InvoicePdf';
import type { Invoice } from '@/features/invoice/types';

/**
 * 請求書PDFの生成責務。フォント登録とバイナリ生成をここに閉じ込める。
 * レイアウトは InvoicePdf、レスポンス返却は API Route が担当する。
 * 将来 PDF エンジンを差し替える場合も、外部はこの関数だけを使えばよい。
 */

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');
let fontsRegistered = false;

function registerFonts(): void {
  if (fontsRegistered) return;
  Font.register({
    family: 'NotoSansJP',
    fonts: [
      { src: path.join(FONT_DIR, 'NotoSansJP-Regular.otf'), fontWeight: 'normal' },
      { src: path.join(FONT_DIR, 'NotoSansJP-Bold.otf'), fontWeight: 'bold' },
    ],
  });
  // CJK の自動ハイフネーションを無効化（単語途中での不自然な分割を防ぐ）
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

/** 請求書から PDF バイナリを生成する。 */
export async function renderInvoicePdf(invoice: Invoice): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<InvoicePdf invoice={invoice} />);
}
