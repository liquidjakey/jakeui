import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Single controlled disclosure. Use Accordion for a group of headed sections.
 * Closed content unmounts; stateful children should lift state if it must persist.
 * Consumer contract: docs/agent/components/collapsible.md.
 */
export interface CollapsibleProps {
  triggerLabel: string;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

export function Collapsible({
  triggerLabel,
  children,
  open,
  onOpenChange,
  disabled = false,
}: CollapsibleProps) {
  const id = useId();
  const panelId = `${id}-panel`;

  return (
    <div
      className={cn(
        'rounded-lg border border-border',
        disabled ? 'bg-muted text-muted-foreground' : 'bg-card text-foreground',
      )}
    >
      <button
        type="button"
        // The trigger exposes expanded state and its controlled panel ID.
        // table; a lone Collapsible usually sits inside content that already has
        // one, and a second would pollute the outline.
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
        className={cn(
          // px is `space/3-5` (14px), not `space/4` (16px); the trigger binds
          // Label/LG (14/20 medium), not Body/MD (14/20 regular).
          'flex w-full items-center justify-between gap-2 px-[calc(var(--spacing)*3.5)] py-3 text-left text-label-lg',
          // Keep a visible keyboard focus ring.
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset',
          MOTION.colors,
          disabled && 'cursor-not-allowed',
        )}
      >
        <span>{triggerLabel}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {/* Closed content unmounts, so only trigger colours animate. */}
      {open ? (
        <div id={panelId} className="px-4 pb-3 text-body-md">
          {children}
        </div>
      ) : null}
    </div>
  );
}
