'use client';

interface MobileBottomNavProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  showReviewPage: boolean;
  progress: number;
}

export function MobileBottomNav({
  onPrevious,
  onNext,
  isFirstPage,
  isLastPage,
  showReviewPage,
  progress,
}: MobileBottomNavProps) {
  if (showReviewPage) return null;

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-nav-progress">
        <div
          className="mobile-nav-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mobile-nav-buttons">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstPage}
          className="mobile-nav-btn mobile-nav-prev"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="mobile-nav-indicator">
          {Math.round(progress)}%
        </div>

        <button
          type="button"
          onClick={onNext}
          className="mobile-nav-btn mobile-nav-next"
        >
          <span>{isLastPage ? 'Review' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
