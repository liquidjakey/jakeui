import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch.js';
import { RadioGroup } from './radio-group.js';
import { Progress } from './progress.js';
import { ScrollArea } from './scroll-area.js';

/**
 * Stories for `Switch`, `RadioGroup`, `Progress` and `ScrollArea`.
 * Contracts: docs/components/switch.md · switch-thumb.md · radio-group.md ·
 * radio-group-indicator.md · progress.md · scroll-area.md
 *
 * **These stories also stand in for `Switch / Field Composition` and `Radio Group /
 * Field Composition`**, both of which are `kind: story-only` (*"Storybook story,
 * never a prop"*) and therefore not bound to code — the same treatment given to the
 * Table and Popover root compositions.
 *
 * 🛑 **Three of these four components have an asserted primary visual**, because the
 * asset that holds it is blocked by the 8-row cap:
 *   - `Switch`'s **track** — lives on `Switch / Root` (24 variants). Asserted.
 *   - `RadioGroup`'s **circle** — lives on `Radio Group / Root` (24 variants). Asserted.
 *   - `Progress`'s **bar** — no fill recorded at all. Asserted.
 *
 * All three assert `primary`, on one real precedent: `Radio Group / Indicator` binds
 * `fill primary` for its checked dot, which is the only recorded checked-state
 * colour in the system. Re-verify all three when the row cap is raised.
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

/**
 * RadioGroup. Arrow keys move **and select** in one step — the radio convention,
 * which differs from `ToggleGroup` where Tab moves and Space activates.
 *
 * Exclusivity is enforced by the shared `name`, not only by state, so two selected
 * items are unrepresentable by construction.
 */
export const Radios: Story = {
  name: 'RadioGroup',
  args: { label: 'Switch', checked: false, onCheckedChange: () => {} },
  render: () => <RadioDemo />,
};

function RadioDemo() {
  const [value, setValue] = useState('cleaning');
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <RadioGroup
        label="Appointment type"
        value={value}
        onValueChange={setValue}
        items={[
          { value: 'general', label: 'General check-up' },
          { value: 'cleaning', label: 'Cleaning', description: 'About 30 minutes.' },
          { value: 'ortho', label: 'Orthodontic consult' },
          { value: 'emergency', label: 'Emergency', disabled: true },
        ]}
      />
      <RadioGroup
        label="Disabled group"
        value="a"
        onValueChange={() => {}}
        disabled
        items={[
          { value: 'a', label: 'First' },
          { value: 'b', label: 'Second' },
        ]}
      />
    </div>
  );
}

/**
 * Progress. **Indeterminate omits `aria-valuenow`** — that omission is what tells
 * assistive technology the value is unknown, which is why `value` is optional
 * rather than defaulted to 0. The Figma `Type` enum deliberately did not become a
 * prop: deriving it from `value`'s presence makes "determinate with no value" and
 * "indeterminate with a value" unrepresentable.
 */
export const Progresses: Story = {
  name: 'Progress — determinate vs indeterminate',
  args: { label: 'Switch', checked: false, onCheckedChange: () => {} },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Upload progress" value={0} />
      <Progress label="Upload progress" value={35} />
      <Progress label="Upload progress" value={100} />
      <Progress label="Working" />
    </div>
  ),
};

/**
 * ScrollArea. **Tab to it, then use the arrow keys.** The focusable, named region is
 * the whole point — a region that scrolls but cannot be focused is unreachable by
 * keyboard, the most common failure of custom scroll areas.
 *
 * 🛑 The record promises "visible track and thumb anatomy" but binds neither, so the
 * **native scrollbar is kept** rather than inventing two colours — the same decision
 * as `NativeSelect`'s chevron.
 */
export const ScrollAreas: Story = {
  name: 'ScrollArea — both axes',
  args: { label: 'Switch', checked: false, onCheckedChange: () => {} },
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <ScrollArea label="Appointment notes">
        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>Note {i + 1} — scrollable content.</p>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea axis="horizontal" label="Timeline">
        <div className="flex w-max gap-3 p-3">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="whitespace-nowrap">
              Week {i + 1}
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
