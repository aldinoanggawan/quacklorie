import { useRef, useState } from 'react';
import { StepperIcon } from './icons/StepperIcon';
import { Typography } from './ui/Typography';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const stepperButtonClass =
  'flex h-7 w-7 cursor-pointer appearance-none items-center justify-center rounded-lg border-2 border-line-brand bg-surface-brand p-0 font-[inherit] leading-none text-muted disabled:cursor-default disabled:opacity-30';

export const Stepper = ({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  formatter = String,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  formatter?: (value: number) => string;
  onChange: (value: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const editingRef = useRef(false);
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const unitId = `${id}-unit`;

  // editingRef mirrors `editing` but updates synchronously, so onBlur can
  // read the current value even when it fires re-entrantly (see cancelEdit).
  const updateEditing = (next: boolean) => {
    editingRef.current = next;
    setEditing(next);
  };

  const update = (direction: -1 | 1) => {
    let next: number;
    if (direction === 1) {
      next = Math.ceil(value / step) * step;
      if (next === value) next += step;
    } else {
      next = Math.floor(value / step) * step;
      if (next === value) next -= step;
    }
    onChange(Number(clamp(next, min, max).toFixed(1)));
  };

  const beginEdit = () => {
    setDraft(formatter(value));
    updateEditing(true);
  };

  const confirmEdit = (input: HTMLInputElement) => {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed)) {
      onChange(Number(clamp(parsed, min, max).toFixed(1)));
    }
    updateEditing(false);
    input.blur();
  };

  const cancelEdit = (input: HTMLInputElement) => {
    updateEditing(false);
    input.blur();
  };

  return (
    <div className="box-border rounded-element border-1.5 border-line bg-white py-2.5 px-3.5">
      <Typography
        variant="caption"
        as="label"
        htmlFor={id}
        color={'var(--color-muted)'}
        className="mb-1.5 block uppercase tracking-em"
      >
        {label}
      </Typography>
      <div className="box-border flex w-full items-center justify-between gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => update(-1)}
          disabled={value <= min}
          className={stepperButtonClass}
        >
          <StepperIcon type="minus" />
        </button>
        <div className="text-center tabular-nums">
          <input
            id={id}
            type="number"
            value={editing ? draft : formatter(value)}
            min={min}
            max={max}
            step={step}
            readOnly={!editing}
            aria-describedby={unitId}
            onFocus={(e) => {
              beginEdit();
              e.target.select();
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => {
              if (editingRef.current) confirmEdit(e.currentTarget);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmEdit(e.currentTarget);
              if (e.key === 'Escape') cancelEdit(e.currentTarget);
            }}
            className="m-0 block h-4 w-14 appearance-none border-0 bg-transparent p-0 text-center text-input font-medium leading-none outline-none cursor-text [box-sizing:content-box] [font-family:inherit] [font-variant-numeric:tabular-nums] [MozAppearance:textfield] [WebkitAppearance:none]"
          />
          <Typography
            variant="caption"
            id={unitId}
            color={'var(--color-muted)'}
            className="mt-px block"
          >
            {unit}
          </Typography>
        </div>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => update(1)}
          disabled={value >= max}
          className={stepperButtonClass}
        >
          <StepperIcon type="plus" />
        </button>
      </div>
    </div>
  );
};
