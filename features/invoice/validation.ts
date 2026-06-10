import type { Invoice } from './types';

/**
 * 請求書入力のバリデーション。純関数。
 * フォーム（PR3）がそのまま表示に使えるエラー構造を返す。
 */

/** 明細1行ぶんのエラー */
export interface ItemErrors {
  name?: string;
  unitPrice?: string;
  quantity?: string;
}

/** 請求書全体のエラー */
export interface InvoiceErrors {
  invoiceNumber?: string;
  issuedAt?: string;
  dueAt?: string;
  clientName?: string;
  clientAddress?: string;
  issuerAddress?: string;
  bankInfo?: string;
  /** 明細全体に対するエラー（例: 1件以上必要） */
  items?: string;
  /** 明細行ごとのエラー（index 対応） */
  itemErrors?: ItemErrors[];
}

export interface ValidationResult {
  valid: boolean;
  errors: InvoiceErrors;
}

const isBlank = (value: string): boolean => value.trim() === '';
const isValidDate = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());

/** 請求書を検証する */
export function validateInvoice(invoice: Invoice): ValidationResult {
  const errors: InvoiceErrors = {};

  if (isBlank(invoice.invoiceNumber)) {
    errors.invoiceNumber = '請求書番号を入力してください';
  }
  if (isBlank(invoice.issuedAt)) {
    errors.issuedAt = '発行日を入力してください';
  } else if (!isValidDate(invoice.issuedAt)) {
    errors.issuedAt = '発行日の形式が正しくありません';
  }
  if (isBlank(invoice.dueAt)) {
    errors.dueAt = '振込期日を入力してください';
  } else if (!isValidDate(invoice.dueAt)) {
    errors.dueAt = '振込期日の形式が正しくありません';
  }
  if (isBlank(invoice.clientName)) {
    errors.clientName = '請求先名を入力してください';
  }
  if (isBlank(invoice.clientAddress)) {
    errors.clientAddress = '請求先住所を入力してください';
  }
  if (isBlank(invoice.issuerAddress)) {
    errors.issuerAddress = '差出人住所を入力してください';
  }
  if (isBlank(invoice.bankInfo)) {
    errors.bankInfo = '振込先を入力してください';
  }
  // 件名・TEL・担当者は任意

  if (invoice.items.length === 0) {
    errors.items = '明細を1件以上追加してください';
  }

  const itemErrors: ItemErrors[] = invoice.items.map((item) => {
    const itemError: ItemErrors = {};
    if (isBlank(item.name)) {
      itemError.name = '品目名を入力してください';
    }
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      itemError.unitPrice = '単価は0以上で入力してください';
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      itemError.quantity = '数量は1以上の整数で入力してください';
    }
    return itemError;
  });

  if (itemErrors.some((e) => Object.keys(e).length > 0)) {
    errors.itemErrors = itemErrors;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
