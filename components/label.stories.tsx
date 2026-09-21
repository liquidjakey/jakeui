import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label.js';

/**
 * Label and requirement-marker previews. The label uses Label/LG; the control
 * must separately expose required / aria-required and be linked by id/htmlFor.
 * Consumer contract: docs/agent/components/label.md.
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

/** Label marker examples. Show required/optional markers selectively; no marker is the default. Markers are decorative, so set required or aria-required on the linked control. */
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
