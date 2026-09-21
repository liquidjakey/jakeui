import type { ReactNode } from 'react';
import { X, Info, CheckCircle, Warning, WarningOctagon } from '@phosphor-icons/react';
import { cn } from '../lib/cn.js';

/**
 * Inline feedback with tone-specific muted surfaces and readable foregrounds.
 * Severity is communicated by icon and text, not colour alone.
 * Consumer contract: docs/agent/components/alert.md.
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
    text: 'text-warning-muted-foreground',
    icon: 'bg-warning',
    Glyph: Warning,
  },
  destructive: {
    surface: 'bg-destructive-muted border-destructive',
    text: 'text-destructive-readable',
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
      // Assertive interrupts; polite announces updates; off is static feedback.
      role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined}
      className={cn('flex gap-3 rounded-lg border p-4', t.surface, t.text)}
    >
      {/* The tone-filled icon circle is decorative; the message supplies meaning. */}
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
