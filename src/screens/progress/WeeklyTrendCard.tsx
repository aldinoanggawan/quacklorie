import { Typography } from '../../components/ui/Typography';
import { Chip } from '../../components/ui/Chip';
import { WeekNavigator } from '../../components/WeekNavigator';
import { shortDayLabel } from '../../lib/dateHelpers';
import type { WeekDayGroup } from '../../hooks/useWeekLog';
import type { Profile } from '../../types/models';

interface WeeklyTrendCardProps {
  weekStart: Date;
  days: WeekDayGroup[];
  profile: Profile | null;
  onWeekStartChange: (weekStart: Date) => void;
}

export const WeeklyTrendCard = ({
  weekStart,
  days,
  profile,
  onWeekStartChange,
}: WeeklyTrendCardProps) => {
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
  const budget = profile?.daily_budget || profile?.tdee || 1;

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="mb-4">
        <WeekNavigator
          weekStart={weekStart}
          onWeekStartChange={onWeekStartChange}
        />
      </div>

      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="inline-block h-0 w-3 border-t border-dashed"
          style={{ borderColor: 'var(--color-muted)' }}
        />
        <Typography variant="caption" color={'var(--color-muted)'}>
          On budget
        </Typography>
      </div>

      <div className="relative mb-1.5 h-16">
        {/* Zero line — bars below this ate more than the day's budget, net of exercise */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed"
          style={{ borderColor: 'var(--color-muted)' }}
        />
        <div className="relative flex h-16 items-stretch justify-between gap-1.5">
          {days.map((day) => {
            const eaten = day.meals.reduce((s, m) => s + m.total_kcal, 0);
            const burned = day.workouts.reduce(
              (s, w) => s + (w.kcal_burned ?? 0),
              0,
            );
            const remaining = (profile?.tdee ?? 0) - eaten + burned;
            const hasData = day.meals.length > 0 || day.workouts.length > 0;
            const over = remaining < 0;
            const barPx = Math.max(
              4,
              Math.round(Math.min(Math.abs(remaining) / budget, 1.3) * 32),
            );
            return (
              <div key={day.date} className="relative h-16 flex-1">
                {hasData && (
                  <div
                    className="absolute left-1/2 w-2 -translate-x-1/2 rounded-full"
                    style={{
                      ...(over
                        ? { top: '50%', height: `${barPx}px` }
                        : { bottom: '50%', height: `${barPx}px` }),
                      background: over
                        ? 'var(--color-danger)'
                        : 'var(--color-success)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-1.5">
        {days.map((day) => (
          <Typography
            key={day.date}
            variant="caption"
            color={'var(--color-muted)'}
            className="flex-1 text-center"
          >
            {shortDayLabel(day.date)}
          </Typography>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Chip
          label="Avg eaten"
          value={avgEaten.toLocaleString()}
          accentColor={'var(--color-danger)'}
          progress={budget ? avgEaten / budget : 0}
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
          progress={budget ? avgBurned / budget : 0}
        />
        <Chip
          label="Net / day"
          value={avgNet.toLocaleString()}
          accentColor={'var(--color-brand-muted)'}
          progress={1}
        />
      </div>
    </div>
  );
};
