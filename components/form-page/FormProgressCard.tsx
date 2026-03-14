'use client';

interface FormProgressCardProps {
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  estimatedTimeRemaining: string;
  questionCounts: {
    total: number;
    startOfCurrentPage: number;
    endOfCurrentPage: number;
  };
  isAutoSaving?: boolean;
  lastSavedText?: string | null;
  onSkipToReview?: () => void;
  showSkipButton?: boolean;
}

export function FormProgressCard({
  currentPage,
  totalPages,
  progressPercentage,
  estimatedTimeRemaining,
  questionCounts,
  isAutoSaving = false,
  lastSavedText,
  onSkipToReview,
  showSkipButton = false,
}: FormProgressCardProps) {
  return (
    <div className="form-card mb-6">
      <div className="p-4 sm:p-6">
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-charcoal)]">
              Section {currentPage + 1} of {totalPages}
            </span>
            <span className="text-xs text-[var(--color-warm-gray)]">
              ({Math.round(progressPercentage)}% complete)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {(isAutoSaving || lastSavedText) && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-warm-gray)]">
                {isAutoSaving ? (
                  <>
                    <span className="spinner w-3 h-3" />
                    <span>Saving...</span>
                  </>
                ) : lastSavedText ? (
                  <>
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{lastSavedText}</span>
                  </>
                ) : null}
              </div>
            )}
            {/* Estimated time */}
            <div className="flex items-center gap-1 text-xs text-[var(--color-warm-gray)]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{estimatedTimeRemaining}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-seafoam)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Question Counter and Skip Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--color-warm-gray)]">
            Questions {questionCounts.startOfCurrentPage + 1}-{questionCounts.endOfCurrentPage} of {questionCounts.total}
          </div>
          {showSkipButton && onSkipToReview && progressPercentage >= 75 && (
            <button
              type="button"
              onClick={onSkipToReview}
              className="text-xs text-[var(--color-sage)] hover:text-[var(--color-seafoam)] font-medium transition-colors"
            >
              Skip to Review →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
