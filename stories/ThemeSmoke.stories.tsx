import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * PR1 のセットアップ確認用スモークストーリー。
 * MUI + MD3ベーステーマが Storybook 上で適用されていることを目視確認する。
 * 機能実装が進んだら削除してよい。
 */
const meta: Meta = {
  title: 'Setup/ThemeSmoke',
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h5">MUI テーマ確認</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Stack>
    </Stack>
  ),
};
