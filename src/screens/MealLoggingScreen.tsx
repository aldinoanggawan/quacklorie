import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Duck } from '../components/duck/Duck';
import type { DuckEmotion } from '../components/duck/Duck';
import { Typography } from '../components/ui/Typography';
import { UploadZone } from '../components/UploadZone';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { analyzeMeal, saveMeal, getRemainingAnalyses } from '../lib/db';
import type { MealType, AnalysisResult, AnalysisItem } from '../types/models';
import { classNames } from '../lib/classNames';

const inputClass =
  'rounded-2xl border border-line bg-surface-warm text-body font-medium text-ink outline-none [color-scheme:light] [font-family:inherit]';

export const MealLoggingScreen = () => {
  const { mealType } = useParams<{ mealType: MealType }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const mealBudget = profile ? Math.round(profile.daily_budget / 3) : 600;

  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmotion, setLoadingEmotion] = useState<DuckEmotion>('grumpy');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [localItems, setLocalItems] = useState<AnalysisItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const editingIndexRef = useRef<number | null>(null);
  const [itemDraft, setItemDraft] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemKcal, setNewItemKcal] = useState('');
  const [saving, setSaving] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);

  const canAnalyse = !!beforeFile && !loading;

  useEffect(() => {
    if (!user) return;
    getRemainingAnalyses(user.id)
      .then(({ remaining, limit }) => {
        setRemaining(remaining);
        setLimit(limit);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingEmotion((e) => (e === 'grumpy' ? 'worried' : 'grumpy'));
    }, 900);
    return () => clearInterval(id);
  }, [loading]);

  const handleAnalyse = async () => {
    if (!beforeFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeMeal({
        beforeFile,
        afterFile: afterFile ?? null,
        note,
      });
      setResult(data);
      setLocalItems(data.items);
      setRemaining((prev) => (prev !== null ? prev - 1 : null));
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong analysing your meal. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // editingIndexRef mirrors editingIndex but updates synchronously, so
  // onBlur can read the current value even when it fires re-entrantly
  // (see cancelItemEdit / confirmItemEdit calling input.blur()).
  const updateEditingIndex = (next: number | null) => {
    editingIndexRef.current = next;
    setEditingIndex(next);
  };

  const handleReanalyse = () => {
    setResult(null);
    setLocalItems([]);
    updateEditingIndex(null);
    setAddingItem(false);
    setNewItemName('');
    setNewItemKcal('');
    setError(null);
  };

  const beginItemEdit = (i: number) => {
    setItemDraft(String(localItems[i].kcal));
    updateEditingIndex(i);
  };

  const confirmItemEdit = (i: number, input: HTMLInputElement) => {
    const parsed = parseInt(itemDraft, 10);
    if (!isNaN(parsed)) {
      const next = [...localItems];
      next[i] = { ...next[i], kcal: parsed };
      setLocalItems(next);
    }
    updateEditingIndex(null);
    input.blur();
  };

  const cancelItemEdit = (input: HTMLInputElement) => {
    updateEditingIndex(null);
    input.blur();
  };

  const handleRemoveItem = (index: number) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) updateEditingIndex(null);
  };

  const handleAddItem = () => {
    const kcal = parseInt(newItemKcal, 10);
    if (!newItemName.trim() || !kcal) return;
    setLocalItems((prev) => [
      ...prev,
      { name: newItemName.trim(), portion: '-', kcal, eaten: true },
    ]);
    setNewItemName('');
    setNewItemKcal('');
    setAddingItem(false);
  };

  const handleLog = async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      await saveMeal({
        userId: user.id,
        mealType: mealType!,
        items: localItems,
        note,
      });
      getRemainingAnalyses(user.id)
        .then(({ remaining, limit }) => {
          setRemaining(remaining);
          setLimit(limit);
        })
        .catch(console.error);
      navigate(-1);
    } catch (err) {
      console.error('Failed to save meal:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalLogged = localItems.reduce(
    (sum, item) => (item.eaten ? sum + item.kcal : sum),
    0,
  );
  const duckEmotion: DuckEmotion = result
    ? totalLogged <= mealBudget
      ? 'happy'
      : 'worried'
    : 'grumpy';

  return (
    <ScreenContainer background={'var(--color-canvas)'} className="gap-5 pt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="cursor-pointer border-0 bg-transparent py-1 pr-2 text-2xl leading-none text-ink"
        >
          ←
        </button>
        <Typography
          variant="subheading"
          as="h1"
          color={'var(--color-ink)'}
          className="flex-1"
        >
          Log {mealType}
        </Typography>
        {remaining !== null && (
          <div
            role="group"
            aria-label={`${remaining} of ${limit} analyses remaining today`}
            className="flex items-center gap-1 rounded-full border-1.5 border-line bg-surface-brand py-1 px-2.5"
          >
            <span aria-hidden="true" className="text-xs">
              ✦
            </span>
            <Typography
              variant="label-strong"
              color={
                remaining === 0
                  ? 'var(--color-danger)'
                  : remaining <= 2
                    ? 'var(--color-brand)'
                    : 'var(--color-ink)'
              }
            >
              {remaining} / {limit}
            </Typography>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!result && remaining === 0 ? (
          <motion.div
            key="limit-reached"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <Duck emotion="sleepy" size={88} />
            <Typography variant="subheading" color={'var(--color-ink)'}>
              No analyses left today
            </Typography>
            <Typography
              variant="body"
              color={'var(--color-muted)'}
              className="max-w-64"
            >
              You've used all {limit} AI analyses for today. Come back tomorrow
              — Quackers will be ready!
            </Typography>
          </motion.div>
        ) : !result ? (
          <motion.div
            key="upload"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            <div>
              <Typography
                variant="label-strong"
                color={'var(--color-muted)'}
                className="mb-2.5 block"
              >
                Your meal
              </Typography>
              <UploadZone
                label="Before"
                photo={beforePhoto}
                onPick={(preview, file) => {
                  setBeforePhoto(preview);
                  setBeforeFile(file);
                }}
                full
                emptyHint="Tap to add your meal photo"
              />
            </div>

            <AnimatePresence>
              {beforePhoto && (
                <motion.div
                  key="after-zone"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Typography
                    variant="label-strong"
                    color={'var(--color-muted)'}
                    className="mb-2.5 block italic"
                  >
                    Didn't finish? Add an after photo for a more accurate count
                  </Typography>
                  <UploadZone
                    label="After"
                    photo={afterPhoto}
                    onPick={(preview, file) => {
                      setAfterPhoto(preview);
                      setAfterFile(file);
                    }}
                    full
                    aspectRatio="5 / 3"
                    emptyHint="Add after photo (optional)"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              placeholder="Add a note (optional)... e.g. I only ate 2 of the 6 nuggets"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className={classNames(
                inputClass,
                'box-border w-full resize-none py-3 px-3.5',
              )}
            />

            <AnimatePresence>
              {loading && (
                <motion.div
                  aria-hidden="true"
                  key="loading-duck"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex justify-center"
                >
                  <Duck emotion={loadingEmotion} size={72} />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              disabled={!canAnalyse}
              onClick={handleAnalyse}
              color={canAnalyse ? 'var(--color-brand)' : 'var(--color-muted)'}
              className={classNames(
                'flex items-center justify-center gap-2.5',
                canAnalyse
                  ? 'cursor-pointer opacity-100'
                  : 'cursor-not-allowed opacity-50',
              )}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Analysing…</span>
                </>
              ) : (
                <>
                  Analyse <span aria-hidden="true">→</span>
                </>
              )}
            </Button>

            {error && (
              <Typography
                variant="caption"
                color={'var(--color-danger)'}
                className="text-center"
              >
                {error}
              </Typography>
            )}
          </motion.div>
        ) : (
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
                {localItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
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
                        color={
                          item.eaten ? 'var(--color-ink)' : 'var(--color-muted)'
                        }
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
                        editingIndex !== i &&
                          'border-b-1.5 border-dashed border-muted pb-0.5',
                      )}
                    >
                      <input
                        type="number"
                        aria-label={`Calories for ${item.name}`}
                        value={editingIndex === i ? itemDraft : item.kcal}
                        readOnly={editingIndex !== i}
                        style={
                          editingIndex === i
                            ? undefined
                            : {
                                width: `${Math.max(1, String(item.kcal).length)}ch`,
                              }
                        }
                        onFocus={(e) => {
                          beginItemEdit(i);
                          e.target.select();
                        }}
                        onChange={(e) => setItemDraft(e.target.value)}
                        onBlur={(e) => {
                          if (editingIndexRef.current === i) {
                            confirmItemEdit(i, e.currentTarget);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter')
                            confirmItemEdit(i, e.currentTarget);
                          if (e.key === 'Escape')
                            cancelItemEdit(e.currentTarget);
                        }}
                        className={
                          editingIndex === i
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
                      <Typography
                        variant="label-strong"
                        color={'var(--color-muted)'}
                      >
                        kcal
                      </Typography>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(i)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base leading-none text-muted"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ))}

                {addingItem ? (
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <label className="sr-only" htmlFor="new-item-name">
                      Item name
                    </label>
                    <input
                      id="new-item-name"
                      placeholder="Item name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
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
                      value={newItemKcal}
                      onChange={(e) => setNewItemKcal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                      className={classNames(
                        inputClass,
                        'w-16 rounded-control py-1 px-2 text-right text-label',
                      )}
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      aria-label="Add item"
                      className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base text-brand"
                    >
                      <span aria-hidden="true">✓</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingItem(false);
                        setNewItemName('');
                        setNewItemKcal('');
                      }}
                      aria-label="Cancel adding item"
                      className="shrink-0 cursor-pointer border-0 bg-transparent py-0.5 px-1 text-base text-muted"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingItem(true)}
                    className="cursor-pointer border-0 bg-transparent py-0.5 text-left font-[inherit]"
                  >
                    <Typography variant="label" color={'var(--color-brand)'}>
                      + Add item
                    </Typography>
                  </button>
                )}
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
              onClick={handleLog}
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
              onClick={handleReanalyse}
              className="cursor-pointer border-0 bg-transparent py-1 text-center font-[inherit]"
            >
              <Typography variant="label" color={'var(--color-muted)'}>
                Re-analyse
              </Typography>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenContainer>
  );
};
