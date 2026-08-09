import { useId } from 'react';
import { cn } from '../lib/cn.js';

/**
 * RadioGroup — labelled exclusive-choice group.
 *
 * Figma: `Radio Group` (78:*) and `Radio Group / Indicator`.
 * Contracts: docs/components/radio-group.md · radio-group-indicator.md
 *
 * Same shape of gap as Switch: this asset's tokensUsed is three TEXT tokens. The
 * outer circle lives on Radio Group / Root, which is BLOCKED (24 variants). The
 * circle border is asserted as `input`.
 *
 * Unlike Switch, the SELECTED half is real — Radio Group / Indicator records
 * `fill primary` — so only the ring is asserted, not the state colour. That record
 * is also the precedent that made Switch's track assertion defensible.
 *
 * Radio Group / Field Composition is NOT bound: kind: story-only.
 */

export interface RadioGroupIndicatorProps {
  checked?: boolean;
  disabled?: boolean;
  /** The record: "Runtime may force-mount the indicator for animation or measurement." */
  forceMount?: boolean;
}

export function RadioGroupIndicator({
  checked = false,
  forceMount = false,
}: RadioGroupIndicatorProps) {
  if (!checked && !forceMount) return null;
  return (
    <span
      aria-hidden="true"
      // Force-mounted and unchecked means hidden from sight AND from assistive
      // technology, not merely transparent.
      hidden={!checked}
      className={cn('block h-2 w-2 rounded-full bg-primary', !checked && 'invisible')}
    />
  );
}

export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  items: RadioItem[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  items,
  value,
  onValueChange,
  label,
  disabled = false,
  orientation = 'vertical',
}: RadioGroupProps) {
  const name = useId();

  return (
    // A fieldset+legend, not a wrapper label: the group's name must come from the
    // legend or it is not announced as a group at all.
    <fieldset className="border-0 p-0" disabled={disabled}>
      <legend className="mb-2 text-body-md text-foreground">{label}</legend>
      <div className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row')}>
        {items.map((item) => {
          const id = `${name}-${item.value}`;
          const itemDisabled = disabled || Boolean(item.disabled);
          const checked = value === item.value;
          return (
            <label key={item.value} htmlFor={id} className="flex items-start gap-2">
              <span className="relative mt-0.5 inline-flex">
                <input
                  id={id}
                  type="radio"
                  // Exclusivity is enforced by the shared name, not only by state.
                  name={name}
                  value={item.value}
                  checked={checked}
                  disabled={itemDisabled}
                  onChange={() => onValueChange(item.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-4 w-4 items-center justify-center rounded-full border',
                    // 🛑 ASSERTED — no circle token is readable; Radio Group / Root
                    // holds it and is blocked. `input` is the resting border token
                    // every other form control here binds.
                    'border-input bg-card',
                    'peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
                    itemDisabled && 'opacity-50',
                  )}
                >
                  <RadioGroupIndicator checked={checked} />
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    'text-body-md',
                    itemDisabled ? 'text-muted-foreground' : 'text-foreground',
                  )}
                >
                  {item.label}
                </span>
                {item.description ? (
                  <span className="text-body-sm text-muted-foreground">{item.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
