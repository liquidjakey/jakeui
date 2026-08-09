import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem } from './dropdown-menu.js';

/**
 * Stories for `DropdownMenuItem` and its checkbox variant, both recovered from the
 * 8-row state cap by proof on 9 Aug 2026.
 *
 * Contracts: docs/components/dropdown-menu-item.md · dropdown-menu-checkbox-item.md
 *
 * They share one title because they are one item family — the checkbox item is the
 * same row with an indicator, and the story exists to show them together.
 */

const meta = {
  title: 'Anatomy/DropdownMenuItem',
  component: DropdownMenuItem,
  parameters: {
    docs: {
      description: {
        component:
          'The shortcut colour binds `muted-foreground`, which the record had to assert ' +
          'and the live read of Dropdown Menu / Content later confirmed.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `DropdownMenuItem` and `DropdownMenuCheckboxItem`, both recovered from the cap.
 *
 * ⚠️ The checkbox item's checked indicator is **asserted** — `Value` being provably
 * inert is precisely the defect: the record gives no way to distinguish checked from
 * unchecked.
 */
export const MenuItems: Story = {
  name: 'Menu Items',
  args: { children: null, onSelect: () => {} },
  render: () => <MenuItemsDemo />,
};

function MenuItemsDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <div className="max-w-xs">
      <DropdownMenu label="Row actions">
        <DropdownMenuItem onSelect={() => {}} shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}} inset>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={a} onCheckedChange={setA}>
          Show archived
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={b} onCheckedChange={setB}>
          Include drafts
        </DropdownMenuCheckboxItem>
        <DropdownMenuItem onSelect={() => {}} tone="destructive" shortcut="⌫">
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}} disabled>
          Unavailable
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
