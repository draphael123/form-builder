'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { DropdownQuestion } from '@/types/form';

interface DropdownProps {
  question: DropdownQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  // Item 13: onBlur callback for inline validation
  onBlur?: () => void;
}

export function Dropdown({ question, register, errors, onBlur }: DropdownProps) {
  const error = errors[question.id];

  // Get registration props and merge with our onBlur
  const registrationProps = register(question.id, {
    required: question.required ? 'Please select an option' : false,
  });

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
        <select
          id={question.id}
          className={`form-input appearance-none cursor-pointer pr-10 ${error ? 'error' : ''}`}
          {...registrationProps}
          onBlur={(e) => {
            registrationProps.onBlur(e); // Call react-hook-form's onBlur
            onBlur?.(); // Call our custom onBlur for validation
          }}
        >
          <option value="">{question.placeholder || 'Select an option'}</option>
          {/* Each option displays label but submits value */}
          {question.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-warm-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
