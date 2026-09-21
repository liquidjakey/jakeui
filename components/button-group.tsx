import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Layout-only group of related Button controls; each member owns its appearance.
 * Attached edges are visual: buttons remain independently operable.
 * Consumer contract: docs/agent/components/button-group.md.
 */
export interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  label?: string;
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  attached = false,
  label,
}: ButtonGroupProps) {
  return (
    <div
      // role only when the grouping is meaningful; a purely visual one needs none.
      role={label ? 'group' : undefined}
      aria-label={label}
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        // Shared edges join the visuals, not the buttons' semantics or focus stops.
        attached
          ? orientation === 'horizontal'
            ? '[&>*]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*+*]:-ml-px'
            : '[&>*]:rounded-none [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg [&>*+*]:-mt-px'
          : 'gap-2',
      )}
    >
      {children}
    </div>
  );
}
