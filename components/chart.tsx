import type { ReactNode } from 'react';

/**
 * Chart — a token-bound CONTAINER, not a chart.
 *
 * Figma: `Chart`, node 67:0, 2 variants.
 * Contract: docs/components/chart.md
 *
 * 🛑 tokensUsed is border / card / foreground / radius-lg / size-16 — five tokens,
 * and EVERY ONE belongs to the container. No series colour, no axis, no gridline,
 * no legend. The record's own name for itself is honest: "Token-bound chart
 * CONTAINER for compact documentation and dashboard examples."
 *
 * So this is exactly that: a titled, token-bound frame that a chart renders into.
 * No data props, no series colours and no rendering are provided, because supplying
 * them would mean inventing a categorical palette — a substantial design system
 * decision, not one to make by implication.
 *
 * `type` carries no token delta and no rendering. It is passed through as a data
 * attribute so a consuming chart can read it, rather than silently dropped.
 */
export interface ChartProps {
  title: string;
  children: ReactNode;
  type?: 'bar' | 'line';
  /**
   * Text alternative. A chart must state its TAKEAWAY, not its chart type —
   * "Revenue rose 12% in Q3", not "bar chart".
   */
  description?: string;
}

export function Chart({ title, children, type = 'bar', description }: ChartProps) {
  return (
    <figure
      data-chart-type={type}
      // padding `space/5` (20px), not `space/4` (16px).
      className="rounded-lg border border-border bg-card p-5 text-foreground"
    >
      {/* Title binds Heading/MD (16/24) in the file, not Heading/SM (15/22). */}
      <figcaption className="text-heading-md">{title}</figcaption>
      {description ? (
        <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3" role="img" aria-label={description ?? title}>
        {children}
      </div>
    </figure>
  );
}
