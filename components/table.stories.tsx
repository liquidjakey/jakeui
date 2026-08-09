import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableActionTrigger,
} from './table.js';

/**
 * Stories for the Table family.
 * Contracts: docs/components/table.md · table-row.md · table-cell.md ·
 * table-head.md · table-caption.md · table-container.md · table-action-trigger.md
 *
 * **These stories are `Table / Root Composition`.** That Figma asset is deliberately
 * not bound to code: its only properties are `Pattern` (`kind: story-only` —
 * *"Storybook story, never a prop"*) and `Viewport` (`kind: responsive-fixture`).
 * Its four patterns — Basic, Footer, Actions, RTL — are the four stories below.
 *
 * ⚠️ **Look at the body text colour.** A default `TableCell` binds
 * `muted-foreground`, so ordinary table data renders muted and only `strong` cells
 * get full contrast. That is backwards from the usual convention, where the body is
 * primary and de-emphasis is the exception. It is transcribed faithfully from the
 * record, and it affects every cell in every table — worth a design review.
 */

const meta = {
  title: 'Data/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Density carries no token delta anywhere in this family — verified, not assumed: ' +
          'Table / Row shows three Compact/Comfortable pairs and all three bind identical tokens. ' +
          'Density changes row height only, and no spacing token exists here, so row height is raw.',
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

/**
 * Pattern = Actions, plus row selection.
 *
 * The action trigger's `label` is **required by the type**, because the record
 * demands a name identifying the context — "Open actions for INV-001", not "More".
 */
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
