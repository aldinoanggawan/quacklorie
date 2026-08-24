import { useState } from 'react';
import { Typography } from '../ui/Typography';
import { classNames } from '../../lib/classNames';
import { inputClass } from './styles';

interface AddItemRowProps {
  onAdd: (name: string, kcal: number) => void;
}

export const AddItemRow = ({ onAdd }: AddItemRowProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');

  const reset = () => {
    setIsAdding(false);
    setName('');
    setKcal('');
  };

  const submit = () => {
    const parsedKcal = parseInt(kcal, 10);
    if (!name.trim() || !parsedKcal) return;
    onAdd(name.trim(), parsedKcal);
    reset();
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="cursor-pointer border-0 bg-transparent py-0.5 text-left font-[inherit]"
      >
        <Typography variant="label" color={'var(--color-brand)'}>
          + Add item
        </Typography>
      </button>
    );
  }

  return (
    <div className="mt-0.5 flex items-center gap-1.5">
      <label className="sr-only" htmlFor="new-item-name">
        Item name
      </label>
      <input
        id="new-item-name"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        autoFocus
        className={classNames(
          inputClass,
          'flex-1 rounded-control py-1 px-2.5 text-label',
        )}
      />
      <label className="sr-only" htmlFor="new-item-kcal">
        Kcal
      </label>
      <input
        id="new-item-kcal"
        type="number"
        placeholder="kcal"
        value={kcal}
        onChange={(e) => setKcal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className={classNames(
          inputClass,
          'w-16 rounded-control py-1 px-2 text-right text-label',
        )}
      />
      <button
        type="button"
        onClick={submit}
        aria-label="Add item"
        className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base text-brand"
      >
        <span aria-hidden="true">✓</span>
      </button>
      <button
        type="button"
        onClick={reset}
        aria-label="Cancel adding item"
        className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base text-muted"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};
