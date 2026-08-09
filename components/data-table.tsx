import type { ReactNode } from 'react';

/**
 * DataTable — data-management composition.
 *
 * Figma: `Data Table`, node 136:0, 4 variants.
 * Contract: docs/components/data-table.md
 *
 * `State=Populated | Empty` is NOT a prop. A "populated" data table with no rows
 * contradicts itself; deriving the state from whether there is anything to show
 * makes that unrepresentable — the same move as Progress's Type and Card's media.
 *
 * ⚠️ THIS COMPOSITION NAMES FOUR COMPONENTS AND ONE OF THEM IS BLOCKED. The record:
 * "built from Input, Button, Table, and Pagination." Input, Table and Pagination are
 * all built; BUTTON IS NOT — 32 variants, 8 state rows, so its outline and ghost
 * bindings are unreadable. The toolbar is therefore a SLOT left to the caller rather
 * than pre-composed with a Button that does not exist yet.
 *
 * The empty state changes only the type size in the record — no muted colour, no
 * distinct treatment. muted-foreground is asserted for the message; the rest is a
 * design gap, and there is no loading or error state at all.
 */
export interface DataTableProps {
  title: string;
  children?: ReactNode;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  emptyMessage?: string;
}

export function DataTable({
  title,
  children,
  toolbar,
  pagination,
  emptyMessage = 'No results.',
}: DataTableProps) {
  const empty = !children;

  return (
    <section
      aria-label={title}
      // padding and gap are both `space/5` (20px); they were 16 and 12.
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5 text-foreground"
    >
      {/* Title binds Heading/LG (18/26) in the file, not Heading/SM (15/22). */}
      <h2 className="text-heading-lg">{title}</h2>

      {/* Controls precede the table in DOM order, so a keyboard user meets
          filters before results. */}
      {toolbar ? <div>{toolbar}</div> : null}

      {empty ? (
        <p className="py-8 text-center text-body-md text-muted-foreground">{emptyMessage}</p>
      ) : (
        children
      )}

      {pagination ? <div>{pagination}</div> : null}
    </section>
  );
}
