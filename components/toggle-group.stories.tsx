import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup } from './toggle-group.js';

/** ToggleGroup composes pressed buttons in a layout-only wrapper. */

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

/** ToggleGroup uses role=group and aria-pressed buttons, not radio semantics. Tab moves between buttons. Single mode permits no pressed item; use RadioGroup when a persistent one-of-many selection is required. */
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
