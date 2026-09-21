import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch.js';

/**
 * Controlled labelled settings and composition previews. The default track uses
 * input unchecked and primary checked; the disabled composed track uses muted.
 * Consumer contract: docs/agent/components/switch.md.
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
