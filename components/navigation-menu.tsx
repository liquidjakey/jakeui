import { useId, useRef } from "react";
import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";

/**
 * Primary navigation links with an optional controlled compact menu.
 * Resting text uses foreground on card; active links use the accent pair.
 * Approved readability overrides are scoped in agent/exceptions.json.
 * Consumer contract: docs/agent/components/navigation-menu.md.
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
  label = "Main",
}: NavigationMenuProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;

  return (
    <nav
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open && onOpenChange) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(false);
          triggerRef.current?.focus();
        }
      }}
      // px `space/3`, py `space/2`; item labels bind Label/MD (13/18 medium).
      className="rounded-lg border border-border bg-card px-3 py-2 text-label-md text-foreground"
    >
      {onOpenChange ? (
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onOpenChange(!open)}
          className={cn(
            "rounded-lg px-3 py-2 hover:bg-accent active:bg-accent-hover sm:hidden",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            MOTION.colors,
            open && "text-accent-foreground",
          )}
        >
          Menu
        </button>
      ) : null}

      <ul
        id={panelId}
        className={cn(
          "flex-wrap gap-1 sm:flex sm:flex-row",
          onOpenChange ? (open ? "flex flex-col" : "hidden") : "flex flex-row",
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={() => {
                onOpenChange?.(false);
                if (triggerRef.current?.getClientRects().length)
                  triggerRef.current.focus();
              }}
              // aria-current, never colour alone.
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2",
                "hover:bg-accent active:bg-accent-hover",
                MOTION.colors,
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                item.current
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground",
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
