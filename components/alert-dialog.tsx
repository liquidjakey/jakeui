import { useId, useEffect, useRef } from 'react';
import { ModalSurface } from './modal-surface.js';
import { cn } from '../lib/cn.js';

/**
 * Consequential modal confirmation with a required description and fixed actions.
 * Initial focus is Cancel. Escape cancels; backdrop clicks do not dismiss.
 * Use Dialog for general content or custom footer composition.
 * Consumer contract: docs/agent/components/alert-dialog.md.
 */
export interface AlertDialogProps {
  open: boolean;
  /** The safe path. Also fired by Escape. */
  onCancel: () => void;
  /** The consequential path. */
  onAction: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel: string;
  /** Use destructive only when the action causes irreversible loss. */
  tone?: 'default' | 'destructive';
}

export function AlertDialog({
  open,
  onCancel,
  onAction,
  title,
  description,
  cancelLabel = 'Cancel',
  actionLabel,
  tone = 'default',
}: AlertDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Initial focus goes to the SAFE path, so someone who presses Enter reflexively
  // cancels rather than confirms.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  return (
    <ModalSurface
      role="alertdialog"
      open={open}
      onClose={onCancel}
      dismissOnBackdrop={false}
      labelledBy={titleId}
      describedBy={descId}
      className="w-[min(26rem,92vw)]"
    >
      <div className="flex flex-col gap-1">
        {/*
          This component binds `card-foreground`, which is the correct pairing for
          a `card` fill. Dialog, Drawer and Sheet bind plain `foreground` on the
          same fill; they resolve identically today, so nothing is visibly wrong.
          Preserve the Dialog heading treatment.
        */}
        {/* Heading/LG (18/26) in the file, not Heading/MD (16/24). */}
        <h2 id={titleId} className="text-heading-lg text-card-foreground">
          {title}
        </h2>
        <p id={descId} className="text-body-md text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-input bg-card px-3 py-2 text-body-sm text-foreground"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'rounded-lg px-3 py-2 text-body-sm',
            // Consequential tone belongs to the action; Cancel stays visually neutral.
            tone === 'destructive'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground',
          )}
        >
          {actionLabel}
        </button>
      </div>
    </ModalSurface>
  );
}
