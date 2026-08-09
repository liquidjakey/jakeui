import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox.js';

/**
 * Stories for `Checkbox`, recovered from the 8-row state cap by proof on 9 Aug 2026.
 *
 * Contract: docs/components/checkbox.md
 *
 * 🛑 No box tokens are recorded anywhere for this component — the border, fill and
 * check glyph are all ASSERTED in code, and the 10px glyph is the one raw size in
 * the system, kept raw because no ramp step is 10px and the repo rule is to flag
 * rather than invent. Carried in `scripts/computed-type-exceptions.json`.
 */

const meta = {
  title: 'Controls/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Three states, so `checked` is not a plain boolean. Indeterminate is never ' +
          'user-selectable — it is derived from children, and clicking an indeterminate box ' +
          'resolves to checked rather than cycling back to mixed.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Checkbox`, all three values. **Indeterminate has no HTML attribute** — it is a
 * DOM property only, applied through a ref, and `aria-checked="mixed"` follows.
 */
export const Checkboxes: Story = {
  args: { label: 'Checkbox', checked: false, onCheckedChange: () => {} },
  render: () => <CheckboxDemo />,
};

function CheckboxDemo() {
  const [a, setA] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Checkbox label="Unchecked" checked={false} onCheckedChange={() => {}} />
      <Checkbox label="Checked" checked onCheckedChange={() => {}} />
      <Checkbox
        label="Indeterminate — click to resolve"
        description="Mixed is derived from children, never chosen. It never cycles back."
        checked={a}
        onCheckedChange={setA}
      />
      <Checkbox label="Disabled" checked={false} onCheckedChange={() => {}} disabled />
    </div>
  );
}
