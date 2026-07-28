import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duck } from '../../components/duck/Duck';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { ProgressDots } from '../../components/ProgressDots';
import { DotIcon } from '../../components/icons/DotIcon';

const TAGS = [
  {
    label: 'Avocado',
    kcal: '100 kcal',
    dot: 'var(--color-plant-dot)',
    left: '8%',
    top: '10%',
    rotate: -8,
    delay: 0,
  },
  {
    label: 'Chicken',
    kcal: '210 kcal',
    dot: 'var(--color-brand)',
    left: '46%',
    top: '32%',
    rotate: 5,
    delay: 0.6,
  },
  {
    label: 'Broccoli',
    kcal: '55 kcal',
    dot: 'var(--color-success)',
    left: '14%',
    top: '54%',
    rotate: -4,
    delay: 1.1,
  },
];

export const TrackCalories = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <ScreenContainer>
      <ProgressDots current={1} />

      <div className="flex flex-1 flex-col justify-center gap-7">
        {/* Card — decorative illustration, meaning is repeated in the text below */}
        <div
          aria-hidden="true"
          className="relative h-72 overflow-hidden rounded-3xl border border-line-brand bg-surface-brand"
        >
          {/* Floating calorie tags */}
          {TAGS.map((tag) => (
            <motion.div
              key={tag.label}
              animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: tag.delay,
              }}
              className="absolute flex items-center gap-1.5 whitespace-nowrap rounded-card bg-white py-1.5 px-3 shadow-float"
              style={{
                left: tag.left,
                top: tag.top,
                transform: `rotate(${tag.rotate}deg)`,
              }}
            >
              <DotIcon color={tag.dot} />
              <Typography variant="label-strong">{tag.label}</Typography>
              <Typography variant="caption" color={tag.dot}>
                {tag.kcal}
              </Typography>
            </motion.div>
          ))}

          {/* Plate with food */}
          <div className="absolute bottom-0 left-[18%] flex flex-col items-center">
            <div className="relative z-1 -mb-5 flex gap-1">
              <div className="h-7 w-5 rounded-[50%] bg-plant-dark" />
              <div className="mt-3 h-6 w-5 rounded-[50%] bg-plant-light" />
              <div className="mt-2 h-5 w-7 rounded-[50%] bg-food" />
            </div>
            <div className="h-7 w-28 rounded-[50%] bg-white shadow-plate" />
            <div className="mt-0.5 h-2.5 w-24 rounded-[50%] bg-black/10" />
          </div>

          {/* Duck peeking from bottom-right */}
          <motion.div
            className="absolute -bottom-6 right-4"
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
          >
            <Duck emotion="happy" size={110} />
          </motion.div>
        </div>

        {/* Text */}
        <div>
          <Typography
            variant="heading"
            as="h1"
            className="mb-2.5 tracking-heading"
          >
            Track calories
          </Typography>
          <Typography
            variant="body"
            color="var(--color-muted)"
            className="m-0 leading-body"
          >
            Snap a photo and let AI do the rest.
          </Typography>
        </div>
      </div>

      <OnboardingCTA onClick={() => navigate('/onboarding/3')} />
    </ScreenContainer>
  );
};
