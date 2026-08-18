import { Typography } from '../../components/ui/Typography';
import { EntryCard } from '../../components/EntryCard';
import { DropletIcon } from '../../components/icons/DropletIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import type { WaterLog } from '../../types/models';

interface LogWaterRowProps {
  logs: WaterLog[];
  onDelete: () => void;
}

export const LogWaterRow = ({ logs, onDelete }: LogWaterRowProps) => {
  const total = logs.reduce((sum, w) => sum + w.amount_bottles, 0);
  const totalDisplay = Math.round(total * 100) / 100;

  return (
    <EntryCard>
      <div className="flex items-center gap-3 py-3 px-3.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control"
          style={{ background: 'var(--color-info)' }}
        >
          <DropletIcon size={18} />
        </div>
        <div className="flex-1">
          <Typography variant="label-strong" color={'var(--color-ink)'}>
            Water
          </Typography>
          <Typography
            variant="caption"
            color={'var(--color-muted)'}
            className="mt-0.5 block"
          >
            {logs.length} log{logs.length === 1 ? '' : 's'}
          </Typography>
        </div>
        <Typography variant="label-strong" color={'var(--color-ink)'}>
          {totalDisplay} bottle{totalDisplay === 1 ? '' : 's'}
        </Typography>
        <button
          type="button"
          aria-label="Delete water logs"
          onClick={onDelete}
          className="cursor-pointer border-0 bg-transparent p-0"
        >
          <TrashIcon size={15} color={'var(--color-muted)'} />
        </button>
      </div>
    </EntryCard>
  );
};
