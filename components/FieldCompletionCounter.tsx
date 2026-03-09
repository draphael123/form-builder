'use client';

interface FieldCompletionCounterProps {
  completed: number;
  total: number;
  required: number;
}

export function FieldCompletionCounter({ completed, total, required }: FieldCompletionCounterProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="field-completion-counter">
      <div className="field-counter-bar">
        <div
          className="field-counter-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="field-counter-text">
        <span className="field-counter-numbers">
          <strong>{completed}</strong> of {total} fields complete
        </span>
        {required > 0 && completed < required && (
          <span className="field-counter-required">
            ({required - Math.min(completed, required)} required remaining)
          </span>
        )}
      </div>
    </div>
  );
}
