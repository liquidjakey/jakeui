import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * Accordion — vertically stacked disclosure sections.
 *
 * Figma: `Accordion`, node 85:*, 4 variants.
 * Contract: docs/components/accordion.md
 *
 * Figma models a SINGLE item; an Accordion is a group of them. `items[]` and
 * `openIds[]` are the code-side expression of that, and the reason this differs
 * from Collapsible despite identical tokens.
 *
 * `openIds` is an ARRAY rather than one id: several sections may be open at once,
 * which the Figma State enum cannot express.
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
            {/*
              Wrapped in a heading so sections are navigable by heading — the
              difference from Collapsible, whose lone trigger is not. The APG
              reserves arrow keys for tablists, so Tab (not arrows) moves between
              these triggers; nothing custom is bound.
            */}
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

            {/*
              Unmounted when closed: "the panel stays in the accessibility tree
              only while open."

              ⚠️ THERE IS DELIBERATELY NO OPEN/CLOSE HEIGHT ANIMATION, and this
              is the one place in the system where motion was attempted and
              backed out. A transition cannot animate an element that does not
              exist when closed, so animating this means keeping it mounted. The
              standard `grid-template-rows: 0fr -> 1fr` technique was tried, with
              `aria-hidden` + `inert` preserving the record's contract. It does
              not survive the transition in Chrome: measured in Storybook, an
              opened panel settled at 0px against a 32px content height, because
              an animating `fr` row is interpolated against zero free space in an
              auto-height grid. Forcing `1fr` with the transition OFF resolved to
              32px correctly, which isolates it to the animation, not the layout.

              A max-height cap would work but needs a magic pixel number, which
              the archetype's first do forbids. Revisit with `calc-size()` /
              `interpolate-size: allow-keywords` once it can be emitted into the
              generated stylesheet. The trigger still animates its colours.
            */}
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
