import { useId, useRef } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import { SegmentedTab } from './segmented-tab.js';
import { cn } from '../lib/cn.js';

/**
 * Controlled tablist and associated panels, composed from SegmentedTab items.
 * Owns roving focus, orientation-aware keys and selection. Density adjusts
 * container padding and gap using spacing tokens.
 * Consumer contract: docs/agent/components/tabs.md.
 */
export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  density?: 'default' | 'compact';
  label?: string;
}

export function Tabs({
  items,
  selectedId,
  onSelect,
  orientation = 'horizontal',
  density = 'default',
  label,
}: TabsProps) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const tabId = (id: string) => `${base}-tab-${id}`;
  const panelId = (id: string) => `${base}-panel-${id}`;

  // Arrow keys move WITHIN the list; Tab moves OUT of it into the panel. That
  // split is the entire point of the tablist pattern, and it is why the unselected
  // tabs carry tabindex -1.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    let target: TabItem | undefined;
    const at = enabled.findIndex((i) => i.id === selectedId);
    if (e.key === nextKey) target = enabled[(at + 1) % enabled.length];
    else if (e.key === prevKey) target = enabled[(at - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') target = enabled[0];
    else if (e.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;

    e.preventDefault();
    onSelect(target.id);
    // Move real focus too — aria-selected alone does not move the caret.
    listRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(tabId(target.id))}`)?.focus();
  };

  const active = items.find((i) => i.id === selectedId);

  return (
    <div className={cn('flex gap-3', orientation === 'vertical' ? 'flex-row' : 'flex-col')}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        onKeyDown={onKeyDown}
        className={cn(
          'inline-flex rounded-lg bg-muted',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          // Density changes spacing without changing tab typography.
          density === 'compact'
            ? 'gap-0.5 p-[calc(var(--spacing)*0.75)]'
            : 'gap-1 p-1',
        )}
      >
        {items.map((item) => (
          <SegmentedTab
            key={item.id}
            id={tabId(item.id)}
            label={item.label}
            selected={item.id === selectedId}
            controls={panelId(item.id)}
            disabled={item.disabled}
            tabIndex={item.id === selectedId ? 0 : -1}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>

      {active ? (
        <div
          role="tabpanel"
          id={panelId(active.id)}
          aria-labelledby={tabId(active.id)}
          // Focusable so keyboard users can reach the panel's content after Tab.
          tabIndex={0}
          className="text-body-md text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
