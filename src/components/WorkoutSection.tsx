import { useState } from 'react';
import { Typography } from './ui/Typography';
import { WorkoutCard } from './WorkoutCard';
import { logWorkout } from '../lib/db';
import { toDateString } from '../lib/dateHelpers';
import type { Workout } from '../types/models';
import { classNames } from '../lib/classNames';

interface WorkoutSectionProps {
  workouts: Workout[];
  userId: string;
  date: Date;
  onSaved: () => void;
}

const inputClass =
  'box-border w-full rounded-control border border-line bg-transparent py-2.5 px-3 text-body font-medium text-ink outline-none [font-family:inherit]';

export const WorkoutSection = ({
  workouts,
  userId,
  date,
  onSaved,
}: WorkoutSectionProps) => {
  const [editMode, setEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [kcal, setKcal] = useState('');
  const [kcalMode, setKcalMode] = useState<'estimate' | 'manual'>('estimate');
  const [saving, setSaving] = useState(false);

  const durationMin = parseInt(duration, 10) || 0;
  const appEstimate = Math.round(durationMin * 7);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const isEstimate = kcalMode === 'estimate';
    await logWorkout(userId, {
      date: toDateString(date),
      name: name.trim(),
      duration_min: durationMin,
      kcal_burned: isEstimate
        ? appEstimate
        : kcal
          ? parseInt(kcal, 10)
          : undefined,
      source: isEstimate ? 'estimated' : undefined,
    });
    setName('');
    setDuration('');
    setKcal('');
    setKcalMode('estimate');
    setShowAddForm(false);
    setSaving(false);
    onSaved();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Typography
          variant="label-strong"
          as="p"
          color={'var(--color-muted)'}
          className="m-0"
        >
          Workout
        </Typography>
        {workouts.length > 0 && (
          <button
            type="button"
            onClick={() => setEditMode((m) => !m)}
            className="cursor-pointer border-0 bg-transparent p-0 font-[inherit]"
          >
            <Typography variant="label-strong" color={'var(--color-brand)'}>
              {editMode ? 'done' : 'edit'}
            </Typography>
          </button>
        )}
      </div>

      {workouts.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onSaved={onSaved} />
          ))}
        </div>
      )}

      {showAddForm ? (
        <div
          className={classNames(
            workouts.length > 0 ? 'mt-2.5' : 'mt-0',
            'flex flex-col gap-3 rounded-2xl border border-line bg-white py-4 px-3.5',
          )}
        >
          <Typography
            variant="label-strong"
            as="p"
            color={'var(--color-muted)'}
            className="m-0 text-caption uppercase tracking-label"
          >
            Add workout
          </Typography>

          <label className="sr-only" htmlFor="workout-name">
            Workout name
          </label>
          <input
            id="workout-name"
            type="text"
            placeholder="Workout name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className={inputClass}
          />

          <label className="sr-only" htmlFor="workout-duration">
            Duration (min)
          </label>
          <input
            id="workout-duration"
            type="number"
            placeholder="Duration (min)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={inputClass}
          />

          <div className="flex overflow-hidden rounded-control border border-line bg-canvas">
            {(['estimate', 'manual'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setKcalMode(mode)}
                aria-pressed={kcalMode === mode}
                className={classNames(
                  'flex-1 cursor-pointer border-0 py-2 font-[inherit] transition-colors duration-150',
                  kcalMode === mode ? 'bg-ink' : 'bg-transparent',
                )}
              >
                <Typography
                  variant="label-strong"
                  color={kcalMode === mode ? 'white' : 'var(--color-muted)'}
                >
                  {mode === 'estimate'
                    ? 'Estimate for me'
                    : 'I know the calories'}
                </Typography>
              </button>
            ))}
          </div>

          {kcalMode === 'estimate' && durationMin > 0 && (
            <Typography
              variant="caption"
              color={'var(--color-muted)'}
              className="-mt-1"
            >
              App estimate: ~{appEstimate} kcal based on {durationMin} min
            </Typography>
          )}

          {kcalMode === 'manual' && (
            <>
              <label className="sr-only" htmlFor="workout-kcal">
                Kcal burned
              </label>
              <input
                id="workout-kcal"
                type="number"
                placeholder="Kcal burned"
                value={kcal}
                onChange={(e) => setKcal(e.target.value)}
                className={inputClass}
              />
            </>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 cursor-pointer rounded-xl border border-line bg-transparent py-2.5 font-[inherit]"
            >
              <Typography variant="label-strong" color={'var(--color-muted)'}>
                Cancel
              </Typography>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="flex-1 cursor-pointer rounded-xl border-0 bg-ink py-2.5 font-[inherit] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Typography variant="label-strong" color="white">
                {saving ? 'Saving…' : 'Save'}
              </Typography>
            </button>
          </div>
        </div>
      ) : (
        (workouts.length === 0 || editMode) && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={classNames(
              workouts.length > 0 ? 'mt-2.5' : 'mt-0',
              'w-full cursor-pointer rounded-element border-0 bg-ink py-3 font-[inherit]',
            )}
          >
            <Typography variant="label-strong" color="white">
              {workouts.length === 0
                ? '+ add workout'
                : '+ add another workout'}
            </Typography>
          </button>
        )
      )}
    </div>
  );
};
