import { useRef } from 'react';
import { Button } from './Button';
import { Typography } from './ui/Typography';
import { BottomSheet } from './BottomSheet';

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
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <BottomSheet
      open={open}
      onClose={onCancel}
      ariaLabelledBy="confirm-sheet-title"
      initialFocusRef={cancelRef}
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
    </BottomSheet>
  );
};
