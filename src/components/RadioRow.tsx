import { Typography } from './ui/Typography';
import { classNames } from '../lib/classNames';

export const RadioRow = ({
  name,
  value,
  label,
  subtitle,
  isSelected,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  subtitle?: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <label
    className={classNames(
      'flex cursor-pointer items-center gap-3.5 rounded-element border-1.5 py-2.5 px-3.5 text-left [font-family:inherit] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2',
      isSelected ? 'border-brand bg-surface-brand' : 'border-line bg-white',
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={isSelected}
      onChange={onSelect}
      className="sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'box-border h-2.5 w-2.5 shrink-0 rounded-full border-2',
        isSelected
          ? 'border-brand bg-brand shadow-[inset_0_0_0_4px_var(--color-brand)]'
          : 'border-line bg-white',
      )}
    />
    <span className="flex-1">
      <Typography variant="label" className="block">
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color={'var(--color-muted)'}>
          {subtitle}
        </Typography>
      )}
    </span>
  </label>
);
