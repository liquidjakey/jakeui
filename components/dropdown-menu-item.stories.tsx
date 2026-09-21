import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem } from './dropdown-menu.js';

/**
 * Action and checkbox item previews inside a menu keyboard scope.
 * Checked and mixed indicators stay visible; checkbox toggles keep the menu open.
 * Consumer contract: docs/agent/components/dropdown-menu-item.md.
 */

const meta = {
  title: 'Anatomy/DropdownMenuItem',
  component: DropdownMenuItem,
  parameters: {
    docs: {
      description: {
        component:
          "Standard menu action item. Render inside a keyboard-owning menu. Shortcut text uses muted-foreground and does not register a keyboard shortcut.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Check action activation and independent checkbox toggling without dismissal. */
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
