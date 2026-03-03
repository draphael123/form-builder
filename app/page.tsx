'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { newHireFormConfig } from '@/lib/form-config';
import { Question, FormSection as FormSectionType } from '@/types/form';
import {
  FormSection,
  TextField,
  MultipleChoice,
  Checkbox,
  Dropdown,
  DatePicker,
  TimePicker,
  LinearScale,
  Grid,
  FileUpload,
} from '@/components/form';

export default function FormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Record<string, unknown>>();

  const watchedValues = watch();

  // Check if a question should be shown based on conditional logic
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.showWhen) return true;

    const { field, equals } = question.showWhen;
    const currentValue = watchedValues[field];

    if (Array.isArray(equals)) {
      return equals.includes(currentValue as string);
    }

    return currentValue === equals;
  };

  // Check if a section should be shown (has at least one visible question)
  const shouldShowSection = (section: FormSectionType): boolean => {
    return section.questions.some((question) => shouldShowQuestion(question));
  };

  // Get visible sections only
  const visibleSections = useMemo(() => {
    return newHireFormConfig.sections.filter((section) => shouldShowSection(section));
  }, [watchedValues]);

  const totalPages = visibleSections.length;
  const currentSection = visibleSections[currentPage];
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  // Render a question based on its type
  const renderQuestion = (question: Question) => {
    if (!shouldShowQuestion(question)) return null;

    const commonProps = {
      register,
      errors,
      watch,
      setValue,
    };

    switch (question.type) {
      case 'short-text':
      case 'long-text':
        return <TextField key={question.id} question={question} {...commonProps} />;

      case 'multiple-choice':
        return <MultipleChoice key={question.id} question={question} {...commonProps} />;

      case 'checkbox':
        return <Checkbox key={question.id} question={question} {...commonProps} />;

      case 'dropdown':
        return <Dropdown key={question.id} question={question} {...commonProps} />;

      case 'date':
        return <DatePicker key={question.id} question={question} {...commonProps} />;

      case 'time':
        return <TimePicker key={question.id} question={question} {...commonProps} />;

      case 'linear-scale':
        return <LinearScale key={question.id} question={question} {...commonProps} />;

      case 'multiple-choice-grid':
      case 'checkbox-grid':
        return <Grid key={question.id} question={question} {...commonProps} />;

      case 'file-upload':
        return <FileUpload key={question.id} question={question} {...commonProps} />;

      default:
        return null;
    }
  };

  // Handle next page
  const handleNext = async () => {
    // Validate current section's fields
    const currentQuestions = currentSection.questions.filter(shouldShowQuestion);
    const fieldIds = currentQuestions.map((q) => q.id);

    const isValid = await trigger(fieldIds);

    if (isValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/success');
      } else {
        setSubmitError(result.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="border-t-8 border-blue-600" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {newHireFormConfig.title}
            </h1>
            {newHireFormConfig.description && (
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {newHireFormConfig.description}
              </p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentPage + 1) / totalPages) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Section */}
          {currentSection && (
            <FormSection
              key={currentSection.id}
              title={currentSection.title}
              description={currentSection.description}
            >
              {currentSection.questions.map((question) => renderQuestion(question))}
            </FormSection>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstPage}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isFirstPage
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {isLastPage ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  newHireFormConfig.submitButtonText || 'Submit'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          This form was created with Form Builder
        </p>
      </div>
    </div>
  );
}
