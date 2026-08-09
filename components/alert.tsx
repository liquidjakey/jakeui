import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Alert — inline feedback message.
 *
 * Figma: `Alert`, node 103:475, 4 variants.
 * Contract: docs/components/alert.md
 *
 * BUILT FROM LIVE BINDINGS, NOT FROM THE RECORD. The doc record was captured before
 * the rebind phase regenerated nothing, so it still reads `text success` and
 * `text warning`. The live bindings are current, and they settle it:
 *
 *   info         info-muted + info stroke; title AND description = info
 *   success      success-muted + success stroke; title AND description
 *                = success-muted-foreground
 *   warning      warning-muted + warning stroke; title = warning-muted-foreground
 *                but DESCRIPTION = warning  <- half-rebound, see below
 *   destructive  NO surface fill bound, destructive stroke; title and description
 *                = destructive
 *
 * ⚠️ WARNING IS HALF-REBOUND IN FIGMA. Its title moved to warning-muted-foreground
 * but its description did not — one of the two 3.07:1 nodes was fixed and the other
 * was missed. Code applies warning-muted-foreground to BOTH, because shipping a
 * known 3.07:1 failure to match a half-finished rebind would be transcribing a bug.
 * Recorded in the props table and in .figma-blocked-variants.json.
 *
 * Info was deliberately NOT rebound — it already passed at 4.82/4.88.
 *
 * The `fill card` the description reported for Destructive was an UNBOUND literal:
 * live bindings show no surface fill at all on that variant. That is also why
 * destructive is the least distinct tone — destructive-muted does not exist.
 */
export interface AlertProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'destructive';
  onDismiss?: () => void;
  /** Defaults to off: an alert on page load must not interrupt. */
  live?: 'off' | 'polite' | 'assertive';
}

const TONE = {
  info: { surface: 'bg-info-muted border-info', text: 'text-info', icon: 'text-info' },
  success: {
    surface: 'bg-success-muted border-success',
    text: 'text-success-muted-foreground',
    icon: 'text-success',
  },
  warning: {
    surface: 'bg-warning-muted border-warning',
    // Applied to BOTH title and description — see the half-rebind note above.
    text: 'text-warning-muted-foreground',
    icon: 'text-warning',
  },
  destructive: {
    // No surface fill is bound in Figma; destructive-muted does not exist, which is
    // why the most severe tone is the least visually distinct.
    surface: 'border-destructive',
    text: 'text-destructive',
    icon: 'text-destructive',
  },
} as const;

export function Alert({
  title,
  description,
  icon,
  action,
  tone = 'info',
  onDismiss,
  live = 'off',
}: AlertProps) {
  const t = TONE[tone];
  return (
    <div
      // role="alert" ONLY when explicitly assertive. The record: "Only an urgent,
      // interrupting message should use role=alert; a static one uses role=status or
      // no live region at all."
      role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined}
      className={cn('flex gap-3 rounded-lg border p-4 text-body-md', t.surface, t.text)}
    >
      {/* Severity is never colour alone — the icon and the text carry it too. */}
      <span aria-hidden="true" className={cn('shrink-0', t.icon)}>
        {icon ?? '!'}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {description ? <p>{description}</p> : null}
        {action ? <div className="mt-1">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          // Names the thing being dismissed, not a bare "Close".
          aria-label={`Dismiss ${title}`}
          onClick={onDismiss}
          className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}
