import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from './dropdown-menu.js';

/** Unanchored menu-surface anatomy. Side and align are metadata, not automatic positioning. Use DropdownMenu for a linked, anchored popup. */

const meta = {
  title: 'Anatomy/DropdownMenuContent',
  component: DropdownMenuContent,
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown Menu / Content's 24 variants produce 3 binding sets. Side and Align " +
          'carry no colour delta, so all 24 differ only by the arrow — geometry, not tokens.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Unanchored menu-surface anatomy. Side and align are metadata, not automatic positioning. Use DropdownMenu for a linked, anchored popup. */
export const MenuContent: Story = {
  name: 'DropdownMenuContent — geometry only',
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {([false, true] as const).map((arrow) => (
        <DropdownMenuContent key={String(arrow)} arrow={arrow} label={`arrow=${arrow}`}>
          <DropdownMenuLabel>Row actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => {}} shortcut="⌘E">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} shortcut="⌘D">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} tone="destructive" shortcut="⌫">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      ))}
    </div>
  ),
};
