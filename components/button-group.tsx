import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * ButtonGroup — groups related actions.
 *
 * Figma: `Button Group`, 4 variants.
 * Contract: docs/components/button-group.md
 *
 * ⚠️ ITS MEMBERS ARE BUTTONS, AND BUTTON IS STILL BLOCKED by the 8-row cap (32
 * variants, 8 rows — outline and ghost entirely unrecorded). This is the container;
 * callers supply their own buttons until Button can be built.
 *
 * The record binds two tokens and one of them is a LEAKED BINDING: the group has no
 * fill, so `primary-foreground` — the text colour FOR the primary fill — sits on
 * whatever is beneath. It almost certainly belongs to the nested Button instances
 * the record describes. Identical in shape to Toggle Group's stray
 * accent-foreground, and given the identical treatment: LAYOUT-ONLY, with each
 * member owning its appearance.
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
        // No border or radius tokens exist for the attached treatment, so the
        // shared-edge rules are raw. Attached is VISUAL ONLY — joining buttons must
        // not imply to assistive technology that they are one control.
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
