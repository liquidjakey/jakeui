import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './drawer.js';
import { Sheet } from './sheet.js';

/**
 * Stories for `Drawer` and `Sheet`.
 * Contracts: docs/components/drawer.md · sheet.md
 *
 * **These two share one title on purpose.** They are token-for-token identical in
 * the design file, and the single story below exists precisely to show that — it
 * cannot be split without destroying what it demonstrates. The title names both
 * components it hosts rather than pretending to be one of them.
 */

const meta = {
  title: 'Overlays/Drawer & Sheet',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          'Identical tokens, identical state rows, identical variants, identical props, ' +
          'identical accessibility. The only difference is the axis name: Drawer calls it ' +
          '`Placement`, Sheet calls it `Side`, with the same two values. Both were built as ' +
          'specified rather than merged, because collapsing them is a design decision.',
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

/**
 * **Drawer and Sheet, side by side — they are identical.**
 *
 * This story exists to make the duplication visible. Identical tokens, identical
 * state rows, identical variants, identical props, identical accessibility. The
 * only difference is the axis name: Drawer calls it `Placement`, Sheet calls it
 * `Side`, with the same two values.
 *
 * Both were built as specified rather than merged, because collapsing them is a
 * design decision. See docs/components/drawer.md for the full comparison.
 */
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
