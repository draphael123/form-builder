'use client';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { MultipleChoiceQuestion } from '@/types/form';
import { useState } from 'react';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
}

export function MultipleChoice({ question, register, errors, watch, setValue }: MultipleChoiceProps) {
  const error = errors[question.id];
  const [otherValue, setOtherValue] = useState('');
  const selectedValue = watch(question.id);

  const handleOtherChange = (value: string) => {
    setOtherValue(value);
    if (selectedValue === '__other__') {
      setValue(question.id, `Other: ${value}`);
    }
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
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              className={`option-card ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="radio"
                value={option.value}
                className="form-radio"
                {...register(question.id, {
                  required: question.required ? 'Please select an option' : false,
                })}
              />
              <span className="text-[var(--color-charcoal)]">
                {option.label}
              </span>
            </label>
          );
        })}
        {question.allowOther && (
          <label className={`option-card ${selectedValue?.toString().startsWith('Other:') ? 'selected' : ''}`}>
            <input
              type="radio"
              value="__other__"
              className="form-radio"
              {...register(question.id, {
                required: question.required ? 'Please select an option' : false,
              })}
              onChange={() => setValue(question.id, `Other: ${otherValue}`)}
            />
            <span className="text-[var(--color-charcoal)]">Other:</span>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => handleOtherChange(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-transparent border-b-2 border-[var(--color-parchment)] focus:border-[var(--color-terracotta)] focus:outline-none transition-colors"
              placeholder="Please specify"
            />
          </label>
        )}
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
