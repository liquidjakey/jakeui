import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from './alert-dialog.js';

/**
 * Stories for `AlertDialog`.
 * Contract: docs/components/alert-dialog.md
 *
 * ⚠️ Its Title binds `Heading/LG` on BOTH sizes, not the "Standard size/18, Form
 * size/13" the record claimed — corrected in code against the live bindings.
 */

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  parameters: {
    docs: {
      description: {
        component:
          'Per its own description: use Tone=Destructive only when the primary action ' +
          'causes irreversible loss. Note the shared `tone` vocabulary defines destructive as ' +
          '"an error that blocks progress", which is Alert’s meaning, not this one — the ' +
          'description wins.',
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

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
  args: {
    open: false,
    onCancel: () => {},
    onAction: () => {},
    title: 'Alert dialog',
    description: 'Description.',
    actionLabel: 'Confirm',
  },
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
