import { Typography } from '../../components/ui/Typography';

interface LogEmptyDayRowProps {
  label: string;
}

export const LogEmptyDayRow = ({ label }: LogEmptyDayRowProps) => (
  <div className="flex items-center justify-between rounded-card border border-line py-2.5 px-3.5">
    <Typography variant="label" color={'var(--color-muted)'}>
      {label}
    </Typography>
    <Typography variant="caption" color={'var(--color-muted)'}>
      Nothing logged
    </Typography>
  </div>
);
