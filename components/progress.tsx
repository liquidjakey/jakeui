import { cn } from '../lib/cn.js';

/**
 * Linear progress with a muted track and primary fill. Omitting value means
 * indeterminate; value=0 means known zero progress. Supply an accessible label.
 * Consumer contract: docs/agent/components/progress.md.
 */
export interface ProgressProps {
  /** Finite value from 0 to max. Omit for indeterminate progress; 0 is determinate. */
  value?: number;
  /** Required: an unnamed progress bar announces a number with no subject. */
  label: string;
  /** Positive finite upper bound for determinate progress. */
  max?: number;
}

export function Progress({ value, label, max = 100 }: ProgressProps) {
  const determinate = typeof value === 'number';
  const pct = determinate ? Math.max(0, Math.min(100, (value / max) * 100)) : undefined;

  return (
    <div
      role="progressbar"
      aria-label={label}
      // Indeterminate OMITS aria-valuenow — that omission is precisely what tells
      // assistive technology the value is unknown, which is why `value` is optional
      // rather than defaulted to 0.
      aria-valuenow={determinate ? value : undefined}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? max : undefined}
      className="h-3 w-full overflow-hidden rounded-lg bg-muted"
    >
      <div
        className={cn(
          'h-full bg-primary',
          determinate
            ? 'motion-safe:transition-[width]'
            : 'w-1/3 motion-safe:animate-pulse',
        )}
        style={determinate ? { width: `${pct}%` } : undefined}
      />
    </div>
  );
}
