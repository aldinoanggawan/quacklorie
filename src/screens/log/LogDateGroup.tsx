import { useState } from 'react';
import { Typography } from '../../components/ui/Typography';
import { Chip } from '../../components/ui/Chip';
import { ChevronIcon } from '../../components/icons/ChevronIcon';
import { WorkoutCard } from '../../components/WorkoutCard';
import { LogMealCard } from './LogMealCard';
import { LogWaterRow } from './LogWaterRow';
import { dayLabel } from '../../lib/weekHelpers';
import { toDateString } from '../../lib/dateHelpers';
import { classNames } from '../../lib/classNames';
import { MEAL_LABELS } from '../../lib/mealLabels';
import type { Meal, Workout, WaterLog, Profile } from '../../types/models';

export type DeleteTarget =
  | { kind: 'meal'; id: string; date: string; subject: string }
  | { kind: 'workout'; id: string; date: string; subject: string }
  | { kind: 'water'; ids: string[]; date: string; subject: string };

interface LogDateGroupProps {
  date: string;
  meals: Meal[];
  workouts: Workout[];
  water: WaterLog[];
  profile: Profile | null;
  onRefresh: () => void;
  onRequestDelete: (target: DeleteTarget) => void;
}

export const LogDateGroup = ({
  date,
  meals,
  workouts,
  water,
  profile,
  onRefresh,
  onRequestDelete,
}: LogDateGroupProps) => {
  const [expanded, setExpanded] = useState(
    () => date === toDateString(new Date()),
  );

  const eaten = meals.reduce((sum, m) => sum + m.total_kcal, 0);
  const burned = workouts.reduce((sum, w) => sum + (w.kcal_burned ?? 0), 0);
  const net = (profile?.tdee ?? 0) - eaten + burned;
  const showSummary = meals.length > 0 || workouts.length > 0;

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-4 font-[inherit] text-left"
      >
        <Typography variant="label-strong" color={'var(--color-ink)'}>
          {dayLabel(date)}
        </Typography>
        <span
          className={classNames(
            'inline-block transition-transform',
            expanded ? '-rotate-90' : 'rotate-90',
          )}
        >
          <ChevronIcon />
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {showSummary && (
            <div className="mb-3 flex items-center gap-1.5">
              <Chip
                label="Eaten"
                value={eaten.toLocaleString()}
                accentColor={'var(--color-danger)'}
                progress={profile?.tdee ? eaten / profile.tdee : 0}
              />
              <Chip
                label="Burned"
                value={burned.toLocaleString()}
                accentColor={'var(--color-success)'}
                valueColor={burned > 0 ? 'var(--color-success)' : undefined}
                borderColor={burned > 0 ? 'var(--color-success)' : undefined}
                background={
                  burned > 0 ? 'var(--color-surface-success)' : undefined
                }
                progress={profile?.tdee ? burned / profile.tdee : 0}
              />
              <Chip
                label="Net"
                value={net.toLocaleString()}
                accentColor={'var(--color-brand-muted)'}
                progress={1}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {meals.map((meal) => (
              <LogMealCard
                key={meal.id}
                meal={meal}
                onDelete={() =>
                  onRequestDelete({
                    kind: 'meal',
                    id: meal.id,
                    date,
                    subject: `this ${MEAL_LABELS[meal.meal_type]} entry`,
                  })
                }
              />
            ))}

            {water.length > 0 && (
              <LogWaterRow
                logs={water}
                onDelete={() =>
                  onRequestDelete({
                    kind: 'water',
                    ids: water.map((w) => w.id),
                    date,
                    subject: `this water log (${water.length} ${water.length === 1 ? 'entry' : 'entries'})`,
                  })
                }
              />
            )}

            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onSaved={onRefresh}
                onDelete={() =>
                  onRequestDelete({
                    kind: 'workout',
                    id: workout.id,
                    date,
                    subject: `this ${workout.name} workout`,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
