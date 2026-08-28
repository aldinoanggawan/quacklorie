import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  getWaterForDate,
  getBottleConfig,
  logWater,
  saveBottleConfig,
} from '../lib/db';
import { toDateString } from '../lib/dateHelpers';
import type { WaterLog, BottleConfig } from '../types/models';

export const DEFAULT_GOAL_ML = 2000;

interface Hydration {
  logs: WaterLog[];
  bottleConfig: BottleConfig | null;
  bottleMl: number;
  goalMl: number;
  consumedMl: number;
  totalBlocks: number;
  filledValue: number;
  loading: boolean;
  logAmount: (bottles: number) => Promise<void>;
  setupBottle: (name: string, ml: number) => Promise<void>;
  refresh: () => void;
}

export const useHydration = (date: Date): Hydration => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [bottleConfig, setBottleConfig] = useState<BottleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const dateStr = toDateString(date);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      getWaterForDate(user.id, dateStr),
      getBottleConfig(user.id),
    ]).then(([w, config]) => {
      if (cancelled) return;
      setLogs(w);
      setBottleConfig(config);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, dateStr, tick]);

  const refresh = () => setTick((t) => t + 1);

  const bottleMl = bottleConfig?.bottle_ml ?? 0;
  const goalMl = DEFAULT_GOAL_ML;
  const consumedMl =
    bottleMl > 0
      ? logs.reduce((sum, l) => sum + l.amount_bottles * bottleMl, 0)
      : 0;
  const totalBlocks = bottleMl > 0 ? Math.round(goalMl / bottleMl) : 0;
  // Float so GlassIcon can render partial fill on the last glass
  const filledValue =
    bottleMl > 0 ? Math.min(consumedMl / bottleMl, totalBlocks) : 0;

  const logAmount = async (bottles: number) => {
    if (!user) return;
    await logWater(user.id, { date: dateStr, amount_bottles: bottles });
    refresh();
  };

  const setupBottle = async (name: string, ml: number) => {
    if (!user) return;
    await saveBottleConfig(user.id, { bottle_name: name, bottle_ml: ml });
    refresh();
  };

  return {
    logs,
    bottleConfig,
    bottleMl,
    goalMl,
    consumedMl,
    totalBlocks,
    filledValue,
    loading,
    logAmount,
    setupBottle,
    refresh,
  };
};
