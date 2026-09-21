import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './radio-group.js';

/**
 * Controlled exclusive-choice groups using native radio inputs.
 * Field-composition variants are examples, not additional public props.
 * Consumer contract: docs/agent/components/radio-group.md.
 */

const meta = {
  title: 'Controls/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Arrow keys move AND select in one step — the radio convention, which differs ' +
          'from ToggleGroup where Tab moves and Space activates. Exclusivity is enforced by ' +
          'the shared `name`, not only by state, so two selected items are unrepresentable.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * RadioGroup. Arrow keys move **and select** in one step — the radio convention,
 * which differs from `ToggleGroup` where Tab moves and Space activates.
 *
 * Exclusivity is enforced by the shared `name`, not only by state, so two selected
 * items are unrepresentable by construction.
 */
export const Radios: Story = {
  name: 'RadioGroup',
  args: { items: [], value: '', onValueChange: () => {}, label: 'Radio group' },
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
