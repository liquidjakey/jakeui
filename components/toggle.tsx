import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

/**
 * Toggle — two-state action button.
 *
 * Figma: `Toggle`, node 82:*, 8 variants.
 * Contract: docs/components/toggle.md
 *
 * THE RECORD'S ACCESSIBILITY CONTRACT WAS WRONG UNTIL 9 AUG 2026. Toggle was
 * mapped to the `choice` archetype, which told it to expose state via aria-checked
 * and referenced radio-group arrow keys. A toggle button is the W3C APG Toggle
 * Button pattern: aria-pressed, and BOTH Space and Enter activate it (a native
 * <button> gives that for free — a checkbox-style Space-only handler would be
 * wrong). A `togglebutton` archetype was added and the record re-enriched.
 *
 * 8 variants is exactly at the description generator's 8-row cap, so nothing is
 * truncated here. One more variant and it would have been.
 */
export interface ToggleProps {
  label: string;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
  /** When set and label is used as the name only, this renders icon-only. */
  icon?: ReactNode;
  iconOnly?: boolean;
}

export function Toggle({
  label,
  pressed,
  onPressedChange,
  disabled = false,
  icon,
  iconOnly = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      // aria-pressed, NEVER aria-checked. See the block above.
      aria-pressed={pressed}
      // For an icon-only toggle the name must describe the ACTION, not the state —
      // "Bold", not "Bolded".
      aria-label={iconOnly ? label : undefined}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        // radius/md here, where every other control in this system binds radius/lg.
        // Transcribed faithfully; flagged in the props table as worth checking.
        'inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-body-md',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        pressed
          ? // Pressed + hover binds the SAME tokens as pressed at rest, so there is
            // deliberately no hover change here. Transcribed as recorded and
            // flagged — every other interactive component does change on hover.
            'border-transparent bg-accent text-accent-foreground'
          : 'border-border bg-card text-foreground',
        // Pressed + disabled loses the pressed state entirely — it renders exactly
        // like unpressed + disabled. aria-pressed still reports it correctly, so
        // assistive technology is fine, but a sighted user cannot tell. Recorded.
        disabled && 'cursor-not-allowed border-transparent bg-muted text-muted-foreground',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
      {iconOnly ? null : label}
    </button>
  );
}
