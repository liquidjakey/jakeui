import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Hierarchical location trail from items. The last item is the current page,
 * not a link; collapsed ancestors remain reachable through the reveal control.
 * Consumer contract: docs/agent/components/breadcrumb.md.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  collapsed?: boolean;
  label?: string;
}

export function Breadcrumb({ items, collapsed = false, label = 'Breadcrumb' }: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const nav = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (expanded) nav.current?.querySelector<HTMLElement>('li:nth-child(2) a')?.focus();
  }, [expanded]);
  // An empty trail is not a breadcrumb. Rendering an empty <nav> would leave a
  // labelled landmark with nothing in it, which is noise for screen-reader users.
  if (items.length === 0) return null;

  // Collapsing folds the MIDDLE, keeping the root and the current page — those are
  // the two a user orients by. Never applied below four levels, where it would
  // hide more than it saves.
  const showOverflow = collapsed && !expanded && items.length > 3;
  const visible: BreadcrumbItem[] = showOverflow
    ? [...items.slice(0, 1), ...items.slice(-2)]
    : items;

  return (
    // Provide a named navigation landmark.
    <nav
      ref={nav}
      aria-label={label}
      className="rounded-lg border border-border bg-card px-3 py-2.5"
    >
      {/* gap is `space/2` (8px) in the file, not `space/1` (4px). */}
      <ol className="flex flex-wrap items-center gap-2 text-body-sm text-muted-foreground">
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          const insertOverflow = showOverflow && i === 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {/* Separators are decorative: "hidden from assistive technology." */}
              {i > 0 ? (
                <span aria-hidden="true" className="select-none">
                  /
                </span>
              ) : null}

              {insertOverflow ? (
                <>
                  {/*
                    A real button, not an inert ellipsis glyph. Collapsing must
                    never hide levels from assistive technology that a sighted
                    user could reach.
                  */}
                  <button
                    type="button"
                    aria-label={`Show ${items.length - 3} hidden levels`}
                    aria-expanded={false}
                    onClick={() => setExpanded(true)}
                    className="rounded px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    …
                  </button>
                  <span aria-hidden="true" className="select-none">
                    /
                  </span>
                </>
              ) : null}

              {isLast ? (
                // The current page: plain text with aria-current, never a link —
                // you do not link to where you already are.
                //
                // Foreground distinguishes the current page from muted ancestor links.
                <span aria-current="page" className={cn('text-foreground')}>
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className={cn(
                    'rounded underline-offset-2 hover:underline',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    MOTION.colors,
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
