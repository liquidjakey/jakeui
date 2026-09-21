import type { ReactNode } from 'react';
import { Toggle } from './toggle.js';
import { cn } from '../lib/cn.js';

/**
 * Controlled group of Toggle buttons; each item owns its appearance.
 * Uses role=group and aria-pressed, including single mode. Tab moves between
 * buttons; single selection can still be cleared so all buttons are off.
 * Consumer contract: docs/agent/components/toggle-group.md.
 */
export interface ToggleGroupItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  pressedIds: string[];
  onPressedChange: (ids: string[]) => void;
  selection?: 'single' | 'multiple';
  orientation?: 'horizontal' | 'vertical';
  label: string;
}

export function ToggleGroup({
  items,
  pressedIds,
  onPressedChange,
  selection = 'single',
  orientation = 'horizontal',
  label,
}: ToggleGroupProps) {
  const toggle = (id: string) => {
    const on = pressedIds.includes(id);
    if (selection === 'single') {
      // Unlike a radio group there is no "must have one" guard: all members may be
      // off, which is legitimate when the members are actions rather than data.
      onPressedChange(on ? [] : [id]);
      return;
    }
    onPressedChange(on ? pressedIds.filter((x) => x !== id) : [...pressedIds, id]);
  };

  return (
    <div
      role="group"
      aria-label={label}
      // gap is `space/2` (8px) in the file, not `space/1` (4px).
      className={cn('inline-flex gap-2', orientation === 'vertical' ? 'flex-col' : 'flex-row')}
    >
      {items.map((item) => (
        <Toggle
          key={item.id}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
          pressed={pressedIds.includes(item.id)}
          onPressedChange={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
