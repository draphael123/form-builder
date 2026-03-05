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
      <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <input
        type="date"
        id={question.id}
        min={getMinDate()}
        max={getMaxDate()}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(question.id, {
          required: question.required ? 'Please select a date' : false,
          validate: getValidateFunction(),
        })}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
