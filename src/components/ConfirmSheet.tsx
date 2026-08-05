import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { Typography } from './ui/Typography';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const ConfirmSheet = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const triggerElement = document.activeElement as HTMLElement | null;
    // Focus the safe (non-destructive) action, not whichever element is first in
    // the DOM — landing focus on the destructive button would let a stray
    // Enter/Space right after opening trigger it.
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      triggerElement?.focus();
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[101] bg-black/40"
          />
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-screen rounded-t-3xl bg-white px-6 pt-6 pb-[calc(env(safe-area-inset-bottom)+24px)]"
          >
            <Typography
              variant="heading"
              as="h2"
              id="confirm-sheet-title"
              className="text-center"
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body"
                as="p"
                color={'var(--color-muted)'}
                className="mt-2 text-center"
              >
                {description}
              </Typography>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                onClick={onConfirm}
                color={danger ? 'var(--color-danger)' : 'var(--color-brand)'}
              >
                {confirmLabel}
              </Button>
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="w-full cursor-pointer border-0 bg-transparent py-2 font-[inherit]"
              >
                <Typography variant="input-label" as="span">
                  {cancelLabel}
                </Typography>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
