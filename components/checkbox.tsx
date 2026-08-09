import { useEffect, useId, useRef } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Checkbox — labelled tri-state checkbox.
 *
 * Figma: `Checkbox`, node 78:0, 9 variants.
 * Contract: docs/components/checkbox.md
 *
 * RECOVERED FROM THE 8-ROW CAP. 9 variants = Value(3) x State(3); 4 rows present.
 * All three Disabled rows are IDENTICAL, so Value carries no text delta — three
 * observations, no exceptions — and the two missing Default rows match
 * Unchecked/Default. The three missing Focused rows have zero observations, but
 * this record is text-only and focus is drawn on the box, which it does not bind.
 *
 * 🛑 THE BOX HAS NO TOKENS AT ALL, exactly as Switch's track has none — and unlike
 * Switch there is no sibling asset holding it (there is no Checkbox / Indicator in
 * the map). Asserted on the established precedent: `input` for the resting border,
 * `primary` / `primary-foreground` for the checked fill and mark.
 */
export interface CheckboxProps {
  label: string;
  /** Three states, so not a plain boolean. Indeterminate is never user-selectable. */
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function Checkbox({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  description,
}: CheckboxProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const ref = useRef<HTMLInputElement>(null);
  const indeterminate = checked === 'indeterminate';

  // There is NO HTML attribute for indeterminate — it exists only as a DOM
  // property, so it must be applied through a ref. aria-checked="mixed" follows.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className="flex items-start gap-2">
      <span className="relative mt-0.5 inline-flex">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked === true}
          disabled={disabled}
          aria-describedby={description ? descId : undefined}
          // Clicking an indeterminate box resolves to checked. It never cycles back
          // to mixed — mixed is derived from children, not chosen.
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded border text-[10px]',
            // 🛑 ASSERTED — no box tokens are recorded anywhere for this component.
            checked === false ? 'border-input bg-card' : 'border-primary bg-primary text-primary-foreground',
            'peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            disabled && 'opacity-50',
          )}
        >
          {checked === true ? '✓' : indeterminate ? '–' : null}
        </span>
      </span>

      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className={cn('text-body-md', disabled ? 'text-muted-foreground' : 'text-foreground')}>
          {label}
        </span>
        {description ? (
          <span id={descId} className="text-body-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </label>
    </div>
  );
}
