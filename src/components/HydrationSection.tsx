import { useState } from 'react';
import { Typography } from './ui/Typography';
import { GlassIcon } from './icons/GlassIcon';
import { useHydration } from '../hooks/useHydration';
import { classNames } from '../lib/classNames';

const OZ_TO_ML = 29.5735;

const FRACTIONS: { label: string; value: number }[] = [
  { label: '¼', value: 0.25 },
  { label: '½', value: 0.5 },
  { label: '¾', value: 0.75 },
  { label: 'Full', value: 1 },
];

interface HydrationSectionProps {
  date: Date;
}

const inputClass =
  'box-border w-full rounded-control border border-line bg-transparent py-2.5 px-3 text-body font-medium text-ink outline-none [font-family:inherit]';

export const HydrationSection = ({ date }: HydrationSectionProps) => {
  const {
    bottleConfig,
    bottleMl,
    consumedMl,
    goalMl,
    totalBlocks,
    filledValue,
    loading,
    logAmount,
    setupBottle,
  } = useHydration(date);

  const [showPanel, setShowPanel] = useState(false);
  const [bottleName, setBottleName] = useState('');
  const [bottleSize, setBottleSize] = useState('');
  const [unit, setUnit] = useState<'ml' | 'oz'>('ml');
  const [setupSaving, setSetupSaving] = useState(false);

  const handleSetup = async () => {
    const raw = parseFloat(bottleSize);
    if (!bottleName.trim() || !raw) return;
    const ml = Math.round(unit === 'oz' ? raw * OZ_TO_ML : raw);
    setSetupSaving(true);
    await setupBottle(bottleName.trim(), ml);
    setSetupSaving(false);
    setShowPanel(false);
  };

  const handleLog = async (fraction: number) => {
    await logAmount(fraction);
    setShowPanel(false);
  };

  if (loading) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Typography
          variant="label-strong"
          as="p"
          color={'var(--color-muted)'}
          className="m-0"
        >
          Hydration
        </Typography>
        <button
          type="button"
          onClick={() => setShowPanel((v) => !v)}
          className="cursor-pointer border-0 bg-transparent p-0 font-[inherit]"
        >
          <Typography variant="label-strong" color={'var(--color-brand)'}>
            {showPanel ? 'cancel' : '+ add'}
          </Typography>
        </button>
      </div>

      {bottleConfig && (
        <div className="flex items-center gap-3.5 rounded-2xl border-1.5 border-line-success bg-surface-water py-3.5 px-4">
          <div
            aria-hidden="true"
            className="flex flex-1 flex-wrap items-end gap-1"
          >
            {Array.from({ length: totalBlocks }).map((_, i) => (
              <GlassIcon key={i} index={i} value={filledValue} />
            ))}
          </div>
          <div className="shrink-0 text-right">
            <Typography
              variant="subheading"
              color={'var(--color-ink)'}
              className="block leading-none"
            >
              {consumedMl.toLocaleString()} ml
            </Typography>
            <Typography
              variant="caption"
              color={'var(--color-muted)'}
              className="mt-1 block"
            >
              of {goalMl.toLocaleString()} ml
            </Typography>
          </div>
        </div>
      )}

      {showPanel && (
        <div
          className={classNames(
            bottleConfig ? 'mt-2.5' : 'mt-0',
            'flex flex-col gap-3 rounded-2xl border border-line bg-white py-4 px-3.5',
          )}
        >
          {!bottleConfig ? (
            <>
              <Typography
                variant="label-strong"
                as="p"
                color={'var(--color-muted)'}
                className="m-0 text-caption uppercase tracking-label"
              >
                Set up your bottle
              </Typography>
              <label className="sr-only" htmlFor="bottle-name">
                Bottle name
              </label>
              <input
                id="bottle-name"
                type="text"
                placeholder="Bottle name (e.g. My Hydro Flask)"
                value={bottleName}
                onChange={(e) => setBottleName(e.target.value)}
                autoFocus
                className={inputClass}
              />
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="bottle-size">
                  Bottle size
                </label>
                <input
                  id="bottle-size"
                  type="number"
                  placeholder={
                    unit === 'ml' ? 'Size (e.g. 500)' : 'Size (e.g. 17)'
                  }
                  value={bottleSize}
                  onChange={(e) => setBottleSize(e.target.value)}
                  className={classNames(inputClass, 'w-auto flex-1')}
                />
                <div className="flex shrink-0 overflow-hidden rounded-control border border-line bg-canvas">
                  {(['ml', 'oz'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      aria-pressed={unit === u}
                      className={classNames(
                        'cursor-pointer border-0 px-3.5 font-[inherit] transition-colors duration-150',
                        unit === u ? 'bg-ink' : 'bg-transparent',
                      )}
                    >
                      <Typography
                        variant="label-strong"
                        color={unit === u ? 'white' : 'var(--color-muted)'}
                      >
                        {u}
                      </Typography>
                    </button>
                  ))}
                </div>
              </div>
              {bottleSize && (
                <Typography
                  variant="caption"
                  color={'var(--color-muted)'}
                  className="-mt-1"
                >
                  ≈{' '}
                  {unit === 'oz'
                    ? `${Math.round(parseFloat(bottleSize) * OZ_TO_ML)} ml`
                    : `${(parseFloat(bottleSize) / OZ_TO_ML).toFixed(1)} oz`}
                </Typography>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPanel(false)}
                  className="flex-1 cursor-pointer rounded-control border border-line bg-transparent py-2.5 font-[inherit]"
                >
                  <Typography
                    variant="label-strong"
                    color={'var(--color-muted)'}
                  >
                    Cancel
                  </Typography>
                </button>
                <button
                  type="button"
                  onClick={handleSetup}
                  disabled={!bottleName.trim() || !bottleSize || setupSaving}
                  className="flex-1 cursor-pointer rounded-control border-0 bg-success py-2.5 font-[inherit] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Typography variant="label-strong" color="white">
                    {setupSaving ? 'Saving...' : 'Save bottle'}
                  </Typography>
                </button>
              </div>
            </>
          ) : (
            /* ── Log flow ── */
            <>
              <div>
                <Typography
                  variant="label-strong"
                  color={'var(--color-ink)'}
                  className="block"
                >
                  {bottleConfig.bottle_name}
                </Typography>
                <Typography variant="caption" color={'var(--color-muted)'}>
                  {bottleMl} ml per bottle — tap how much you drank
                </Typography>
              </div>

              <div className="flex gap-2">
                {FRACTIONS.map(({ label, value }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleLog(value)}
                    className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-xl border-1.5 border-line-success bg-surface-success py-2.5 px-1 font-[inherit]"
                  >
                    <Typography
                      variant="subheading"
                      color={'var(--color-success)'}
                      className="leading-none"
                    >
                      {label}
                    </Typography>
                    <Typography variant="caption" color={'var(--color-muted)'}>
                      {Math.round(bottleMl * value)} ml
                    </Typography>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
