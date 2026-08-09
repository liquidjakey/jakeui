import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label.js';

/**
 * Stories for `Label`.
 * Contract: docs/components/label.md
 *
 * ⚠️ Its record was **stale**: it said `Body/MD`, and the file binds `Label/LG` —
 * weight 500, not 400. The required marker binds `destructive`, which the record
 * did not carry at all. Both corrected in code against the live bindings.
 */

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          'The marker is aria-hidden: required state reaches assistive technology through ' +
          'the control’s own `required`, not through the glyph.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Label` on its own, showing all three marker states.
 *
 * The third — no marker at all — has no Figma variant, and it is the default,
 * because the record's dont says to mark only whichever of required/optional is
 * rarer. The marker is `aria-hidden`: required state reaches assistive technology
 * through the control's own `required`, not through the glyph.
 */
export const LabelVariants: Story = {
  name: 'Label — marker states',
  args: { children: null, htmlFor: 'demo-a' },
  render: () => (
    <div className="flex flex-col gap-3">
      <Label htmlFor="demo-a">No marker (default, no Figma variant)</Label>
      <Label htmlFor="demo-b" requirement="required">
        Required
      </Label>
      <Label htmlFor="demo-c" requirement="optional">
        Optional
      </Label>
      <Label htmlFor="demo-d" disabled>
        Disabled
      </Label>
    </div>
  ),
};
