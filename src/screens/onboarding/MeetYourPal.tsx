import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PulsingDuck } from '../../components/PulsingDuck';
import { useOnboarding } from '../../store/useOnboarding';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { ProgressDots } from '../../components/ProgressDots';
import { TRANSITION_DURATION_MS } from '../../constants';

const QUICK_NAMES = ['Waddles', 'Pudding', 'Biscuit', 'Mochi'];

export const MeetYourPal = () => {
  const navigate = useNavigate();
  const { palName, setPalName } = useOnboarding();
  const [name, setName] = useState(palName);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(
      () => inputRef.current?.focus(),
      TRANSITION_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setPalName(name.trim() || 'Quackers');
    navigate('/onboarding/6');
  };

  return (
    <ScreenContainer>
      <ProgressDots current={4} />

      <div className="flex flex-1 flex-col justify-center gap-5">
        {/* Card */}
        <div className="relative flex flex-col items-center rounded-3xl bg-surface-warm py-7 px-6 shadow-card">
          {/* Speech bubble */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-5 top-10 max-w-[100px] rounded-[14px_14px_14px_4px] border-1.5 border-line bg-white py-2 px-3 leading-bubble shadow-float"
          >
            <Typography variant="label">Quack! Nice to meet you! 🐥</Typography>
          </motion.div>

          {/* Pulsing ring + excited duck */}
          <div className="mt-20">
            <PulsingDuck emotion="excited" size={110} />
          </div>

          {/* Name tag */}
          <div className="mb-10 rounded-card border border-line bg-surface-brand-subtle py-1 px-4 text-center">
            <Typography variant="label" color="var(--color-muted)">
              your pal /{' '}
              <strong className="text-brand">
                {name.trim() || 'Quackers'}
              </strong>
            </Typography>
          </div>
        </div>

        {/* Name input */}
        <div>
          <Typography
            variant="input-label"
            as="label"
            htmlFor="pal-name"
            color="var(--color-muted)"
            className="mb-1.5 block"
          >
            Give your pal a name
          </Typography>
          <input
            id="pal-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Enter name"
            className="box-border w-full rounded-element border-1.5 border-line bg-white py-3.5 px-4 text-input font-medium text-ink outline-none transition-colors duration-200 [font-family:inherit] focus:border-brand"
          />
        </div>

        {/* Quick-pick chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_NAMES.map((n) => (
            <button
              key={n}
              onClick={() => setName(n)}
              aria-pressed={name === n}
              className={
                name === n
                  ? 'cursor-pointer rounded-full border-1.5 border-brand bg-brand py-1.5 px-3.5 font-[inherit] transition-all duration-200'
                  : 'cursor-pointer rounded-full border-1.5 border-line bg-surface-brand-subtle py-1.5 px-3.5 font-[inherit] transition-all duration-200'
              }
            >
              <Typography
                variant="label-strong"
                color={name === n ? 'white' : 'var(--color-muted)'}
              >
                {n}
              </Typography>
            </button>
          ))}
        </div>

        {/* Text */}
        <div>
          <Typography
            variant="heading"
            as="h1"
            className="mb-2.5 tracking-heading"
          >
            Meet your pal
          </Typography>
          <Typography
            variant="body"
            color="var(--color-muted)"
            className="m-0 leading-body"
          >
            Name your duck companion — they'll cheer you on every single day.
          </Typography>
        </div>
      </div>

      <OnboardingCTA onClick={handleNext} />
    </ScreenContainer>
  );
};
