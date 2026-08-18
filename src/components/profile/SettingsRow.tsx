import { classNames } from '../../lib/classNames';
import { Typography } from '../ui/Typography';
import { ChevronIcon } from '../icons/ChevronIcon';

const rowClass =
  'flex w-full items-center justify-between gap-3 rounded-element py-3.5 px-4';

export const SettingsRow = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <Typography variant="title" className="shrink-0">
        {label}
      </Typography>
      <span className="flex min-w-0 items-center gap-2">
        <Typography
          variant="label"
          color={'var(--color-muted)'}
          className="truncate"
        >
          {value}
        </Typography>
        {onClick && <ChevronIcon />}
      </span>
    </>
  );

  if (!onClick) {
    return (
      <div className={classNames(rowClass, 'border-1.5 border-line')}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        rowClass,
        'cursor-pointer border-1.5 border-line bg-white text-left font-[inherit] transition-colors duration-150 hover:border-brand has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2',
      )}
    >
      {content}
    </button>
  );
};
