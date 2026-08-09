import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './toggle.js';

/**
 * Stories for `Toggle`.
 * Contract: docs/components/toggle.md
 *
 * A **button** with `aria-pressed`, not a checkbox with `aria-checked`. The record
 * said otherwise until 9 Aug 2026: it was mapped to the `choice` archetype, which
 * told it to use `aria-checked` and referenced radio-group arrow keys. A
 * `togglebutton` archetype was added and the record re-enriched.
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

/**
 * `Toggle` — a **button** with `aria-pressed`, not a checkbox with `aria-checked`.
 *
 * The record said otherwise until 9 Aug 2026: it was mapped to the `choice`
 * archetype, which told it to use `aria-checked` and referenced radio-group arrow
 * keys. A `togglebutton` archetype was added and the record re-enriched.
 *
 * ⚠️ Two recorded oddities visible here. **Pressed + hover binds the same tokens as
 * pressed at rest**, so a pressed toggle gives no hover feedback. And **pressed +
 * disabled loses the pressed state entirely** — it looks identical to unpressed +
 * disabled. `aria-pressed` still reports it, so assistive technology is correct,
 * but a sighted user cannot tell.
 */
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
        The last two render identically — that is the recorded gap, not a bug in the code.
      </p>
    </div>
  );
}
