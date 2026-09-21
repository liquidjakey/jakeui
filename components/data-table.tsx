import type { ReactNode } from 'react';
import { Children, isValidElement, Fragment } from 'react';

/**
 * DataTable — data-management composition.
 *
 * Figma: `Data Table`, node 136:0, 4 variants.
 * Contract: docs/agent/components/data-table.md
 *
 * Caller owns data operations and composes Input, Button, Table and Pagination.
 * All four are implemented. Slots allow application-specific controls.
 * Set `empty` explicitly for opaque children such as <Table>; React children
 * cannot reveal the row count inside another component. Loading and error are
 * explicit runtime loading, error and empty states.
 */
export interface DataTableProps {
  title: string;
  children?: ReactNode;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  emptyMessage?: string;
  empty?: boolean;
  loading?: boolean;
  error?: ReactNode;
}

function hasContent(node: ReactNode): boolean {
  return Children.toArray(node).some((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? hasContent(child.props.children)
      : true,
  );
}

export function DataTable({
  title,
  children,
  toolbar,
  pagination,
  emptyMessage = 'No results.',
  empty: explicitlyEmpty,
  loading = false,
  error,
}: DataTableProps) {
  const empty = explicitlyEmpty ?? !hasContent(children);

  return (
    <section
      aria-label={title}
      aria-busy={loading || undefined}
      // Padding and gap both use space/5 (20px).
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5 text-foreground"
    >
      {/* Title binds Heading/LG (18/26) in the file, not Heading/SM (15/22). */}
      <h2 className="text-heading-lg">{title}</h2>

      {/* Controls precede the table in DOM order, so a keyboard user meets
          filters before results. */}
      {toolbar ? <div>{toolbar}</div> : null}

      {error ? (
        <div role="alert" className="text-body-md text-destructive-readable">
          {error}
        </div>
      ) : loading ? (
        <p role="status" className="py-8 text-center text-body-md text-muted-foreground">
          Loading results…
        </p>
      ) : empty ? (
        <p className="py-8 text-center text-body-md text-muted-foreground">{emptyMessage}</p>
      ) : (
        children
      )}

      {pagination ? <div>{pagination}</div> : null}
    </section>
  );
}
