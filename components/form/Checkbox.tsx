'use client';

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { CheckboxQuestion } from '@/types/form';

interface CheckboxProps {
  question: CheckboxQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
}

export function Checkbox({ question, register, errors, watch }: CheckboxProps) {
  const error = errors[question.id];
  const selectedValues = watch(question.id) as string[] | undefined;

  const validate = (value: unknown) => {
    const arr = value as string[] | undefined;
    if (question.required && (!arr || arr.length === 0)) {
      return 'Please select at least one option';
    }
    if (question.minSelected && (!arr || arr.length < question.minSelected)) {
      return `Please select at least ${question.minSelected} options`;
    }
    if (question.maxSelected && arr && arr.length > question.maxSelected) {
      return `Please select at most ${question.maxSelected} options`;
    }
    return true;
  };

  return (
    <div className="space-y-3">
      <label className="question-label block">
        {question.label}
        {question.required && <span className="required-mark">*</span>}
      </label>
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedValues?.includes(option.value);
          return (
            <label
              key={option.value}
              className={`option-card ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                value={option.value}
                className="form-checkbox"
                {...register(question.id, { validate })}
              />
              <span className="text-[var(--color-charcoal)]">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {selectedValues && selectedValues.length > 0 && (
        <p className="text-xs text-[var(--color-warm-gray)]">
          {selectedValues.length} selected
        </p>
      )}
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
