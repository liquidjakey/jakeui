import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './data-table.js';
import { Pagination } from './pagination.js';
import { Table, TableRow, TableHead, TableCell } from './table.js';
import { Input } from './input.js';

/**
 * Illustrative composition shell. For functional filtering and pagination,
 * start from RecordsTable in examples/recipes.tsx; these rows are static fixtures.
 * Consumer contract: docs/agent/components/data-table.md.
 */

const meta = {
  title: 'Content/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          "Composition shell with toolbar, content and pagination slots. Pass empty explicitly for opaque table children and loading/error for fetch states. These static rows do not implement filtering or pagination; use the RecordsTable recipe for a functional example.",
      },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Populated and empty shell previews. Toolbar and pagination are caller-owned slots. */
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
