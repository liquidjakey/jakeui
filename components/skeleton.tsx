import { cn } from '../lib/cn.js';

/**
 * Skeleton — loading placeholder.
 *
 * Figma: `Skeleton`, 4 variants.
 * Contract: docs/components/skeleton.md
 *
 * Another "no root-level bindings" record — every shape's fill lives on a child. Read
 * from live bindings: EVERY shape in EVERY variant binds `muted`, and the four types
 * differ only in which shapes are present:
 *
 *   text      3 lines
 *   avatar    circle + 2 lines
 *   card      media block, title, 2 description lines, meta, action
 *   tableRow  5 cells
 */
export interface SkeletonProps {
  type?: 'text' | 'avatar' | 'card' | 'tableRow';
  /** Announced once by the caller; the shapes themselves are hidden. */
  label?: string;
}

const bar = 'rounded bg-muted';

export function Skeleton({ type = 'text', label = 'Loading' }: SkeletonProps) {
  return (
    // Hidden from assistive technology: the loading state is announced ONCE by the
    // caller's live region, not by every placeholder shape.
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className="motion-safe:animate-pulse"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        {type === 'text' ? (
          <div className="flex flex-col gap-2">
            <div className={cn(bar, 'h-3 w-full')} />
            <div className={cn(bar, 'h-3 w-full')} />
            <div className={cn(bar, 'h-3 w-2/3')} />
          </div>
        ) : null}

        {type === 'avatar' ? (
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-full bg-muted')} />
            <div className="flex flex-1 flex-col gap-2">
              <div className={cn(bar, 'h-3 w-1/2')} />
              <div className={cn(bar, 'h-3 w-1/3')} />
            </div>
          </div>
        ) : null}

        {type === 'card' ? (
          <div className="flex flex-col gap-3">
            <div className={cn(bar, 'h-24 w-full')} />
            <div className={cn(bar, 'h-4 w-2/3')} />
            <div className={cn(bar, 'h-3 w-full')} />
            <div className={cn(bar, 'h-3 w-5/6')} />
            <div className="flex items-center justify-between">
              <div className={cn(bar, 'h-3 w-1/4')} />
              <div className={cn(bar, 'h-8 w-20')} />
            </div>
          </div>
        ) : null}

        {type === 'tableRow' ? (
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn(bar, 'h-3 flex-1')} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
