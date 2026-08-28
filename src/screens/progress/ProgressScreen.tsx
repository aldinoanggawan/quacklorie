import { useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Chip } from '../../components/ui/Chip';
import { Duck } from '../../components/duck/Duck';
import { LoadingScreen } from '../../components/LoadingScreen';
import { WeeklyTrendCard } from './WeeklyTrendCard';
import { HabitsCard } from './HabitsCard';
import { useWeekLog } from '../../hooks/useWeekLog';
import { useProfile } from '../../hooks/useProfile';
import { toDateString } from '../../lib/dateHelpers';
import { startOfWeek, addDays, weekPhrase } from '../../lib/weekHelpers';
import { streakEmotion } from '../../lib/duckHelpers';

export const ProgressScreen = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const { days, loading } = useWeekLog(weekStart);
  const { profile, loading: profileLoading } = useProfile();

  if (loading || profileLoading) return <LoadingScreen />;

  const isCurrentWeek =
    toDateString(weekStart) === toDateString(startOfWeek(new Date()));
  const weekLabel = weekPhrase(weekStart, addDays(weekStart, 6), isCurrentWeek);
  const daysLogged = days.filter((d) => d.meals.length > 0).length;

  const weightDelta = profile
    ? profile.weight_kg - profile.target_weight_kg
    : 0;
  const absDelta = Math.abs(weightDelta).toFixed(1);
  const weightMessage =
    profile?.goal_type === 'maintain'
      ? `Aiming to hold steady around ${profile.target_weight_kg} kg`
      : Number(absDelta) === 0
        ? "You're at your goal weight!"
        : `${absDelta} kg to ${profile?.goal_type === 'lose' ? 'lose' : 'gain'}`;

  return (
    <ScreenContainer background={'var(--color-canvas)'} className="gap-5 pt-10">
      <Typography variant="subheading" as="h1" color={'var(--color-ink)'}>
        Progress
      </Typography>

      {/* Primary: streak hero */}
      <div className="relative overflow-visible rounded-card border border-line bg-white p-6 pb-5 shadow-card">
        <div className="flex items-baseline gap-1.5 pr-24">
          <Typography
            variant="display"
            color={'var(--color-brand)'}
            className="leading-none"
          >
            {daysLogged}/7
          </Typography>
        </div>
        <Typography
          variant="caption"
          as="p"
          color={'var(--color-muted)'}
          className="my-1 uppercase tracking-label"
        >
          Days logged {weekLabel}
        </Typography>
        <div aria-hidden="true" className="absolute right-4 top-3">
          <Duck emotion={streakEmotion(daysLogged, 7)} size={80} />
        </div>
      </div>

      {/* Secondary: weekly trend */}
      <WeeklyTrendCard
        weekStart={weekStart}
        days={days}
        profile={profile}
        onWeekStartChange={setWeekStart}
      />

      {/* Secondary: water & workout habits */}
      <HabitsCard days={days} weekLabel={weekLabel} />

      {/* Tertiary: weight goal */}
      {profile && (
        <div className="rounded-card border border-line bg-white p-5 shadow-card">
          <Typography
            variant="title"
            as="p"
            color={'var(--color-ink)'}
            className="mb-3"
          >
            Weight goal
          </Typography>
          <div className="flex items-center gap-1.5">
            <Chip
              label="Current"
              value={`${profile.weight_kg} kg`}
              accentColor={'var(--color-brand-muted)'}
              progress={1}
            />
            <Chip
              label="Goal"
              value={`${profile.target_weight_kg} kg`}
              accentColor={'var(--color-brand)'}
              progress={1}
            />
          </div>
          <Typography
            variant="body-sm"
            as="p"
            color={'var(--color-muted)'}
            className="mt-3"
          >
            {weightMessage}
          </Typography>
        </div>
      )}
    </ScreenContainer>
  );
};
