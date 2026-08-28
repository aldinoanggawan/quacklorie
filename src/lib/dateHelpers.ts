export const toDateString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export const shortDayLabel = (date: string): string =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
  });

export const dayLetter = (date: string): string =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'narrow',
  });

export const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};
