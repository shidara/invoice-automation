'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InvoiceForm from '@/features/invoice/InvoiceForm';
import { downloadInvoicePdf } from '@/features/invoice/downloadInvoicePdf';
import type { Invoice } from '@/features/invoice/types';

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (invoice: Invoice) => {
    setSubmitting(true);
    setError(null);
    try {
      await downloadInvoicePdf(invoice);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PDFの生成に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          請求書作成
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          項目を入力して「PDFを作成」を押すと、PDFがダウンロードされます。
        </Typography>
        <InvoiceForm
          onSubmit={handleSubmit}
          submitting={submitting}
          errorMessage={error ?? undefined}
        />
      </Box>
    </Container>
  );
}
