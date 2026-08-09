import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * ModalSurface — INTERNAL. Not exported from components/index.ts.
 *
 * The shared native `<dialog>` surface behind Dialog, AlertDialog, Drawer and
 * Sheet. All four bind the same tokens (card / border / radius-lg / foreground)
 * and carry the same accessibility contract, so they share one implementation
 * rather than four that drift apart.
 *
 * WHY NATIVE <dialog>: showModal() supplies the focus trap, Escape-to-close, the
 * top layer and ::backdrop from the platform. Every item marked "platform" in
 * docs/components/dialog.md Table 4 comes free and correct. This follows the
 * precedent set by NativeSelect — prefer the platform's own behaviour over a
 * re-implementation that will be subtly wrong.
 *
 * What is NOT free and is implemented here:
 *   - backdrop click (a <dialog> has no such behaviour)
 *   - page scroll lock (the top layer blocks interaction, not scrolling)
 *   - keeping controlled `open` in sync with platform-initiated closes
 */
export interface ModalSurfaceProps {
  open: boolean;
  onClose: () => void;
  /** False for AlertDialog: a decision must not be dismissible by misclick. */
  dismissOnBackdrop?: boolean;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  /** Geometry only — placement and width. All tokens are on BASE. */
  className?: string;
  /** Where the panel sits in the viewport. */
  layout?: 'center' | 'left' | 'right';
}

/**
 * Tokens transcribed from the four records, which are identical:
 * fill `card` · border 1px `border` · radius `radius/lg` · text `foreground`.
 *
 * NOTE the recorded mismatch: AlertDialog binds `card-foreground` for this same
 * surface while the other three bind `foreground`. They resolve to the same
 * primitives today, so this is invisible — but `card-foreground` is the correct
 * pairing for a `card` fill. Callers pass their own text token so each component
 * stays faithful to its own record; see docs/components/dialog.md Table 3.
 */
const BASE = [
  'bg-card border border-border rounded-lg',
  'p-6 shadow-lg',
  // The backdrop has no token in any of the four records. A neutral black at low
  // alpha stands in until Figma binds one. Recorded in every props table.
  'backdrop:bg-black/50',
  'open:flex open:flex-col open:gap-4',
].join(' ');

const LAYOUT = {
  center: 'm-auto max-h-[85vh]',
  left: 'mr-auto ml-0 h-full max-h-none rounded-l-none',
  right: 'ml-auto mr-0 h-full max-h-none rounded-r-none',
} as const;

export function ModalSurface({
  open,
  onClose,
  dismissOnBackdrop = true,
  labelledBy,
  describedBy,
  children,
  className,
  layout = 'center',
}: ModalSurfaceProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Drive the platform from the controlled prop. showModal() is what buys the
  // focus trap and the top layer; a plain `open` attribute does NOT — it renders
  // a non-modal dialog with no trap at all.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The platform can close the dialog without React knowing (Escape). The
  // `cancel` event is that signal; without this the controlled `open` prop and
  // the real DOM state silently diverge and the dialog cannot be reopened.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // let React drive the close, not the platform
      onClose();
    };
    el.addEventListener('cancel', onCancel);
    return () => el.removeEventListener('cancel', onCancel);
  }, [onClose]);

  // The top layer blocks interaction behind the dialog but does not stop the
  // page scrolling underneath it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cn(BASE, LAYOUT[layout], className)}
      onClick={(e) => {
        if (!dismissOnBackdrop) return;
        // A <dialog> fills the top layer, so a click on the backdrop reports the
        // dialog itself as the target. Anything inside reports a descendant.
        if (e.target === ref.current) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
