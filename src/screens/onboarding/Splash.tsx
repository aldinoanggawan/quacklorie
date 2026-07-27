import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PulsingDuck } from '../../components/PulsingDuck';
import { LoadingScreen } from '../../components/LoadingScreen';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { Typography } from '../../components/ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../lib/db';

export const Splash = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (loading || !session) return;
    getProfile(session.user.id).then((profile) => {
      navigate(profile?.daily_budget ? '/home' : '/onboarding', {
        replace: true,
      });
    });
  }, [loading, session, navigate]);

  if (loading || session) return <LoadingScreen />;

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-canvas pt-12 px-6 pb-11">
      {/* Warm yellow blob — top right */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? false
            : { scale: [1, 1.12, 1], x: [0, 14, 0], y: [0, -14, 0] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[-90px] top-[-90px] h-[280px] w-[280px] rounded-full bg-[rgba(232,212,74,0.55)] blur-[52px]"
      />
      {/* Teal blob — bottom left */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? false
            : { scale: [1, 1.18, 1], x: [0, -16, 0], y: [0, 14, 0] }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="pointer-events-none absolute bottom-[-110px] left-[-90px] h-[300px] w-[300px] rounded-full bg-[rgba(59,184,138,0.45)] blur-[52px]"
      />
      {/* Pink blob — bottom right */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? false
            : { scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, 20, 0] }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="pointer-events-none absolute bottom-[-70px] right-[-70px] h-[220px] w-[220px] rounded-full bg-[rgba(232,64,96,0.35)] blur-[52px]"
      />

      <div className="z-1 flex w-full max-w-screen flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-7 rounded-card border-1.5 border-line-brand bg-surface-brand-pale py-1 px-3.5 tracking-badge"
        >
          <Typography variant="label-strong" color={'var(--color-brand)'}>
            <span aria-hidden="true">✦</span> Your pocket nutrition pal
          </Typography>
        </motion.div>

        {/* Duck with pulsing ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-7"
        >
          <PulsingDuck emotion="happy" size={120} />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Typography
            variant="heading-lg"
            as="h1"
            className="mb-3 text-center leading-heading tracking-heading-lg"
          >
            Eat well, <span className="text-brand">track</span> with{' '}
            <span className="text-success">joy</span>
          </Typography>
        </motion.div>

        {/* Sub-copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <Typography
            variant="body"
            color="var(--color-muted)"
            className="mb-7 max-w-72 text-center leading-body"
          >
            Your playful daily companion for calories, hydration, and healthy
            habits.
          </Typography>
        </motion.div>

        {/* Pill tags */}
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="m-0 mb-9 flex list-none flex-wrap justify-center gap-2 p-0"
        >
          {['Calorie tracking', 'Hydration', 'Streaks'].map((tag) => (
            <Typography
              key={tag}
              as="li"
              variant="label"
              color="var(--color-muted)"
              className="rounded-card border border-line bg-[rgba(240,228,192,0.85)] py-1 px-3.5"
            >
              {tag}
            </Typography>
          ))}
        </motion.ul>

        {/* CTA */}
        <OnboardingCTA
          onClick={() => navigate('/auth')}
          label="Get started"
        />
      </div>
    </main>
  );
};
