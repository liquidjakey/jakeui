import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog.js';
import { AlertDialog } from './alert-dialog.js';
import { Drawer } from './drawer.js';
import { Sheet } from './sheet.js';

/**
 * Stories for the overlay family: `Dialog`, `AlertDialog`, `Drawer`, `Sheet`.
 * Contracts: docs/components/dialog.md · alert-dialog.md · drawer.md · sheet.md
 *
 * All four share `modal-surface.tsx`, a native `<dialog>` driven by `showModal()`.
 * The focus trap, Escape-to-close, top layer and `::backdrop` are all supplied by
 * the platform rather than re-implemented.
 *
 * **Worth actually testing in the canvas**, because these are the behaviours a
 * type check cannot verify:
 *   - Tab repeatedly — focus must never leave the open surface
 *   - Escape — must close and return focus to the trigger button
 *   - Click the backdrop — closes everything EXCEPT AlertDialog, by design
 */

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

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Native <dialog> surface. Focus trap, Escape and focus return come from the platform. ' +
          'Note that `Size` and `Width` have no token backing — there are no width tokens in the ' +
          'file at all — so those values are raw and flagged in the props tables.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard type, small size. Backdrop click closes. */
export const Default: Story = {
  args: { open: false, onClose: () => {}, title: 'Dialog' },
  render: () => <DialogDemo />,
};

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Trigger label="Open dialog" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Reschedule appointment"
        description="Pick a new time. The patient is notified automatically."
        footer={<Trigger label="Done" onClick={() => setOpen(false)} />}
      >
        <p>Body content is a slot, not a typed prop — see the props table Table 2.</p>
      </Dialog>
    </>
  );
}

/** `type="form"` binds the smaller title size (`size/13` vs `size/18`). */
export const FormType: Story = {
  name: 'Type = form',
  args: { open: false, onClose: () => {}, title: 'Dialog' },
  render: () => <FormDemo />,
};

function FormDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Trigger label="Open form dialog (large)" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        type="form"
        size="large"
        title="Edit patient record"
        description="Title renders at size/13 here rather than size/18."
      >
        <p>Large size — a raw width, because no width tokens exist in the file.</p>
      </Dialog>
    </>
  );
}

/**
 * **AlertDialog — the backdrop deliberately does not close it.**
 *
 * Try clicking outside: nothing happens. A Dialog is dismissible by clicking away;
 * an AlertDialog is a decision, and dismissing a decision by misclick is how
 * people lose data. Escape still cancels.
 *
 * Note also that focus lands on **Cancel**, not the action — so someone who
 * presses Enter reflexively takes the safe path.
 */
export const AlertDestructive: Story = {
  name: 'AlertDialog — destructive',
  args: { open: false, onClose: () => {}, title: 'Dialog' },
  render: () => <AlertDemo />,
};

function AlertDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <Trigger label="Delete record…" onClick={() => setOpen(true)} />
      {result ? <span className="text-body-sm text-muted-foreground">Result: {result}</span> : null}
      <AlertDialog
        open={open}
        tone="destructive"
        title="Delete this patient record?"
        description="This removes all appointment history. It cannot be undone."
        cancelLabel="Keep record"
        actionLabel="Delete permanently"
        onCancel={() => {
          setResult('cancelled');
          setOpen(false);
        }}
        onAction={() => {
          setResult('deleted');
          setOpen(false);
        }}
      />
    </div>
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
  args: { open: false, onClose: () => {}, title: 'Dialog' },
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
