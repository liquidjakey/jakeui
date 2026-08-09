import { cn } from '../lib/cn.js';

/**
 * Separator — visual separator for grouping adjacent content.
 *
 * Figma: `Separator`, node 70:405, 2 variants.
 * Contract: docs/components/separator.md
 *
 * `decorative` has no Figma property and must exist: the record splits this
 * component in two semantically with no visual difference between the halves.
 * A purely visual rule is `aria-hidden`; one that genuinely divides groups keeps
 * `role="separator"`. Defaults to decorative, which is the common case.
 */
export interface SeparatorProps {
  /** Axis the rule runs along. */
  orientation?: 'horizontal' | 'vertical';
  /** Visual only (default) vs a real semantic boundary. */
  decorative?: boolean;
  className?: string;
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
}: SeparatorProps) {
  return (
    <div
      // A decorative rule must not be announced at all. A semantic one keeps the
      // role — and, when vertical, must SAY so: role="separator" implies
      // horizontal, so the orientation has to be stated explicitly.
      role={decorative ? undefined : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(
        // `border` is the only token this component binds. Thickness is written
        // as h-px / w-px so a raw pixel value never lands in a colour position.
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
