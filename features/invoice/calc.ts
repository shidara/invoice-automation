import type { Invoice, InvoiceItem } from './types';

/**
 * 金額計算ロジック。すべて純関数。
 * 通貨は円（整数）想定。
 */

/** 明細1行の金額（単価 × 数量） */
export function itemAmount(item: InvoiceItem): number {
  return item.unitPrice * item.quantity;
}

/** 小計（全明細の金額合計） */
export function calcSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + itemAmount(item), 0);
}

/**
 * 合計。現時点では税を扱わないため小計と同額。
 * 将来 消費税などを足す場合はここを拡張する。
 */
export function calcTotal(invoice: Invoice): number {
  return calcSubtotal(invoice.items);
}
