import { useId, useLayoutEffect } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { useMenu } from '../lib/menu.js';
import { PopoverArrow } from './popover-arrow.js';
import { ThemedPortal, useAnchoredSurface } from '../lib/floating.js';
import { useMergeRefs } from '@floating-ui/react';

/**
 * Controlled command-menu family. Link the trigger's controls to the menu id.
 * Linked menus use collision-aware portals; unlinked surfaces remain inline.
 * Consumer contracts: docs/agent/components/dropdown-menu.md and sibling part refs.
 */

/* ─────────────────────────── Trigger ──────────────────────────── */

export interface DropdownMenuTriggerProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'button' | 'avatar';
  disabled?: boolean;
  controls?: string;
  /** Required when type="avatar" and there is no visible text. */
  label?: string;
}

/** Caller owns open state and links controls to the menu id for focus management. */
export function DropdownMenuTrigger({
  children,
  open,
  onOpenChange,
  type = 'button',
  disabled = false,
  controls,
  label,
}: DropdownMenuTriggerProps) {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      aria-label={type === 'avatar' ? label : undefined}
      disabled={disabled}
      onClick={() => {
        onOpenChange(!open);
        if (!open && controls)
          requestAnimationFrame(() =>
            document
              .getElementById(controls)
              ?.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')
              ?.focus(),
          );
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          onOpenChange(false);
          return;
        }
        // Down Arrow opens too — the APG convention for menu buttons.
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          onOpenChange(true);
          requestAnimationFrame(() => {
            const items = controls
              ? document
                  .getElementById(controls)
                  ?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')
              : undefined;
            (e.key === 'ArrowUp' ? items?.[items.length - 1] : items?.[0])?.focus();
          });
        }
      }}
      className={cn(
        // py is `space/1-75` (7px) in the file, not `space/2` (8px).
        'inline-flex items-center gap-2 rounded-lg px-3 py-[calc(var(--spacing)*1.75)]',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        type === 'button' && 'border border-border bg-card text-label-md text-foreground',
        // The avatar trigger is transparent at rest; open adds the accent surface.
        type === 'avatar' && 'text-body-xs text-accent-foreground',
        open && 'bg-accent text-accent-foreground',
        // Disabled dims text while preserving the current fill.
        disabled && 'cursor-not-allowed text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}

/* ──────────────────────────── Menu ────────────────────────────── */

export interface DropdownMenuProps {
  children: ReactNode;
  type?: 'standard' | 'checkbox';
  density?: 'compact' | 'comfortable';
  label?: string;
  id?: string;
}

export function DropdownMenu({ children, density = 'compact', label, id }: DropdownMenuProps) {
  const menu = useMenu(id);
  const floating = useAnchoredSurface(true, () => {}, 'bottom-start');
  const ref = useMergeRefs([menu.ref, floating.refs.setFloating]);
  useLayoutEffect(() => {
    if (id)
      floating.refs.setReference(
        document.querySelector(`[aria-haspopup="menu"][aria-controls="${CSS.escape(id)}"]`),
      );
  }, [id, floating.refs]);
  const content = (
    <div
      {...menu}
      ref={ref}
      style={floating.elements.domReference ? floating.floatingStyles : undefined}
      id={id}
      role="menu"
      aria-label={label}
      className={cn(
        'z-50 w-max min-w-48 max-w-full overflow-y-auto rounded-lg border border-border bg-popover text-label-md text-popover-foreground shadow-md',
        // Density padding on the container is not itself bound in the file; the
        // ITEMS are (px space/2, py space/1-5), and those are transcribed below.
        density === 'comfortable' ? 'p-2' : 'p-1',
      )}
    >
      {children}
    </div>
  );
  return floating.elements.domReference ? (
    <ThemedPortal reference={floating.elements.domReference}>{content}</ThemedPortal>
  ) : (
    content
  );
}

/* ──────────────────────────── Label ───────────────────────────── */

export interface DropdownMenuLabelProps {
  children: ReactNode;
  inset?: boolean;
}

/** Non-focusable section label; uses popover-foreground like the menu items. */
export function DropdownMenuLabel({ children, inset = false }: DropdownMenuLabelProps) {
  return (
    <div
      role="presentation"
      // py `space/1-25` (5px); the label is 12/18 SEMI BOLD in the file, not medium.
      className={cn(
        'px-2 py-[calc(var(--spacing)*1.25)] text-body-xs font-semibold text-popover-foreground',
        inset && 'pl-8',
      )}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Radio item ─────────────────────────── */

export interface DropdownMenuRadioItemProps {
  children: ReactNode;
  checked?: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

/** Preserve the visible check indicator. Caller owns exclusivity across radio items. */
export function DropdownMenuRadioItem({
  children,
  checked = false,
  onSelect,
  icon,
  disabled = false,
}: DropdownMenuRadioItemProps) {
  return (
    <div
      role="menuitemradio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-2 py-1.5',
        'rounded-[calc(var(--radius-4))] text-popover-foreground',
        'hover:bg-accent hover:text-accent-foreground',
        MOTION.colors,
        'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none',
        // Disabled items are skipped by menu navigation.
        disabled && 'pointer-events-none text-muted-foreground',
      )}
    >
      <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
        {checked ? '•' : (icon ?? null)}
      </span>
      {children}
    </div>
  );
}

/* ───────────────────────── Sub trigger ────────────────────────── */

export interface DropdownMenuSubTriggerProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
  inset?: boolean;
  disabled?: boolean;
  controls?: string;
}

/** Open and hover share accent styling. Inset reserves leading-icon alignment. */
export function DropdownMenuSubTrigger({
  children,
  open,
  onOpenChange,
  icon,
  inset = false,
  disabled = false,
  controls,
}: DropdownMenuSubTriggerProps) {
  return (
    <div
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      onClick={disabled ? undefined : () => onOpenChange(!open)}
      onKeyDown={(e) => {
        if (disabled) return;
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(true);
          requestAnimationFrame(
            () =>
              controls &&
              document
                .getElementById(controls)
                ?.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')
                ?.focus(),
          );
        }
      }}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-2 py-1.5',
        'rounded-[calc(var(--radius-4))] text-popover-foreground',
        'hover:bg-accent hover:text-accent-foreground',
        open && 'bg-accent text-accent-foreground',
        inset && 'pl-8',
        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        disabled && 'pointer-events-none text-muted-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {/* The decorative submenu arrow inherits the item's colour. */}
      <CaretRight size={12} weight="bold" aria-hidden="true" />
    </div>
  );
}

