import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard } from './hover-card.js';

/**
 * Stories for `HoverCard`.
 * Contract: docs/components/hover-card.md
 */

const meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  parameters: {
    docs: {
      description: {
        component:
          'Opens on hover AND on focus — hover alone would exclude keyboard and touch users, ' +
          'which the record calls out explicitly. `closeDelay` lets the pointer travel from ' +
          'trigger into the card without it vanishing.',
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function TriggerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-input bg-card px-3 py-2 text-body-sm text-foreground"
    >
      {children}
    </button>
  );
}

/**
 * `HoverCard`. Opens on hover **and on focus** — hover alone would exclude keyboard
 * and touch users, which the record calls out explicitly.
 *
 * `closeDelay` lets the pointer travel from trigger into the card without it
 * vanishing. Density is not just spacing: `detailed` is what makes room for `meta`.
 */
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
