import { useId } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { OPACITY_DISABLED, OPACITY_READONLY, OPACITY_THUMB_DISABLED } from '../lib/opacity.js';

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
 * ⚠️ THE RECORD WAS WRONG ABOUT DISABLED, corrected 10 Aug 2026. It said "Size
 * follows the Root size; disabled styling is inherited from the Root state," so
 * no disabled delta was applied here. A live read of the OPACITY axis — the one
 * the description format does not carry — shows `Switch / Thumb` State=Disabled
 * has a delta of its own: it dims to 75%, on both sizes.
 *
 * That value was a raw 0.75 with nothing to bind to, so `opacity/75` was added to
 * the Interaction collection and bound on both variants. It now flows through
 * `npm run tokens:sync` as `--opacity-75` like any other token.
 *
 * The two dimmings COMPOUND, exactly as they do in the file: the thumb sits
 * inside the track, so a disabled switch renders the track at opacity/50 and the
 * thumb at a further 75% of that.
 *
 * radius/full is the correct token for a circle — no raw 9999px.
 */
export function SwitchThumb({ checked = false, size = 'default', disabled = false }: SwitchThumbProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // 14x14 small, 16x16 default, fill `card` in EVERY state — read from the
        // `Switch / Thumb` set, which is what figma.map.json binds this export to.
        //
        // ✅ THE FIGMA CONTRADICTION IS RESOLVED (10 Aug 2026). The composed
        // `Switch` set used to draw an 18x18 `primary-foreground` thumb on a 40x22
        // track, while the atomic `Switch / Root` + `Switch / Thumb` sets drew
        // 36x20 with a 16x16 `card` thumb. Both were internally coherent and they
        // disagreed with each other. The atoms won — they are what the map binds
        // these exports to — and the composed set has been rebuilt onto them:
        // 36x20 track, 16x16 thumb, `card` fill in every state, 2px inset. This
        // code was already correct and did not change.
        'pointer-events-none block rounded-full bg-card shadow-sm',
        MOTION.transform,
        size === 'small' ? 'size-3.5' : 'size-4',
        checked ? (size === 'small' ? 'translate-x-3.5' : 'translate-x-4') : 'translate-x-0.5',
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
          // Its disabled variant keeps those colours and dims with opacity/50
          // instead. `muted` is taken from the composed `Switch` set, which is the
          // only place the file recolours a disabled track — a divergence between
          // the two sets that is recorded in the findings doc and left as-is.
          disabled ? 'bg-muted' : checked ? 'bg-primary' : 'bg-input',
          disabled && 'cursor-not-allowed',
        )}
      >
        <SwitchThumb checked={checked} disabled={disabled} />
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
 * ✅ CORRECTED 10 Aug 2026. This used to say Disabled and ReadOnly bind exactly
 * the same tokens as Default and were therefore indistinguishable. The COLOUR
 * tokens are indeed identical — but the file separates the states with an
 * OPACITY binding that the original read never looked at:
 *
 *   Disabled  opacity/50      ReadOnly  opacity/80      Default  none
 *
 * on all eight size×value combinations. So the states are distinguishable, and
 * the two dimmings are NOT the same value — which is the bug this component had
 * until now, collapsing both into one `opacity-50` branch.
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
        // Disabled and read-only are NOT the same dimming. The file binds
        // opacity/50 for Disabled and opacity/80 for ReadOnly; these shared one
        // branch at opacity-50 until 10 Aug 2026, so read-only rendered too faint.
        state === 'disabled' && OPACITY_DISABLED,
        state === 'readOnly' && OPACITY_READONLY,
      )}
    >
      {children}
    </span>
  );
}
