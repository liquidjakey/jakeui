import { cn } from '../lib/cn.js';

/**
 * Breadcrumb — hierarchical location trail.
 *
 * Figma: `Breadcrumb`, node 88:*, 2 variants.
 * Contract: docs/components/breadcrumb.md
 *
 * Figma models a FIXED three-level trail (Home label / Parent label / Current
 * label), because a design file cannot express a variable-length list. Those three
 * properties are one EXAMPLE of the array, not the API. Real trails are 2, 4 or 6
 * deep, so code takes items[].
 *
 * The LAST item is the current page and is never a link.
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
  // An empty trail is not a breadcrumb. Rendering an empty <nav> would leave a
  // labelled landmark with nothing in it, which is noise for screen-reader users.
  if (items.length === 0) return null;

  // Collapsing folds the MIDDLE, keeping the root and the current page — those are
  // the two a user orients by. Never applied below four levels, where it would
  // hide more than it saves.
  const showOverflow = collapsed && items.length > 3;
  const visible: BreadcrumbItem[] = showOverflow ? [...items.slice(0, 1), ...items.slice(-2)] : items;

  return (
    // The record: "Wrap in a nav with an accessible name such as 'Breadcrumb'."
    <nav aria-label={label} className="rounded-lg border border-border bg-card px-3 py-2">
      <ol className="flex flex-wrap items-center gap-1 text-body-sm text-muted-foreground">
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
                // `foreground` here is ASSERTED, not transcribed: the record binds
                // everything to muted-foreground, which would make the current page
                // indistinguishable from its ancestors. Figma owes a binding.
                <span aria-current="page" className={cn('text-foreground')}>
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="rounded underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
