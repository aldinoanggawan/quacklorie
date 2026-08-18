import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  getMealsByDateRange,
  getWorkoutsByDateRange,
  getWaterByDateRange,
} from '../lib/db';
import { toDateString } from '../lib/dateHelpers';
import { addDays } from '../lib/weekHelpers';
import type { Meal, Workout, WaterLog } from '../types/models';

export interface WeekDayGroup {
  date: string;
  meals: Meal[];
  workouts: Workout[];
  water: WaterLog[];
}

interface WeekLog {
  days: WeekDayGroup[];
  loading: boolean;
  refresh: () => void;
}

export const useWeekLog = (weekStart: Date): WeekLog => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [water, setWater] = useState<WaterLog[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const startDate = toDateString(weekStart);
  const endDate = toDateString(addDays(weekStart, 6));
  const requestKey = `${startDate}|${endDate}|${tick}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      getMealsByDateRange(user.id, startDate, endDate),
      getWorkoutsByDateRange(user.id, startDate, endDate),
      getWaterByDateRange(user.id, startDate, endDate),
    ]).then(([m, w, h]) => {
      if (cancelled) return;
      setMeals(m);
      setWorkouts(w);
      setWater(h);
      setLoadedKey(requestKey);
    });
    return () => {
      cancelled = true;
    };
  }, [user, startDate, endDate, tick, requestKey]);

  const refresh = () => setTick((t) => t + 1);

  const days: WeekDayGroup[] = Array.from({ length: 7 })
    .map((_, i) => toDateString(addDays(weekStart, i)))
    .map((date) => ({
      date,
      meals: meals.filter((m) => m.date === date),
      workouts: workouts.filter((w) => w.date === date),
      water: water.filter((w) => w.date === date),
    }));

  return { days, loading, refresh };
};
