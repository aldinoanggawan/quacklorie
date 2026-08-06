import type { ActivityLevel, Goal, PaceId, Sex } from '../../types/models';

export type BodyStatKey = 'age' | 'heightCm' | 'weightKg' | 'targetWeightKg';

export interface BodyStats {
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
}

export interface StepperFieldConfig {
  key: BodyStatKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  formatter?: (value: number) => string;
}

export interface Selections {
  sex: Sex;
  activityLevel: ActivityLevel;
  goalType: Goal;
  pace: PaceId;
}

export type SelectionFieldConfig = {
  [K in keyof Selections]: {
    key: K;
    label: string;
    name: string;
    options: readonly {
      id: Selections[K];
      label: string;
      subtitle?: string;
    }[];
  };
}[keyof Selections];
