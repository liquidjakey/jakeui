import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";

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
  label = "Pagination",
}: PaginationProps) {
  const count = Number.isFinite(pageCount)
    ? Math.max(0, Math.floor(pageCount))
    : 0;
  const current = count
    ? Math.max(1, Math.min(count, Number.isFinite(page) ? Math.floor(page) : 1))
    : 0;
  const pages = [...new Set([1, current - 1, current, current + 1, count])]
    .filter((n) => n >= 1 && n <= count)
    .sort((a, b) => a - b);
  const btn = (extra?: string) =>
    cn(
      "min-h-10 min-w-10 rounded-lg px-3 py-1.5 text-label-md tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring enabled:hover:bg-accent enabled:active:bg-accent-hover disabled:cursor-not-allowed disabled:text-muted-foreground",
      MOTION.colors,
      extra,
    );
  return (
    <div className="@container w-full">
      <nav
        aria-label={label}
        className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-lg bg-card px-2 py-1.5"
      >
        <button
          type="button"
          className={btn()}
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          Previous
        </button>
        <span
          className={cn(
            "px-2 text-label-md tabular-nums text-foreground",
            !compact && "@min-[32rem]:hidden",
          )}
        >
          Page {current} of {count}
        </span>
        {!compact ? (
          <ol className="hidden items-center gap-1 @min-[32rem]:flex">
            {pages.map((n, i) => (
              <li key={n} className="flex items-center gap-1">
                {i > 0 && n > pages[i - 1]! + 1 ? (
                  <span aria-hidden="true" className="px-1 text-body-sm">
                    …
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Page ${n}`}
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => onPageChange(n)}
                  className={btn(
                    n === current
                      ? "bg-accent text-accent-foreground"
                      : undefined,
                  )}
                >
                  {n}
                </button>
              </li>
            ))}
          </ol>
        ) : null}
        <button
          type="button"
          className={btn()}
          disabled={current === 0 || current >= count}
          onClick={() => onPageChange(current + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
