import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './calendar.js';

/**
 * Stories for `Calendar`.
 * Contract: docs/components/calendar.md
 *
 * 🛑 **Mostly asserted rather than transcribed.** Its record names *"today, selected,
 * range, disabled, and out-of-month"* in prose and binds **none** of them. Every day
 * state below is asserted from precedent elsewhere in the system — the widest
 * promise-to-binding gap in the build.
 *
 * ✅ Its day labels were also **unbound in Figma** at 13/20 Medium. The ramp question
 * was decided Option B on 10 Aug 2026 and they now carry `Label/MD` 13/18, which is
 * what this code already used.
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

/**
 * `Calendar`. **Every day state below is asserted**, not transcribed — see the 🛑
 * note at the top. Six rows are always rendered so the grid does not change height
 * between months.
 */
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
    <div className="flex gap-6">
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
