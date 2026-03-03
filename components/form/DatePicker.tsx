'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { DateQuestion } from '@/types/form';

interface DatePickerProps {
  question: DateQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function DatePicker({ question, register, errors }: DatePickerProps) {
  const error = errors[question.id];

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
        min={question.minDate}
        max={question.maxDate}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(question.id, {
          required: question.required ? 'Please select a date' : false,
        })}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
