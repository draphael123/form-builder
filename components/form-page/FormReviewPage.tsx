'use client';

import { FormSection as FormSectionType, Question } from '@/types/form';

interface FormReviewPageProps {
  visibleSections: FormSectionType[];
  watchedValues: Record<string, unknown>;
  shouldShowQuestion: (question: Question) => boolean;
  onEditFromReview: (sectionIndex: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function FormReviewPage({
  visibleSections,
  watchedValues,
  shouldShowQuestion,
  onEditFromReview,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
}: FormReviewPageProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="form-card mb-6">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)]">
                Review Your Answers
              </h2>
              <p className="text-[var(--color-warm-gray)]">
                Please review your information before submitting
              </p>
            </div>
          </div>

          {visibleSections.map((section, sectionIndex) => {
            const visibleQuestions = section.questions.filter(shouldShowQuestion);
            if (visibleQuestions.length === 0) return null;

            return (
              <div key={section.id} className="review-section">
                <div className="flex items-center justify-between">
                  <h3 className="review-section-title">{section.title}</h3>
                  <button
                    type="button"
                    onClick={() => onEditFromReview(sectionIndex)}
                    className="review-edit-btn"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>
                {visibleQuestions.map((question) => {
                  const value = watchedValues[question.id];
                  let displayValue: string;

                  if (value === undefined || value === null || value === '') {
                    displayValue = '';
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value);
                  } else {
                    displayValue = String(value);
                  }

                  // Handle file uploads
                  if (question.type === 'file-upload' && displayValue) {
                    displayValue = 'File uploaded';
                  }

                  return (
                    <div key={question.id} className="review-field">
                      <span className="review-field-label">{question.label}</span>
                      <span className={`review-field-value ${!displayValue ? 'empty' : ''}`}>
                        {displayValue || 'Not provided'}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="form-card border-l-4 border-red-500 animate-fade-in mb-6">
          <div className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-800">Submission Error</p>
              <p className="text-sm text-red-600 mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Form
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
