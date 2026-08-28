import type { DuckEmotion } from '../components/duck/Duck';

export const streakEmotion = (
  daysLogged: number,
  totalDays: number,
): DuckEmotion => {
  if (daysLogged === totalDays) return 'celebrating';
  if (daysLogged >= totalDays / 2) return 'proud';
  if (daysLogged > 0) return 'happy';
  return 'sleepy';
};
