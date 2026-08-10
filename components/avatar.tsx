import { cn } from '../lib/cn.js';

/**
 * Avatar — identity representation using initials, image and presence.
 *
 * Figma: `Avatar`, node 111:25, 6 variants.
 * Contract: docs/components/avatar.md
 *
 * Unblocked 9 Aug 2026 by a CORRECTION, not new information: it had been flagged as
 * carrying pre-rebind stale tokens, but the detection regex matched
 * `text primary-foreground` while looking for `text primary`. See handoff §5.
 *
 * This record pairs its fill and text CORRECTLY (primary + primary-foreground) —
 * worth noting, because Navigation Menu binds that same primary-foreground on a
 * `card` fill where it is invisible. The token is right; that usage is wrong.
 *
 * Size is one of the few places a dimension is genuinely tokenised: radius/16,
 * radius/24, radius/32 are real variables rather than raw values.
 */
export interface AvatarProps {
  initials: string;
  /** The accessible name. "AL" read aloud is meaningless. */
  name: string;
  size?: 'small' | 'medium' | 'large';
  status?: 'online' | 'offline' | 'busy';
  src?: string;
  /** True when a visible name sits beside it — avoids announcing it twice. */
  decorative?: boolean;
}

/**
 * Diameters read from the file: 32 / 48 / 64, with radius/16, radius/24 and
 * radius/32 — exactly half of each, so every size is a true circle. Medium was
 * 40px and large was 56px, both a full step small.
 *
 * ⚠️ PARTLY RESOLVED (10 Aug 2026). The Initials text was unbound on all three
 * sizes — 11/14, 14/18 and 18/22, all Semi Bold, none of those line-heights in
 * the ramp. Under the Option B decision, medium and large are now bound in Figma
 * to `Heading/XS` 14/20 and `Heading/LG` 18/26, matching what this code uses.
 *
 * **Small is still unbound, and cannot be bound: the ramp has no 11px semibold
 * step.** `Label/XS` is 11/16 MEDIUM, so `small` below composes it with
 * `font-semibold` to reach the weight the file draws. That is why Avatar is one
 * of the three entries in scripts/computed-type-exceptions.json — the computed
 * 11/16/600 is off-ramp on purpose. Adding an 11px semibold step, or moving the
 * small initials to medium weight, is the open decision.
 */
const SIZE = {
  small: 'size-8 text-label-xs font-semibold rounded-[calc(var(--radius-16))]',
  medium: 'size-12 text-heading-xs rounded-[calc(var(--radius-24))]',
  large: 'size-16 text-heading-lg rounded-[calc(var(--radius-32))]',
} as const;

/** Status dot is 8px on small and 10px on medium and large. */
const STATUS_SIZE = {
  small: 'size-2',
  medium: 'size-2.5',
  large: 'size-2.5',
} as const;

// No presence colour is recorded — tokensUsed is eight entries and none is a status
// colour. Asserted from the semantic families; Figma owes presence bindings.
const STATUS = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
} as const;

export function Avatar({
  initials,
  name,
  size = 'medium',
  status,
  src,
  decorative = false,
}: AvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : name}
        aria-hidden={decorative || undefined}
        className={cn(
          'inline-flex items-center justify-center overflow-hidden',
          // The Initials are Semi Bold in the file; this was font-medium.
          'bg-primary text-primary-foreground',
          SIZE[size],
        )}
      >
        {src ? (
          // Fallback chain: image -> initials. alt="" because the wrapper already
          // carries the accessible name.
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </span>
      {status ? (
        <>
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-card',
              STATUS_SIZE[size],
              STATUS[status],
            )}
          />
          {/* Never colour alone: the state is announced as text. */}
          <span className="sr-only">{status}</span>
        </>
      ) : null}
    </span>
  );
}
