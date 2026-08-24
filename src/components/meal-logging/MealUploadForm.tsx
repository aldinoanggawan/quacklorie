import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { Duck } from '../duck/Duck';
import type { DuckEmotion } from '../duck/Duck';
import { Typography } from '../ui/Typography';
import { UploadZone } from '../UploadZone';
import { Spinner } from '../Spinner';
import { classNames } from '../../lib/classNames';
import { inputClass } from './styles';

interface MealUploadFormProps {
  loading: boolean;
  error: string | null;
  onAnalyse: (args: {
    beforeFile: File;
    afterFile: File | null;
    note: string;
  }) => void;
}

export const MealUploadForm = ({
  loading,
  error,
  onAnalyse,
}: MealUploadFormProps) => {
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [loadingEmotion, setLoadingEmotion] = useState<DuckEmotion>('grumpy');

  const canAnalyse = !!beforeFile && !loading;

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingEmotion((e) => (e === 'grumpy' ? 'worried' : 'grumpy'));
    }, 900);
    return () => clearInterval(id);
  }, [loading]);

  const handleAnalyse = () => {
    if (!beforeFile) return;
    onAnalyse({ beforeFile, afterFile, note });
  };

  return (
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
  );
};
