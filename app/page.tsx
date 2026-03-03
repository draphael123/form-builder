'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { newHireFormConfig } from '@/lib/form-config';
import { Question } from '@/types/form';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
              <p className="text-sm text-gray-600">
                {newHireFormConfig.description}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {newHireFormConfig.sections.map((section) => (
            <FormSection
              key={section.id}
              title={section.title}
              description={section.description}
            >
              {section.questions.map((question) => renderQuestion(question))}
            </FormSection>
          ))}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
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
