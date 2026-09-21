import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { OPACITY_DISABLED, OPACITY_READONLY, OPACITY_THUMB_DISABLED } from '../lib/opacity.js';

/**
 * Controlled, labelled boolean setting; use Checkbox for a choice applied on save.
 * SwitchRoot and SwitchThumb are visual anatomy, not standalone controls.
 * Consumer contract: docs/agent/components/switch.md.
 */

export interface SwitchThumbProps {
  checked?: boolean;
  size?: 'small' | 'default';
  disabled?: boolean;
}

/**
 * The thumb adds opacity/75 when disabled. Inside a disabled SwitchRoot,
 * this compounds with the track's opacity/50; the composed Switch uses bg-muted.
 */
export function SwitchThumb({
  checked = false,
  size = 'default',
  disabled = false,
}: SwitchThumbProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // Both sizes use card fill and a full radius; the thumb is decorative.
        'pointer-events-none block rounded-full bg-card shadow-sm',
        MOTION.transform,
        size === 'small' ? 'size-3.5' : 'size-4',
        checked ? (size === 'small' ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0',
        disabled && OPACITY_THUMB_DISABLED,
      )}
    />
  );
}

export interface SwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function Switch({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  description,
}: SwitchProps) {
  const id = useId();
  const descId = `${id}-desc`;

  return (
    // gap is `space/2-5` (10px) in the file, not `space/3` (12px).
    <div className="flex items-start gap-2.5">
      <button
        id={`${id}-control`}
        type="button"
        // role="switch" with aria-checked. NOT a checkbox: a switch takes effect
        // immediately, a checkbox applies on save.
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        onKeyDown={(e) => {
          // Space toggles; Enter does NOT. That is the switch convention and it
          // differs from Toggle, which is a button and takes both.
          if (e.key === 'Enter') e.preventDefault();
        }}
        className={cn(
          // Default track geometry matches SwitchRoot; this control has one size.
          'mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent',
          // Focus binds a 2px `ring` stroke on Switch / Root, not 1px.
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          MOTION.colors,
          // The labelled Switch uses a muted disabled track. Visual SwitchRoot
          // keeps its checked/unchecked fill and applies state opacity instead.
          disabled ? 'bg-muted' : checked ? 'bg-primary' : 'bg-input',
          disabled && 'cursor-not-allowed',
        )}
      >
        <SwitchThumb checked={checked} disabled={disabled} />
      </button>

      <label htmlFor={`${id}-control`} className="flex cursor-pointer flex-col gap-0.5">
        <span
          id={id}
          // Label/LG in the file (14/20 medium), not Body/MD (14/20 regular).
          className={cn('text-label-lg', disabled ? 'text-muted-foreground' : 'text-foreground')}
        >
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

/* ─────────────────────────── Switch / Root ─────────────────────────── */

export interface SwitchRootProps {
  checked: boolean;
  size?: 'small' | 'default';
  /** Visual preview state only; does not implement interaction or semantics. */
  state?: 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
  children?: React.ReactNode;
}

/**
 * Visual track: input unchecked, primary checked; hover changes the fill.
 * Focus adds ring, invalid adds a destructive border. Disabled uses opacity/50,
 * readOnly opacity/80. Compose with SwitchThumb for anatomy previews.
 */
export function SwitchRoot({
  checked,
  size = 'default',
  state = 'default',
  children,
}: SwitchRootProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
        size === 'small' ? 'h-[calc(var(--spacing)*4.5)] w-[calc(var(--spacing)*7.5)]' : 'h-5 w-9',
        checked
          ? state === 'hover'
            ? 'bg-primary-hover'
            : 'bg-primary'
          : state === 'hover'
            ? 'bg-accent-hover'
            : 'bg-input',
        state === 'focused' && 'ring-2 ring-ring',
        state === 'invalid' && 'border-destructive',
        // Read-only remains more visible than disabled.
        state === 'disabled' && OPACITY_DISABLED,
        state === 'readOnly' && OPACITY_READONLY,
      )}
    >
      {children}
    </span>
  );
}
