import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableCaption,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableActionTrigger,
} from './table.js';

/** Table composition examples: Basic, Footer, Actions and RTL. Pattern and Viewport are fixtures, not props. TableCell uses muted-foreground by default; emphasis=strong uses foreground. Preserve the selected density and verify actual contrast. */

const meta = {
  title: 'Content/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          "Native table composition with shared density. Density adjusts row height; existing geometry is scoped by agent/exceptions.json. Applications reuse the components rather than copying internal dimensions.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const INVOICES = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV-003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
];

/** Anatomy only. Application consumers normally use Table, which owns this wrapper. */
export const Anatomy: Story = {
  args: { children: null },
  render: () => (
    <TableContainer label="Anatomy example">
      <table className="w-full border-collapse text-body-sm">
        <TableCaption>Container and caption anatomy</TableCaption>
        <thead><TableRow type="header"><TableHead>Name</TableHead></TableRow></thead>
        <tbody><TableRow><TableCell>Ada Lovelace</TableCell></TableRow></tbody>
      </table>
    </TableContainer>
  ),
};

/** Pattern = Basic. */
export const Basic: Story = {
  args: { children: null },
  render: () => (
    <Table caption="Recent invoices">
      <thead>
        <TableRow type="header">
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead alignment="right">Amount</TableHead>
        </TableRow>
      </thead>
      <tbody>
        {INVOICES.map((r) => (
          <TableRow key={r.id}>
            <TableCell emphasis="strong">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell alignment="right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  ),
};

/** Pattern = Footer. Note the footer row binds no fill, so `card` shows through. */
export const WithFooter: Story = {
  name: 'Pattern = Footer',
  args: { children: null },
  render: () => (
    <Table caption="Invoices with total" density="comfortable">
      <thead>
        <TableRow type="header" density="comfortable">
          <TableHead>Invoice</TableHead>
          <TableHead alignment="right">Amount</TableHead>
        </TableRow>
      </thead>
      <tbody>
        {INVOICES.map((r) => (
          <TableRow key={r.id} density="comfortable">
            <TableCell emphasis="strong">{r.id}</TableCell>
            <TableCell alignment="right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </tbody>
      <tfoot>
        <TableRow type="footer" density="comfortable">
          <TableCell emphasis="strong">Total</TableCell>
          <TableCell alignment="right" emphasis="strong">
            $750.00
          </TableCell>
        </TableRow>
      </tfoot>
    </Table>
  ),
};

/** Row actions and selection. Supply a context-specific accessible label, such as Open actions for INV-001. */
export const WithActions: Story = {
  name: 'Pattern = Actions + selection',
  args: { children: null },
  render: () => <ActionsDemo />,
};

function ActionsDemo() {
  const [selected, setSelected] = useState<string | null>('INV-002');
  return (
    <Table caption="Invoices with row actions">
      <thead>
        <TableRow type="header">
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead alignment="right">Amount</TableHead>
          <TableHead alignment="right">Actions</TableHead>
        </TableRow>
      </thead>
      <tbody>
        {INVOICES.map((r) => (
          <TableRow
            key={r.id}
            selected={selected === r.id}
            onSelect={() => setSelected(selected === r.id ? null : r.id)}
          >
            <TableCell emphasis="strong">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell alignment="right">{r.amount}</TableCell>
            <TableCell alignment="right">
              <TableActionTrigger
                label={`Open actions for ${r.id}`}
                onClick={() => {}}
              />
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}

/**
 * Pattern = RTL, and the compact viewport.
 *
 * The container is a **focusable, named scroll region** — Tab to it and use the
 * arrow keys. A region that scrolls but cannot be focused is unreachable by
 * keyboard, which is why `TableContainer` sets `tabIndex` and `aria-label`.
 */
export const RtlAndOverflow: Story = {
  name: 'Pattern = RTL + compact overflow',
  args: { children: null },
  render: () => (
    <div dir="rtl" className="max-w-xs">
      <Table caption="فواتير" label="Invoices (RTL)">
        <thead>
          <TableRow type="header">
            <TableHead>الفاتورة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الطريقة</TableHead>
            <TableHead alignment="right">المبلغ</TableHead>
          </TableRow>
        </thead>
        <tbody>
          {INVOICES.map((r) => (
            <TableRow key={r.id}>
              <TableCell emphasis="strong">{r.id}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>{r.method}</TableCell>
              <TableCell alignment="right">{r.amount}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  ),
};
