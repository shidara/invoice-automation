/**
 * Blob を指定ファイル名でダウンロードする（通常ブラウザ向けの配信方式）。
 */
export function downloadInvoicePdf(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
