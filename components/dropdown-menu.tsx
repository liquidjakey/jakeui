import { useId } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * The Dropdown Menu family — six of eleven assets.
 *
 * Figma: `Dropdown Menu` (109:*) plus `Dropdown Menu / *`.
 * Contracts: docs/components/dropdown-menu.md · dropdown-menu-trigger.md ·
 *            dropdown-menu-label.md · dropdown-menu-radio-item.md ·
 *            dropdown-menu-sub-trigger.md · dropdown-menu-sub-content.md
 *
 * / Item and / Checkbox Item were RECOVERED from the 8-row cap on 9 Aug 2026 — see
 * their own doc blocks below for the proofs.
 *
 * STILL BLOCKED by the cap: / Content (24 variants, 1 state row) and
 * / Root Composition (24, 8). Nothing can be inferred from 1 of 24 — unlike
 * Table / Row, whose missing rows sat on a provably inert axis.
 *
 * NOT MAPPED to code at all: / Group, / Radio Group, / Separator, / Shortcut. They
 * have doc records but no map entry, so they owe no codePath.
 *
 * PLACEMENT IS NOT COLLISION-AWARE, same limitation as Popover.
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

/**
 * NOTE THE CONTRAST WITH NativeSelect. Both maps annotate State with `controlled`
 * containing an open state. There it was deliberately NOT emitted, because a native
 * select's menu is platform-owned and its open state is neither observable nor
 * stylable. Here the menu is ours: it can be opened programmatically, its state is
 * observable, and aria-expanded needs it. Same annotation, opposite conclusion —
 * the difference is who owns the popup.
 */
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
      onClick={() => onOpenChange(!open)}
      onKeyDown={(e) => {
        // Down Arrow opens too — the APG convention for menu buttons.
        if (e.key === 'ArrowDown' && !open) {
          e.preventDefault();
          onOpenChange(true);
        }
      }}
      className={cn(
        // py is `space/1-75` (7px) in the file, not `space/2` (8px).
        'inline-flex items-center gap-2 rounded-lg px-3 py-[calc(var(--spacing)*1.75)]',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        type === 'button' && 'border border-border bg-card text-label-md text-foreground',
        // Avatar/closed binds accent-foreground with NO fill. accent-foreground is
        // the text colour FOR the accent fill, so with nothing behind it it sits on
        // whatever is beneath — the same class of mismatch as Card's
        // info-foreground, though far less severe. Transcribed and flagged.
        type === 'avatar' && 'text-body-xs text-accent-foreground',
        open && 'bg-accent text-accent-foreground',
        // Recorded disabled changes TEXT ONLY, with no fill change — unlike every
        // other disabled control here, which moves to `muted`. Transcribed.
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

export function DropdownMenu({
  children,
  density = 'compact',
  label,
  id,
}: DropdownMenuProps) {
  return (
    <div
      id={id}
      role="menu"
      aria-label={label}
      className={cn(
        'min-w-48 rounded-lg border border-border bg-popover text-label-md text-popover-foreground shadow-md',
        // Density padding on the container is not itself bound in the file; the
        // ITEMS are (px space/2, py space/1-5), and those are transcribed below.
        density === 'comfortable' ? 'p-2' : 'p-1',
      )}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────── Label ───────────────────────────── */

export interface DropdownMenuLabelProps {
  children: ReactNode;
  inset?: boolean;
}

/**
 * The record: "Non-focusable." role="presentation" so it is skipped by arrow-key
 * navigation — a label announced as an item is a dead end for keyboard users.
 *
 * It binds full-strength popover-foreground, the SAME colour as the items it
 * labels, so a label looks exactly like the things beneath it. muted-foreground
 * would be the usual treatment. Transcribed as recorded and flagged.
 */
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

/**
 * 🛑 THE CHECKED STATE HAS NO RECORDED VISUAL. Both "Checked" rows in the record are
 * Highlighted rows, and they are identical to the unchecked highlighted row — there
 * is no recorded way to tell a checked radio item from an unchecked one.
 *
 * For an exclusive-choice control that is the one state that must be visible, so a
 * check indicator is rendered here: ASSERTED, not transcribed. aria-checked carries
 * it correctly either way, so assistive technology is fine — this is a sighted-user
 * gap. Figma owes a checked indicator.
 */
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
        // No disabled tokens are recorded; shared convention asserted.
        disabled && 'pointer-events-none text-muted-foreground',
      )}
    >
      <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
        {checked ? '•' : icon ?? null}
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

/**
 * Open and Highlighted bind IDENTICAL tokens (accent fill, accent-foreground text),
 * so a sub trigger looks the same whether its submenu is open or merely hovered.
 * Transcribed as recorded and flagged in the props table.
 *
 * Inset is provably inert: both Inset pairs present in the record — Open and
 * Highlighted — bind identical tokens, the same reasoning that recovered
 * Table / Row. Padding only, and no spacing token, so the indent is raw.
 */
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
        // Right opens and moves in, Left closes and returns. Flips in RTL.
        if (e.key === 'ArrowRight') onOpenChange(true);
        if (e.key === 'ArrowLeft') onOpenChange(false);
      }}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-2 py-1.5',
        'rounded-[calc(var(--radius-4))] text-popover-foreground',
        'hover:bg-accent hover:text-accent-foreground',
        open && 'bg-accent text-accent-foreground',
        inset && 'pl-8',
        disabled && 'pointer-events-none text-muted-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex w-4 shrink-0 justify-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {/* No indicator token is recorded — inherits currentColor. */}
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
}: DropdownMenuSubContentProps) {
  const id = useId();
  return (
    <div
      id={id}
      role="menu"
      aria-label={label}
      data-side={side}
      data-align={align}
      className={cn(
        'min-w-40 rounded-lg border border-border bg-popover p-1',
        'text-body-sm text-popover-foreground shadow-md',
      )}
    >
      {children}
    </div>
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

/**
 * RECOVERED FROM THE 8-ROW CAP. 12 variants = Tone(2) x State(3) x Inset(2); 8 rows
 * present. Inset is PROVABLY INERT — all three pairs present bind identical tokens
 * (Destructive/Default, Destructive/Highlighted, Default/Highlighted) — so the two
 * Inset-only gaps carry nothing new.
 *
 * The two Default/Disabled gaps rest on a WEAKER inference: Destructive/Disabled is
 * identical to Destructive/Default, so Disabled contributes no delta there, but that
 * is one observation extended across the Tone axis rather than three. Consistent
 * with this whole family recording no disabled tokens; flagged in the props table.
 *
 * Both `Show icon` and `Show shortcut` are kind: slot-toggle — the booleans
 * disappear and the nullable slots are the API.
 */
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
        // Destructive keeps `destructive` text even when highlighted — deliberate in
        // the record, but that pairing is not one the token system defines, so its
        // contrast on `accent` is unverified.
        tone === 'destructive' ? 'text-destructive' : 'text-popover-foreground',
        tone === 'destructive'
          ? 'hover:bg-accent'
          : 'hover:bg-accent hover:text-accent-foreground',
        inset && 'pl-8',
        disabled && 'pointer-events-none text-muted-foreground',
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
 * RECOVERED FROM THE CAP: all three Highlighted rows (Unchecked, Checked,
 * Indeterminate) bind identical tokens, so Value is provably inert and the two
 * missing Default rows match Unchecked/Default.
 *
 * 🛑 AND THAT INERTNESS IS ITSELF THE DEFECT — the same one as the radio item.
 * Value being inert means there is NO RECORDED WAY to tell a checked item from an
 * unchecked one. For a multi-select control that is the state that must be visible,
 * so an indicator is asserted. aria-checked carries it correctly regardless, so
 * this is a sighted-user gap.
 *
 * The icon slot and the indicator compete for the leading position; the indicator
 * wins when checked — forced by the missing token, not a design choice.
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
}

/**
 * Read from LIVE BINDINGS — its description showed 1 of 24 rows, so nothing could be
 * inferred. The read settles it in one line:
 *
 * SIDE AND ALIGN CARRY NO COLOUR DELTA AT ALL. 24 variants collapse to just THREE
 * distinct binding sets, and the only difference between those is whether the Arrow
 * node is present and where it sits in z-order. Both axes are purely geometric.
 *
 * Surface popover + border. Items: popover at rest, accent when highlighted, with
 * labels popover-foreground / accent-foreground and destructive items in destructive.
 * Shortcuts and indicators are muted-foreground.
 */
export function DropdownMenuContent({
  children,
  side = 'bottom',
  align = 'start',
  arrow = false,
  label,
}: DropdownMenuContentProps) {
  return (
    <div
      role="menu"
      aria-label={label}
      data-side={side}
      data-align={align}
      className={cn(
        'relative min-w-48 rounded-lg border border-border bg-popover p-1',
        'text-body-sm text-popover-foreground shadow-md',
      )}
    >
      {arrow ? (
        <span
          aria-hidden="true"
          className="absolute h-2 w-2 rotate-45 border border-border bg-popover"
          style={{ [side === 'top' ? 'bottom' : 'top']: '-5px', left: 'calc(50% - 4px)' }}
        />
      ) : null}
      {children}
    </div>
  );
}
