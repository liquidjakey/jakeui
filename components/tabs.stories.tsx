import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './tabs.js';

/**
 * Controlled tablist and panels using SegmentedTab internally.
 * Test orientation-aware arrows, Home/End and Tab exit; only the selected tab is tabbable.
 * Consumer contract: docs/agent/components/tabs.md.
 */

const meta = {
  title: 'Controls/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "Complete controlled tablist with linked panels, built from SegmentedTab items. Tabs owns keyboard navigation and selection; SegmentedTab alone needs a tablist owner.",
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
