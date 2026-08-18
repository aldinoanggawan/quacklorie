import { useState } from 'react';
import { Typography } from '../../components/ui/Typography';
import { EntryCard } from '../../components/EntryCard';
import { ForkKnifeIcon } from '../../components/icons/ForkKnifeIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ChevronIcon } from '../../components/icons/ChevronIcon';
import { classNames } from '../../lib/classNames';
import { getMealItems } from '../../lib/db';
import { MEAL_LABELS } from '../../lib/mealLabels';
import type { Meal, MealItem, MealType } from '../../types/models';

const MEAL_COLORS: Record<MealType, string> = {
  breakfast: 'var(--color-duck-yellow)',
  lunch: 'var(--color-success)',
  dinner: 'var(--color-brand)',
  snack: 'var(--color-danger)',
};

interface LogMealCardProps {
  meal: Meal;
  onDelete: () => void;
}

export const LogMealCard = ({ meal, onDelete }: LogMealCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<MealItem[] | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);

  const toggleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && items === null) {
      setLoadingItems(true);
      const fetched = await getMealItems(meal.id);
      setItems(fetched);
      setLoadingItems(false);
    }
  };

  return (
    <EntryCard>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${MEAL_LABELS[meal.meal_type]}, ${meal.total_kcal.toLocaleString()} kcal`}
        onClick={toggleExpand}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
          }
        }}
        className="flex select-none cursor-pointer items-center gap-3 py-3 px-3.5"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control"
          style={{ background: MEAL_COLORS[meal.meal_type] }}
        >
          <ForkKnifeIcon size={18} />
        </div>
        <div className="flex-1">
          <Typography variant="label-strong" color={'var(--color-ink)'}>
            {MEAL_LABELS[meal.meal_type]}
          </Typography>
          {meal.description && (
            <Typography
              variant="caption"
              color={'var(--color-muted)'}
              className="mt-0.5 block truncate"
            >
              {meal.description}
            </Typography>
          )}
        </div>
        <Typography
          variant="label-strong"
          color={'var(--color-ink)'}
          className="shrink-0"
        >
          {meal.total_kcal.toLocaleString()} kcal
        </Typography>

        <button
          type="button"
          aria-label="Delete meal"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
        >
          <TrashIcon size={15} color={'var(--color-muted)'} />
        </button>

        <span
          aria-hidden="true"
          className={classNames(
            'inline-block shrink-0 transition-transform',
            expanded ? '-rotate-90' : 'rotate-90',
          )}
        >
          <ChevronIcon size={14} />
        </span>
      </div>

      {expanded && (
        <div className="border-t border-line py-3 px-3.5">
          {loadingItems && (
            <Typography variant="caption" color={'var(--color-muted)'}>
              Loading…
            </Typography>
          )}
          {!loadingItems && items && items.length === 0 && (
            <Typography variant="caption" color={'var(--color-muted)'}>
              No items recorded
            </Typography>
          )}
          {!loadingItems && items && items.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <Typography variant="body-sm" color={'var(--color-ink)'}>
                    {item.name}
                    {item.portion ? ` · ${item.portion}` : ''}
                  </Typography>
                  <Typography variant="caption" color={'var(--color-muted)'}>
                    {item.kcal.toLocaleString()} kcal
                  </Typography>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </EntryCard>
  );
};
