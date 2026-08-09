import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scroll-area.js';

/**
 * Stories for `ScrollArea`.
 * Contract: docs/components/scroll-area.md
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

/**
 * ScrollArea. **Tab to it, then use the arrow keys.** The focusable, named region is
 * the whole point — a region that scrolls but cannot be focused is unreachable by
 * keyboard, the most common failure of custom scroll areas.
 *
 * 🛑 The record promises "visible track and thumb anatomy" but binds neither, so the
 * **native scrollbar is kept** rather than inventing two colours — the same decision
 * as `NativeSelect`'s chevron.
 */
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
