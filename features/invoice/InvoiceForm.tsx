'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';

import {
  type Invoice,
  type InvoiceItem,
  createEmptyInvoice,
  createEmptyItem,
} from './types';
import { itemAmount, calcSubtotal, calcTotal } from './calc';
import { validateInvoice, type InvoiceErrors } from './validation';
import { formatJPY } from '@/lib/format';
import { addDays } from '@/lib/date';

/** 振込期日は発行日の何日後にするか */
const DUE_DAYS_AFTER_ISSUE = 7;

export interface InvoiceFormProps {
  /** 初期値（未指定なら空の請求書） */
  initialInvoice?: Invoice;
  /** バリデーション通過後に確定した請求書を受け取る */
  onSubmit: (invoice: Invoice) => void;
  /** 送信処理中（ボタンを無効化） */
  submitting?: boolean;
  /** 送信ボタンの文言 */
  submitLabel?: string;
  /** 送信失敗時などに表示するエラーメッセージ */
  errorMessage?: string;
}

export default function InvoiceForm({
  initialInvoice,
  onSubmit,
  submitting = false,
  submitLabel = 'PDFを作成',
  errorMessage,
}: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>(
    () => initialInvoice ?? createEmptyInvoice(),
  );
  const [errors, setErrors] = useState<InvoiceErrors>({});

  const subtotal = calcSubtotal(invoice.items);
  const total = calcTotal(invoice);

  const updateField = <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  };

  // 発行日を変更したら振込期日を自動で +7日にする
  const updateIssuedAt = (value: string) => {
    setInvoice((prev) => ({
      ...prev,
      issuedAt: value,
      dueAt: addDays(value, DUE_DAYS_AFTER_ISSUE),
    }));
  };

  const updateItem = <K extends keyof InvoiceItem>(
    index: number,
    key: K,
    value: InvoiceItem[K],
  ) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }));
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateInvoice(invoice);
    setErrors(result.errors);
    if (result.valid) {
      onSubmit(invoice);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            基本情報
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="請求書番号"
                value={invoice.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                error={Boolean(errors.invoiceNumber)}
                helperText={errors.invoiceNumber}
                fullWidth
                required
              />
              <TextField
                label="発行日"
                type="date"
                value={invoice.issuedAt}
                onChange={(e) => updateIssuedAt(e.target.value)}
                error={Boolean(errors.issuedAt)}
                helperText={errors.issuedAt}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                required
              />
              <TextField
                label="振込期日"
                type="date"
                value={invoice.dueAt}
                onChange={(e) => updateField('dueAt', e.target.value)}
                error={Boolean(errors.dueAt)}
                helperText={errors.dueAt ?? '発行日の7日後を自動入力'}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="件名（任意）"
              value={invoice.title}
              onChange={(e) => updateField('title', e.target.value)}
              fullWidth
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            請求先
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="請求先名"
              value={invoice.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              error={Boolean(errors.clientName)}
              helperText={errors.clientName}
              fullWidth
              required
            />
            <TextField
              label="請求先住所"
              value={invoice.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
              error={Boolean(errors.clientAddress)}
              helperText={errors.clientAddress}
              multiline
              minRows={2}
              fullWidth
              required
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            差出人
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="差出人住所"
              value={invoice.issuerAddress}
              onChange={(e) => updateField('issuerAddress', e.target.value)}
              error={Boolean(errors.issuerAddress)}
              helperText={errors.issuerAddress}
              multiline
              minRows={2}
              fullWidth
              required
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="TEL（任意）"
                type="tel"
                value={invoice.issuerTel}
                onChange={(e) => updateField('issuerTel', e.target.value)}
                fullWidth
              />
              <TextField
                label="担当者（任意）"
                value={invoice.issuerContact}
                onChange={(e) => updateField('issuerContact', e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="振込先"
              value={invoice.bankInfo}
              onChange={(e) => updateField('bankInfo', e.target.value)}
              error={Boolean(errors.bankInfo)}
              helperText={errors.bankInfo}
              multiline
              minRows={2}
              fullWidth
              required
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack
            direction="row"
            sx={{
              mb: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">明細</Typography>
            <Button startIcon={<AddIcon />} onClick={addItem}>
              行を追加
            </Button>
          </Stack>

          {errors.items && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {errors.items}
            </Typography>
          )}

          <Stack spacing={2}>
            {invoice.items.map((item, index) => {
              const itemError = errors.itemErrors?.[index];
              return (
                <Stack
                  key={index}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
                >
                  <TextField
                    label="品目名"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    error={Boolean(itemError?.name)}
                    helperText={itemError?.name}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="単価"
                    type="number"
                    value={Number.isNaN(item.unitPrice) ? '' : item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, 'unitPrice', Number(e.target.value))
                    }
                    error={Boolean(itemError?.unitPrice)}
                    helperText={itemError?.unitPrice}
                    sx={{ width: { xs: '100%', sm: 140 } }}
                  />
                  <TextField
                    label="数量"
                    type="number"
                    value={Number.isNaN(item.quantity) ? '' : item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', Number(e.target.value))
                    }
                    error={Boolean(itemError?.quantity)}
                    helperText={itemError?.quantity}
                    sx={{ width: { xs: '100%', sm: 100 } }}
                  />
                  <Box
                    sx={{
                      minWidth: { sm: 120 },
                      textAlign: { xs: 'right', sm: 'right' },
                      pt: { sm: 2 },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {formatJPY(itemAmount(item))}
                    </Typography>
                  </Box>
                  <IconButton
                    aria-label="この行を削除"
                    onClick={() => removeItem(index)}
                    disabled={invoice.items.length === 1}
                    sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              小計: {formatJPY(subtotal)}
            </Typography>
            <Typography variant="h6">合計: {formatJPY(total)}</Typography>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            備考
          </Typography>
          <TextField
            label="備考（任意）"
            value={invoice.note}
            onChange={(e) => updateField('note', e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Paper>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box sx={{ textAlign: 'right' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
          >
            {submitting ? '作成中…' : submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
