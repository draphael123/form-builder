'use client';

interface FloatingProgressBarProps {
  progress: number;
}

export function FloatingProgressBar({ progress }: FloatingProgressBarProps) {
  return (
    <div className="floating-progress">
      <div
        className="floating-progress-fill"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
