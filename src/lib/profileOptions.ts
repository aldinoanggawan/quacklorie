import type { ActivityLevel, Goal, PaceId, Sex } from '../types/models';

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Male',
  female: 'Female',
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose weight',
  maintain: 'Maintain weight',
  gain: 'Gain weight',
};

export const PACE_LABELS: Record<PaceId, string> = {
  slow: 'Slow & sustainable',
  balanced: 'Balanced',
  fast: 'Faster results',
};

export const ACTIVITY_OPTIONS: {
  id: ActivityLevel;
  label: string;
  subtitle: string;
}[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    subtitle: 'Desk job, little to no exercise',
  },
  {
    id: 'light',
    label: 'Lightly active',
    subtitle: '2–3 workouts/week e.g. spin, pilates, yoga',
  },
  {
    id: 'moderate',
    label: 'Moderately active',
    subtitle: '4–5 sessions/week + active daily life',
  },
  {
    id: 'very',
    label: 'Very active',
    subtitle: 'Daily intense training or physical job',
  },
];

export const formatWeight = (value: number) => value.toFixed(1);
