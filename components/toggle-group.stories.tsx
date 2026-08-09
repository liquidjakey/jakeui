import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup } from './toggle-group.js';

/**
 * Stories for `ToggleGroup`.
 * Contract: docs/components/toggle-group.md
 *
 * ⚠️ The group's record has only two tokens and one of them (`accent-foreground`)
 * looks like a stray binding — a foreground token on a container with no fill. It
 * is implemented as layout-only.
 */

const meta = {
  title: 'Controls/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    docs: {
      description: {
        component:
          'role="group", NOT radiogroup, even in single mode. Its members are toggle ' +
          'buttons with aria-pressed, so Tab moves between them and arrow keys are not used ' +
          '— which is the opposite of RadioGroup.',
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  args: { items: [], pressedIds: [], onPressedChange: () => {}, label: 'Toggle group' },
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
