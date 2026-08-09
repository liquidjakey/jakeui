import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch.js';

/**
 * Stories for `Switch`.
 * Contracts: docs/components/switch.md · switch-thumb.md
 *
 * **This story also stands in for `Switch / Field Composition`**, which is
 * `kind: story-only` (*"Storybook story, never a prop"*) and therefore not bound to
 * code — the same treatment given to the Table and Popover root compositions.
 *
 * 🛑 **Its track is asserted**, because the asset that holds it — `Switch / Root`,
 * 24 variants — is blocked by the 8-row cap. It asserts `primary` on one real
 * precedent: `Radio Group / Indicator` binds `fill primary` for its checked dot,
 * which is the only recorded checked-state colour in the system. `RadioGroup` and
 * `Progress` assert the same thing on the same precedent. Re-verify when the row
 * cap is raised.
 *
 * ⚠️ **Figma contradicts itself on this component's geometry** — the composed
 * `Switch` set draws 40x22 with an 18x18 `primary-foreground` thumb, the atomic
 * `Switch / Root` + `Switch / Thumb` sets draw 36x20 with a 16x16 `card` thumb. The
 * atoms win, because that is what figma.map.json binds these exports to. See the
 * Figma-side decision memo, item 3.
 */

const meta = {
  title: 'Controls/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'Switch uses role="switch" with aria-checked, and Space toggles while Enter does not — ' +
          'the switch convention, which differs from Toggle (a button, where both work).',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pattern = Basic, Description, Disabled. */
export const Switches: Story = {
  args: { label: 'Switch', checked: false, onCheckedChange: () => {} },
  render: () => <SwitchDemo />,
};

function SwitchDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Switch label="Appointment reminders" checked={a} onCheckedChange={setA} />
      <Switch
        label="Marketing email"
        description="Occasional product news. You can turn this off at any time."
        checked={b}
        onCheckedChange={setB}
      />
      <Switch label="Locked setting" checked onCheckedChange={() => {}} disabled />
      <Switch label="Locked and off" checked={false} onCheckedChange={() => {}} disabled />
    </div>
  );
}
