'use client';

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { LinearScaleQuestion } from '@/types/form';

interface LinearScaleProps {
  question: LinearScaleQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
}

export function LinearScale({ question, register, errors, watch }: LinearScaleProps) {
  const error = errors[question.id];
  const selectedValue = watch(question.id);

  const scaleValues = [];
  for (let i = question.min; i <= question.max; i++) {
    scaleValues.push(i);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        {question.minLabel && (
          <span className="text-sm text-gray-600">{question.minLabel}</span>
        )}
        <div className="flex gap-2 flex-wrap justify-center">
          {scaleValues.map((value) => (
            <label
              key={value}
              className={`flex flex-col items-center cursor-pointer`}
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register(question.id, {
                  required: question.required ? 'Please select a value' : false,
                })}
              />
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                  String(selectedValue) === String(value)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 hover:border-blue-400 text-gray-700'
                }`}
              >
                {value}
              </span>
            </label>
          ))}
        </div>
        {question.maxLabel && (
          <span className="text-sm text-gray-600">{question.maxLabel}</span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
