import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Pagination — navigate paged datasets.
 *
 * Figma: `Pagination`, 4 variants.
 * Contract: docs/components/pagination.md
 *
 * `Viewport` is kind: responsive-fixture and would normally be dropped — it was for
 * Table / Container and Sidebar. THIS IS THE EXCEPTION, because the record
 * describes a STRUCTURAL difference rather than a breakpoint: "Desktop exposes page
 * numbers; Compact uses a concise page summary." Different content, not the same
 * content reflowed, and a caller in a narrow column needs it regardless of viewport.
 *
 * `State=Disabled` is NOT a prop: previous is disabled at page 1 and next at the
 * last page. That is arithmetic, and a prop would let a caller contradict it.
 *
 * The record binds three tokens and no state distinctions at all — no current page,
 * no disabled, no hover, no focus, and no radius. All asserted from convention.
 */
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
  label?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  compact = false,
  label = 'Pagination',
}: PaginationProps) {
  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  const btn = (extra?: string) =>
    cn(
      // Items bind Label/MD (13/18 medium), not Body/SM (13/18 regular).
      'rounded-lg px-3 py-1.5 text-label-md text-foreground',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      MOTION.colors,
      // The archetype: "Disable rather than hide the controls at the first and last
      // page." Disabled buttons stay announced. No token recorded; muted asserted.
      'disabled:cursor-not-allowed disabled:text-muted-foreground',
      extra,
    );

  return (
    <nav aria-label={label} className="flex items-center gap-2 rounded-lg bg-card px-2 py-1.5">
      <button type="button" className={btn()} disabled={atStart} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>

      {compact ? (
        // Real text, so it is announced as-is.
        <span className="px-2 text-label-md text-foreground">
          Page {page} of {pageCount}
        </span>
      ) : (
        <ol className="flex items-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              <button
                type="button"
                // aria-current, never colour alone.
                aria-current={n === page ? 'page' : undefined}
                onClick={() => onPageChange(n)}
                className={btn(n === page ? 'bg-accent text-accent-foreground' : undefined)}
              >
                {n}
              </button>
            </li>
          ))}
        </ol>
      )}

      <button type="button" className={btn()} disabled={atEnd} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
