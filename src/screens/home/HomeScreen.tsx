import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Typography } from '../../components/ui/Typography';
import { Chip } from '../../components/ui/Chip';
import { MealsSection } from '../../components/MealsSection';
import { WorkoutSection } from '../../components/WorkoutSection';
import { HydrationSection } from '../../components/HydrationSection';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Duck } from '../../components/duck/Duck';
import type { DuckEmotion } from '../../components/duck/Duck';
import { Spinner } from '../../components/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useDailySummary } from '../../hooks/useDailySummary';
import { useWeeklyStreak } from '../../hooks/useWeeklyStreak';
import { formatDate, greeting } from '../../lib/dateHelpers';

const duckEmotion = (remaining: number): DuckEmotion => {
  if (Math.abs(remaining) <= 50) return 'proud';
  if (remaining > 500) return 'happy';
  if (remaining >= 100) return 'worried';
  return 'sad';
};

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const today = new Date();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!profileLoading && !profile) navigate('/onboarding');
  }, [profileLoading, profile, navigate]);

  const { meals, workouts, eaten, burned, remaining, refresh } =
    useDailySummary(profile?.tdee ?? 0, today);
  const {
    daysLogged,
    totalDays,
    loading: streakLoading,
  } = useWeeklyStreak(today);

  return (
    <ScreenContainer background={'var(--color-canvas)'} className="gap-5 pt-10">
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div>
          <Typography variant="label" color={'var(--color-muted)'}>
            {formatDate(today)}
          </Typography>
          <Typography variant="subheading" as="h1" color={'var(--color-ink)'}>
            {greeting()}, {profile?.pal_name ?? '…'}
          </Typography>
        </div>

        {/* Streak pill */}
        <div className="flex items-center gap-1 rounded-full border-1.5 border-line bg-surface-brand py-1 px-2.5">
          {streakLoading ? (
            <Spinner
              size={14}
              color="var(--color-ink)"
              trackColor="rgba(0, 0, 0, 0.15)"
            />
          ) : (
            <>
              <span
                aria-hidden="true"
                className="text-sm"
                style={{ opacity: daysLogged > 0 ? 1 : 0.35 }}
              >
                🔥
              </span>
              <Typography variant="label-strong" color={'var(--color-ink)'}>
                {daysLogged}/{totalDays} days
              </Typography>
            </>
          )}
        </div>
      </div>

      {/* Hero card */}
      <div className="relative overflow-visible rounded-card border border-line bg-white p-6 pb-5 shadow-card">
        {/* Big number */}
        <div className="flex items-baseline gap-1.5 pr-24">
          <Typography
            variant="display"
            color={'var(--color-brand)'}
            className="leading-none"
          >
            {remaining.toLocaleString()}
          </Typography>
          <Typography variant="body" as="span" color={'var(--color-muted)'}>
            kcal
          </Typography>
        </div>

        {/* Eyebrow */}
        <Typography
          variant="caption"
          as="p"
          color={'var(--color-muted)'}
          className="my-1 uppercase tracking-label"
        >
          Calories remaining
        </Typography>

        {/* Duck — decorative reaction, meaning is already conveyed by the number above */}
        <motion.div
          aria-hidden="true"
          className="absolute right-4 top-3"
          animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        >
          <Duck emotion={duckEmotion(remaining)} size={80} />
        </motion.div>

        {/* Formula chips */}
        <div className="mt-10 flex items-center gap-1.5">
          <Chip
            label="TDEE"
            value={(profile?.tdee ?? 0).toLocaleString()}
            accentColor={'var(--color-brand-muted)'}
            progress={1}
          />
          <Typography variant="label-strong" color={'var(--color-muted)'}>
            −
          </Typography>
          <Chip
            label="Eaten"
            value={eaten.toLocaleString()}
            accentColor={'var(--color-danger)'}
            progress={profile?.tdee ? eaten / profile.tdee : 0}
          />
          <Typography variant="label-strong" color={'var(--color-muted)'}>
            +
          </Typography>
          <Chip
            label="Burned"
            value={burned.toLocaleString()}
            accentColor={'var(--color-success)'}
            valueColor={burned > 0 ? 'var(--color-success)' : undefined}
            borderColor={burned > 0 ? 'var(--color-success)' : undefined}
            background={burned > 0 ? 'var(--color-surface-success)' : undefined}
            progress={profile?.tdee ? burned / profile.tdee : 0}
          />
        </div>
      </div>
      <MealsSection meals={meals} />
      {user && (
        <WorkoutSection
          workouts={workouts}
          userId={user.id}
          date={today}
          onSaved={refresh}
        />
      )}
      <HydrationSection date={today} />
    </ScreenContainer>
  );
};
