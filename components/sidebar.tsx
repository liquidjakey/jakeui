import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Sidebar and Sidebar Navigation Item.
 *
 * Figma: `Sidebar` (4 variants), `Sidebar Navigation Item` (17:*, 2 variants).
 * Contracts: docs/components/sidebar.md · sidebar-navigation-item.md
 *
 * The nav item has THE BEST-BEHAVED COLOUR RECORD IN THE SYSTEM: it uses the
 * dedicated sidebar-* family throughout, with the fill and its matching foreground
 * correctly paired (sidebar-accent + sidebar-accent-foreground). Compare Card
 * (info-foreground on a card fill) and Dialog (plain foreground on card).
 *
 * Viewport is kind: responsive-fixture on Sidebar, so it is NOT a prop — same
 * treatment as Table / Container's.
 */

export interface SidebarNavigationItemProps {
  children: ReactNode;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  /** Set by Sidebar. Hides the label visually while keeping the accessible name. */
  collapsed?: boolean;
}

export function SidebarNavigationItem({
  children,
  href,
  active = false,
  icon,
  collapsed = false,
}: SidebarNavigationItemProps) {
  return (
    <a
      href={href}
      // Derived from the route, never set by hand. aria-current, not colour alone.
      aria-current={active ? 'page' : undefined}
      className={cn(
        // gap is `space/2-5` (10px) and the label binds Label/LG (14/20 medium).
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-label-lg',
        'text-sidebar-foreground',
        // No hover or focus token is recorded; shared ring asserted.
        'hover:bg-sidebar-accent/50',
        MOTION.colors,
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      {/*
        Collapsed keeps the label in the DOM, visually hidden, so the item keeps
        its accessible name. Icons alone would strip it.
      */}
      <span className={cn(collapsed && 'sr-only')}>{children}</span>
    </a>
  );
}

export interface SidebarProps {
  children: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  label?: string;
}

export function Sidebar({
  children,
  collapsed = false,
  onCollapsedChange,
  label = 'Main',
}: SidebarProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex flex-col gap-1 rounded-lg border border-sidebar-border bg-sidebar p-2',
        // No width tokens exist anywhere in the file, so both are raw.
        collapsed ? 'w-14' : 'w-56',
        // Collapsed switches text to sidebar-accent-foreground with NO accent fill.
        // That token is the foreground FOR sidebar-accent, so with nothing behind
        // it, it sits on plain `sidebar` — the same class of mismatch as Dropdown
        // Menu / Trigger's avatar state. Transcribed as recorded and flagged.
        collapsed ? 'text-body-sm text-sidebar-accent-foreground' : 'text-sidebar-foreground',
      )}
    >
      {onCollapsedChange ? (
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => onCollapsedChange(!collapsed)}
          className="mb-1 self-end rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
        </button>
      ) : null}
      {children}
    </nav>
  );
}
