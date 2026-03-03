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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              value={option.value}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              {...register(question.id, {
                required: question.required ? 'Please select an option' : false,
              })}
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
        {question.allowOther && (
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              value="__other__"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              {...register(question.id, {
                required: question.required ? 'Please select an option' : false,
              })}
              onChange={() => setValue(question.id, `Other: ${otherValue}`)}
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Other:</span>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => handleOtherChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Please specify"
            />
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
