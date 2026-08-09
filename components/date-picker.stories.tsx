import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './date-picker.js';

/**
 * Stories for `DatePicker`.
 * Contract: docs/components/date-picker.md
 *
 * Its live read is what settled **Calendar's day states** — the ones Calendar's own
 * record names in prose and binds nowhere.
 */

const meta = {
  title: 'Controls/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Four of five asserted Calendar states were confirmed correct by reading this ' +
          'component live. The exception: `today` is a `primary` stroke, not the ring outline ' +
          'that had been asserted, and calendar.tsx was corrected on the strength of it.',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `DatePicker`. Its live read is what settled **Calendar's day states** — the ones
 * Calendar's own record names in prose and binds nowhere.
 *
 * Four of five asserted states were correct. The exception: **`today` is a `primary`
 * stroke, not the ring outline that had been asserted** — `calendar.tsx` was
 * corrected on the strength of this read. Open the picker and look at today's date.
 *
 * ⚠️ The archetype asks that a date be *typeable* as well as pickable. This asset
 * records only a button trigger, so typing is not implemented — a real gap against
 * the archetype, recorded rather than invented.
 */
export const DatePickers: Story = {
  name: 'DatePicker — field states',
  args: { value: undefined, onChange: () => {}, label: 'Date' },
  render: () => <DateDemo />,
};

function DateDemo() {
  const [d, setD] = useState<Date | undefined>(new Date(2026, 7, 14));
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <DatePicker label="Appointment date" value={d} onChange={setD} />
      <DatePicker
        label="Required date"
        value={undefined}
        onChange={() => {}}
        invalid
        errorMessage="Choose a date."
      />
      <DatePicker label="Locked" value={d} onChange={() => {}} disabled />
      <p className="text-caption-sm text-muted-foreground">
        ⚠️ The trailing icon binds `foreground` even when disabled, so it stays full-strength
        while the value beside it goes muted. Transcribed as bound.
      </p>
    </div>
  );
}
