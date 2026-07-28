import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duck, type DuckEmotion } from '../../components/duck/Duck';
import { GainIcon } from '../../components/icons/GainIcon';
import { LoseIcon } from '../../components/icons/LoseIcon';
import { MaintainIcon } from '../../components/icons/MaintainIcon';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectionCard } from '../../components/SelectionCard';
import { Typography } from '../../components/ui/Typography';
import { ProgressDots } from '../../components/ProgressDots';
import { useOnboarding } from '../../store/useOnboarding';

type GoalId = 'lose' | 'maintain' | 'gain';

interface Goal {
  id: GoalId;
  label: string;
  subtitle: string;
  emotion: DuckEmotion;
  icon: React.ReactNode;
  iconBg: string;
}

const GOALS: Goal[] = [
  {
    id: 'lose',
    label: 'Lose weight',
    subtitle: 'Calorie deficit · duck gets determined',
    emotion: 'determined',
    icon: <LoseIcon />,
    iconBg: 'var(--color-goal-loss)',
  },
  {
    id: 'maintain',
    label: 'Maintain weight',
    subtitle: 'At TDEE · duck stays happy',
    emotion: 'proud',
    icon: <MaintainIcon />,
    iconBg: 'var(--color-goal-maintain)',
  },
  {
    id: 'gain',
    label: 'Gain weight',
    subtitle: 'Calorie surplus · duck gets excited',
    emotion: 'excited',
    icon: <GainIcon />,
    iconBg: 'var(--color-goal-gain)',
  },
];

export const GoalSelection = () => {
  const navigate = useNavigate();
  const { setGoal } = useOnboarding();
  const [selected, setSelected] = useState<GoalId>('lose');
  const prefersReducedMotion = useReducedMotion();

  const selectedGoal = GOALS.find((g) => g.id === selected)!;

  const handleNext = () => {
    setGoal(selected);
    navigate(selected === 'maintain' ? '/onboarding/8' : '/onboarding/7');
  };

  return (
    <ScreenContainer>
      <ProgressDots current={5} total={selected === 'maintain' ? 5 : 6} />

      <div className="pt-4">
        <Typography
          variant="label-strong"
          color={'var(--color-brand)'}
          className="mb-2 block"
        >
          Step 5 of {selected === 'maintain' ? 5 : 6}
        </Typography>
        <Typography
          variant="heading"
          as="h1"
          id="goal-heading"
          className="mb-7 tracking-heading"
        >
          What's your main goal?
        </Typography>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="goal-heading"
        className="flex flex-col gap-3"
      >
        {GOALS.map((goal, i) => (
          <SelectionCard
            key={goal.id}
            isSelected={selected === goal.id}
            onClick={() => setSelected(goal.id)}
            icon={goal.icon}
            iconBg={goal.iconBg}
            label={goal.label}
            subtitle={goal.subtitle}
            animationDelay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* Duck — decorative reaction, meaning is repeated in each option's subtitle */}
      <div
        aria-hidden="true"
        className="mt-12 flex flex-1 items-start justify-center pb-2"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
        >
          <Duck emotion={selectedGoal.emotion} size={110} />
        </motion.div>
      </div>

      <OnboardingCTA onClick={handleNext} label="Let's go" />
    </ScreenContainer>
  );
};
