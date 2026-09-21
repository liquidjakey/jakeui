import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, type DateRange } from './date-picker.js';
import { Pagination } from './pagination.js';
import { Avatar } from './avatar.js';
import { SwitchRoot, SwitchThumb } from './switch.js';
import { DataTable } from './data-table.js';
import { Sidebar, SidebarNavigationItem } from './sidebar.js';
import { Table, TableRow, TableCell } from './table.js';
import { Field } from './field.js';
import { Input } from './input.js';
import { Textarea } from './textarea.js';
import { NativeSelect } from './native-select.js';
import { Popover, PopoverTrigger, PopoverViewport } from './popover.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu.js';

const meta = { title: 'Verification/Interactions' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const EdgeCases: Story = { render: () => <EdgeCasesDemo /> };
function EdgeCasesDemo() {
  const [range, setRange] = useState<DateRange>();
  const [page, setPage] = useState(50);
  return (
    <div className="flex max-w-3xl flex-col gap-4 p-4 text-body-md text-foreground">
      <DatePicker mode="range" label="Stay dates" value={range} onChange={setRange} />
      <output aria-label="Selected range">
        {range?.map((date) => date?.getDate()).join('–') ?? 'None'}
      </output>
      <Pagination page={page} pageCount={100} onPageChange={setPage} />
      <Avatar name="Broken image fallback" initials="AL" src="data:image/png;base64,broken" />
      <div data-testid="small-switch">
        <SwitchRoot size="small" checked>
          <SwitchThumb size="small" checked />
        </SwitchRoot>
      </div>
      <DataTable title="Empty fragments">
        <>
          {false}
          {[]}
        </>
      </DataTable>
      <Sidebar collapsed>
        <SidebarNavigationItem href="#home">Home</SidebarNavigationItem>
      </Sidebar>
      <Table density="comfortable">
        <tbody>
          <TableRow>
            <TableCell>Inherited density</TableCell>
          </TableRow>
        </tbody>
      </Table>
      <PopoverViewport previous={<button type="button">Old panel action</button>}>
        <button type="button">Current panel action</button>
      </PopoverViewport>
    </div>
  );
}

export const FieldComposition: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4 p-4">
      <Field label="Email" requirement="required" invalid errorMessage="Email is required.">
        {(props) => <Input {...props} value="" onChange={() => {}} />}
      </Field>
      <Field label="Notes" requirement="required" invalid errorMessage="Notes are required.">
        {(props) => <Textarea {...props} value="" onChange={() => {}} />}
      </Field>
      <Field label="Choice" requirement="required" invalid errorMessage="Choose an option.">
        {(props) => (
          <NativeSelect
            {...props}
            value="one"
            onChange={() => {}}
            options={[{ value: 'one', label: 'One' }]}
          />
        )}
      </Field>
    </div>
  ),
};

export const OverlayComposition: Story = { render: () => <OverlayDemo /> };
function OverlayDemo() {
  const [open, setOpen] = useState(false);
  const [changes, setChanges] = useState(0);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const [nested, setNested] = useState(false);
  const [actions, setActions] = useState(0);
  const change = (next: boolean) => {
    setOpen(next);
    setChanges((n) => n + 1);
  };
  return (
    <div className="flex flex-col items-start gap-4 p-4 text-body-md">
      <Popover
        open={open}
        onOpenChange={change}
        title="Composed popup"
        trigger={
          <PopoverTrigger open={open} onOpenChange={change}>
            Composed trigger
          </PopoverTrigger>
        }
      >
        <button type="button">Popup action</button>
      </Popover>
      <output aria-label="Open changes">{changes}</output>
      <DropdownMenuTrigger
        open={menu}
        onOpenChange={(next) => {
          setMenu(next);
          if (!next) {
            setSub(false);
            setNested(false);
          }
        }}
        controls="verify-menu"
      >
        Nested actions
      </DropdownMenuTrigger>
      {menu ? (
        <DropdownMenu id="verify-menu" label="Nested actions">
          <DropdownMenuSubTrigger open={sub} onOpenChange={setSub} controls="verify-sub">
            More actions
          </DropdownMenuSubTrigger>
        </DropdownMenu>
      ) : null}
      {menu && sub ? (
        <DropdownMenuSubContent id="verify-sub" label="More actions">
          <DropdownMenuSubTrigger open={nested} onOpenChange={setNested} controls="verify-nested">
            Destinations
          </DropdownMenuSubTrigger>
          <DropdownMenuItem onSelect={() => setActions((n) => n + 1)}>
            Direct action
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      ) : null}
      {menu && sub && nested ? (
        <DropdownMenuSubContent id="verify-nested" label="Destinations">
          <DropdownMenuItem onSelect={() => setActions((n) => n + 1)}>
            Archive record
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      ) : null}
      <output aria-label="Completed actions">{actions}</output>
    </div>
  );
}
