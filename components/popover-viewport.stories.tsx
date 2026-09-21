import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopoverViewport } from './popover.js';

/**
 * Anatomy preview: previous content stays mounted but inert and invisible.
 * Direction describes activation order, not popup placement.
 * Consumer contract: docs/agent/components/popover-viewport.md.
 */

const meta = {
  title: 'Anatomy/PopoverViewport',
  component: PopoverViewport,
  parameters: {
    docs: {
      description: {
        component:
          "direction describes activation order, not anchored placement. Previous content is mounted but inert and invisible; this anatomy surface does not implement a transition engine.",
      },
    },
  },
} satisfies Meta<typeof PopoverViewport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Previous content is mounted but inert and invisible; only current content is usable. */
export const Viewport: Story = {
  name: 'PopoverViewport — current + previous',
  args: { children: null },
  render: () => (
    <div className="w-64 p-8">
      <PopoverViewport direction="right" previous={<p className="p-3">Outgoing content</p>}>
        <p className="p-3">Current content</p>
      </PopoverViewport>
    </div>
  ),
};
