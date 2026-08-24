import { Typography } from './ui/Typography';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  children?: React.ReactNode;
}

export const ScreenHeader = ({
  title,
  onBack,
  children,
}: ScreenHeaderProps) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      aria-label="Go back"
      onClick={onBack}
      className="cursor-pointer border-0 bg-transparent py-1 pr-2 text-2xl leading-none text-ink"
    >
      ←
    </button>
    <Typography
      variant="subheading"
      as="h1"
      color={'var(--color-ink)'}
      className="flex-1"
    >
      {title}
    </Typography>
    {children}
  </div>
);
