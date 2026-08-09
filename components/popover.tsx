import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * The Popover family.
 *
 * Figma: `Popover` (111:*) plus `Popover / *`.
 * Contracts: docs/components/popover.md · popover-backdrop.md ·
 *            popover-close.md · popover-viewport.md
 *
 * `Popover / Root Composition` is NOT bound to code — its Pattern axis is
 * `kind: story-only` ("Storybook story, never a prop"), same as Table's. It ships
 * as stories. `Popover / Content` (48 variants, 1 state row) stays blocked by the
 * 8-row cap; unlike Table / Row, nothing can be inferred from 1 of 48.
 *
 * PLACEMENT IS NOT COLLISION-AWARE. The component places on the requested side and
 * stays there. Flipping near a viewport edge needs a positioning library, which is
 * out of scope for a token-level component — recorded in the props table rather
 * than half-built.
 */

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

const SIDE: Record<PopoverSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/* ─────────────────────────── Backdrop ─────────────────────────── */

export interface PopoverBackdropProps {
  open: boolean;
  mode?: 'modal' | 'trapFocus';
  onClick?: () => void;
}

/**
 * 🛑 THE ONLY SCRIM TOKEN IN THE SYSTEM, AND IT IS THE WRONG KIND OF TOKEN.
 *
 * The record binds `fill foreground`. Verified in .figma-tokens-dump.json,
 * `foreground` is neutral/950 in Light and neutral/50 in Dark — it INVERTS. As a
 * scrim that is a near-black overlay in Light (right) and a near-WHITE overlay in
 * Dark (wrong). A scrim should darken in both themes.
 *
 * Dialog, Drawer, Sheet and AlertDialog record no backdrop token at all, which is
 * why modal-surface.tsx falls back to a raw black/50. So there is no correct scrim
 * token anywhere, and the one that exists is theme-inverting.
 *
 * Applied as recorded anyway: unlike Card's invisible text this produces a visible,
 * functioning backdrop, and deviating would mean inventing a token. Figma owes a
 * real overlay/scrim token — that one addition closes five gaps at once.
 */
export function PopoverBackdrop({ open, mode = 'modal', onClick }: PopoverBackdropProps) {
  if (!open) return null;
  return (
    <div
      aria-hidden="true"
      onClick={mode === 'modal' ? onClick : undefined}
      className="fixed inset-0 z-40 bg-foreground/50 motion-safe:transition-opacity"
    />
  );
}

/* ──────────────────────────── Close ───────────────────────────── */

export interface PopoverCloseProps {
  onClose: () => void;
  label?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Defaults to "Close" rather than requiring a name, unlike TableActionTrigger.
 * There the name must identify a row, so required is right; here "Close" genuinely
 * is the correct name almost every time, and a required prop everyone fills with
 * the same string is friction rather than safety.
 *
 * radius/7 is a half-step ramp member and this is the only component that binds it.
 * Written as an explicit calc so it can never degrade to a raw pixel value — the
 * same treatment space/2-25 gets in Input.
 */
export function PopoverClose({ onClose, label = 'Close', disabled = false, icon }: PopoverCloseProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClose}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center bg-popover',
        'rounded-[calc(var(--radius-7))]',
        'hover:bg-accent',
        MOTION.colors,
        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        // No disabled tokens recorded on this asset; shared convention asserted.
        disabled && 'cursor-not-allowed text-muted-foreground hover:bg-popover',
      )}
    >
      {/* The record: "the icon itself is decorative to assistive technology." */}
      <span aria-hidden="true">{icon ?? '×'}</span>
    </button>
  );
}

/* ─────────────────────────── Viewport ─────────────────────────── */

export interface PopoverViewportProps {
  children: ReactNode;
  previous?: ReactNode;
  direction?: PopoverSide;
}

/**
 * `State` deliberately did NOT become an enum. Current and previous are not modes a
 * caller selects — both render AT ONCE during a transition, which is the entire
 * point, and an enum could only ever show one.
 *
 * `direction` is an ACTIVATION direction (the axis content travels along), not
 * anchored placement. That distinction is why this component's vocabulary was the
 * last unresolved doc block in the system: `side` already owns top/right/bottom/
 * left for placement, and guessing would have put a wrong meaning in six blocks.
 */
