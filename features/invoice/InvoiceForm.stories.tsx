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
      clientName: '株式会社サンプル',
      title: 'Webサイト制作費',
      items: [
        { name: 'デザイン', unitPrice: 120000, quantity: 1 },
        { name: '実装', unitPrice: 80000, quantity: 2 },
      ],
      note: 'お振込手数料はご負担ください。',
    },
  },
};
