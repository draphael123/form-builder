'use client';

interface FormNavigationFooterProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel?: string;
  nextLabel?: string;
  reviewLabel?: string;
  showKeyboardHint?: boolean;
  showSwipeHint?: boolean;
}

export function FormNavigationFooter({
  isFirstPage,
  isLastPage,
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  reviewLabel = 'Review Answers',
  showKeyboardHint = true,
  showSwipeHint = true,
}: FormNavigationFooterProps) {
  return (
    <div className="space-y-4">
      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
        {!isFirstPage ? (
          <button
            type="button"
            onClick={onPrevious}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {previousLabel}
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onNext}
          className="btn btn-primary"
        >
          {isLastPage ? reviewLabel : nextLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard Navigation Hint */}
      {showKeyboardHint && (
        <div className="hidden sm:flex justify-center">
          <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">←</span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">→</span>
            <span>to navigate</span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Enter</span>
            <span>to continue</span>
          </div>
        </div>
      )}

      {/* Swipe Hint for Mobile */}
      {showSwipeHint && (
        <div className="flex sm:hidden justify-center">
          <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Swipe to navigate</span>
          </div>
        </div>
      )}
    </div>
  );
}
