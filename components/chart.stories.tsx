import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './chart.js';

/**
 * Stories for `Chart`.
 * Contract: docs/components/chart.md
 *
 * 🛑 **Five tokens, all of them the container.** No series colour, no axis, no
 * gridline. It is a titled frame that a chart renders *into*; supplying a palette
 * would mean inventing one, which the repo rule forbids.
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

/**
 * `Chart` — a container, deliberately. The bars below are supplied by the caller,
 * because there is no series palette in the file to draw them from.
 */
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
