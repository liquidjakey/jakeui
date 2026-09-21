import { cn } from '../lib/cn.js';
import { useState } from 'react';

/**
 * Identity image with initials fallback and optional presence.
 * Supply a meaningful name; use decorative when adjacent text already names it.
 * Consumer contract: docs/agent/components/avatar.md.
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
 * Small initials use the approved 11/16/600 typography exception.
 * Scope and retirement criteria: agent/exceptions.json; exact computed checks:
 * scripts/computed-type-exceptions.json. Medium and large use heading tokens.
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

// Semantic presence colours are supplemented by status text below.
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
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span className="relative inline-flex shrink-0">
      <span
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : name}
        aria-hidden={decorative || undefined}
        className={cn(
          'inline-flex items-center justify-center overflow-hidden',
          'bg-primary text-primary-foreground',
          SIZE[size],
        )}
      >
        {src && src !== failedSrc ? (
          // Fallback chain: image -> initials. alt="" because the wrapper already
          // carries the accessible name.
          <img
            src={src}
            alt=""
            onError={() => setFailedSrc(src)}
            className="h-full w-full object-cover"
          />
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
