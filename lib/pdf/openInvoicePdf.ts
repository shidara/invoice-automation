/**
 * PDF を Viewer で表示する配信方式（LINE 内など、ダウンロードが不安定な環境向け）。
 *
 * object URL を新規ウィンドウで開く。成功可否を boolean で返し、
 * 失敗時は呼び出し側（deliverInvoicePdf）が通常DLへフォールバックできる。
 *
 * 将来 Share / Upload を足す場合も、この「Blob を受け取り成否を返す」形を踏襲する。
 */
export function openInvoicePdf(blob: Blob): boolean {
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    URL.revokeObjectURL(url);
    return false;
  }
  // 即時 revoke するとビューアが読み込めない端末があるため、遅延して解放する。
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}
