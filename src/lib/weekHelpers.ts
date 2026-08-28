export const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

export const addDays = (date: Date, n: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const formatWeekRange = (
  start: Date,
  end: Date,
  isCurrentWeek: boolean,
): string => {
  if (isCurrentWeek) return 'This week';

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString(
    'en-GB',
    sameMonth ? { day: 'numeric' } : { day: 'numeric', month: 'short' },
  );
  const endLabel = end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  return `${startLabel} – ${endLabel}`;
};

export const weekPhrase = (
  start: Date,
  end: Date,
  isCurrentWeek: boolean,
): string => (isCurrentWeek ? 'this week' : formatWeekRange(start, end, false));

export const dayLabel = (date: string): string =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
  });
