import { useState } from 'react';
import { Typography } from './ui/Typography';
import { ChevronIcon } from './icons/ChevronIcon';
import { WeekJumpSheet } from './WeekJumpSheet';
import { toDateString } from '../lib/dateHelpers';
import { startOfWeek, addDays, formatWeekRange } from '../lib/weekHelpers';

interface WeekNavigatorProps {
  weekStart: Date;
  onWeekStartChange: (weekStart: Date) => void;
}

export const WeekNavigator = ({
  weekStart,
  onWeekStartChange,
}: WeekNavigatorProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isCurrentWeek =
    toDateString(weekStart) === toDateString(startOfWeek(new Date()));

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => onWeekStartChange(addDays(weekStart, -7))}
          className="cursor-pointer border-0 bg-transparent p-1"
        >
          <span className="inline-block rotate-180">
            <ChevronIcon />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="cursor-pointer border-0 bg-transparent p-0 font-[inherit]"
        >
          <Typography variant="label-strong" color={'var(--color-ink)'}>
            {formatWeekRange(weekStart, addDays(weekStart, 6), isCurrentWeek)}
          </Typography>
        </button>
        <button
          type="button"
          aria-label="Next week"
          disabled={isCurrentWeek}
          onClick={() => onWeekStartChange(addDays(weekStart, 7))}
          className="cursor-pointer border-0 bg-transparent p-1 disabled:cursor-default disabled:opacity-30"
        >
          <ChevronIcon />
        </button>
      </div>

      <WeekJumpSheet
        open={pickerOpen}
        selectedWeekStart={weekStart}
        onSelect={(date) => {
          onWeekStartChange(startOfWeek(date));
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
};
