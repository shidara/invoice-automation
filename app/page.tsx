'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InvoiceForm from '@/features/invoice/InvoiceForm';
import type { Invoice } from '@/features/invoice/types';

export default function Home() {
  // PR4 で PDF 生成 API に接続する。現時点では確定値の確認のみ。
  const handleSubmit = (invoice: Invoice) => {
    console.log('invoice', invoice);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          請求書作成
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          項目を入力して「PDFを作成」を押してください。
        </Typography>
        <InvoiceForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
}
