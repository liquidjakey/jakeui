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

const SIZE = {
  small: 'h-8 w-8 text-body-xs rounded-[calc(var(--radius-16))]',
  medium: 'h-10 w-10 text-body-md rounded-[calc(var(--radius-24))]',
  large: 'h-14 w-14 text-heading-md rounded-[calc(var(--radius-32))]',
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
          'bg-primary font-medium text-primary-foreground',
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
              'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-card',
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
