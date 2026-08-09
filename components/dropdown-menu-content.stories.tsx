import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from './dropdown-menu.js';

/**
 * `DropdownMenuContent` — the surface `DropdownMenu` composes, read directly from
 * live bindings after the description cap blocked it.
 */

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

/**
 * `DropdownMenuContent`. Its description showed **1 of 24 rows** — nothing could be
 * inferred, and the read settled it in one line: **Side and Align carry no colour
 * delta**. All 24 variants are three binding sets differing only by the arrow.
 *
 * ✅ It also confirmed the `muted-foreground` shortcut colour that
 * `dropdown-menu-item.md` had to assert.
 */
export const MenuContent: Story = {
  name: 'DropdownMenuContent — geometry only',
  args: { children: null },
  render: () => (
    <div className="flex gap-6">
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
