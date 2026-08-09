import { useId, useEffect, useRef } from 'react';
import { ModalSurface } from './modal-surface.js';
import { cn } from '../lib/cn.js';

/**
 * AlertDialog — modal confirmation for consequential actions.
 *
 * Figma: `Alert Dialog`, node 66:*, 2 variants.
 * Contract: docs/components/alert-dialog.md
 *
 * Two deliberate differences from Dialog, both accessibility decisions:
 *
 * 1. BACKDROP CLICK DOES NOT CLOSE. A Dialog is dismissible by clicking away; an
 *    AlertDialog is a decision, and dismissing a decision by misclick is how
 *    people lose data. Escape still cancels — that is unambiguous intent and the
 *    platform contract users rely on.
 * 2. `description` is REQUIRED. A confirmation whose only text is a title cannot
 *    tell the user what they are agreeing to. Enforced by the type.
 *
 * No children and no footer slots: the content is fixed on purpose. A slot would
 * let a caller turn this back into a Dialog.
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
  /**
   * Per this component's own description: "Use Tone=Destructive only when the
   * primary action causes irreversible loss." Note the shared `tone` vocabulary
   * in archetypes.json defines destructive as "an error that blocks progress",
   * which is Alert's meaning, not this one. The description wins.
   */
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
          See docs/components/dialog.md Table 3.
        */}
        <h2 id={titleId} className="text-heading-md font-semibold text-card-foreground">
          {title}
        </h2>
        <p id={descId} className="text-body-sm text-muted-foreground">
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
            // No button token is recorded on this set — tokensUsed lists five and
            // none is an action colour. Asserted rather than transcribed, and
            // flagged in the props table. Revisit when Button is built and bound.
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
