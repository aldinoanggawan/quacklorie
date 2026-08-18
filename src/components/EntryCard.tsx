import { classNames } from '../lib/classNames';

type Tone = 'neutral' | 'success';

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'border-line bg-white',
  success: 'border-line-success bg-surface-success',
};

interface EntryCardProps {
  tone?: Tone;
  children: React.ReactNode;
}

export const EntryCard = ({ tone = 'neutral', children }: EntryCardProps) => (
  <div
    className={classNames(
      'overflow-hidden rounded-card-sm border-1.5',
      TONE_CLASSES[tone],
    )}
  >
    {children}
  </div>
);
