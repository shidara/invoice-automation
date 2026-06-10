/**
 * 請求書ドメインの型定義。
 *
 * subtotal / total は items から計算で導出するため、ここでは保持しない（calc.ts 参照）。
 * 状態の二重持ちを避け、明細を正とする。
 */

/** 請求明細の1行 */
export interface InvoiceItem {
  /** 品目名 */
  name: string;
  /** 単価（円） */
  unitPrice: number;
  /** 数量 */
  quantity: number;
}

/** 編集対象の請求書（subtotal / total は派生値なので含めない） */
export interface Invoice {
  /** 請求書番号 */
  invoiceNumber: string;
  /** 発行日（ISO の yyyy-mm-dd 文字列） */
  issuedAt: string;
  /** 請求先名 */
  clientName: string;
  /** 件名 */
  title: string;
  /** 明細 */
  items: InvoiceItem[];
  /** 備考（任意） */
  note: string;
}

/** 空の明細行を作る */
export function createEmptyItem(): InvoiceItem {
  return { name: '', unitPrice: 0, quantity: 1 };
}

/** 空の請求書を作る（明細は1行から開始） */
export function createEmptyInvoice(): Invoice {
  return {
    invoiceNumber: '',
    issuedAt: '',
    clientName: '',
    title: '',
    items: [createEmptyItem()],
    note: '',
  };
}
