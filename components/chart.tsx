import type { ReactNode } from 'react';

/**
 * Titled chart container, not a data renderer. Caller supplies the visualization,
 * accessible takeaway and series mapping using approved chart token roles.
 * Type is exposed as data-chart-type; it does not select a renderer.
 * Consumer contract: docs/agent/components/chart.md.
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
