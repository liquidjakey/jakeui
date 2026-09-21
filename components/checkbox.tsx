import { useEffect, useId, useRef } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Labelled controlled tri-state choice. Indeterminate is supplied by the caller
 * and resolves to a boolean on activation. The decorative 10px glyph is scoped
 * in scripts/computed-type-exceptions.json, not a consumer typography allowance.
 * Consumer contract: docs/agent/components/checkbox.md.
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
    // gap is `space/2-5` (10px) in the file, not `space/2` (8px).
    <label className="flex cursor-pointer items-start gap-2.5" htmlFor={id}>
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
            MOTION.colors,
            checked === false
              ? 'border-input bg-card'
              : 'border-primary bg-primary text-primary-foreground',
            'peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            disabled && 'opacity-50',
          )}
        >
          {checked === true ? '✓' : indeterminate ? '–' : null}
        </span>
      </span>

      <span className="flex flex-col gap-0.5">
        <span
          className={cn('text-label-lg', disabled ? 'text-muted-foreground' : 'text-foreground')}
        >
          {label}
        </span>
        {description ? (
          <span id={descId} className="text-body-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
