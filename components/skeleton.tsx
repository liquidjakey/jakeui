import { cn } from '../lib/cn.js';

/**
 * Loading placeholder with its own status region; decorative shapes are hidden.
 * Use one meaningful loading announcement per loading region.
 * Consumer contract: docs/agent/components/skeleton.md.
 */
export interface SkeletonProps {
  type?: 'text' | 'avatar' | 'card' | 'tableRow';
  /** Text for this component's status region; shapes are hidden from assistive technology. */
  label?: string;
}

const bar = 'rounded bg-muted';

export function Skeleton({ type = 'text', label = 'Loading' }: SkeletonProps) {
  return (
    // The wrapper announces loading; individual placeholder shapes are decorative.
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
