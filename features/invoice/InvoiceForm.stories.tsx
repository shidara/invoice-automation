import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Container from '@mui/material/Container';
import InvoiceForm from './InvoiceForm';
import type { Invoice } from './types';

const meta = {
  title: 'Invoice/InvoiceForm',
  component: InvoiceForm,
  decorators: [
    (Story) => (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Story />
      </Container>
    ),
  ],
  args: {
    onSubmit: (invoice: Invoice) => console.log('submit', invoice),
  },
} satisfies Meta<typeof InvoiceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 空の状態。送信するとバリデーションエラーが表示される。 */
export const Empty: Story = {};

/** 値が入った状態。 */
export const Prefilled: Story = {
  args: {
    initialInvoice: {
      invoiceNumber: 'INV-2026-001',
      issuedAt: '2026-06-10',
      dueAt: '2026-06-17',
      clientName: '株式会社サンプル',
      clientAddress: '〒100-0001\n東京都千代田区千代田1-1',
      issuerAddress: '〒150-0001\n東京都渋谷区神宮前2-2-2',
      issuerTel: '03-1234-5678',
      issuerContact: '設楽 太郎',
      bankInfo: 'サンプル銀行 渋谷支店 普通 1234567',
      title: 'Webサイト制作費',
      items: [
        { name: 'デザイン', unitPrice: 120000, quantity: 1 },
        { name: '実装', unitPrice: 80000, quantity: 2 },
      ],
      note: 'お振込手数料はご負担ください。',
    },
  },
};
