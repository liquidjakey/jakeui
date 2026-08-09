import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton.js';

/**
 * Stories for `Skeleton`.
 * Contract: docs/components/skeleton.md
 *
 * Built from live bindings: its token contract existed **only on child nodes**, so
 * the generator — which reads the root — could only ever report "no root-level
 * bindings" for it. `Slider` and `Popover / Arrow` had the same shape of gap.
 */

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Every shape in every variant binds `muted`; the four types differ only in which ' +
          'shapes exist. The shapes are aria-hidden and the loading state is announced once ' +
          'by the wrapper — announcing each placeholder would be noise.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Skeleton` — every shape in every variant binds `muted`. The four types differ only
 * in which shapes exist.
 *
 * The shapes are `aria-hidden`; the loading state is announced **once** by the
 * wrapper. Announcing each placeholder would be noise.
 */
export const Skeletons: Story = {
  name: 'Skeleton — four types',
  args: {},
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">text</span>
        <Skeleton type="text" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">avatar</span>
        <Skeleton type="avatar" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">card</span>
        <Skeleton type="card" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-muted-foreground">tableRow</span>
        <Skeleton type="tableRow" />
      </div>
    </div>
  ),
};
