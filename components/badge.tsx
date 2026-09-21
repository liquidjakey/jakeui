import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Noninteractive status, count or category label. Use a control for actions.
 * Consumer contract: docs/agent/components/badge.md.
 */
export interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
  size?: 'small' | 'medium';
}

/**
 * Solid semantic fills use their matching foregrounds.
 * Destructive deliberately uses card text; preserve this component-specific pair.
 */
const TONE = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-card',
} as const;

/** Small uses Label/XS; medium uses Label/SM with size-specific token spacing. */
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
