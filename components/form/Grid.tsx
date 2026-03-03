'use client';

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { GridQuestion } from '@/types/form';

interface GridProps {
  question: GridQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  watch: UseFormWatch<Record<string, unknown>>;
}

export function Grid({ question, register, errors, watch }: GridProps) {
  const isMultipleChoice = question.type === 'multiple-choice-grid';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left"></th>
              {question.columns.map((col) => (
                <th key={col.value} className="p-2 text-center text-sm font-medium text-gray-700">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row) => {
              const fieldName = `${question.id}_${row.value}`;
              const error = errors[fieldName];
              const selectedValue = watch(fieldName);

              return (
                <tr key={row.value} className="border-t border-gray-200">
                  <td className="p-2 text-sm text-gray-700">{row.label}</td>
                  {question.columns.map((col) => (
                    <td key={col.value} className="p-2 text-center">
                      {isMultipleChoice ? (
                        <input
                          type="radio"
                          value={col.value}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          {...register(fieldName, {
                            required: question.required ? 'This row is required' : false,
                          })}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          value={col.value}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          {...register(fieldName)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Show error for any row */}
      {question.rows.some((row) => errors[`${question.id}_${row.value}`]) && (
        <p className="text-sm text-red-500">Please complete all rows</p>
      )}
    </div>
  );
}
