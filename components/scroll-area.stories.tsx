import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scroll-area.js';

/**
 * Stories for `ScrollArea`.
 * Contract: docs/agent/components/scroll-area.md
 */

const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  parameters: {
    docs: {
      description: {
        component:
          'A focusable, named region is the whole point — a region that scrolls but cannot ' +
          'be focused is unreachable by keyboard, the most common failure of custom scroll ' +
          'areas. `label` is required for the same reason.',
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Named focusable overflow region. Tab to it and use arrow keys. Keep native scrollbars; do not invent custom track/thumb styling. */
export const ScrollAreas: Story = {
  name: 'ScrollArea — both axes',
  args: { children: null, label: 'Scroll area' },
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <ScrollArea label="Appointment notes">
        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>Note {i + 1} — scrollable content.</p>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea axis="horizontal" label="Timeline">
        <div className="flex w-max gap-3 p-3">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="whitespace-nowrap">
              Week {i + 1}
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
