import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

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
        // 14x14 small, 16x16 default, fill `card` in EVERY state — read from the
        // `Switch / Thumb` set, which is what figma.map.json binds this export to.
        //
        // ⚠️ FIGMA CONTRADICTS ITSELF HERE. The composed `Switch` set draws an
        // 18x18 thumb filled `primary-foreground` when checked, on a 40x22 track.
        // The atomic `Switch / Root` + `Switch / Thumb` sets draw 36x20 with a
        // 16x16 `card` thumb. Both are internally coherent (2px inset) and they
        // disagree with each other. The atoms win here because they are what the
        // map binds for SwitchThumb and SwitchRoot. Logged in the findings doc.
        'pointer-events-none block rounded-full bg-card shadow-sm',
        MOTION.transform,
        size === 'small' ? 'size-3.5' : 'size-4',
        checked ? (size === 'small' ? 'translate-x-3.5' : 'translate-x-4') : 'translate-x-0.5',
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
          // 36x20 — `Switch / Root` at Size=Default. (Small is 32x18.)
          'mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full',
          // Focus binds a 2px `ring` stroke on Switch / Root, not 1px.
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          MOTION.colors,
          // Confirmed against Switch / Root: `input` unchecked, `primary` checked.
          // Disabled binds `input` there — identical to Default, the documented
          // "disabled is invisible" defect. `muted` is taken from the composed
          // `Switch` set instead, which is the only place the file distinguishes
          // a disabled track at all.
          disabled ? 'bg-muted' : checked ? 'bg-primary' : 'bg-input',
          disabled && 'cursor-not-allowed',
        )}
      >
        <SwitchThumb checked={checked} />
      </button>

      <span className="flex flex-col gap-0.5">
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
        state === 'focused' && 'ring-2 ring-ring',
        state === 'invalid' && 'border-destructive',
        (state === 'disabled' || state === 'readOnly') && 'opacity-50',
      )}
    >
      {children}
    </span>
  );
}
