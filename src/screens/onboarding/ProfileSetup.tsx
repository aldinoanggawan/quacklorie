import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duck } from '../../components/duck/Duck';
import { FemaleIcon } from '../../components/icons/FemaleIcon';
import { MaleIcon } from '../../components/icons/MaleIcon';
import { OnboardingCTA } from '../../components/OnboardingCTA';
import { RadioGroupSection } from '../../components/RadioGroupSection';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Stepper } from '../../components/Stepper';
import { Typography } from '../../components/ui/Typography';
import { useOnboarding } from '../../store/useOnboarding';
import type { ActivityLevel, Sex } from '../../types/models';
import { useAuth, getUsername } from '../../hooks/useAuth';
import { saveProfile } from '../../lib/db';
import { calculateDailyBudget, calculateTdee } from '../../lib/tdee';
import {
  ACTIVITY_OPTIONS,
  formatWeight,
  GOAL_LABELS,
  SEX_LABELS,
} from '../../lib/profileOptions';

const SexIcon = ({ sex }: { sex: Sex }) =>
  sex === 'male' ? <MaleIcon /> : <FemaleIcon />;

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const { goal, pace, profile, palName } = useOnboarding();
  const { user } = useAuth();
  const [age, setAge] = useState(profile?.age ?? 26);
  const [heightCm, setHeightCm] = useState(profile?.heightCm ?? 175);
  const [weightKg, setWeightKg] = useState(profile?.weightKg ?? 70);
  const [targetWeightKg, setTargetWeightKg] = useState(
    profile?.targetWeightKg ?? 65,
  );
  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activityLevel ?? 'light',
  );
  const prefersReducedMotion = useReducedMotion();

  const tdee = useMemo(
    () => calculateTdee({ age, heightCm, weightKg, sex, activityLevel }),
    [activityLevel, age, heightCm, sex, weightKg],
  );

  const { dailyBudgetKcal, rawAdjustment } = useMemo(
    () => calculateDailyBudget({ tdee, weightKg, heightCm, sex, goal, pace }),
    [tdee, weightKg, heightCm, sex, goal, pace],
  );
  const goalLabel = GOAL_LABELS[goal];
  const budgetSub =
    rawAdjustment === 0
      ? 'Maintenance budget applied'
      : `${rawAdjustment > 0 ? '+' : '−'}${Math.abs(rawAdjustment)} kcal ${rawAdjustment > 0 ? 'surplus' : 'deficit'} applied`;

  const handleNext = async () => {
    await saveProfile(user!.id, {
      username: getUsername(user),
      pal_name: palName,
      age,
      height_cm: heightCm,
      weight_kg: weightKg,
      target_weight_kg: targetWeightKg,
      sex,
      activity_level: activityLevel,
      goal_type: goal,
      pace,
      tdee,
      daily_budget: dailyBudgetKcal,
    });
    navigate('/home');
  };

  return (
    <ScreenContainer className="gap-5 pt-10">
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Typography variant="subheading" color={'var(--color-muted)'}>
            Almost there!
          </Typography>
          <Typography
            variant="heading-lg"
            as="h1"
            className="mt-2 leading-subheading"
          >
            Tell us about yourself
          </Typography>
        </div>
        <motion.div
          aria-hidden="true"
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
          className="mt-1 shrink-0"
        >
          <Duck emotion="happy" />
        </motion.div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stepper
          label="Age"
          value={age}
          unit="years"
          min={13}
          max={100}
          onChange={setAge}
        />
        <Stepper
          label="Height"
          value={heightCm}
          unit="cm"
          min={120}
          max={230}
          onChange={setHeightCm}
        />
        <Stepper
          label="Current weight"
          value={weightKg}
          unit="kg"
          min={35}
          max={250}
          step={0.5}
          formatter={formatWeight}
          onChange={setWeightKg}
        />
        <Stepper
          label="Target weight"
          value={targetWeightKg}
          unit="kg"
          min={35}
          max={250}
          step={0.5}
          formatter={formatWeight}
          onChange={setTargetWeightKg}
        />
      </div>

      <div role="radiogroup" aria-label="Sex" className="flex gap-2.5">
        {(['male', 'female'] as Sex[]).map((option) => {
          const isSelected = sex === option;
          return (
            <label
              key={option}
              className={
                isSelected
                  ? 'flex-1 cursor-pointer rounded-element border-1.5 border-brand bg-surface-brand py-3 px-2 text-center text-ink transition-all duration-150 [font-family:inherit] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2'
                  : 'flex-1 cursor-pointer rounded-element border-1.5 border-line bg-white py-3 px-2 text-center text-ink transition-all duration-150 [font-family:inherit] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2'
              }
            >
              <input
                type="radio"
                name="sex"
                value={option}
                checked={isSelected}
                onChange={() => setSex(option)}
                className="sr-only"
              />
              <span aria-hidden="true" className="mb-1 flex justify-center">
                <SexIcon sex={option} />
              </span>
              <Typography variant="label" color={'var(--color-muted)'}>
                {SEX_LABELS[option]}
              </Typography>
            </label>
          );
        })}
      </div>

      <RadioGroupSection
        label="Activity level"
        name="activity-level"
        options={ACTIVITY_OPTIONS}
        value={activityLevel}
        onChange={setActivityLevel}
      />

      <div className="flex items-center justify-between rounded-2xl border-1.5 border-line-brand bg-surface-brand py-3 px-4">
        <div>
          <Typography variant="body" color={'var(--color-muted)'}>
            Your estimated daily budget
          </Typography>
          <Typography
            variant="heading"
            as="p"
            className="mt-1 leading-number tabular-nums"
          >
            {dailyBudgetKcal.toLocaleString()} kcal
          </Typography>
          <Typography
            variant="label"
            color={'var(--color-muted)'}
            className="mt-1 block"
          >
            {goalLabel} · {budgetSub}
          </Typography>
        </div>
        <span aria-hidden="true">
          <Duck emotion="proud" size={62} />
        </span>
      </div>

      <div className="pt-0.5">
        <OnboardingCTA
          onClick={handleNext}
          label="Calculate my plan"
          animationDelay={0.1}
        />
      </div>
    </ScreenContainer>
  );
};
