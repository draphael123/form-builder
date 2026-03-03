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
              type="checkbox"
              value={option.value}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register(question.id, { validate })}
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {selectedValues && selectedValues.length > 0 && (
        <p className="text-xs text-gray-500">
          {selectedValues.length} selected
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
