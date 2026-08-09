import { cloneElement, useId, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Tooltip — brief non-interactive label revealed on hover or focus.
 *
 * Figma: `Tooltip`, node 111:20, 4 variants.
 * Contract: docs/components/tooltip.md
 *
 * `label` is deliberately a STRING, not a ReactNode. Everywhere else in this system
 * a content property was widened to a node; not here. The record calls this "brief
 * non-interactive", and a node slot invites buttons and links into a surface that
 * is unreachable by keyboard and invisible on touch. The narrow type is the guard.
 *
 * The fill/text pairing is a deliberate inversion and it is CORRECT: `foreground`
 * fill with `card` text gives a dark chip on a light theme and a light chip on a
 * dark one. Note this is the same `foreground` token that is WRONG as a backdrop on
 * Popover / Backdrop — as a fill behind short text it inverts correctly; as a
 * full-screen scrim it inverts backwards.
 */
export interface TooltipProps {
  label: string;
  /** The trigger. Must be focusable — a tooltip on a non-focusable element is unreachable. */
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const SIDE = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
} as const;

export function Tooltip({ label, children, side = 'top', delay = 400 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (immediate: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    // Focus shows immediately; hover waits out the delay. A keyboard user has
    // already expressed intent by focusing.
    if (immediate) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    // DESCRIBES, never names. A tooltip must not be the trigger's only label.
    'aria-describedby': open ? id : undefined,
    onMouseEnter: () => show(false),
    onMouseLeave: hide,
    onFocus: () => show(true),
    onBlur: hide,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    },
  });

  return (
    <span className="relative inline-block">
      {trigger}
      {open ? (
        <span
          id={id}
          role="tooltip"
          // Stays visible while the pointer is over it, per the record.
          onMouseEnter={() => show(true)}
          onMouseLeave={hide}
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-lg bg-foreground px-2 py-1',
            'text-body-xs text-card',
            SIDE[side],
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
