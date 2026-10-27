type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;

  confirmLabel?: string;
  cancelLabel?: string;

  isLoading?: boolean;

  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={onClose}
        disabled={isLoading}
        className="absolute inset-0 bg-slate-950/40"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-rose-600"
            aria-hidden="true"
          >
            <path
              d="M12 8v4M12 16h.01"
              strokeLinecap="round"
            />

            <circle
              cx="12"
              cy="12"
              r="9"
            />
          </svg>
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-5 text-xl font-bold text-slate-900"
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          {description}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Cancelling...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;