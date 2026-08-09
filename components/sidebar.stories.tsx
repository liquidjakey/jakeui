import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, SidebarNavigationItem } from './sidebar.js';
import { Command } from './command.js';
import { Chart } from './chart.js';
import { Pagination } from './pagination.js';
import { Calendar } from './calendar.js';
import { DataTable } from './data-table.js';
import { Table, TableRow, TableHead, TableCell } from './table.js';
import { Input } from './input.js';

/**
 * Stories for the last of the buildable set: `Sidebar`, `SidebarNavigationItem`,
 * `Command`, `Chart`, `Pagination`, `Calendar` and `DataTable`.
 *
 * Two of these are mostly **asserted rather than transcribed**, and the stories are
 * the only place to see that:
 *
 * 🛑 **`Calendar`** — its record names *"today, selected, range, disabled, and
 * out-of-month"* in prose and binds **none** of them. Every day state you can see
 * below is asserted from precedent elsewhere in the system. The widest promise-to-
 * binding gap in the build.
 *
 * 🛑 **`Chart`** — five tokens, all of them the container. No series colour, no
 * axis, no gridline. It is a titled frame that a chart renders *into*; supplying a
 * palette would mean inventing one.
 */

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component:
          'SidebarNavigationItem has the best-behaved colour record in the system — the dedicated ' +
          'sidebar-* family throughout, with fill and matching foreground correctly paired. Compare ' +
          'Card (info-foreground on a card fill) and Dialog (plain foreground on card).',
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Expanded and collapsed. Collapsed keeps labels in the DOM, visually hidden. */
export const Sidebars: Story = {
  args: { children: null },
  render: () => <SidebarDemo />,
};

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex gap-4">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} label="Clinic">
        <SidebarNavigationItem href="#" active collapsed={collapsed} icon={<span>◧</span>}>
          Patients
        </SidebarNavigationItem>
        <SidebarNavigationItem href="#" collapsed={collapsed} icon={<span>◫</span>}>
          Appointments
        </SidebarNavigationItem>
        <SidebarNavigationItem href="#" collapsed={collapsed} icon={<span>◨</span>}>
          Billing
        </SidebarNavigationItem>
      </Sidebar>
      <p className="text-body-sm text-muted-foreground">
        Toggle the chevron. Collapsed labels stay in the DOM as screen-reader text.
      </p>
    </div>
  );
}

/**
 * `Command` items. Note `selected` means **highlighted**, not chosen — it is the
 * active descendant. Focus stays in a search input that points here via
 * `aria-activedescendant`, which is why `id` is a prop.
 */
export const Commands: Story = {
  args: { children: null },
  render: () => (
    <div className="max-w-sm rounded-lg border border-border bg-popover p-1" role="listbox">
      <Command id="c1" selected onSelect={() => {}} shortcut="⌘K">
        Search patients
      </Command>
      <Command id="c2" onSelect={() => {}} shortcut="⌘N">
        New appointment
      </Command>
      <Command id="c3" onSelect={() => {}}>
        Open settings
      </Command>
    </div>
  ),
};

/** `Pagination`, both structures. Disabled boundary controls stay announced. */
export const Paginations: Story = {
  args: { children: null },
  render: () => <PaginationDemo />,
};

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col gap-4">
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
      <Pagination page={page} pageCount={5} onPageChange={setPage} compact />
      <p className="text-body-sm text-muted-foreground">
        Page 1 disables Previous; page 5 disables Next. That is arithmetic, not a prop.
      </p>
    </div>
  );
}

/**
 * `Calendar`. **Every day state below is asserted**, not transcribed — see the 🛑
 * note at the top. Six rows are always rendered so the grid does not change height
 * between months.
 */
export const Calendars: Story = {
  args: { children: null },
  render: () => <CalendarDemo />,
};

function CalendarDemo() {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selected, setSelected] = useState<Date>(new Date(2026, 7, 14));
  return (
    <div className="flex gap-6">
      <Calendar
        month={month}
        monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={setSelected}
        isDisabled={(d) => d.getDay() === 0}
      />
      <Calendar
        month={month}
        monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
        onMonthChange={setMonth}
        mode="range"
        density="comfortable"
        selected={[new Date(2026, 7, 10), new Date(2026, 7, 18)]}
        onSelect={() => {}}
      />
    </div>
  );
}

/**
 * `Chart` — a container, deliberately. The bars below are supplied by the caller,
 * because there is no series palette in the file to draw them from.
 */
export const Charts: Story = {
  args: { children: null },
  render: () => (
    <div className="max-w-sm">
      <Chart title="Appointments per week" description="Volume rose 12% across August.">
        <div className="flex h-24 items-end gap-2">
          {[40, 65, 50, 80, 72].map((h, i) => (
            <div key={i} className="w-full bg-primary" style={{ height: `${h}%` }} />
          ))}
        </div>
      </Chart>
    </div>
  ),
};

/**
 * `DataTable`, populated and empty. The state is derived from whether there are
 * children — a "populated" table with no rows contradicts itself.
 *
 * ⚠️ The toolbar is a **slot** rather than pre-composed: the record says this
 * composition is built from Input, Button, Table and Pagination, and **Button is
 * still blocked** by the 8-row cap.
 */
export const DataTables: Story = {
  args: { children: null },
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
