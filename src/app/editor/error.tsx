'use client';

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          {error.message || 'An unexpected error occurred in the editor.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-5 rounded-md text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
