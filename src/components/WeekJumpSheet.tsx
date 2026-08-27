import { BottomSheet } from './BottomSheet';
import { MonthCalendar } from './MonthCalendar';
import { toDateString } from '../lib/dateHelpers';
import { addDays } from '../lib/weekHelpers';

interface WeekJumpSheetProps {
  open: boolean;
  selectedWeekStart: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export const WeekJumpSheet = ({
  open,
  selectedWeekStart,
  onSelect,
  onClose,
}: WeekJumpSheetProps) => {
  const selectedWeekEndStr = toDateString(addDays(selectedWeekStart, 6));
  const selectedWeekStartStr = toDateString(selectedWeekStart);

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="Jump to week">
      <MonthCalendar
        initialMonth={selectedWeekStart}
        isSelected={(dateStr) =>
          dateStr >= selectedWeekStartStr && dateStr <= selectedWeekEndStr
        }
        onSelectDate={onSelect}
      />
    </BottomSheet>
  );
};
