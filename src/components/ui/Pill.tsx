import { Spinner } from '../Spinner';

interface PillProps {
  loading?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

export const Pill = ({ loading, ariaLabel, children }: PillProps) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className="flex items-center gap-1 rounded-full border-1.5 border-line bg-surface-brand py-1 px-2.5"
  >
    {loading ? (
      <Spinner
        size={14}
        color="var(--color-ink)"
        trackColor="rgba(0, 0, 0, 0.15)"
      />
    ) : (
      children
    )}
  </div>
);
