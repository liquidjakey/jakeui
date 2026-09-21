import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog.js';

/**
 * Stories for `Dialog`.
 * Contract: docs/agent/components/dialog.md
 *
 * Dialog, AlertDialog, Drawer and Sheet all share `modal-surface.tsx`, a native
 * `<dialog>` driven by `showModal()`.
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
          "Native modal surface with focus containment, Escape dismissal and focus return. size selects existing internal geometry; type classifies content without changing title typography.",
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
        <p>Body content is a slot, not a typed prop — see the props table.</p>
      </Dialog>
    </>
  );
}

/** type="form" preserves Heading/LG; size="large" changes content width. */
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
        description="Form and standard dialogs share Heading/LG title typography."
      >
        <p>Large size uses the existing overlay geometry; see the scoped exception registry.</p>
      </Dialog>
    </>
  );
}
