import { Typography } from './ui/Typography';

interface LogButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

export const LogButton = ({ onClick, ariaLabel }: LogButtonProps) => (
  <button
    type="button"
    aria-label={ariaLabel}
    className="cursor-pointer rounded-full border border-line bg-surface-brand px-2.5 py-px font-[inherit] transition-all duration-150 hover:border-brand hover:bg-surface-brand"
    onClick={onClick}
  >
    <Typography variant="label-strong" color={'var(--color-brand)'}>
      + log
    </Typography>
  </button>
);
