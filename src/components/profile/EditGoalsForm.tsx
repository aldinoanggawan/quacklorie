import { useMemo, useState } from 'react';
import { Button } from '../Button';
import { RadioGroupSection } from '../RadioGroupSection';
import { Stepper } from '../Stepper';
import { Typography } from '../ui/Typography';
import { saveProfile } from '../../lib/db';
import { calculateDailyBudget, calculateTdee } from '../../lib/tdee';
import { SELECTION_FIELDS, STEPPER_FIELDS } from './EditGoalsForm.options';
import type { BodyStatKey, BodyStats, Selections } from './EditGoalsForm.types';
import type { Profile } from '../../types/models';

export const EditGoalsForm = ({
  userId,
  profile,
  onSaved,
}: {
  userId: string;
  profile: Profile;
  onSaved: () => void;
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bodyStats, setBodyStats] = useState<BodyStats>({
    age: profile.age,
    heightCm: profile.height_cm,
    weightKg: profile.weight_kg,
    targetWeightKg: profile.target_weight_kg,
  });
  const updateBodyStat = (key: BodyStatKey, value: number) =>
    setBodyStats((prev) => ({ ...prev, [key]: value }));

  const [selections, setSelections] = useState<Selections>({
    sex: profile.sex,
    activityLevel: profile.activity_level,
    goalType: profile.goal_type,
    pace: profile.pace,
  });
  const updateSelection = <K extends keyof Selections>(
    key: K,
    value: Selections[K],
  ) => setSelections((prev) => ({ ...prev, [key]: value }));

  const tdee = useMemo(
    () =>
      calculateTdee({
        age: bodyStats.age,
        heightCm: bodyStats.heightCm,
        weightKg: bodyStats.weightKg,
        sex: selections.sex,
        activityLevel: selections.activityLevel,
      }),
    [
      selections.activityLevel,
      bodyStats.age,
      bodyStats.heightCm,
      bodyStats.weightKg,
      selections.sex,
    ],
  );

  const { dailyBudgetKcal, rawAdjustment } = useMemo(
    () =>
      calculateDailyBudget({
        tdee,
        weightKg: bodyStats.weightKg,
        heightCm: bodyStats.heightCm,
        sex: selections.sex,
        goal: selections.goalType,
        pace: selections.pace,
      }),
    [
      tdee,
      bodyStats.weightKg,
      bodyStats.heightCm,
      selections.sex,
      selections.goalType,
      selections.pace,
    ],
  );
  const budgetSub =
    rawAdjustment === 0
      ? 'Maintenance budget applied'
      : `${rawAdjustment > 0 ? '+' : '−'}${Math.abs(rawAdjustment)} kcal ${rawAdjustment > 0 ? 'surplus' : 'deficit'} applied`;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveProfile(userId, {
        username: profile.username,
        pal_name: profile.pal_name,
        age: bodyStats.age,
        height_cm: bodyStats.heightCm,
        weight_kg: bodyStats.weightKg,
        target_weight_kg: bodyStats.targetWeightKg,
        sex: selections.sex,
        activity_level: selections.activityLevel,
        goal_type: selections.goalType,
        pace: selections.pace,
        tdee,
        daily_budget: dailyBudgetKcal,
      });
      onSaved();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {STEPPER_FIELDS.map((field) => (
          <Stepper
            key={field.key}
            label={field.label}
            value={bodyStats[field.key]}
            unit={field.unit}
            min={field.min}
            max={field.max}
            step={field.step}
            formatter={field.formatter}
            onChange={(value) => updateBodyStat(field.key, value)}
          />
        ))}
      </div>

      {SELECTION_FIELDS.map((field) => (
        <RadioGroupSection
          key={field.key}
          label={field.label}
          name={field.name}
          options={field.options}
          value={selections[field.key]}
          onChange={(value) => updateSelection(field.key, value)}
        />
      ))}

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
            {budgetSub}
          </Typography>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        aria-busy={saving}
      >
        {saving ? 'Saving…' : 'Save'}
      </Button>
      {error && (
        <Typography
          variant="label"
          color={'var(--color-danger)'}
          className="mt-2 block text-center"
        >
          {error}
        </Typography>
      )}
    </>
  );
};
