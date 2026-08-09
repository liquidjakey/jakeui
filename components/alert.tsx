import type { ReactNode } from 'react';
import { X, Info, CheckCircle, Warning, WarningOctagon } from '@phosphor-icons/react';
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
 * ⚠️ DESTRUCTIVE DOES HAVE A SURFACE FILL, AND IT IS UNTOKENISED. Re-read on
 * 9 Aug 2026: the variant carries a solid #fdeae9 with no bound variable. An
 * earlier note here said "live bindings show no surface fill at all", which was
 * wrong. It is left unfilled in code rather than hardcoded, because the archetype's
 * first do is "reference variables for every value; never hardcode a hex". Figma
 * needs a `destructive-muted` token — it is the only tone missing one, and until
 * it exists this variant cannot match the file without breaking that rule.
 *
 * Type comes from the live bindings: Title = Label/LG (14/20 medium),
 * Description = Body/SM (13/18). Both were previously rendering at Body/MD
 * (14/20) with the title bumped to semibold, so neither matched.
 *
 * The icon is a 24x24 circle filled with the tone colour carrying a `card` glyph,
 * not a bare tinted character.
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
  info: { surface: 'bg-info-muted border-info', text: 'text-info', icon: 'bg-info', Glyph: Info },
  success: {
    surface: 'bg-success-muted border-success',
    text: 'text-success-muted-foreground',
    icon: 'bg-success',
    Glyph: CheckCircle,
  },
  warning: {
    surface: 'bg-warning-muted border-warning',
    // Applied to BOTH title and description — see the half-rebind note above.
    text: 'text-warning-muted-foreground',
    icon: 'bg-warning',
    Glyph: Warning,
  },
  destructive: {
    // Figma carries an untokenised #fdeae9 here. Left unfilled until a
    // `destructive-muted` token exists — see the header note.
    surface: 'border-destructive',
    text: 'text-destructive',
    icon: 'bg-destructive',
    Glyph: WarningOctagon,
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
      className={cn('flex gap-3 rounded-lg border p-4', t.surface, t.text)}
    >
      {/*
        Severity is never colour alone — the icon and the text carry it too.

        A 24x24 circle filled with the tone colour, glyph in `card`, transcribed
        from the live binding (Icon frame: fill <tone>, cornerRadius 12, 24x24).
        It previously rendered as a bare character tinted with the tone colour,
        which is a different shape entirely.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full text-card',
          t.icon,
        )}
      >
        {icon ?? <t.Glyph size={14} weight="fill" />}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-label-lg">{title}</p>
        {description ? <p className="text-body-sm">{description}</p> : null}
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
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
