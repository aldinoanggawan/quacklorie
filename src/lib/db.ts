import { supabase } from './supabase';
import { resizeImage, fileToBase64 } from './imageUtils';
import { DAILY_ANALYSIS_LIMIT } from '../constants';
import type {
  Profile,
  ProfileData,
  Meal,
  NewMeal,
  MealItem,
  NewMealItem,
  WaterLog,
  NewWaterLog,
  BottleConfig,
  Workout,
  NewWorkout,
  AnalysisItem,
  AnalysisResult,
} from '../types/models';

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();
  return data !== null; // true = taken, false = available
};

export const saveUsername = async (
  userId: string,
  username: string,
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, username }, { onConflict: 'user_id' });
  if (error) throw error;
};

export const saveProfile = async (
  userId: string,
  profile: ProfileData,
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' });
  if (error) throw error;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const logMeal = async (userId: string, meal: NewMeal): Promise<void> => {
  const { error } = await supabase
    .from('meals')
    .insert({ user_id: userId, ...meal });
  if (error) throw error;
};

export const getMealsForDate = async (
  userId: string,
  date: string,
): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('logged_at');
  if (error) throw error;
  return data ?? [];
};

export const logMealItems = async (items: NewMealItem[]): Promise<void> => {
  const { error } = await supabase.from('meal_items').insert(items);
  if (error) throw error;
};

export const getMealItems = async (mealId: string): Promise<MealItem[]> => {
  const { data, error } = await supabase
    .from('meal_items')
    .select('*')
    .eq('meal_id', mealId);
  if (error) throw error;
  return data ?? [];
};

export const logWater = async (
  userId: string,
  log: NewWaterLog,
): Promise<void> => {
  const { error } = await supabase
    .from('water_logs')
    .insert({ user_id: userId, ...log });
  if (error) throw error;
};

export const getWaterForDate = async (
  userId: string,
  date: string,
): Promise<WaterLog[]> => {
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('logged_at');
  if (error) throw error;
  return data ?? [];
};

export const getMealsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
};

export const getWaterByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<WaterLog[]> => {
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const deleteWaterLog = async (id: string): Promise<void> => {
  const { error } = await supabase.from('water_logs').delete().eq('id', id);
  if (error) throw error;
};

export const getBottleConfig = async (
  userId: string,
): Promise<BottleConfig | null> => {
  const { data, error } = await supabase
    .from('bottle_config')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const saveBottleConfig = async (
  userId: string,
  config: Omit<BottleConfig, 'user_id'>,
): Promise<void> => {
  const { error } = await supabase
    .from('bottle_config')
    .upsert({ user_id: userId, ...config }, { onConflict: 'user_id' });
  if (error) throw error;
};

export const logWorkout = async (
  userId: string,
  workout: NewWorkout,
): Promise<void> => {
  const { error } = await supabase
    .from('workouts')
    .insert({ user_id: userId, ...workout });
  if (error) throw error;
};

export const updateWorkout = async (
  workoutId: string,
  fields: Partial<NewWorkout>,
): Promise<void> => {
  const { error } = await supabase
    .from('workouts')
    .update(fields)
    .eq('id', workoutId);
  if (error) throw error;
};

export const getWorkoutsForDate = async (
  userId: string,
  date: string,
): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw error;
  return data ?? [];
};

export const getWorkoutsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const deleteWorkout = async (id: string): Promise<void> => {
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) throw error;
};

export const getRemainingAnalyses = async (
  userId: string,
): Promise<{ remaining: number; limit: number }> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('profiles')
    .select('daily_analyses_count, daily_analyses_reset_date')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const isNewDay = data.daily_analyses_reset_date !== today;
  const count = isNewDay ? 0 : (data.daily_analyses_count ?? 0);

  return {
    remaining: DAILY_ANALYSIS_LIMIT - count,
    limit: DAILY_ANALYSIS_LIMIT,
  };
};

export const analyzeMeal = async ({
  beforeFile,
  afterFile,
  note,
}: {
  beforeFile: File;
  afterFile?: File | null;
  note?: string;
}): Promise<AnalysisResult> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const resizedBefore = await resizeImage(beforeFile);
  const resizedAfter = afterFile ? await resizeImage(afterFile) : undefined;

  const beforeBase64 = await fileToBase64(resizedBefore);
  const afterBase64 = resizedAfter
    ? await fileToBase64(resizedAfter)
    : undefined;
  const mimeType = 'image/jpeg';

  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: {
      beforeImage: beforeBase64,
      afterImage: afterBase64,
      mimeType,
      userNote: note || undefined,
    },
  });

  if (error) {
    if (error.context?.status === 429) {
      const body = await error.context.json();
      throw new Error(body.message ?? 'Daily analysis limit reached');
    }
    throw error;
  }
  return data as AnalysisResult;
};

export const saveMeal = async ({
  userId,
  mealType,
  items,
  note,
}: {
  userId: string;
  mealType: string;
  items: AnalysisItem[];
  note: string;
}): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];

  const totalKcal = items.reduce(
    (sum, item) => (item.eaten ? sum + item.kcal : sum),
    0,
  );

  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      date: today,
      meal_type: mealType,
      description: note || undefined,
      total_kcal: totalKcal,
    })
    .select('id')
    .single();

  if (mealError) throw mealError;

  const mealItems = items.map((item) => ({
    meal_id: meal.id,
    name: item.name,
    portion: item.portion,
    kcal: item.kcal,
    eaten: item.eaten,
  }));

  const { error: itemsError } = await supabase
    .from('meal_items')
    .insert(mealItems);
  if (itemsError) throw itemsError;
};
