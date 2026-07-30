import { motion } from 'framer-motion';
import { CheckIcon } from './icons/CheckIcon';
import { Typography } from './ui/Typography';
import { classNames } from '../lib/classNames';

export const SelectionCard = ({
  name,
  value,
  isSelected,
  onSelect,
  icon,
  iconBg,
  label,
  subtitle,
  animationDelay = 0,
}: {
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  subtitle: string;
  animationDelay?: number;
}) => (
  <motion.label
    tabIndex={-1}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: animationDelay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={classNames(
      'flex cursor-pointer items-center gap-4 rounded-card border-1.5 p-4 px-5 text-left font-[inherit] transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2',
      isSelected ? 'border-brand bg-canvas' : 'border-line bg-white',
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

    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-element text-2xl transition-colors duration-200"
      style={{
        background:
          iconBg ??
          (isSelected
            ? 'var(--color-surface-brand)'
            : 'var(--color-neutral-subtle)'),
      }}
    >
      {icon}
    </div>

    <div className="flex-1">
      <Typography variant="title" className="mb-2">
        {label}
      </Typography>
      <Typography variant="label" as="p" color="var(--color-muted)">
        {subtitle}
      </Typography>
    </div>

    <div
      aria-hidden="true"
      className={classNames(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
        isSelected ? 'border-brand bg-brand' : 'border-line bg-transparent',
      )}
    >
      {isSelected && <CheckIcon />}
    </div>
  </motion.label>
);