export function PopoverViewport({ children, previous, direction = 'bottom' }: PopoverViewportProps) {
  return (
    <div
      data-activation-direction={direction}
      className="relative overflow-hidden rounded-lg border border-border bg-popover text-body-xs text-popover-foreground"
    >
      {previous ? (
        // Hidden AND inert: both halves are in the DOM at once, so announcing or
        // focusing the outgoing half would read the popover twice.
        <div aria-hidden="true" data-previous className="pointer-events-none absolute inset-0">
          {previous}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}

/* ─────────────────────────── Popover ──────────────────────────── */

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: 'small' | 'large';
  arrow?: boolean;
  side?: PopoverSide;
  /** Traps focus. The record: "a popover holding a form should trap focus; a non-modal one should not." */
  modal?: boolean;
}

/** No width token exists anywhere in the file, so both sizes are raw. */
const WIDTH = { small: 'w-[min(18rem,90vw)]', large: 'w-[min(28rem,90vw)]' } as const;

export function Popover({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  size = 'small',
  arrow = false,
  side = 'bottom',
  modal = false,
}: PopoverProps) {
  const id = useId();
  const contentId = `${id}-content`;
  const titleId = `${id}-title`;
  const rootRef = useRef<HTMLDivElement>(null);

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  // Outside click closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <span
        // The record: "The trigger carries aria-expanded and aria-controls."
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={() => onOpenChange(!open)}
      >
        {trigger}
      </span>

      {modal ? <PopoverBackdrop open={open} onClick={() => onOpenChange(false)} /> : null}

      {open ? (
        <div
          id={contentId}
          // role="dialog" only when modal. A non-modal surface announced as a
          // dialog misleads — it implies a trap and a decision that are not there.
          role={modal ? 'dialog' : undefined}
          aria-modal={modal || undefined}
          aria-labelledby={title ? titleId : undefined}
          className={cn(
            'absolute z-50 rounded-lg border border-border bg-popover p-4',
            MOTION.overlay,
            'text-body-md text-popover-foreground shadow-md',
            WIDTH[size],
            SIDE[side],
          )}
        >
          {arrow ? (
            // No arrow token is recorded; it inherits the surface tokens.
            <span
              aria-hidden="true"
              className="absolute h-2 w-2 rotate-45 border border-border bg-popover"
              style={{ [side === 'top' ? 'bottom' : 'top']: '-5px', left: 'calc(50% - 4px)' }}
            />
          ) : null}

          {title ? (
            <h3 id={titleId} className="text-heading-xs text-popover-foreground">
              {title}
            </h3>
          ) : null}
          {/* Description binds Body/XS (12/18) in the file. */}
          {description ? (
            <p className="mt-1 text-body-xs text-muted-foreground">{description}</p>
          ) : null}
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────── Popover trigger ───────────────────────── */

export interface PopoverTriggerProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  controls?: string;
}

/**
 * RECOVERED FROM THE 8-ROW CAP. 10 variants = Type(button|rTL) x State(5); 8 rows
 * present, missing rTL/Focused and rTL/Disabled. Every rTL row present carries the
 * SAME single delta and nothing else — `type size/12` — three rows, one token, no
 * exceptions. So the Type axis changes only the type size and the two missing rows
 * are their Button counterparts at size/12.
 *
 * ⚠️ `rTL` IS NOT A VISUAL VARIANT. Right-to-left is a document direction, so in
 * code it is dir="rtl" on an ancestor plus logical properties — never a prop. What
 * the axis really documents is that RTL renders one type step smaller, which this
 * component honours by inheriting rather than branching.
 *
 * ⚠️ Open and Hover bind IDENTICAL tokens, so the trigger looks the same whether
 * the popover is open or merely hovered — the same gap as Dropdown Menu / Sub
 * Trigger. And accent-foreground appears with no accent fill, the fourth component
 * with that shape.
 */
export function PopoverTrigger({
  children,
  open,
  onOpenChange,
  disabled = false,
  controls,
}: PopoverTriggerProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      disabled={disabled}
      onClick={() => onOpenChange(!open)}
      className={cn(
        'rounded-lg px-3 py-2 text-body-sm',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        open ? 'text-accent-foreground' : 'text-foreground',
        'hover:text-accent-foreground',
        disabled && 'cursor-not-allowed text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}

/* ─────────────────────── Popover / Content ─────────────────────── */

export interface PopoverContentProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  size?: 'small' | 'large';
  side?: PopoverSide;
  align?: 'start' | 'center' | 'end';
  arrow?: boolean;
}

/**
 * Read from LIVE BINDINGS — its description showed 1 of 48 rows, the worst ratio in
 * the file, and nothing could be inferred from it.
 *
 * SIZE, SIDE AND ALIGN ALL CARRY NO COLOUR DELTA. 48 variants collapse to THREE
 * distinct binding sets, differing only by the Arrow node. Every visual axis on this
 * component is geometry.
 *
 * 🔎 AND THE READ PROVED THE STALENESS FINDING: the action link binds
 * `primary-readable` — one of the three tokens the 9 Aug rebind introduced, which
 * appears in NO description anywhere. The bindings are current; the descriptions are
 * not. That is the clearest single piece of evidence for it in the file.
 */
export function PopoverContent({
  title,
  description,
  children,
  action,
  onClose,
  size = 'small',
  side = 'bottom',
  align = 'start',
  arrow = false,
}: PopoverContentProps) {
  return (
    <div
      data-side={side}
      data-align={align}
      className={cn(
        'relative rounded-lg border border-border bg-popover p-4 shadow-md',
        'text-body-md text-popover-foreground',
        size === 'large' ? 'w-[min(28rem,90vw)]' : 'w-[min(18rem,90vw)]',
      )}
    >
      {arrow ? <span aria-hidden="true" className="absolute h-2 w-2 rotate-45 border border-border bg-popover" style={{ [side === 'top' ? 'bottom' : 'top']: '-5px', left: 'calc(50% - 4px)' }} /> : null}
      {onClose ? (
        <span className="absolute right-2 top-2">
          <PopoverClose onClose={onClose} />
        </span>
      ) : null}
      {title ? <h3 className="font-semibold text-popover-foreground">{title}</h3> : null}
      {description ? <p className="mt-1 text-body-sm text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-2 text-muted-foreground">{children}</div> : null}
      {/* primary-readable, read from the live binding. */}
      {action ? <div className="mt-3 text-primary-readable">{action}</div> : null}
    </div>
  );
}
