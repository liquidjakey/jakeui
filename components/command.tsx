import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Command option anatomy, not a complete palette. A parent must own search,
 * active-descendant navigation and activation. Keep focus on the parent input
 * and point aria-activedescendant at the option id.
 * Consumer contract: docs/agent/components/command.md.
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
        // gap `space/3` (12px), py `space/2-5` (10px), label Label/LG.
        'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-label-lg',
        selected ? 'bg-accent text-accent-foreground' : 'text-foreground',
        MOTION.colors,
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
        // read as punctuation. Use muted-foreground.
        <span aria-hidden="true" className="text-caption-sm text-muted-foreground">
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}
