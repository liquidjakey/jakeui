import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './radio-group.js';

/**
 * Stories for `RadioGroup`.
 * Contracts: docs/components/radio-group.md · radio-group-indicator.md
 *
 * **This story also stands in for `Radio Group / Field Composition`**, which is
 * `kind: story-only` (*"Storybook story, never a prop"*) and therefore not bound to
 * code — the same treatment given to the Table and Popover root compositions.
 *
 * 🛑 **Its circle is asserted**, because the asset that holds it — `Radio Group /
 * Root`, 24 variants — is blocked by the 8-row cap. It asserts `primary` on one real
 * precedent: `Radio Group / Indicator` binds `fill primary` for its checked dot,
 * which is the only recorded checked-state colour in the system. Re-verify when the
 * row cap is raised.
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
