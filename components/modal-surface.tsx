import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * INTERNAL modal foundation, not a public export. showModal() supplies modal
 * focus containment and the top layer; an open attribute alone is nonmodal.
 * This wrapper synchronizes platform cancellation with controlled state, locks
 * page scrolling, and implements configurable backdrop dismissal.
 * Public callers own content, naming and task-specific initial focus.
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
  role?: 'dialog' | 'alertdialog';
}

/** Shared modal surface. Callers style their own title and description text. */
const BASE = [
  'bg-card border border-border rounded-lg',
  MOTION.overlay,
  'p-6 shadow-lg',
  // The approved scrim remains dark in both themes; see agent/exceptions.json.
  'backdrop:bg-scrim',
  // Sheet overrides the shared gap through className.
  'open:flex open:flex-col open:gap-5',
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
  role = 'dialog',
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
      role={role}
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cn(BASE, LAYOUT[layout], className)}
      onClick={(e) => {
        if (!dismissOnBackdrop) return;
        // A <dialog> fills the top layer, so a click on the backdrop reports the
        // dialog itself as the target. Anything inside reports a descendant.
        if (e.target !== ref.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          onClose();
      }}
    >
      {children}
    </dialog>
  );
}
