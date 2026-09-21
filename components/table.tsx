import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Native table family with an overflow wrapper and shared row density.
 * Use semantic thead/tbody/tfoot plus TableRow, TableHead and TableCell.
 * Density changes row height. Existing geometry is scoped in agent/exceptions.json.
 * Consumer contracts: docs/agent/components/table.md and sibling part references.
 */

export type TableDensity = 'compact' | 'comfortable';
const DensityContext = createContext<TableDensity>('compact');
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

/** Overflow wrapper only. Viewport is a responsive fixture, not a prop. This container has no independent text style. */
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

/** Keep caption first inside the native table. Visual bottom placement uses caption-side, never DOM reordering. */
export function TableCaption({ children, position = 'top' }: TableCaptionProps) {
  return (
    <caption
      className={cn(
        // Table headings use Label/SM (12/16 Medium).
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
  /** Header association; defaults to col. Use row for a row header. */
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

/** Emphasis changes text colour, not weight: strong uses foreground, default muted-foreground. */
export function TableCell({ children, alignment = 'left', emphasis = 'default' }: TableCellProps) {
  return (
    <td
      className={cn(
        // Both emphasis values keep the complete Body/SM type style.
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

/** Density changes row height while row type controls header/footer styling. */
export function TableRow({
  children,
  type = 'body',
  selected = false,
  onSelect,
  density: densityOverride,
}: TableRowProps) {
  const inheritedDensity = useContext(DensityContext);
  const density = densityOverride ?? inheritedDensity;
  const selectable = Boolean(onSelect);
  return (
    <tr
      aria-selected={selectable ? selected : undefined}
      onClick={(e) => {
        if (!(e.target as Element).closest('button, a, input, select, textarea')) onSelect?.();
      }}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        density === 'comfortable' ? '[&>*]:py-3' : '[&>*]:py-2',
        type === 'header' && 'border-b border-border bg-muted',
        type === 'body' && 'bg-card',
        // Selection-capable rows use a hover tint to expose their affordance.
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
  /** Accessible action name that identifies the row or task context. */
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  expanded?: boolean;
}

/** Icon-only row actions require a context-specific accessible label. */
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
        // Disabled actions use the shared disabled treatment.
        disabled && 'cursor-not-allowed text-muted-foreground hover:bg-card',
      )}
    >
      {/* Icon inherits currentColor from the row. */}
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
    <DensityContext.Provider value={density}>
      <TableContainer label={label ?? caption ?? 'Table'}>
        <table
          // Named by its <caption> when there is one, by aria-label otherwise.
          // Never unnamed.
          aria-label={caption ? undefined : label}
          className="w-full border-collapse text-body-sm"
        >
          {caption ? <TableCaption position={captionPosition}>{caption}</TableCaption> : null}
          {children}
        </table>
      </TableContainer>
    </DensityContext.Provider>
  );
}
