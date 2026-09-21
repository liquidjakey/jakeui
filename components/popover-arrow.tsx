import { cn } from '../lib/cn.js';

/**
 * Decorative arrow using popover fill and border stroke. side controls geometry.
 * Anchored Popover owns its positioning-engine arrow; this export is anatomy.
 * Consumer contract: docs/agent/components/popover-arrow.md.
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
