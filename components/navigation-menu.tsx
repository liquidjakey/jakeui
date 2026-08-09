import { useId } from 'react';
import { cn } from '../lib/cn.js';

/**
 * NavigationMenu — primary product navigation.
 *
 * Figma: `Navigation Menu`, 4 variants.
 * Contract: docs/components/navigation-menu.md
 *
 * 🛑 THE SECOND COMPONENT WHOSE CODE DELIBERATELY DIVERGES FROM ITS RECORD.
 *
 * The record binds `fill card` + `text primary-foreground`. Verified in
 * .figma-tokens-dump.json:
 *
 *   card                Light white/100   Dark neutral/900
 *   primary-foreground  Light blue/50     Dark blue/50      <- near-white in BOTH
 *
 * primary-foreground is the text for the SOLID primary fill — which is how Avatar
 * uses it, correctly. On a `card` fill it is near-white text on a WHITE card in
 * Light. Invisible. Dark happens to survive, so this is a light-mode-only failure,
 * narrower than Card's, which broke in both.
 *
 * The code binds `foreground`. Same cause as Card: a *-foreground token paired with
 * a fill it does not belong to. Figma owes a rebind.
 */
export interface NavItem {
  href: string;
  label: string;
  current?: boolean;
}

export interface NavigationMenuProps {
  items: NavItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
}

export function NavigationMenu({
  items,
  open = false,
  onOpenChange,
  label = 'Main',
}: NavigationMenuProps) {
  const id = useId();
  const panelId = `${id}-panel`;

  return (
    <nav
      aria-label={label}
      className="rounded-lg border border-border bg-card p-2 text-body-sm text-foreground"
    >
      {onOpenChange ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onOpenChange(!open)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && open) onOpenChange(false);
          }}
          className={cn(
            'rounded-lg px-3 py-2 sm:hidden',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            // Recorded: compact/open binds accent-foreground with no accent fill —
            // the fourth component with this shape. Transcribed and flagged.
            open && 'text-accent-foreground',
          )}
        >
          Menu
        </button>
      ) : null}

      <ul
        id={panelId}
        className={cn(
          'gap-1 sm:flex sm:flex-row',
          onOpenChange ? (open ? 'flex flex-col' : 'hidden') : 'flex flex-row',
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              // aria-current, never colour alone.
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'block rounded-lg px-3 py-2',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                // `foreground`, NOT the record's primary-foreground. See the block
                // above — following the record would be invisible in light mode.
                item.current ? 'bg-accent text-accent-foreground' : 'text-foreground',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
