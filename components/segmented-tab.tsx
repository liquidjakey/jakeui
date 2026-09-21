import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';

/**
 * One tab item. Prefer Tabs, which composes these with linked panels and keyboard
 * navigation. Standalone use requires a tablist owner and roving focus.
 * The selected item uses card fill and a selected-tab shadow on the muted track.
 * Consumer contract: docs/agent/components/segmented-tab.md.
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
        // padY is `space/1-75` (7px), not 6; type is Label/SM (12/16), not
        // Body/XS (12/18).
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-[calc(var(--spacing)*1.75)] text-label-sm',
        // Unselected has NO fill — the container's `muted` shows through.
        // The selected tab carries a drop shadow in the file, exported as the
        // effect/selected-tab token.
        selected
          ? 'bg-card text-foreground shadow-effect-selected-tab'
          : 'text-muted-foreground',
        // Keep keyboard focus visually distinct from selection.
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        MOTION.colors,
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
