import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * SegmentedTab — the ITEM half of the tab control.
 *
 * Figma: `Segmented Tab`, node 19:*, 2 variants.
 * Contract: docs/components/segmented-tab.md
 *
 * Its own description: "Place instances inside a secondary-colored segmented-
 * control container." That container is `Tabs`, which binds `muted` and carries
 * NO selected-state treatment. This component carries the selected-state treatment
 * and no container. Neither is complete alone — read tabs.md and segmented-tab.md
 * together.
 *
 * Note the inversion: the SELECTED tab takes the lighter `card` fill and appears to
 * lift out of the muted track, rather than being highlighted. That only reads
 * correctly inside the container.
 */
export interface SegmentedTabProps {
  label: string;
  selected?: boolean;
  onSelect: () => void;
  /** Id of the panel this tab controls. */
  controls?: string;
  disabled?: boolean;
  id?: string;
  /** Set by the parent Tabs; a standalone tab cannot know its siblings. */
  tabIndex?: number;
  icon?: ReactNode;
}

export function SegmentedTab({
  label,
  selected = false,
  onSelect,
  controls,
  disabled = false,
  id,
  tabIndex,
  icon,
}: SegmentedTabProps) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={selected}
      aria-controls={controls}
      // Roving tabindex: "Only the selected tab is in the tab order." The parent
      // supplies this, because a standalone tab cannot know its siblings.
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-body-xs',
        // Unselected has NO fill — the container's `muted` shows through.
        selected ? 'bg-card text-foreground' : 'text-muted-foreground',
        // Asserted from the record's own prose rather than a binding: "focus
        // remains visually distinguishable using the shared ring treatment."
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      {label}
    </button>
  );
}
