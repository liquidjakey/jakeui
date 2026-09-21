import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Named, focusable scroll region using native scrollbars. Preserve the platform
 * scroll affordance and the visible keyboard focus ring.
 * Consumer contract: docs/agent/components/scroll-area.md.
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
