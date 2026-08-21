import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getMealDatesByDateRange } from '../lib/db';
import { toDateString } from '../lib/dateHelpers';
import { startOfWeek, addDays } from '../lib/weekHelpers';

interface WeeklyStreak {
  daysLogged: number;
  totalDays: number;
  loading: boolean;
}

export const useWeeklyStreak = (today: Date): WeeklyStreak => {
  const { user } = useAuth();
  const [daysLogged, setDaysLogged] = useState(0);
  const [loading, setLoading] = useState(true);

  const weekStart = startOfWeek(today);
  const startDate = toDateString(weekStart);
  const endDate = toDateString(addDays(weekStart, 6));

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMealDatesByDateRange(user.id, startDate, endDate).then((dates) => {
      if (cancelled) return;
      setDaysLogged(new Set(dates).size);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, startDate, endDate]);

  return { daysLogged, totalDays: 7, loading };
};
