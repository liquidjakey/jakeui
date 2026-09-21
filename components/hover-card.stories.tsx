import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';
import { HoverCard } from './hover-card.js';

/**
 * Stories for `HoverCard`.
 * Contract: docs/agent/components/hover-card.md
 */

const meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  parameters: {
    docs: {
      description: {
        component:
          "Optional contextual preview on hover or focus. Essential information needs a click-accessible path, especially on touch. closeDelay lets the pointer travel into the card.",
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const TriggerButton = Button;

/** Optional preview opens on hover or focus. Essential content needs a click-accessible path on touch. closeDelay lets the pointer reach the card; detailed density displays meta. */
export const HoverCards: Story = {
  name: 'HoverCard — compact vs detailed',
  args: { title: 'Hover card', children: <span /> },
  render: () => (
    <div className="flex gap-8 p-16">
      <HoverCard title="Ada Lovelace" description="Patient since 2019.">
        <TriggerButton>Compact</TriggerButton>
      </HoverCard>
      <HoverCard
        title="Ada Lovelace"
        description="Patient since 2019."
        density="detailed"
        meta={<p>Last visit: 14 June · Next: 14 August</p>}
      >
        <TriggerButton>Detailed</TriggerButton>
      </HoverCard>
    </div>
  ),
};
