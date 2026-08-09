import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Command — command menu ITEM primitive (not the palette; Command Panel is a
 * separate asset and not part of this build).
 *
 * Figma: `Command`, node 67:3, 2 variants.
 * Contract: docs/components/command.md
 *
 * The record is precise about what Selected means: "Selected=True is the
 * highlighted command o[ption]" — it is the ACTIVE DESCENDANT, not a chosen value.
 * A command palette selects nothing; it runs things. So focus never lands here: it
 * stays in the search input, which points at this item via aria-activedescendant,
 * which is why `id` is a prop. Moving real focus per keystroke would break typing.
 */
export interface CommandProps {
  children: ReactNode;
  shortcut?: string;
  selected?: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  id?: string;
}

export function Command({
  children,
  shortcut,
  selected = false,
  onSelect,
  icon,
  id,
}: CommandProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-body-md',
        selected ? 'bg-accent text-accent-foreground' : 'text-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {shortcut ? (
        // Decorative: screen readers announce the label, and the glyphs would be
        // read as punctuation. No token is recorded for it; muted asserted.
        <span aria-hidden="true" className="text-body-sm text-muted-foreground">
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}
