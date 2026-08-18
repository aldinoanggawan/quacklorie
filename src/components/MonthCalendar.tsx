import { memo, useCallback, useMemo, useState } from 'react';
import { Typography } from './ui/Typography';
import { ChevronIcon } from './icons/ChevronIcon';
import { classNames } from '../lib/classNames';
import { toDateString } from '../lib/dateHelpers';
import { startOfWeek, addDays } from '../lib/weekHelpers';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const dayTextColor = (
  disabled: boolean,
  inMonth: boolean,
  isToday: boolean,
): string => {
  if (disabled) return 'var(--color-line)';
  if (!inMonth) return 'var(--color-muted)';
  if (isToday) return 'var(--color-info)';
  return 'var(--color-ink)';
};

interface CalendarDayProps {
  date: Date;
  day: number;
  disabled: boolean;
  selected: boolean;
  isFirstInRow: boolean;
  isLastInRow: boolean;
  isToday: boolean;
  inMonth: boolean;
  onSelect: (date: Date) => void;
}

const CalendarDay = memo(
  ({
    date,
    day,
    disabled,
    selected,
    isFirstInRow,
    isLastInRow,
    isToday,
    inMonth,
    onSelect,
  }: CalendarDayProps) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(date)}
      className={classNames(
        'aspect-square cursor-pointer border-0 font-[inherit] disabled:cursor-not-allowed',
        selected
          ? classNames(
              'border-y-1.5 border-brand bg-surface-brand',
              isFirstInRow && 'rounded-l-full border-l-1.5',
              isLastInRow && 'rounded-r-full border-r-1.5',
            )
          : 'rounded-control bg-transparent',
      )}
    >
      <Typography
        variant="caption"
        color={dayTextColor(disabled, inMonth, isToday)}
        style={isToday ? { fontWeight: 700 } : undefined}
      >
        {day}
      </Typography>
    </button>
  ),
);

interface MonthCalendarProps {
  initialMonth: Date;
  isSelected?: (dateStr: string) => boolean;
  onSelectDate: (date: Date) => void;
}

export const MonthCalendar = memo(
  ({ initialMonth, isSelected, onSelectDate }: MonthCalendarProps) => {
    const [viewMonth, setViewMonth] = useState(() =>
      startOfMonth(initialMonth),
    );

    const now = new Date();
    const today = toDateString(now);
    const currentWeekEnd = addDays(startOfWeek(now), 6);
    const maxSelectableDate = toDateString(currentWeekEnd);
    const maxMonth = startOfMonth(currentWeekEnd);
    const isAtMaxMonth =
      viewMonth.getFullYear() === maxMonth.getFullYear() &&
      viewMonth.getMonth() === maxMonth.getMonth();

    const cells = useMemo(() => {
      const gridStart = startOfWeek(startOfMonth(viewMonth));
      return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    }, [viewMonth]);

    const handleSelect = useCallback(
      (date: Date) => onSelectDate(date),
      [onSelectDate],
    );

    const goToPrevMonth = () =>
      setViewMonth(
        new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
      );
    const goToNextMonth = () =>
      setViewMonth(
        new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
      );

    return (
      <>
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={goToPrevMonth}
            className="cursor-pointer border-0 bg-transparent p-1"
          >
            <span className="inline-block rotate-180">
              <ChevronIcon />
            </span>
          </button>
          <Typography variant="heading" as="h2">
            {viewMonth.toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
          <button
            type="button"
            aria-label="Next month"
            disabled={isAtMaxMonth}
            onClick={goToNextMonth}
            className="cursor-pointer border-0 bg-transparent p-1 disabled:cursor-default disabled:opacity-30"
          >
            <ChevronIcon />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-y-1">
          {WEEKDAY_LABELS.map((w, i) => (
            <Typography
              key={i}
              variant="caption"
              color={'var(--color-muted)'}
              className="text-center"
            >
              {w}
            </Typography>
          ))}
          {cells.map((d, i) => {
            const dateStr = toDateString(d);
            return (
              <CalendarDay
                key={dateStr}
                date={d}
                day={d.getDate()}
                disabled={dateStr > maxSelectableDate}
                selected={isSelected?.(dateStr) ?? false}
                isFirstInRow={i % 7 === 0}
                isLastInRow={i % 7 === 6}
                isToday={dateStr === today}
                inMonth={d.getMonth() === viewMonth.getMonth()}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
      </>
    );
  },
);
