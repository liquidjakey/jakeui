import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './tooltip.js';

/**
 * Stories for `Tooltip`.
 * Contract: docs/components/tooltip.md
 */

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Describes, never names. `label` is deliberately a STRING, not a node — a node ' +
          'slot would invite buttons and links into a surface that is unreachable by keyboard ' +
          'and invisible on touch.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

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
 * `Tooltip` — describes, never names.
 *
 * Its `label` is deliberately a **string**, not a node. A node slot would invite
 * buttons and links into a surface that is unreachable by keyboard and invisible on
 * touch. Tab to the button: the tooltip shows on focus immediately, and on hover
 * after a delay.
 */
export const Tooltips: Story = {
  name: 'Tooltip — four sides',
  args: { label: 'Tooltip', children: <span /> },
  render: () => (
    <div className="flex gap-6 p-16">
      {(['top', 'bottom', 'left', 'right'] as const).map((s) => (
        <Tooltip key={s} side={s} label={`Placed on the ${s}`}>
          <TriggerButton>{s}</TriggerButton>
        </Tooltip>
      ))}
    </div>
  ),
};
