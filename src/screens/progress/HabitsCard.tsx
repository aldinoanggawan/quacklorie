import { useEffect, useState } from 'react';
import { Typography } from '../../components/ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { DEFAULT_GOAL_ML } from '../../hooks/useHydration';
import { getBottleConfig } from '../../lib/db';
import { dayLetter } from '../../lib/dateHelpers';
import type { WeekDayGroup } from '../../hooks/useWeekLog';

interface WaterRingProps {
  fraction: number;
}

const WaterRing = ({ fraction }: WaterRingProps) => {
  const pct = Math.round(Math.min(Math.max(fraction, 0), 1) * 100);
  const isFull = pct >= 100;
  return (
    <div
      aria-hidden="true"
      className="h-3.5 w-3.5 rounded-full"
      style={{
        background: isFull
          ? 'var(--color-info)'
          : pct > 0
            ? `conic-gradient(var(--color-info) ${pct}%, var(--color-line) ${pct}%)`
            : 'var(--color-line)',
      }}
    />
  );
};

interface WorkoutDotProps {
  logged: boolean;
}

const WorkoutDot = ({ logged }: WorkoutDotProps) => (
  <div
    aria-hidden="true"
    className="h-3.5 w-3.5 rounded-full"
    style={{
      background: logged ? 'var(--color-success)' : 'var(--color-line)',
    }}
  />
);

interface HabitsCardProps {
  days: WeekDayGroup[];
  weekLabel: string;
}

export const HabitsCard = ({ days, weekLabel }: HabitsCardProps) => {
  const { user } = useAuth();
  const [bottleMl, setBottleMl] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getBottleConfig(user.id).then((config) => {
      if (!cancelled) setBottleMl(config?.bottle_ml ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const totalMl =
    days.reduce(
      (sum, d) => sum + d.water.reduce((s, w) => s + w.amount_bottles, 0),
      0,
    ) * bottleMl;
  const totalWorkoutMin = days.reduce(
    (sum, d) => sum + d.workouts.reduce((s, w) => s + w.duration_min, 0),
    0,
  );

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-card">
      <Typography
        variant="title"
        as="p"
        color={'var(--color-ink)'}
        className="mb-3"
      >
        Habits {weekLabel}
      </Typography>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-16" />
          <div className="flex flex-1 items-center justify-between gap-1">
            {days.map((day) => (
              <Typography
                key={day.date}
                variant="caption"
                color={'var(--color-muted)'}
                className="w-3.5 text-center"
              >
                {dayLetter(day.date)}
              </Typography>
            ))}
          </div>
          <div className="w-16" />
        </div>

        <div className="flex items-center gap-2">
          <Typography
            variant="label"
            color={'var(--color-ink)'}
            className="w-16"
          >
            Water
          </Typography>
          <div className="flex flex-1 items-center justify-between gap-1">
            {days.map((day) => {
              const consumedMl =
                day.water.reduce((s, w) => s + w.amount_bottles, 0) * bottleMl;
              return (
                <WaterRing
                  key={day.date}
                  fraction={consumedMl / DEFAULT_GOAL_ML}
                />
              );
            })}
          </div>
          <Typography
            variant="caption"
            color={'var(--color-muted)'}
            className="w-16 text-right"
          >
            {totalMl.toLocaleString()} ml
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Typography
            variant="label"
            color={'var(--color-ink)'}
            className="w-16"
          >
            Workout
          </Typography>
          <div className="flex flex-1 items-center justify-between gap-1">
            {days.map((day) => (
              <WorkoutDot key={day.date} logged={day.workouts.length > 0} />
            ))}
          </div>
          <Typography
            variant="caption"
            color={'var(--color-muted)'}
            className="w-16 text-right"
          >
            {totalWorkoutMin} min
          </Typography>
        </div>
      </div>
    </div>
  );
};
