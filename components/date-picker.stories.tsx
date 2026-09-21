import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './date-picker.js';

/**
 * Single-date field states with calendar selection and native date entry.
 * Consumer contract: docs/agent/components/date-picker.md.
 */

const meta = {
  title: 'Controls/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          "Controlled single-date or tuple-range selection with a calendar popup and native date-entry fields. Test both entry paths, keyboard navigation, invalid and disabled states.",
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Check calendar selection and native date entry, including invalid and disabled fields. */
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
