import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './progress.js';

/**
 * Stories for `Progress`.
 * Contract: docs/components/progress.md
 *
 * 🛑 **Its bar is asserted** — no fill is recorded at all. It asserts `primary` on
 * the same precedent as `Switch` and `RadioGroup`: `Radio Group / Indicator` binds
 * `fill primary` for its checked dot, the only recorded checked-state colour in the
 * system. Re-verify when the row cap is raised.
 */

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    docs: {
      description: {
        component:
          'The Figma `Type` enum deliberately did not become a prop: deriving it from ' +
          '`value`’s presence makes "determinate with no value" and "indeterminate with a ' +
          'value" unrepresentable.',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Progress. **Indeterminate omits `aria-valuenow`** — that omission is what tells
 * assistive technology the value is unknown, which is why `value` is optional
 * rather than defaulted to 0. The Figma `Type` enum deliberately did not become a
 * prop: deriving it from `value`'s presence makes "determinate with no value" and
 * "indeterminate with a value" unrepresentable.
 */
export const Progresses: Story = {
  name: 'Progress — determinate vs indeterminate',
  args: { label: 'Progress' },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Upload progress" value={0} />
      <Progress label="Upload progress" value={35} />
      <Progress label="Upload progress" value={100} />
      <Progress label="Working" />
    </div>
  ),
};
