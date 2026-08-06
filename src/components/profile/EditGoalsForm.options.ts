import {
  ACTIVITY_OPTIONS,
  formatWeight,
  GOAL_LABELS,
  PACE_LABELS,
  SEX_LABELS,
} from '../../lib/profileOptions';
import type {
  SelectionFieldConfig,
  StepperFieldConfig,
} from './EditGoalsForm.types';

export const SEX_OPTIONS = [
  { id: 'male', label: SEX_LABELS.male },
  { id: 'female', label: SEX_LABELS.female },
] as const;

export const GOAL_OPTIONS = [
  { id: 'lose', label: GOAL_LABELS.lose, subtitle: 'Calorie deficit' },
  { id: 'maintain', label: GOAL_LABELS.maintain, subtitle: 'At TDEE' },
  { id: 'gain', label: GOAL_LABELS.gain, subtitle: 'Calorie surplus' },
] as const;

export const PACE_OPTIONS = [
  { id: 'slow', label: PACE_LABELS.slow, subtitle: 'Gentle pace' },
  {
    id: 'balanced',
    label: PACE_LABELS.balanced,
    subtitle: 'Steady and realistic',
  },
  { id: 'fast', label: PACE_LABELS.fast, subtitle: 'Higher effort' },
] as const;

export const SELECTION_FIELDS: SelectionFieldConfig[] = [
  { key: 'sex', label: 'Sex', name: 'sex', options: SEX_OPTIONS },
  {
    key: 'activityLevel',
    label: 'Activity level',
    name: 'activity-level',
    options: ACTIVITY_OPTIONS,
  },
  { key: 'goalType', label: 'Goal', name: 'goal', options: GOAL_OPTIONS },
  { key: 'pace', label: 'Pace', name: 'pace', options: PACE_OPTIONS },
];

export const STEPPER_FIELDS: StepperFieldConfig[] = [
  { key: 'age', label: 'Age', unit: 'years', min: 13, max: 100 },
  { key: 'heightCm', label: 'Height', unit: 'cm', min: 120, max: 230 },
  {
    key: 'weightKg',
    label: 'Current weight',
    unit: 'kg',
    min: 35,
    max: 250,
    step: 0.5,
    formatter: formatWeight,
  },
  {
    key: 'targetWeightKg',
    label: 'Target weight',
    unit: 'kg',
    min: 35,
    max: 250,
    step: 0.5,
    formatter: formatWeight,
  },
];
