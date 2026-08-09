import { cn } from '../lib/cn.js';

/**
 * PopoverArrow — the pointer on an anchored surface.
 *
 * Figma: `Popover / Arrow`, 4 variants.
 * Contract: docs/components/popover-arrow.md
 *
 * Third of the "no root-level bindings" records: the fill lives on a child Arrow
 * node. Read from live bindings — `popover` fill with a `border` stroke on every
 * variant, so Side is pure geometry with no colour delta.
 *
 * That also fills the gap flagged in popover.md, which had to draw its own arrow
 * with no recorded token. This is the token.
 */
export interface PopoverArrowProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const POS = {
  top: 'bottom-[-5px] left-1/2 -translate-x-1/2',
  bottom: 'top-[-5px] left-1/2 -translate-x-1/2',
  left: 'right-[-5px] top-1/2 -translate-y-1/2',
  right: 'left-[-5px] top-1/2 -translate-y-1/2',
} as const;

export function PopoverArrow({ side = 'bottom', className }: PopoverArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute h-2 w-2 rotate-45 border border-border bg-popover',
        POS[side],
        className,
      )}
    />
  );
}
