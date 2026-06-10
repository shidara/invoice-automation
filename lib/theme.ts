'use client';

import { createTheme } from '@mui/material/styles';

/**
 * MD3（Material Design 3）ベースの最小テーマ。
 * 厳密な MD3 準拠は追わず、配色・角丸を MD3 の雰囲気に寄せる程度に留める。
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4', // MD3 baseline primary
    },
    secondary: {
      main: '#625B71',
    },
    background: {
      default: '#FEF7FF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      '"Hiragino Sans"',
      '"Hiragino Kaku Gothic ProN"',
      'Meiryo',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