/* ───────────────────────── Sub content ────────────────────────── */

export interface DropdownMenuSubContentProps {
  children: ReactNode;
  side?: 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  label?: string;
  id?: string;
}

/**
 * Identical tokens to DropdownMenu, which is correct — a submenu is the same
 * surface. Neither axis carries a token delta; both are pure geometry.
 *
 * The `side` vocabulary ("opens to the left/right OF THE TRIGGER") is correct here,
 * unlike on Sheet where the surface attaches to the viewport instead.
 */
export function DropdownMenuSubContent({
  children,
  side = 'right',
  align = 'start',
  label,
  id: providedId,
}: DropdownMenuSubContentProps) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const menu = useMenu(id);
  const floating = useAnchoredSurface(
    true,
    () => {},
    align === 'center' ? side : `${side}-${align}`,
  );
  const ref = useMergeRefs([menu.ref, floating.refs.setFloating]);
  useLayoutEffect(() => {
    floating.refs.setReference(document.querySelector(`[aria-controls="${CSS.escape(id)}"]`));
  }, [id, floating.refs]);
  const content = (
    <div
      ref={ref}
      style={floating.elements.domReference ? floating.floatingStyles : undefined}
      onClick={menu.onClick}
      onKeyDown={(e) => {
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) {
          e.preventDefault();
          e.stopPropagation();
          const trigger = document.querySelector<HTMLElement>(
            `[aria-controls="${CSS.escape(id)}"]`,
          );
          trigger?.click();
          trigger?.focus();
        } else menu.onKeyDown(e);
      }}
      id={id}
      role="menu"
      aria-label={label}
      data-side={side}
      data-align={align}
      className={cn(
        'z-50 min-w-40 overflow-y-auto rounded-lg border border-border bg-popover p-1',
        'text-body-sm text-popover-foreground shadow-md',
      )}
    >
      {children}
    </div>
  );
  return floating.elements.domReference ? (
    <ThemedPortal reference={floating.elements.domReference}>{content}</ThemedPortal>
  ) : (
    content
  );
}

