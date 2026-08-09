import { useId } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Switch — labelled switch.
 *
 * Figma: `Switch` (81:*) and `Switch / Thumb`.
 * Contracts: docs/components/switch.md · switch-thumb.md
 *
 * 🛑 THIS ASSET RECORDS THE LABEL, NOT THE SWITCH. Switch.doc.json's entire
 * tokensUsed is foreground / muted-foreground / size/14 — three text tokens and
 * nothing else. No track fill, no checked colour, no border. Switch / Thumb gives
 * the thumb (card + radius/full), and SWITCH / ROOT, WHICH HOLDS THE TRACK, IS
 * BLOCKED by the 8-row cap (24 variants).
 *
 * The track is ASSERTED on the strongest precedent available: Radio Group /
 * Indicator binds `fill primary` for its checked indicator, so primary is this
 * system's checked-state colour. Unchecked uses `input`, the resting border token
 * every other form control here binds.
 *
 * This is the largest assertion in this build. Re-verify when Switch / Root reads.
 *
 * Switch / Field Composition is NOT bound to code: its Pattern axis is
 * kind: story-only. Its seven patterns ship as stories.
 */

export interface SwitchThumbProps {
  checked?: boolean;
  size?: 'small' | 'default';
  disabled?: boolean;
}

/**
 * The record: "Size follows the Root size; disabled styling is inherited from the
 * Root state." So this asset records no size or disabled deltas of its own and none
 * are applied. radius/full is the correct token for a circle — no raw 9999px.
 */
export function SwitchThumb({ checked = false, size = 'default' }: SwitchThumbProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none block rounded-full bg-card shadow-sm',
        'motion-safe:transition-transform',
        size === 'small' ? 'h-3 w-3' : 'h-4 w-4',
        checked ? (size === 'small' ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0.5',
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
    <div className="flex items-start gap-3">
      <button
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
          'mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'motion-safe:transition-colors',
          // 🛑 ASSERTED — see the block above. No track token exists on any
          // readable asset; Switch / Root holds it and is blocked.
          checked ? 'bg-primary' : 'bg-input',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <SwitchThumb checked={checked} />
      </button>

      <span className="flex flex-col gap-0.5">
        <span
          id={id}
          className={cn('text-body-md', disabled ? 'text-muted-foreground' : 'text-foreground')}
        >
          {label}
        </span>
        {description ? (
          <span id={descId} className="text-body-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );
}

/* ─────────────────────────── Switch / Root ─────────────────────────── */

export interface SwitchRootProps {
  checked: boolean;
  size?: 'small' | 'default';
  /** Figma State: only Focused and Invalid carry a visual. */
  state?: 'default' | 'hover' | 'focused' | 'disabled' | 'readOnly' | 'invalid';
  children?: React.ReactNode;
}

/**
 * The track. Read from LIVE BINDINGS — its description was capped at 8 of 24 rows.
 *
 *   unchecked   input | hover accent-hover | focused +ring | invalid +destructive
 *   checked     primary | hover primary-hover | focused +ring | invalid +destructive
 *
 * ⚠️ THE ASSERTION MADE IN switch.tsx WAS CORRECT — input unchecked, primary
 * checked. It is now confirmed rather than assumed.
 *
 * ⚠️ Disabled and ReadOnly bind EXACTLY the same tokens as Default. A disabled
 * switch is visually indistinguishable from an operable one, which is a real
 * accessibility problem: only opacity (applied in Switch) separates them.
 */
export function SwitchRoot({ checked, size = 'default', state = 'default', children }: SwitchRootProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
        size === 'small' ? 'h-4 w-7' : 'h-5 w-9',
        checked
          ? state === 'hover'
            ? 'bg-primary-hover'
            : 'bg-primary'
          : state === 'hover'
            ? 'bg-accent-hover'
            : 'bg-input',
        state === 'focused' && 'ring-1 ring-ring',
        state === 'invalid' && 'border-destructive',
        (state === 'disabled' || state === 'readOnly') && 'opacity-50',
      )}
    >
      {children}
    </span>
  );
}
