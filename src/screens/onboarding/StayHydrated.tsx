import { withOpacity } from '../../lib/color';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duck } from '../../components/duck/Duck';
import { GlassIcon } from '../../components/icons/GlassIcon';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { ProgressDots } from '../../components/ProgressDots';

const GlassRow = ({ value, total }: { value: number; total: number }) => (
  <div className="flex items-end justify-center gap-3.5">
    {Array.from({ length: total }, (_, i) => (
      <GlassIcon key={i} index={i} value={value} />
    ))}
  </div>
);

export const StayHydrated = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <ScreenContainer background="var(--color-canvas-water)">
      <ProgressDots
        current={2}
        activeColor={'var(--color-success)'}
        inactiveColor={withOpacity('var(--color-success)', 0.2)}
      />

      <div className="flex flex-1 flex-col justify-center gap-6">
        {/* Card — decorative illustration, meaning is repeated in the text below */}
        <div
          aria-hidden="true"
          className="relative flex min-h-60 flex-col items-center overflow-hidden rounded-3xl border border-line-success bg-surface-water pb-0 pt-20"
        >
          {/* Swimming duck */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Duck emotion="swimming" size={110} />
          </motion.div>

          {/* 250 ml floating card */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-4 top-4 flex items-center gap-1 rounded-element bg-white py-1.5 px-3.5"
            style={{
              boxShadow: `0 2px 12px ${withOpacity('var(--color-success)', 0.22)}`,
            }}
          >
            <Typography variant="label-strong" color={'var(--color-success)'}>
              💧 250 ml
            </Typography>
          </motion.div>

          {/* Wave at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden">
            <motion.svg
              width="600"
              height="100"
              viewBox="0 0 600 100"
              preserveAspectRatio="none"
              animate={prefersReducedMotion ? undefined : { x: [0, -200] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            >
              <rect
                x="0"
                y="40"
                width="600"
                height="60"
                fill={withOpacity('var(--color-success)', 0.22)}
              />
              <path
                d="M0 25 C25 10 75 40 100 25 C125 10 175 40 200 25 C225 10 275 40 300 25 C325 10 375 40 400 25 C425 10 475 40 500 25 C525 10 575 40 600 25 L600 100 L0 100 Z"
                fill={withOpacity('var(--color-success)', 0.22)}
              />
            </motion.svg>
          </div>
        </div>

        {/* Glass icons — decorative illustration, meaning is repeated in the text below */}
        <div aria-hidden="true">
          <GlassRow value={2.5} total={5} />
        </div>

        {/* Text */}
        <div>
          <Typography
            variant="heading"
            as="h1"
            className="mb-2.5 tracking-heading"
          >
            Stay hydrated
          </Typography>
          <Typography
            variant="body"
            color="var(--color-muted)"
            className="m-0 leading-body"
          >
            Log water intake with a tap. Hit your daily goal effortlessly.
          </Typography>
        </div>
      </div>

      <OnboardingCTA
        color={'var(--color-success)'}
        onClick={() => navigate('/onboarding/4')}
      />
    </ScreenContainer>
  );
};
