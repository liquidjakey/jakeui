import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './tabs.js';
import { Toggle } from './toggle.js';
import { ToggleGroup } from './toggle-group.js';

/**
 * Stories for `Tabs`, `SegmentedTab`, `Toggle` and `ToggleGroup`.
 * Contracts: docs/components/tabs.md · segmented-tab.md · toggle.md · toggle-group.md
 *
 * **Tabs and Segmented Tab are two halves of one control.** Tabs binds only the
 * container fill (`muted`) and has no selected-state treatment; Segmented Tab binds
 * exactly that treatment and no container. Notice the inversion in the canvas: the
 * *selected* tab takes the lighter `card` fill and lifts out of the muted track,
 * rather than being highlighted.
 *
 * **Test with the keyboard** — this is what the tablist pattern is for:
 *   - Arrow keys move *within* the list; Tab moves *out of* it into the panel
 *   - Home and End jump to first and last
 *   - Only the selected tab is tabbable
 */

const meta = {
  title: 'Controls/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Tabs is the container half; SegmentedTab is the item half. Neither is complete alone — ' +
          'the container record carries no selected-state tokens at all.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { id: 'overview', label: 'Overview', content: <p>Patient overview.</p> },
  { id: 'history', label: 'History', content: <p>Appointment history.</p> },
  { id: 'billing', label: 'Billing', content: <p>Invoices and payments.</p> },
];

export const Default: Story = {
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
  render: () => <TabsDemo />,
};

function TabsDemo() {
  const [id, setId] = useState('overview');
  return (
    <div className="max-w-md">
      <Tabs items={ITEMS} selectedId={id} onSelect={setId} label="Patient sections" />
    </div>
  );
}

/** Vertical orientation sets `aria-orientation` and swaps arrow keys to Up/Down. */
export const Vertical: Story = {
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
  render: () => <VerticalDemo />,
};

function VerticalDemo() {
  const [id, setId] = useState('history');
  return (
    <div className="max-w-md">
      <Tabs
        items={ITEMS}
        selectedId={id}
        onSelect={setId}
        orientation="vertical"
        label="Patient sections"
      />
    </div>
  );
}

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
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
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

/**
 * `ToggleGroup` — `role="group"`, **not** `radiogroup`, even in single mode. Its
 * members are toggle buttons with `aria-pressed`, so Tab moves between them and
 * arrow keys are not used.
 *
 * Single mode has no "must have one" guard: unlike a radio group, all members may
 * be off, which is legitimate when the members are actions rather than data. Click
 * the pressed member to see it turn everything off.
 *
 * ⚠️ The group's record has only two tokens and one of them (`accent-foreground`)
 * looks like a stray binding — a foreground token on a container with no fill. It
 * is implemented as layout-only.
 */
export const Groups: Story = {
  name: 'ToggleGroup — single vs multiple',
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
  render: () => <GroupDemo />,
};

function GroupDemo() {
  const [single, setSingle] = useState<string[]>(['left']);
  const [multi, setMulti] = useState<string[]>(['bold', 'italic']);
  const align = [
    { id: 'left', label: 'Left' },
    { id: 'center', label: 'Center' },
    { id: 'right', label: 'Right' },
  ];
  const marks = [
    { id: 'bold', label: 'Bold' },
    { id: 'italic', label: 'Italic' },
    { id: 'underline', label: 'Underline', disabled: true },
  ];
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        label="Alignment"
        items={align}
        pressedIds={single}
        onPressedChange={setSingle}
        selection="single"
      />
      <ToggleGroup
        label="Text style"
        items={marks}
        pressedIds={multi}
        onPressedChange={setMulti}
        selection="multiple"
      />
    </div>
  );
}
