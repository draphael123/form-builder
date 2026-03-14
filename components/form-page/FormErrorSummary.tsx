'use client';

interface FormError {
  id: string;
  label: string;
  message: string;
}

interface FormErrorSummaryProps {
  errors: FormError[];
  onJumpToError?: (errorId: string) => void;
}

export function FormErrorSummary({ errors, onJumpToError }: FormErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="form-card border-l-4 border-red-500 animate-fade-in mb-6">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-800">
              Please fix the following {errors.length === 1 ? 'error' : 'errors'}:
            </p>
            <ul className="mt-2 space-y-1">
              {errors.map((error) => (
                <li key={error.id} className="text-sm text-red-600">
                  {onJumpToError ? (
                    <button
                      type="button"
                      onClick={() => onJumpToError(error.id)}
                      className="text-left hover:underline focus:underline focus:outline-none"
                    >
                      <strong>{error.label}:</strong> {error.message}
                    </button>
                  ) : (
                    <span>
                      <strong>{error.label}:</strong> {error.message}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
