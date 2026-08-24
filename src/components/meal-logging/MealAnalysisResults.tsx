import { motion } from 'framer-motion';
import { Button } from '../Button';
import { Duck } from '../duck/Duck';
import type { DuckEmotion } from '../duck/Duck';
import { Typography } from '../ui/Typography';
import { Spinner } from '../Spinner';
import { EditableItemRow } from './EditableItemRow';
import { AddItemRow } from './AddItemRow';
import { classNames } from '../../lib/classNames';
import type {
  AnalysisItem,
  AnalysisResult,
  MealType,
} from '../../types/models';

interface MealAnalysisResultsProps {
  result: AnalysisResult;
  items: AnalysisItem[];
  mealType: MealType;
  mealBudget: number;
  saving: boolean;
  onChangeItemKcal: (index: number, kcal: number) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: (name: string, kcal: number) => void;
  onSave: () => void;
  onReanalyse: () => void;
}

export const MealAnalysisResults = ({
  result,
  items,
  mealType,
  mealBudget,
  saving,
  onChangeItemKcal,
  onRemoveItem,
  onAddItem,
  onSave,
  onReanalyse,
}: MealAnalysisResultsProps) => {
  const totalLogged = items.reduce(
    (sum, item) => (item.eaten ? sum + item.kcal : sum),
    0,
  );
  const duckEmotion: DuckEmotion =
    totalLogged <= mealBudget ? 'happy' : 'worried';

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-5"
    >
      <div className="flex justify-center">
        <Duck emotion={duckEmotion} size={88} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-warm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-base">
              ⭐
            </span>
            <Typography variant="label-strong" color={'var(--color-ink)'}>
              AI analysis
            </Typography>
          </div>
          <Typography variant="label" color={'var(--color-muted)'}>
            ~{Math.round(result.confidence * 100)}% confidence
          </Typography>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <EditableItemRow
              key={i}
              item={item}
              onChangeKcal={(kcal) => onChangeItemKcal(i, kcal)}
              onRemove={() => onRemoveItem(i)}
            />
          ))}

          <AddItemRow onAdd={onAddItem} />
        </div>

        <div className="flex items-center justify-between border-t border-line pt-2.5">
          <Typography variant="label-strong" color={'var(--color-ink)'}>
            Total logged
          </Typography>
          <Typography variant="label-strong" color={'var(--color-brand)'}>
            {totalLogged} kcal
          </Typography>
        </div>

        {result.notes && (
          <Typography
            variant="caption"
            color={'var(--color-muted)'}
            className="italic"
          >
            {result.notes}
          </Typography>
        )}
      </div>

      <Button
        disabled={saving}
        onClick={onSave}
        color={'var(--color-brand)'}
        className={classNames(
          'flex items-center justify-center gap-2.5',
          saving
            ? 'cursor-not-allowed opacity-70'
            : 'cursor-pointer opacity-100',
        )}
      >
        {saving ? (
          <>
            <Spinner />
            <span>Saving…</span>
          </>
        ) : (
          <>
            Log {totalLogged} kcal to {mealType}{' '}
            <span aria-hidden="true">→</span>
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={onReanalyse}
        className="cursor-pointer border-0 bg-transparent py-1 text-center font-[inherit]"
      >
        <Typography variant="label" color={'var(--color-muted)'}>
          Re-analyse
        </Typography>
      </button>
    </motion.div>
  );
};
