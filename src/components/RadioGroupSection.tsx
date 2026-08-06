import { Typography } from './ui/Typography';
import { RadioRow } from './RadioRow';

export const RadioGroupSection = <T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: readonly { id: T; label: string; subtitle?: string }[];
  value: T;
  onChange: (value: T) => void;
}) => {
  const headingId = `${name}-heading`;

  return (
    <section>
      <Typography
        variant="label-strong"
        as="p"
        id={headingId}
        color={'var(--color-muted)'}
        className="mb-1.5"
      >
        {label}
      </Typography>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="flex flex-col gap-2"
      >
        {options.map((option) => (
          <RadioRow
            key={option.id}
            name={name}
            value={option.id}
            isSelected={value === option.id}
            onSelect={() => onChange(option.id)}
            label={option.label}
            subtitle={option.subtitle}
          />
        ))}
      </div>
    </section>
  );
};
