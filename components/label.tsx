import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Label — form control label primitive.
 *
 * Figma: `Label`, node 70:329, 3 variants.
 * Contract: docs/components/label.md
 *
 * Two deliberate divergences from `figma.map.json`, both recorded in Table 2:
 *
 * 1. The map types `State` as `kind: prop` with `'default' | 'disabled'`. It is a
 *    boolean here. The record's own description carries the governance rule that
 *    visual State axes stay QA/story states without explicit engineering approval,
 *    and every other control in this system uses `disabled: boolean`.
 *
 * 2. The map types `Type` as `'required' | 'optional'`. Code has THREE states,
 *    because most labels carry no marker at all and Figma has no variant for that.
 *    `undefined` is that third state and it is the default — required by the
 *    record's own dont: "Do not mark both required and optional fields."
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
        'inline-flex items-center gap-1 text-body-md',
        disabled ? 'text-muted-foreground' : 'text-foreground',
        className,
      )}
    >
      {children}
      {requirement ? (
        // Decorative on purpose. Required state reaches assistive technology
        // through the control's own `required` / `aria-required`, not through
        // this glyph — announcing it here would say it twice.
        //
        // Deliberately NOT tinted `destructive`: tokensUsed records no marker
        // colour, and red reads as an error before the user has done anything
        // wrong. The marker inherits the label's colour until Figma binds one.
        <span aria-hidden="true">{requirement === 'required' ? '*' : '(optional)'}</span>
      ) : null}
    </label>
  );
}
