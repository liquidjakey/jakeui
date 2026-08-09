import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './data-table.js';
import { Pagination } from './pagination.js';
import { Table, TableRow, TableHead, TableCell } from './table.js';
import { Input } from './input.js';

/**
 * Stories for `DataTable`.
 * Contract: docs/components/data-table.md
 *
 * ⚠️ Its Description node is **unbound in Figma** at 13/20 Regular; `Body/SM` 13/18
 * is used instead. Part of the ramp question in the Figma-side decision memo.
 */

const meta = {
  title: 'Content/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          'A composition rather than a control: the toolbar, table and pagination are all ' +
          'slots. Its state is derived from whether there are children — a "populated" table ' +
          'with no rows contradicts itself.',
      },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `DataTable`, populated and empty. The state is derived from whether there are
 * children — a "populated" table with no rows contradicts itself.
 *
 * ⚠️ The toolbar is a **slot** rather than pre-composed: the record says this
 * composition is built from Input, Button, Table and Pagination, and **Button is
 * still blocked** by the 8-row cap.
 */
export const DataTables: Story = {
  args: { title: 'Data table' },
  render: () => <DataTableDemo />,
};

function DataTableDemo() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <DataTable
        title="Invoices"
        toolbar={
          <div className="max-w-xs">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoices" />
          </div>
        }
        pagination={<Pagination page={page} pageCount={3} onPageChange={setPage} compact />}
      >
        <Table label="Invoices">
          <thead>
            <TableRow type="header">
              <TableHead>Invoice</TableHead>
              <TableHead alignment="right">Amount</TableHead>
            </TableRow>
          </thead>
          <tbody>
            <TableRow>
              <TableCell emphasis="strong">INV-001</TableCell>
              <TableCell alignment="right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell emphasis="strong">INV-002</TableCell>
              <TableCell alignment="right">$150.00</TableCell>
            </TableRow>
          </tbody>
        </Table>
      </DataTable>

      <DataTable title="Archived invoices" emptyMessage="No archived invoices yet." />
    </div>
  );
}
