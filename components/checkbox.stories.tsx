import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox.js';

/**
 * Boolean and indeterminate choice previews. The 10px decorative check glyph is
 * scoped in scripts/computed-type-exceptions.json; it is not an application type style.
 * Consumer contract: docs/agent/components/checkbox.md.
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
