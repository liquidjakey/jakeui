import { cn } from '../lib/cn.js';

/**
 * Progress — linear progress primitive.
 *
 * Figma: `Progress`, 2 variants.
 * Contract: docs/components/progress.md
 *
 * 🛑 tokensUsed is `muted` and `radius/lg` — two entries, and BOTH belong to the
 * track. The filled portion, the only part that conveys progress, has no colour.
 * Asserted as `primary`, on the same precedent as Switch's track: Radio Group /
 * Indicator binds `fill primary` for its checked state.
 *
 * `Type` deliberately did NOT become an enum. A determinate bar with no value is
 * meaningless and an indeterminate one with a value contradicts itself; an enum
 * lets both be expressed. Deriving the type from `value`'s presence makes the
 * invalid pair unrepresentable — the same move as Card's `media` slot.
 */
export interface ProgressProps {
  /** 0–100. Omitting it is what makes the bar indeterminate. */
  value?: number;
  /** Required: an unnamed progress bar announces a number with no subject. */
  label: string;
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
      // radius/lg on a thin bar reads as nearly square; radius/full would be the
      // usual choice. Transcribed as recorded.
      className="h-2 w-full overflow-hidden rounded-lg bg-muted"
    >
      <div
        className={cn(
          // 🛑 ASSERTED — no fill is recorded for the filled portion.
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
