import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Collapsible — single disclosure region.
 *
 * Figma: `Collapsible`, node 89:*, 4 variants.
 * Contract: docs/components/collapsible.md
 *
 * Token-identical to Accordion. That is defensible rather than a duplication
 * problem: the Figma master models ONE disclosure item, which is what a
 * Collapsible is, while an Accordion is a group of the same item. The difference
 * is real in code — Accordion takes items[] and openIds[], this takes one boolean.
 *
 * The map types State as 'closed' | 'open' and Disabled as 'false' | 'true'.
 * Both are emitted as real booleans: a stringly-typed boolean is a Figma artefact,
 * not an API.
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
        // The record: "The trigger is a button carrying aria-expanded and
        // aria-controls." Deliberately NOT wrapped in a heading — see the props
        // table; a lone Collapsible usually sits inside content that already has
        // one, and a second would pollute the outline.
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-body-md',
          // Asserted, not transcribed: no focus token is recorded on this set.
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset',
          disabled && 'cursor-not-allowed',
        )}
      >
        <span>{triggerLabel}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {/*
        The record: "The panel stays in the accessibility tree only while open."
        Unmounted when closed, not hidden with CSS — display:none would still be
        in the DOM for some tooling, and the record asks for absence.
      */}
      {open ? (
        <div id={panelId} className="px-4 pb-3 text-body-md">
          {children}
        </div>
      ) : null}
    </div>
  );
}
