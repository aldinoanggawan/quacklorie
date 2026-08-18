import { useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Chip } from '../../components/ui/Chip';
import { ChevronIcon } from '../../components/icons/ChevronIcon';
import { ConfirmSheet } from '../../components/ConfirmSheet';
import { LoadingScreen } from '../../components/LoadingScreen';
import { LogDateGroup, type DeleteTarget } from './LogDateGroup';
import { LogEmptyDayRow } from './LogEmptyDayRow';
import { LogEmptyState } from './LogEmptyState';
import { WeekJumpSheet } from './WeekJumpSheet';
import { useWeekLog } from '../../hooks/useWeekLog';
import { useProfile } from '../../hooks/useProfile';
import { deleteMeal, deleteWorkout, deleteWaterLog } from '../../lib/db';
import { toDateString } from '../../lib/dateHelpers';
import {
  startOfWeek,
  addDays,
  formatWeekRange,
  dayLabel,
} from '../../lib/weekHelpers';

const deleteByKind = (target: DeleteTarget): Promise<unknown> => {
  switch (target.kind) {
    case 'meal':
      return deleteMeal(target.id);
    case 'workout':
      return deleteWorkout(target.id);
    case 'water':
      return Promise.all(target.ids.map(deleteWaterLog));
  }
};

export const LogScreen = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [pickerOpen, setPickerOpen] = useState(false);
  const { days, loading, refresh } = useWeekLog(weekStart);
  const { profile } = useProfile();
  const [pendingDelete, setPendingDelete] = useState<DeleteTarget | null>(null);

  if (loading) return <LoadingScreen />;

  const isCurrentWeek =
    toDateString(weekStart) === toDateString(startOfWeek(new Date()));
  const weekHasData = days.some(
    (d) => d.meals.length > 0 || d.workouts.length > 0 || d.water.length > 0,
  );

  const totalEaten = days.reduce(
    (sum, d) => sum + d.meals.reduce((s, m) => s + m.total_kcal, 0),
    0,
  );
  const totalBurned = days.reduce(
    (sum, d) => sum + d.workouts.reduce((s, w) => s + (w.kcal_burned ?? 0), 0),
    0,
  );
  const avgEaten = Math.round(totalEaten / 7);
  const avgBurned = Math.round(totalBurned / 7);
  const avgNet = (profile?.tdee ?? 0) - avgEaten + avgBurned;

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteByKind(pendingDelete);
    setPendingDelete(null);
    refresh();
  };

  return (
    <ScreenContainer background={'var(--color-canvas)'} className="gap-5 pt-10">
      <Typography variant="subheading" as="h1" color={'var(--color-ink)'}>
        Log
      </Typography>

      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => setWeekStart((d) => addDays(d, -7))}
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
          onClick={() => setWeekStart((d) => addDays(d, 7))}
          className="cursor-pointer border-0 bg-transparent p-1 disabled:cursor-default disabled:opacity-30"
        >
          <ChevronIcon />
        </button>
      </div>

      {!weekHasData && <LogEmptyState isCurrentWeek={isCurrentWeek} />}

      {weekHasData && (
        <>
          <div className="flex items-center gap-1.5">
            <Chip
              label="Avg eaten"
              value={avgEaten.toLocaleString()}
              accentColor={'var(--color-danger)'}
              progress={profile?.tdee ? avgEaten / profile.tdee : 0}
            />
            <Chip
              label="Avg burned"
              value={avgBurned.toLocaleString()}
              accentColor={'var(--color-success)'}
              valueColor={avgBurned > 0 ? 'var(--color-success)' : undefined}
              borderColor={avgBurned > 0 ? 'var(--color-success)' : undefined}
              background={
                avgBurned > 0 ? 'var(--color-surface-success)' : undefined
              }
              progress={profile?.tdee ? avgBurned / profile.tdee : 0}
            />
            <Chip
              label="Net / day"
              value={avgNet.toLocaleString()}
              accentColor={'var(--color-brand-muted)'}
              progress={1}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {days.map((day) =>
              day.meals.length > 0 ||
              day.workouts.length > 0 ||
              day.water.length > 0 ? (
                <LogDateGroup
                  key={day.date}
                  date={day.date}
                  meals={day.meals}
                  workouts={day.workouts}
                  water={day.water}
                  profile={profile}
                  onRefresh={refresh}
                  onRequestDelete={setPendingDelete}
                />
              ) : (
                <LogEmptyDayRow key={day.date} label={dayLabel(day.date)} />
              ),
            )}
          </div>
        </>
      )}

      <WeekJumpSheet
        open={pickerOpen}
        selectedWeekStart={weekStart}
        onSelect={(date) => {
          setWeekStart(startOfWeek(date));
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />

      <ConfirmSheet
        open={pendingDelete !== null}
        title="Delete entry?"
        description={
          pendingDelete
            ? `This will permanently delete ${pendingDelete.subject} from ${dayLabel(pendingDelete.date)}.`
            : undefined
        }
        confirmLabel="Delete"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </ScreenContainer>
  );
};
