import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './tabs.js';

/**
 * Stories for `Tabs`.
 * Contract: docs/components/tabs.md
 *
 * **Tabs and Segmented Tab are two halves of one control.** Tabs binds only the
 * container fill (`muted`) and has no selected-state treatment; Segmented Tab binds
 * exactly that treatment and no container. Notice the inversion in the canvas: the
 * *selected* tab takes the lighter `card` fill and lifts out of the muted track,
 * rather than being highlighted.
 *
 * **Test with the keyboard** — this is what the tablist pattern is for:
 *   - Arrow keys move *within* the list; Tab moves *out of* it into the panel
 *   - Home and End jump to first and last
 *   - Only the selected tab is tabbable
 */

const meta = {
  title: 'Controls/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Tabs is the container half; SegmentedTab is the item half. Neither is complete alone — ' +
          'the container record carries no selected-state tokens at all.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { id: 'overview', label: 'Overview', content: <p>Patient overview.</p> },
  { id: 'history', label: 'History', content: <p>Appointment history.</p> },
  { id: 'billing', label: 'Billing', content: <p>Invoices and payments.</p> },
];

export const Default: Story = {
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
  render: () => <TabsDemo />,
};

function TabsDemo() {
  const [id, setId] = useState('overview');
  return (
    <div className="max-w-md">
      <Tabs items={ITEMS} selectedId={id} onSelect={setId} label="Patient sections" />
    </div>
  );
}

/** Vertical orientation sets `aria-orientation` and swaps arrow keys to Up/Down. */
export const Vertical: Story = {
  args: { items: ITEMS, selectedId: 'overview', onSelect: () => {} },
  render: () => <VerticalDemo />,
};

function VerticalDemo() {
  const [id, setId] = useState('history');
  return (
    <div className="max-w-md">
      <Tabs
        items={ITEMS}
        selectedId={id}
        onSelect={setId}
        orientation="vertical"
        label="Patient sections"
      />
    </div>
  );
}
