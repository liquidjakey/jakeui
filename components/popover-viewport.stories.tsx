import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopoverViewport } from './popover.js';

/**
 * Stories for `PopoverViewport`.
 * Contract: docs/components/popover-viewport.md
 *
 * The component whose vocabulary was the **last unresolved doc block in the system**.
 */

const meta = {
  title: 'Anatomy/PopoverViewport',
  component: PopoverViewport,
  parameters: {
    docs: {
      description: {
        component:
          '`direction` is an ACTIVATION direction (data-activation-direction), not anchored ' +
          'placement — the `side` axis already owns top/right/bottom/left for placement. That ' +
          'distinction is why the block was left owed rather than guessed.',
      },
    },
  },
} satisfies Meta<typeof PopoverViewport>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `PopoverViewport` — the component whose vocabulary was the **last unresolved doc
 * block in the system**.
 *
 * `direction` is an *activation* direction (`data-activation-direction`), not
 * anchored placement — that distinction is exactly why it was left owed rather than
 * guessed: the `side` axis already owns top/right/bottom/left for placement. Reading
 * this asset's own description settled it.
 *
 * Note `State` did **not** become an enum: current and previous both render at once
 * during a transition, and an enum could only ever show one.
 */
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
