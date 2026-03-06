'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { DateQuestion } from '@/types/form';
import { validateBirthDate, validateSignatureDate, validateDateNotInFuture } from '@/lib/validations';

interface DatePickerProps {
  question: DateQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function DatePicker({ question, register, errors }: DatePickerProps) {
  const error = errors[question.id];

  // Get validation function based on type
  const getValidateFunction = () => {
    const validator = (value: unknown): string | true => {
      if (!value || typeof value !== 'string') return true;

      switch (question.validationType) {
        case 'birthDate':
          return validateBirthDate(value);
        case 'signatureDate':
          return validateSignatureDate(value);
        case 'pastDate':
          return validateDateNotInFuture(value);
        default:
          return true;
      }
    };

    return question.validationType ? validator : undefined;
  };

  // Get max date for date input (prevent future dates for certain types)
  const getMaxDate = () => {
    if (question.maxDate) return question.maxDate;
    if (question.validationType === 'birthDate' ||
        question.validationType === 'signatureDate' ||
        question.validationType === 'pastDate') {
      return new Date().toISOString().split('T')[0];
    }
    return undefined;
  };

  // Get min date for certain validation types
  const getMinDate = () => {
    if (question.minDate) return question.minDate;
    if (question.validationType === 'signatureDate') {
      // Signature date should be within last 7 days
      const minDate = new Date();
      minDate.setDate(minDate.getDate() - 7);
      return minDate.toISOString().split('T')[0];
    }
    return undefined;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={question.id} className="question-label block">
        {question.label}
        {question.required && <span className="required-mark">*</span>}
      </label>
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}
      <div className="relative">
        <input
          type="date"
          id={question.id}
          min={getMinDate()}
          max={getMaxDate()}
          className={`form-input ${error ? 'error' : ''}`}
          {...register(question.id, {
            required: question.required ? 'Please select a date' : false,
            validate: getValidateFunction(),
          })}
        />
      </div>
      {error && (
        <p className="error-text">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message as string}
        </p>
      )}
    </div>
  );
}
