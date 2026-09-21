import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Controlled group of headed disclosure sections. openIds permits several open
 * sections; onToggle delegates selection policy to the caller.
 * Consumer contract: docs/agent/components/accordion.md.
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  openIds: string[];
  onToggle: (id: string) => void;
}

export function Accordion({ items, openIds, onToggle }: AccordionProps) {
  const base = useId();

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${base}-${item.id}-panel`;
        const disabled = Boolean(item.disabled);

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-lg border border-border',
              disabled ? 'bg-muted text-muted-foreground' : 'bg-card text-foreground',
            )}
          >
            {/* Headings expose section structure; Tab moves between triggers. */}
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                disabled={disabled}
                onClick={() => onToggle(item.id)}
                className={cn(
                  // py is `space/3-5` (14px), not `space/3` (12px); the trigger
                  // binds Label/LG (14/20 medium), not Body/MD (14/20 regular).
                  'flex w-full items-center justify-between gap-2 px-4 py-[calc(var(--spacing)*3.5)] text-left text-label-lg',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset',
                  MOTION.colors,
                  disabled && 'cursor-not-allowed',
                )}
              >
                <span>{item.title}</span>
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
            </h3>

            {/* Closed panels unmount and have no height animation. Lift child state
                to preserve it across closing; trigger colours still transition. */}
            {open ? (
              <div id={panelId} className="px-4 pb-3 text-body-md">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
