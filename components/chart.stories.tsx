import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './chart.js';

/**
 * Caller-rendered visualization in a titled frame. The bars are illustrative
 * fixtures; product charts own data, accessible takeaways and approved chart-role mapping.
 * Consumer contract: docs/agent/components/chart.md.
 */

const meta = {
  title: 'Content/Chart',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component:
          'The text alternative must state the chart’s TAKEAWAY, not its chart type — ' +
          '"Revenue rose 12% in Q3", not "bar chart".',
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Illustrative bars supplied through children; Chart does not render data itself. */
export const Charts: Story = {
  args: { title: 'Chart', children: null },
  render: () => (
    <div className="max-w-sm">
      <Chart title="Appointments per week" description="Volume rose 12% across August.">
        <div className="flex h-24 items-end gap-2">
          {[40, 65, 50, 80, 72].map((h, i) => (
            <div key={i} className="w-full bg-primary" style={{ height: `${h}%` }} />
          ))}
        </div>
      </Chart>
    </div>
  ),
};
