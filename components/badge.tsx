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
 * ⚠️ RESOLVED 9 Aug 2026 by reading the live bindings. This block previously
 * recorded that Success bound `info-foreground` rather than `success-foreground`,
 * transcribed from the doc record and flagged as "Figma owes a rebind". The file
 * binds `success-foreground`. The record was stale, not the design — and the two
 * do NOT resolve to the same value, so the transcription was rendering near-white
 * text where Figma shows near-black. Both tones are corrected below.
 *
 * Badge is still what makes info-foreground legitimate: on a SOLID info fill it is
 * the correct pairing, which is what identified Card's use of it on a card fill as
 * the anomaly rather than the token being bad.
 */
export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
  size?: 'small' | 'medium';
}

/**
 * Read from the live bindings on 9 Aug 2026, which corrected TWO tones that had
 * been transcribed from the lossy doc record:
 *
 *   success     record said `info-foreground`; the file binds `success-foreground`.
 *               Not cosmetic — info-foreground is neutral/50 (#fafafa) and
 *               success-foreground is green/950 (#052e16). Near-white vs near-black.
 *   destructive was pattern-completed as `destructive-foreground`; the file binds
 *               `card`. They differ in both modes (#fafafa vs #ffffff light,
 *               #0a0a0a vs #171717 dark).
 */
const TONE = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-card',
} as const;

/**
 * Padding is fully tokenised in the file; it was raw `px-2 py-0.5` for both sizes.
 *   small  space/2   x, space/0-75 y   (8 / 3)
 *   medium space/2-5 x, space/1-25 y   (10 / 5)
 *
 * Type: medium binds Label/SM. Small is UNBOUND in Figma at 11px Inter Medium
 * with a 14px line-height — a metric the ramp does not contain (Label/XS is
 * 11/16). Label/XS is used here so the badge stays on the type system; the Figma
 * node needs the style applied. See the Figma fix list in the session notes.
 */
const SIZE = {
  small: 'px-2 py-[calc(var(--spacing)*0.75)] text-label-xs',
  medium: 'px-2.5 py-[calc(var(--spacing)*1.25)] text-label-sm',
} as const;

export function Badge({ children, tone = 'neutral', size = 'small' }: BadgeProps) {
  return (
    // A span, not a button. A badge that can be clicked or removed is a chip and
    // needs its own control.
    <span className={cn('inline-flex items-center gap-1 rounded-lg', SIZE[size], TONE[tone])}>
      {children}
    </span>
  );
}
