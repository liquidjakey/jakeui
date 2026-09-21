import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { Tooltip } from "./tooltip.js";
import { cn } from "../lib/cn.js";
import { MOTION } from "../lib/motion.js";
import { CaretLeft } from "@phosphor-icons/react";

/**
 * Navigation shell and items using the sidebar token family. Collapsed state
 * propagates to items while preserving their accessible labels. Application layout
 * owns responsive placement; Sidebar is not a mobile drawer.
 * Consumer contract: docs/agent/components/sidebar.md.
 */

const CollapseContext = createContext(false);

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
  collapsed: collapsedOverride,
}: SidebarNavigationItemProps) {
  const inheritedCollapse = useContext(CollapseContext);
  const collapsed = collapsedOverride ?? inheritedCollapse;
  const link = (
    <a
      href={href}
      // Derived from the route, never set by hand. aria-current, not colour alone.
      aria-current={active ? "page" : undefined}
      className={cn(
        // gap is `space/2-5` (10px) and the label binds Label/LG (14/20 medium).
        "flex min-w-0 items-center gap-2.5 rounded-lg py-2 text-label-lg",
        collapsed ? "justify-center px-1" : "px-3",
        "text-sidebar-foreground",
        // Use the shared focus ring for keyboard navigation.
        "hover:bg-sidebar-accent/50",
        MOTION.colors,
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-full"
        >
          {icon}
        </span>
      ) : null}
      {/*
        Collapsed keeps the label in the DOM, visually hidden, so the item keeps
        its accessible name. Icons alone would strip it.
      */}
      {!icon && collapsed ? (
        <span aria-hidden="true">
          {typeof children === "string" ? children.slice(0, 1) : "•"}
        </span>
      ) : null}
      <span className={cn(collapsed ? "sr-only" : "truncate")}>{children}</span>
    </a>
  );
  return collapsed && typeof children === "string" ? (
    <Tooltip label={children} side="right">
      {link}
    </Tooltip>
  ) : (
    link
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
  label = "Main",
}: SidebarProps) {
  return (
    <CollapseContext.Provider value={collapsed}>
      <nav
        aria-label={label}
        className={cn(
          "flex shrink-0 flex-col gap-1 rounded-lg border border-sidebar-border bg-sidebar p-2",
          // Existing shell widths are scoped by agent/exceptions.json.
          collapsed ? "w-14" : "w-56",
          // Navigation items and the collapse trigger set their own foregrounds.
          collapsed
            ? "text-body-sm text-sidebar-accent-foreground"
            : "text-sidebar-foreground",
        )}
      >
        {onCollapsedChange ? (
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              "mb-1 flex size-10 shrink-0 items-center justify-center self-end rounded-lg text-sidebar-foreground hover:bg-sidebar-accent active:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              MOTION.colors,
            )}
          >
            <CaretLeft
              size={20}
              aria-hidden="true"
              className={cn(
                MOTION.transform,
                "rtl:-scale-x-100",
                collapsed && "rotate-180",
              )}
            />
          </button>
        ) : null}
        {children}
      </nav>
    </CollapseContext.Provider>
  );
}
