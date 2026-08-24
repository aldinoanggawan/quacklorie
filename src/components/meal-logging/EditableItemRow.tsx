import { useRef, useState } from 'react';
import { Typography } from '../ui/Typography';
import { classNames } from '../../lib/classNames';
import type { AnalysisItem } from '../../types/models';
import { inputClass } from './styles';

interface EditableItemRowProps {
  item: AnalysisItem;
  onChangeKcal: (kcal: number) => void;
  onRemove: () => void;
}

export const EditableItemRow = ({
  item,
  onChangeKcal,
  onRemove,
}: EditableItemRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isEditingRef = useRef(false);
  const [draft, setDraft] = useState('');

  const setEditing = (next: boolean) => {
    isEditingRef.current = next;
    setIsEditing(next);
  };

  const beginEdit = () => {
    setDraft(String(item.kcal));
    setEditing(true);
  };

  // isEditingRef mirrors isEditing but updates synchronously, so onBlur can
  // read the current value even when it fires re-entrantly (see cancelEdit /
  // confirmEdit calling input.blur()).
  const confirmEdit = (input: HTMLInputElement) => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed)) onChangeKcal(parsed);
    setEditing(false);
    input.blur();
  };

  const cancelEdit = (input: HTMLInputElement) => {
    setEditing(false);
    input.blur();
  };

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={classNames(
          'h-2 w-2 shrink-0 rounded-full',
          item.eaten ? 'bg-brand' : 'bg-muted',
        )}
      />

      <div className="min-w-0 flex-1">
        <Typography
          variant="label"
          color={item.eaten ? 'var(--color-ink)' : 'var(--color-muted)'}
          className={item.eaten ? 'no-underline' : 'line-through'}
        >
          {item.name}
        </Typography>
        <Typography
          variant="caption"
          color={'var(--color-muted)'}
          className="block"
        >
          {item.portion}
        </Typography>
      </div>

      <div
        className={classNames(
          'flex items-baseline gap-1',
          !isEditing && 'border-b-1.5 border-dashed border-muted pb-0.5',
        )}
      >
        <input
          type="number"
          aria-label={`Calories for ${item.name}`}
          value={isEditing ? draft : item.kcal}
          readOnly={!isEditing}
          style={
            isEditing
              ? undefined
              : { width: `${Math.max(1, String(item.kcal).length)}ch` }
          }
          onFocus={(e) => {
            beginEdit();
            e.target.select();
          }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => {
            if (isEditingRef.current) confirmEdit(e.currentTarget);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmEdit(e.currentTarget);
            if (e.key === 'Escape') cancelEdit(e.currentTarget);
          }}
          className={
            isEditing
              ? classNames(
                  inputClass,
                  'w-12 rounded-lg py-0.5 px-1.5 text-right text-label',
                )
              : classNames(
                  'cursor-text border-0 bg-transparent text-right text-label font-[inherit]',
                  item.eaten
                    ? 'text-ink no-underline'
                    : 'text-muted line-through',
                )
          }
        />
        <Typography variant="label-strong" color={'var(--color-muted)'}>
          kcal
        </Typography>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base leading-none text-muted"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};
