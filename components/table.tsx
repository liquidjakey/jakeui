import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * The Table family — eight Figma assets, seven code exports, one file.
 *
 * Figma: `Table` (130:*) plus `Table / *`.
 * Contracts: docs/components/table.md · table-row.md · table-cell.md ·
 *            table-head.md · table-caption.md · table-container.md ·
 *            table-action-trigger.md
 *
 * `Table / Root Composition` is deliberately NOT bound to code. Its map entry has
 * no real properties — Pattern is `kind: story-only` ("Storybook story, never a
 * prop") and Viewport is `kind: responsive-fixture`. It is a set of composition
 * examples, so it ships as stories. Binding it would claim it is a component.
 *
 * DENSITY CARRIES NO TOKEN DELTA anywhere in this family, and that is verified
 * rather than assumed: Table / Row shows three Compact/Comfortable pairs and all
 * three bind identical tokens. Density changes row height only, which is spacing,
 * and no spacing token exists in any record here. Row height is therefore raw.
 */

export type TableDensity = 'compact' | 'comfortable';
export type TableAlignment = 'left' | 'center' | 'right';

const ALIGN: Record<TableAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/* ─────────────────────────── Container ─────────────────────────── */

export interface TableContainerProps {
  children: ReactNode;
  label?: string;
}

/**
 * The overflow wrapper. Figma's `Viewport` axis is a responsive fixture, not a
 * prop — the map says so itself — so overflow is plain CSS and takes no input.
 *
 * The record binds size/10 here, the smallest type size in the file, on a wrapper
 * that renders no text of its own. Almost certainly inherited from a nested
 * example; deliberately not applied.
 */
export function TableContainer({ children, label = 'Table' }: TableContainerProps) {
  return (
    <div
      // A scrollable region must be focusable AND named, or a keyboard user
      // cannot scroll it at all.
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'w-full overflow-x-auto rounded-lg border border-border bg-card',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      )}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────── Caption ──────────────────────────── */

export interface TableCaptionProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
}

/**
 * The record: "Position is visual; code should preserve caption semantics and
 * reading order." A <caption> must be the FIRST CHILD of <table> wherever it
 * appears, so bottom placement uses caption-side and never DOM reordering —
 * moving it would break the naming relationship.
 */
export function TableCaption({ children, position = 'top' }: TableCaptionProps) {
  return (
    <caption
      className={cn(
        // Head binds 12px Medium -> Label/SM (12/16); it was Body/XS (12/18 regular).
        'px-4 py-2 text-left text-label-sm text-muted-foreground',
        position === 'bottom' ? 'caption-bottom' : 'caption-top',
      )}
    >
      {children}
    </caption>
  );
}

/* ───────────────────────────── Head ────────────────────────────── */

export interface TableHeadProps {
  children: ReactNode;
  alignment?: TableAlignment;
  /** Required by the record's prose: "use scope/row-header semantics in code." */
  scope?: 'col' | 'row';
}

export function TableHead({ children, alignment = 'left', scope = 'col' }: TableHeadProps) {
  return (
    <th
      scope={scope}
      className={cn('px-4 py-2 text-label-sm text-muted-foreground', ALIGN[alignment])}
    >
      {children}
    </th>
  );
}

/* ───────────────────────────── Cell ────────────────────────────── */

export interface TableCellProps {
  children: ReactNode;
  alignment?: TableAlignment;
  emphasis?: 'default' | 'strong';
}

/**
 * EMPHASIS CHANGES COLOUR, NOT WEIGHT — despite its name, and despite the shared
 * vocabulary calling it "heavier weight". The record binds foreground vs
 * muted-foreground and no weight token. Transcribed as bound, not as named.
 *
 * Consequence worth knowing: a DEFAULT cell is muted-foreground, so ordinary table
 * data renders muted and only "strong" cells get full contrast. That is backwards
 * from the usual convention. Faithful to the record; flagged for design review.
 */
