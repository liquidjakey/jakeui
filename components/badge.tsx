import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Badge — short status, count or category label.
 *
 * Figma: `Badge`, node 111:32, 10 variants.
 * Contract: docs/components/badge.md
 *
 * UNBLOCKED TWICE on 9 Aug 2026. It was wrongly flagged as carrying pre-rebind
 * stale tokens — a regex error, since `text warning\b` matched
 * `text warning-foreground`. And its cap gap proved recoverable: 8 of 10 rows are
 * present and the two missing are BOTH Destructive, against four tones that share
 * one consistent shape (fill <tone> + text <tone>-foreground). Pattern-completion
 * across four observations, not invention.
 *
 * ⚠️ SUCCESS BINDS `text info-foreground`, NOT `success-foreground`. Every other
 * tone pairs with its own foreground; Success reaches across to Info's, and
 * success-foreground exists. Both resolve to the same value today so nothing is
 * visibly wrong — which is exactly the condition that made a planned contrast fix a
 * no-op once before. Transcribed as recorded (unlike Card and Navigation Menu,
 * where following the record produced INVISIBLE text; here it does not) and
 * flagged. Figma owes a rebind.
 *
 * Badge is also what makes info-foreground legitimate: on a SOLID info fill it is
 * the correct pairing, which is what identified Card's use of it on a card fill as
 * the anomaly rather than the token being bad.
 */
export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
  size?: 'small' | 'medium';
}

const TONE = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-info text-info-foreground',
  // Transcribed as recorded — see the block above.
  success: 'bg-success text-info-foreground',
  warning: 'bg-warning text-warning-foreground',
  // Pattern-completed from the four recorded tones.
  destructive: 'bg-destructive text-destructive-foreground',
} as const;

export function Badge({ children, tone = 'neutral', size = 'small' }: BadgeProps) {
  return (
    // A span, not a button. A badge that can be clicked or removed is a chip and
    // needs its own control.
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-medium',
        // Size contributes only a type-size step; no padding token, so raw.
        size === 'medium' ? 'text-body-xs' : 'text-caption-xs',
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
