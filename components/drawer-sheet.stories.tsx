import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './drawer.js';
import { Sheet } from './sheet.js';

/** Drawer and Sheet modal examples. See their current public references. */

const meta = {
  title: 'Overlays/Drawer & Sheet',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          "Drawer and Sheet share modal behavior and visual language. Drawer uses placement; Sheet uses side. Both need controlled open state and onClose.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Trigger({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-input bg-card px-3 py-2 text-body-sm text-foreground"
    >
      {label}
    </button>
  );
}

/** Compare the placement and side interfaces on the shared modal surfaces. */
export const DrawerVsSheet: Story = {
  name: 'Drawer vs Sheet (identical by design file)',
  args: { open: false, onClose: () => {}, title: 'Drawer' },
  render: () => <EdgeDemo />,
};

function EdgeDemo() {
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);
  return (
    <div className="flex gap-2">
      <Trigger label="Drawer (right, compact)" onClick={() => setDrawer(true)} />
      <Trigger label="Sheet (left, wide)" onClick={() => setSheet(true)} />

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        placement="right"
        width="compact"
        title="Filters"
        description="Axis is called Placement here."
      >
        <p>Transient filtering, per the description.</p>
      </Drawer>

      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        side="left"
        width="wide"
        title="Patient details"
        description="Axis is called Side here. Everything else is the same."
      >
        <p>Persistent side task, per the description — but still a modal that traps focus.</p>
      </Sheet>
    </div>
  );
}
