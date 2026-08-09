import type { Meta, StoryObj } from '@storybook/react-vite';
import { Command } from './command.js';

/**
 * Stories for `Command`.
 * Contract: docs/components/command.md
 */

const meta = {
  title: 'Overlays/Command',
  component: Command,
  parameters: {
    docs: {
      description: {
        component:
          '`selected` means HIGHLIGHTED, not chosen — it is the active descendant. Focus ' +
          'stays in a search input that points here via aria-activedescendant, which is why ' +
          '`id` is a prop rather than generated.',
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Command` items. Note `selected` means **highlighted**, not chosen — it is the
 * active descendant. Focus stays in a search input that points here via
 * `aria-activedescendant`, which is why `id` is a prop.
 */
export const Commands: Story = {
  args: { children: null, onSelect: () => {} },
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