export function TableCell({ children, alignment = 'left', emphasis = 'default' }: TableCellProps) {
  return (
    <td
      className={cn(
        // Cells bind Body/SM; Emphasis=Strong binds Value/Strong (handled by caller).
        'px-4 py-2 text-body-sm',
        emphasis === 'strong' ? 'text-foreground' : 'text-muted-foreground',
        ALIGN[alignment],
      )}
    >
      {children}
    </td>
  );
}

/* ────────────────────────────── Row ────────────────────────────── */

export interface TableRowProps {
  children: ReactNode;
  type?: 'header' | 'body' | 'footer';
  selected?: boolean;
  onSelect?: () => void;
  density?: TableDensity;
}

/**
 * Recovered from the 8-row cap by inference, not guesswork: the two missing
 * variants are Header/Comfortable and Footer/Comfortable, and every
 * Compact/Comfortable pair that IS present binds identical tokens (three pairs,
 * three matches). Density is proven inert here. See docs/components/table-row.md.
 */
export function TableRow({
  children,
  type = 'body',
  selected = false,
  onSelect,
  density = 'compact',
}: TableRowProps) {
  const selectable = Boolean(onSelect);
  return (
    <tr
      aria-selected={selectable ? selected : undefined}
      onClick={onSelect}
      className={cn(
        density === 'comfortable' ? '[&>*]:py-3' : '[&>*]:py-2',
        type === 'header' && 'border-b border-border bg-muted',
        type === 'body' && 'bg-card',
        // Recorded hover binds only text, identical to resting — a hover state
        // that looks like rest is almost certainly an oversight, so a muted tint
        // is ASSERTED here rather than transcribed.
        selectable && !selected && 'hover:bg-muted/50',
        MOTION.colors,
        selected && 'bg-accent',
        selectable &&
          'cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      )}
      tabIndex={selectable ? 0 : undefined}
    >
      {children}
    </tr>
  );
}

/* ─────────────────────── Action trigger ────────────────────────── */

export interface TableActionTriggerProps {
  /** REQUIRED. The record demands a name that identifies the context. */
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  expanded?: boolean;
}

/**
 * `label` is required in the type on purpose. The record's accessibility contract:
 * "icon-only row action trigger requires a programmatic accessible name that
 * identifies the action context (for example, 'Open row actions')". Making it
 * optional would make it forgettable, and an unnamed icon-only control is
 * unusable by screen reader.
 */
export function TableActionTrigger({
  label,
  onClick,
  icon,
  disabled = false,
  expanded = false,
}: TableActionTriggerProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={expanded}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        // Padding keeps this above the 24px minimum target — an icon-only control
        // in a dense row is the likeliest place to fall under it.
        'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-card',
        'hover:bg-accent',
        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        // No disabled tokens are recorded on this asset; shared convention asserted.
        disabled && 'cursor-not-allowed text-muted-foreground hover:bg-card',
      )}
    >
      {/* No icon colour is recorded either — inherits currentColor from the row. */}
      <span aria-hidden="true">{icon ?? '⋮'}</span>
    </button>
  );
}

/* ───────────────────────────── Table ───────────────────────────── */

export interface TableProps {
  children: ReactNode;
  caption?: string;
  captionPosition?: 'top' | 'bottom';
  density?: TableDensity;
  label?: string;
}

/**
 * Figma's `Selection` axis is NOT a prop here: selection is a property of a ROW
 * (Table / Row carries State=Selected with a real accent fill), and a table-level
 * selection prop would be a second source of truth for the same state.
 *
 * `First row label` / `Second row label` are example content, not API — the same
 * pattern as Breadcrumb's three fixed labels.
 */
export function Table({
  children,
  caption,
  captionPosition = 'top',
  density = 'compact',
  label,
}: TableProps) {
  return (
    <TableContainer label={label ?? caption ?? 'Table'}>
      <table
        // Named by its <caption> when there is one, by aria-label otherwise.
        // Never unnamed.
        aria-label={caption ? undefined : label}
        className={cn('w-full border-collapse text-body-sm', density)}
      >
        {caption ? <TableCaption position={captionPosition}>{caption}</TableCaption> : null}
        {children}
      </table>
    </TableContainer>
  );
}
