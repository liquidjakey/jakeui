import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

/**
 * Calendar — month grid with single-date and range selection.
 *
 * Figma: `Calendar`, node 132:0, 4 variants.
 * Contract: docs/components/calendar.md
 *
 * 🛑 FIVE STATES NAMED IN PROSE, ZERO IN TOKENS. The record's description ends
 * "Includes today, selected, range, disabled, and out-of-month …", but tokensUsed
 * is border / card / foreground / radius-lg / size-13 — five CONTAINER tokens and
 * not one day-state colour. This is the widest gap between what a record promises
 * and what it binds anywhere in this build.
 *
 * The day states are asserted from precedent already established elsewhere:
 *   selected      primary / primary-foreground   (Radio Group / Indicator)
 *   range         accent / accent-foreground     (Command, Toggle, menus)
 *   today         primary stroke                 (CONFIRMED by the Date Picker read)
 *   disabled      muted-foreground               (shared convention)
 *   out-of-month  muted-foreground               (shared convention)
 *
 * Figma owes day-state bindings. This is the least-transcribed component in the
 * build and its props table's checklist box is left unticked.
 */
export interface CalendarProps {
  month: Date;
  /** Kept as a prop rather than derived: month naming is locale-dependent. */
  monthLabel: string;
  onMonthChange: (month: Date) => void;
  mode?: 'single' | 'range';
  selected?: Date | [Date, Date];
  onSelect: (value: Date) => void;
  density?: 'compact' | 'comfortable';
  isDisabled?: (date: Date) => boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({
  month,
  monthLabel,
  onMonthChange,
  mode = 'single',
  selected,
  onSelect,
  density = 'compact',
  isDisabled,
}: CalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay();
  const today = new Date();

  // Six rows of seven always, so the grid does not change height between months —
  // a jumping calendar is the classic layout-shift bug in this component.
  const cells: Array<Date> = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(year, monthIndex, i + 1 - startOffset));
  }

  const isSelected = (d: Date) => {
    if (!selected) return false;
    if (Array.isArray(selected)) return sameDay(selected[0], d) || sameDay(selected[1], d);
    return sameDay(selected, d);
  };
  const inRange = (d: Date) => {
    if (mode !== 'range' || !Array.isArray(selected)) return false;
    return d > selected[0] && d < selected[1];
  };

  return (
    <div // padding `space/4` (16px), not `space/3` (12px).
    className="inline-block rounded-lg border border-border bg-card p-4 text-body-sm text-foreground">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
          className="rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <CaretLeft size={14} weight="bold" aria-hidden="true" />
        </button>
        {/* aria-live so a month change is announced without moving focus. */}
        <span aria-live="polite" className="font-medium">
          {monthLabel}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
          className="rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <CaretRight size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <table role="grid" className="border-collapse">
        <thead>
          <tr>
            {DAY_NAMES.map((d) => (
              // Abbreviated visually, full name available to screen readers.
              <th key={d} scope="col" className="p-1 font-normal text-muted-foreground">
                <span aria-hidden="true">{d.slice(0, 2)}</span>
                <span className="sr-only">{d}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((d) => {
                const outside = d.getMonth() !== monthIndex;
                const disabled = isDisabled?.(d) ?? false;
                const sel = isSelected(d);
                const range = inRange(d);
                const isToday = sameDay(d, today);
                return (
                  <td key={d.toISOString()} className="p-0.5">
                    <button
                      type="button"
                      aria-selected={sel}
                      aria-disabled={disabled || undefined}
                      // Roving tabindex: only one day is tabbable, not 42.
                      tabIndex={sel || (!selected && isToday) ? 0 : -1}
                      disabled={disabled}
                      onClick={() => onSelect(d)}
                      className={cn(
                        'flex items-center justify-center rounded-lg',
                        density === 'comfortable' ? 'h-9 w-9' : 'h-8 w-8',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        MOTION.colors,
                        // 🛑 every line below is ASSERTED — see the block above.
                        sel && 'bg-primary text-primary-foreground',
                        !sel && range && 'bg-accent text-accent-foreground',
                        // CORRECTED 9 Aug 2026 from the Date Picker live read:
                        // `today` is a PRIMARY STROKE, not the ring outline that
                        // was asserted here. The other four day states were right.
                        !sel && !range && isToday && 'border border-primary',
                        (outside || disabled) && 'text-muted-foreground',
                        disabled && 'cursor-not-allowed',
                      )}
                    >
                      {/* Announce the full date, not just the number. */}
                      <span aria-hidden="true">{d.getDate()}</span>
                      <span className="sr-only">
                        {DAY_NAMES[d.getDay()]} {d.getDate()} {d.toLocaleString('en', { month: 'long' })}{' '}
                        {d.getFullYear()}
                      </span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
