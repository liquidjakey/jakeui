import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './toggle.js';

/**
 * Controlled button with aria-pressed. Space and Enter activate it.
 * Consumer contract: docs/agent/components/toggle.md.
 */

const meta = {
  title: 'Controls/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          'A button, so Space and Enter both activate it — which differs from Switch, ' +
          'where Space toggles and Enter does not.',
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A pressed button, activated with Space or Enter. */
export const Toggles: Story = {
  name: 'Toggle — states',
  args: { label: 'Toggle', pressed: false, onPressedChange: () => {} },
  render: () => <ToggleDemo />,
};

function ToggleDemo() {
  const [bold, setBold] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Toggle label="Bold" pressed={bold} onPressedChange={setBold} />
        <Toggle label="Pressed" pressed onPressedChange={() => {}} />
        <Toggle label="Disabled" pressed={false} onPressedChange={() => {}} disabled />
        <Toggle label="Pressed + disabled" pressed onPressedChange={() => {}} disabled />
      </div>
      <p className="text-caption-sm text-muted-foreground">
        The last two share the same disabled styling; pressed semantics remain distinct.
      </p>
    </div>
  );
}
