'use client';

interface SkipToReviewButtonProps {
  progress: number;
  onSkip: () => void;
  threshold?: number;
}

export function SkipToReviewButton({
  progress,
  onSkip,
  threshold = 90
}: SkipToReviewButtonProps) {
  if (progress < threshold) return null;

  return (
    <button
      type="button"
      onClick={onSkip}
      className="skip-to-review-btn"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
      Skip to Review
    </button>
  );
}
