import { cloneElement, useId, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * HoverCard — contextual preview revealed on hover or focus.
 *
 * Figma: `Hover Card`, node 69:*, 2 variants.
 * Contract: docs/components/hover-card.md
 *
 * THE RISK WITH THIS PATTERN, stated by the record itself: "Reachable on keyboard
 * focus, or its content must exist elsewhere." Hover alone excludes keyboard and
 * touch users entirely, so this opens on focus as well and nothing inside may be
 * the only copy of anything.
 *
 * `closeDelay` exists so the pointer can travel from the trigger into the card
 * without it vanishing. A hover surface that closes the instant the pointer leaves
 * the trigger is unusable if it contains anything at all.
 *
 * Density is not just spacing here. The record: "use compact density for brief
 * descriptions and detailed density when supporting metadata is needed." So
 * `density` sets spacing and `meta` is the content it makes room for; passing
 * `meta` without `detailed` renders nothing.
 */
export interface HoverCardProps {
  title: string;
  description?: string;
  children: ReactElement;
  meta?: ReactNode;
  density?: 'compact' | 'detailed';
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  title,
  description,
  children,
  meta,
  density = 'compact',
  openDelay = 500,
  closeDelay = 200,
}: HoverCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = (next: boolean, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), ms);
  };

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: () => schedule(true, openDelay),
    onMouseLeave: () => schedule(false, closeDelay),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      // The record: "Escape dismisses it."
      if (e.key === 'Escape') setOpen(false);
    },
  });

  return (
    <span className="relative inline-block">
      {trigger}
      {open ? (
        <div
          id={id}
          onMouseEnter={() => schedule(true, 0)}
          onMouseLeave={() => schedule(false, closeDelay)}
          className={cn(
            'absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2',
            'rounded-lg border border-border bg-popover text-body-sm text-popover-foreground shadow-md',
            MOTION.overlay,
            // No spacing token is recorded for Density, so this is raw.
            // Both densities bind padding `space/4` (16px) in the file; this
            // was p-4 / p-3. Density changes what is IN the card, not its box.
            'p-4',
          )}
        >
          <p className="font-semibold">{title}</p>
          {description ? (
            <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
          ) : null}
          {/* meta only appears at detailed density — the variant means "has more in it". */}
          {/* Metadata binds Label/SM (12/16) with popover-foreground. */}
          {meta && density === 'detailed' ? (
            <div className="mt-2 text-label-sm text-popover-foreground">{meta}</div>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
