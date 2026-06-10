import { isInLineClient } from '@/lib/liff';
import { downloadInvoicePdf } from './downloadInvoicePdf';
import { openInvoicePdf } from './openInvoicePdf';

export type DeliveryMode = 'auto' | 'download' | 'open';

export interface DeliverOptions {
  /** ダウンロード時のファイル名 */
  fileName: string;
  /** 配信方式（既定 auto） */
  mode?: DeliveryMode;
}

/**
 * 生成済みの PDF Blob をユーザーに届ける。配信方式の選択をここに集約する。
 *
 * - auto（既定）: LINE 内なら Viewer 表示を試し、失敗時は通常DLへフォールバック。
 *   通常ブラウザはダウンロード。
 * - download: 常に通常ダウンロード。
 * - open: Viewer 表示（失敗時はDLへフォールバック）。
 *
 * UI 側は環境判定を持たず、この関数を呼ぶだけでよい。
 */
export function deliverInvoicePdf(
  blob: Blob,
  { fileName, mode = 'auto' }: DeliverOptions,
): void {
  const preferOpen = mode === 'open' || (mode === 'auto' && isInLineClient());
  if (preferOpen && openInvoicePdf(blob)) {
    return;
  }
  downloadInvoicePdf(blob, fileName);
}
