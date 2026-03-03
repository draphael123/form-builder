'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextQuestion } from '@/types/form';

interface TextFieldProps {
  question: TextQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
}

export function TextField({ question, register, errors }: TextFieldProps) {
  const error = errors[question.id];
  const isLongText = question.type === 'long-text';

  const commonProps = {
    id: question.id,
    placeholder: question.placeholder,
    className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? 'border-red-500' : 'border-gray-300'
    }`,
    ...register(question.id, {
      required: question.required ? 'This field is required' : false,
      minLength: question.minLength
        ? { value: question.minLength, message: `Minimum ${question.minLength} characters` }
        : undefined,
      maxLength: question.maxLength
        ? { value: question.maxLength, message: `Maximum ${question.maxLength} characters` }
        : undefined,
    }),
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
      {isLongText ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type="text" {...commonProps} />
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
