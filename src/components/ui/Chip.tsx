import { Typography } from './Typography';

interface ChipProps {
  label: string;
  value: string;
  accentColor: string;
  valueColor?: string;
  borderColor?: string;
  background?: string;
  progress: number;
}

export const Chip = ({
  label,
  value,
  accentColor,
  valueColor,
  borderColor = 'var(--color-line)',
  background = 'white',
  progress,
}: ChipProps) => (
  <div
    className="flex flex-1 flex-col gap-0.5 rounded-element border py-1.5 px-2.5"
    style={{ background, borderColor }}
  >
    <Typography
      variant="caption"
      color="var(--color-muted)"
      className="text-center"
    >
      {label}
    </Typography>
    <Typography
      variant="label"
      color={valueColor ?? 'var(--color-ink)'}
      className="text-center leading-none"
    >
      {value}
    </Typography>
    <div
      aria-hidden="true"
      className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-black/10"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ right: `${(1 - progress) * 100}%`, background: accentColor }}
      />
    </div>
  </div>
);
