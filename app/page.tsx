import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          請求書作成
        </Typography>
        <Typography variant="body1" color="text.secondary">
          入力フォームと PDF 生成はこれから実装します。
        </Typography>
      </Box>
    </Container>
  );
}
