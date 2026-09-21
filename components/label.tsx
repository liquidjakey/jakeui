import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Control label. Wire htmlFor to the control id; requirement only adds a marker.
 * Consumer contract: docs/agent/components/label.md.
 */
export interface LabelProps {
  /** The label text. A ReactNode so a marker or inline code can be composed in. */
  children: ReactNode;
  /** The id of the control this labels. */
  htmlFor: string;
  /** Appends a marker. `undefined` means no marker at all. */
  requirement?: 'required' | 'optional';
  /** Dims the label to match a disabled control. Visual only. */
  disabled?: boolean;
  className?: string;
}

export function Label({ children, htmlFor, requirement, disabled = false, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'inline-flex items-center gap-1 text-label-lg',
        disabled ? 'text-muted-foreground' : 'text-foreground',
        className,
      )}
    >
      {children}
      {requirement ? (
        // Markers are decorative: set required / aria-required on the control.
        // Required uses destructive; Optional uses muted-foreground. Disabled
        // dims either marker with the label.
        <span
          aria-hidden="true"
          className={cn(
            requirement === 'optional' && 'text-caption-sm',
            disabled
              ? 'text-muted-foreground'
              : requirement === 'required'
                ? 'text-destructive'
                : 'text-muted-foreground',
          )}
        >
          {requirement === 'required' ? '*' : 'Optional'}
        </span>
      ) : null}
    </label>
  );
}
