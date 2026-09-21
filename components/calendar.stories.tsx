import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './calendar.js';

/**
 * Controlled month and selection previews. Verify day navigation and range
 * selection; the caller owns assembling range endpoints. Six rows keep grid height stable.
 * Consumer contract: docs/agent/components/calendar.md.
 */

const meta = {
  title: 'Controls/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          'Six rows are always rendered so the grid does not change height between months. ' +
          '`monthLabel` is a prop rather than derived because month naming is locale-dependent.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Day-state fixture with six rows to keep month navigation height stable. */
export const Calendars: Story = {
  args: {
    month: new Date(2026, 7, 1),
    monthLabel: 'August 2026',
    onMonthChange: () => {},
    onSelect: () => {},
  },
  render: () => <CalendarDemo />,
};

function CalendarDemo() {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selected, setSelected] = useState<Date>(new Date(2026, 7, 14));
  return (
    <div className="flex flex-wrap gap-6">
      <Calendar
        month={month}
        monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={setSelected}
        isDisabled={(d) => d.getDay() === 0}
      />
      <Calendar
        month={month}
        monthLabel={month.toLocaleString('en', { month: 'long', year: 'numeric' })}
        onMonthChange={setMonth}
        mode="range"
        density="comfortable"
        selected={[new Date(2026, 7, 10), new Date(2026, 7, 18)]}
        onSelect={() => {}}
      />
    </div>
  );
}
