import { useState } from 'react';
import { analyzeMeal, saveMeal } from '../lib/db';
import type { AnalysisItem, AnalysisResult, MealType } from '../types/models';

interface AnalyseArgs {
  beforeFile: File;
  afterFile: File | null;
  note: string;
}

export const useMealAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const analyse = async ({
    beforeFile,
    afterFile,
    note,
  }: AnalyseArgs): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeMeal({ beforeFile, afterFile, note });
      setResult(data);
      setItems(data.items);
      setNote(note);
      return true;
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong analysing your meal. Please try again.',
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setItems([]);
    setError(null);
  };

  const updateItemKcal = (index: number, kcal: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, kcal } : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = (name: string, kcal: number) => {
    setItems((prev) => [...prev, { name, portion: '-', kcal, eaten: true }]);
  };

  const save = async (userId: string, mealType: MealType) => {
    setSaving(true);
    try {
      await saveMeal({ userId, mealType, items, note });
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    error,
    result,
    items,
    saving,
    analyse,
    reset,
    updateItemKcal,
    removeItem,
    addItem,
    save,
  };
};
