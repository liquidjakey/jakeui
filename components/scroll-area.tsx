import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * ScrollArea — scrollable viewport primitive.
 *
 * Figma: `Scroll Area`, 2 variants.
 * Contract: docs/components/scroll-area.md
 *
 * 🛑 The record's own description promises anatomy it does not bind: "Scrollable
 * viewport primitive with VISIBLE TRACK AND THUMB ANATOMY." tokensUsed is five
 * entries and every one belongs to the viewport container — no track, no thumb.
 *
 * Rather than invent two colours, the NATIVE SCROLLBAR IS KEPT: the same decision,
 * for the same reason, as NativeSelect's chevron. Suppressing the platform's own
 * affordance would force inventing a token that does not exist, and it keeps native
 * scroll behaviour intact, which is the point of a scroll area.
 *
 * The focusable + named region is the important part: a region that scrolls but
 * cannot be focused is UNREACHABLE BY KEYBOARD, the single most common failure of
 * custom scroll areas.
 */
export interface ScrollAreaProps {
  children: ReactNode;
  axis?: 'vertical' | 'horizontal';
  /** Required: a focusable region with no name is an unexplained tab stop. */
  label: string;
}

export function ScrollArea({ children, axis = 'vertical', label }: ScrollAreaProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'rounded-lg border border-border bg-card text-body-md text-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        axis === 'vertical' ? 'max-h-64 overflow-y-auto' : 'overflow-x-auto',
      )}
    >
      {children}
    </div>
  );
}