/* ───────────────────────────── Item ───────────────────────────── */

export interface DropdownMenuItemProps {
  children: ReactNode;
  onSelect: () => void;
  tone?: 'default' | 'destructive';
  icon?: ReactNode;
  shortcut?: string;
  inset?: boolean;
  disabled?: boolean;
}

/** Action item. Icon and shortcut are optional content, not visibility booleans. */
export function DropdownMenuItem({
  children,
  onSelect,
  tone = 'default',
  icon,
  shortcut,
  inset = false,
  disabled = false,
}: DropdownMenuItemProps) {
  return (
    <div
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-2 py-1.5',
        'rounded-[calc(var(--radius-4))]',
        // The readable destructive alias is retained on the highlighted surface.
        tone === 'destructive' ? 'text-destructive-readable' : 'text-popover-foreground',
        tone === 'destructive' ? 'hover:bg-accent' : 'hover:bg-accent hover:text-accent-foreground',
        inset && 'pl-8',
        disabled && 'pointer-events-none text-muted-foreground',
        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {shortcut ? (
        // aria-hidden: the glyphs would be read as punctuation. Showing a shortcut
        // here does not create the key binding.
        <span aria-hidden="true" className="text-caption-xs text-muted-foreground">
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}

/* ───────────────────── Checkbox item ──────────────────────────── */

export interface DropdownMenuCheckboxItemProps {
  children: ReactNode;
  checked?: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  disabled?: boolean;
}

/**
 * Multi-select item; keep the menu open while toggling. The visible checked or
 * mixed indicator takes the leading slot; the optional icon appears when unchecked.
 */
export function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  icon,
  disabled = false,
}: DropdownMenuCheckboxItemProps) {
  const indeterminate = checked === 'indeterminate';
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={indeterminate ? 'mixed' : checked === true}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      // Unlike a radio item the menu stays open — that is the point of multi-select.
      onClick={disabled ? undefined : () => onCheckedChange(!(checked === true))}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-2 py-1.5',
        'rounded-[calc(var(--radius-4))] text-popover-foreground',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        disabled && 'pointer-events-none text-muted-foreground',
      )}
    >
      <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
        {checked === true ? '✓' : indeterminate ? '–' : (icon ?? null)}
      </span>
      {children}
    </div>
  );
}

/* ──────────────────── Dropdown Menu / Content ──────────────────── */

export interface DropdownMenuContentProps {
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  arrow?: boolean;
  label?: string;
  id?: string;
}

/**
 * Inline menu surface and keyboard scope. Side/align annotate anatomy; use the
 * linked DropdownMenu for anchored placement. An arrow is optional decoration.
 */
export function DropdownMenuContent({
  children,
  side = 'bottom',
  align = 'start',
  arrow = false,
  label,
  id,
}: DropdownMenuContentProps) {
  const menu = useMenu(id);
  return (
    <div
      {...menu}
      id={id}
      role="menu"
      aria-label={label}
      data-side={side}
      data-align={align}
      className={cn(
        'relative min-w-48 rounded-lg border border-border bg-popover p-1',
        'text-body-sm text-popover-foreground shadow-md',
      )}
    >
      {arrow ? <PopoverArrow side={side} /> : null}
      {children}
    </div>
  );
}
