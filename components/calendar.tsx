import { useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../lib/cn.js';
import { MOTION } from '../lib/motion.js';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface CalendarProps {
  month: Date;
  monthLabel: string;
  onMonthChange: (month: Date) => void;
  mode?: 'single' | 'range';
  selected?: Date | [Date, Date?];
  onSelect: (value: Date) => void;
  density?: 'compact' | 'comfortable';
  isDisabled?: (date: Date) => boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const sameDay = (a: Date, b: Date) => dateKey(a) === dateKey(b);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(
    first.getFullYear(),
    first.getMonth(),
    Math.min(d.getDate(), new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()),
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
  const year = month.getFullYear(),
    monthIndex = month.getMonth();
  const today = new Date();
  const grid = useRef<HTMLTableElement>(null);
  const pendingFocus = useRef(false);
  const [focused, setFocused] = useState<Date>();
  const first = new Date(year, monthIndex, 1);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(first, i - first.getDay()));
  const inMonth = (d: Date) => d.getFullYear() === year && d.getMonth() === monthIndex;
  const enabled = (d: Date) => !isDisabled?.(d);
  const selectedStart = Array.isArray(selected) ? selected[0] : selected;
  const tabDate = [focused, selectedStart, today, ...cells.filter(inMonth)].find(
    (d) => d && inMonth(d) && enabled(d),
  );

  useLayoutEffect(() => {
    if (!pendingFocus.current || !tabDate) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(tabDate)}"]`)?.focus();
    pendingFocus.current = false;
  }, [tabDate]);

  const navigate = (e: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let next: Date;
    let direction = 1;
    switch (e.key) {
      case 'ArrowRight':
        direction = rtl ? -1 : 1;
        next = addDays(date, direction);
        break;
      case 'ArrowLeft':
        direction = rtl ? 1 : -1;
        next = addDays(date, direction);
        break;
      case 'ArrowDown':
        next = addDays(date, 7);
        break;
      case 'ArrowUp':
        direction = -1;
        next = addDays(date, -7);
        break;
      case 'Home':
        next = addDays(date, -date.getDay());
        break;
      case 'End':
        direction = -1;
        next = addDays(date, 6 - date.getDay());
        break;
      case 'PageDown':
        next = addMonths(date, e.shiftKey ? 12 : 1);
        break;
      case 'PageUp':
        direction = -1;
        next = addMonths(date, e.shiftKey ? -12 : -1);
        break;
      default:
        return;
    }
    e.preventDefault();
    // Bounded search also handles calendars where every date is disabled.
    let attempts = 0;
    while (!enabled(next) && attempts++ < 366) next = addDays(next, direction);
    if (!enabled(next)) return;
    pendingFocus.current = true;
    setFocused(next);
    if (!inMonth(next)) onMonthChange(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <div className="inline-block max-w-full rounded-lg border border-border bg-card p-4 text-body-sm text-foreground">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
          className="flex size-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <CaretLeft size={14} aria-hidden="true" />
        </button>
        <span aria-live="polite" className="font-medium">
          {monthLabel}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
          className="flex size-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <CaretRight size={14} aria-hidden="true" />
        </button>
      </div>
      <table ref={grid} role="grid" aria-label={monthLabel} className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_NAMES.map((d) => (
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
                const disabled = !enabled(d);
                const end = Array.isArray(selected) ? selected[1] : undefined;
                const sel = Boolean(
                  selectedStart && (sameDay(selectedStart, d) || (end && sameDay(end, d))),
                );
                const range =
                  mode === 'range' && selectedStart && end && d > selectedStart && d < end;
                return (
                  <td key={dateKey(d)} aria-selected={sel || Boolean(range)} className="p-0.5">
                    <button
                      type="button"
                      data-date={dateKey(d)}
                      aria-label={d.toLocaleDateString('en', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      tabIndex={tabDate && sameDay(tabDate, d) ? 0 : -1}
                      disabled={disabled}
                      onFocus={() => setFocused(d)}
                      onKeyDown={(e) => navigate(e, d)}
                      onClick={() => {
                        setFocused(d);
                        onSelect(d);
                      }}
                      className={cn(
                        'flex w-full min-w-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        density === 'comfortable' ? 'h-9 min-w-8' : 'h-8 min-w-7',
                        MOTION.colors,
                        sel
                          ? 'bg-primary text-primary-foreground'
                          : range
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent',
                        !sel && !range && sameDay(d, today) && 'border border-primary',
                        !sel && (!inMonth(d) || disabled) && 'text-muted-foreground',
                        disabled && 'cursor-not-allowed',
                      )}
                    >
                      {d.getDate()}
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
