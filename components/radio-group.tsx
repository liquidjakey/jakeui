import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { OPACITY_DISABLED, OPACITY_READONLY } from '../lib/opacity.js';

/**
 * Controlled exclusive choice using native radio inputs.
 * RadioGroupRoot, RadioGroupItem and RadioGroupIndicator are visual anatomy;
 * use RadioGroup for labels, grouping and keyboard behavior.
 * Consumer contract: docs/agent/components/radio-group.md.
 */

export interface RadioGroupIndicatorProps {
  checked?: boolean;
  disabled?: boolean;
  /** Keeps the decorative indicator mounted when unchecked for animation or measurement. */
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
          // gap is `space/2-5` (10px) in the file, not `space/2` (8px).
          return (
            <label key={item.value} htmlFor={id} className="flex items-start gap-2.5">
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
                    'inline-flex size-5 items-center justify-center rounded-full border',
                    MOTION.colors,
                    'border-input bg-card',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                    itemDisabled && OPACITY_DISABLED,
                  )}
                >
                  <RadioGroupIndicator checked={checked} />
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    // Item labels bind Label/LG (14/20 medium), not Body/MD.
                    'text-label-lg',
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

/* ──────────────────── Radio Group / Item + Root ──────────────────── */

export type RadioState = 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';

export interface RadioGroupItemProps {
  checked?: boolean;
  state?: RadioState;
}

/**
 * Decorative circle: card/input at rest, accent on hover, ring on focus,
 * destructive border when invalid. Disabled uses opacity/50, readOnly opacity/80.
 */
export function RadioGroupItem({ checked = false, state = 'default' }: RadioGroupItemProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-5 items-center justify-center rounded-full border',
        state === 'hover' ? 'bg-accent' : 'bg-card',
        state === 'invalid'
          ? 'border-destructive'
          : state === 'focused'
            ? 'border-ring'
            : checked
              ? 'border-primary'
              : 'border-input',
        // Read-only remains more visible than disabled.
        state === 'disabled' && OPACITY_DISABLED,
        state === 'readOnly' && OPACITY_READONLY,
      )}
    >
      <RadioGroupIndicator checked={checked} />
    </span>
  );
}

export interface RadioGroupRootProps {
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  label: string;
  /** Only disabled affects this wrapper; other states do not propagate to children. */
  state?: 'default' | 'disabled' | 'readOnly' | 'invalid';
}

/**
 * Anatomy fieldset: orientation controls layout. Disabled disables descendant
 * native controls and dims the legend; readOnly and invalid do not style children.
 * Pass visual state to each RadioGroupItem when building anatomy previews.
 */
export function RadioGroupRoot({
  children,
  orientation = 'vertical',
  label,
  state = 'default',
}: RadioGroupRootProps) {
  return (
    <fieldset className="border-0 p-0" disabled={state === 'disabled'}>
      <legend
        className={cn(
          'mb-2 text-body-md',
          state === 'disabled' ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {label}
      </legend>
      <div className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row')}>
        {children}
      </div>
    </fieldset>
  );
}
