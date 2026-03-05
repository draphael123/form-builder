'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { TextQuestion } from '@/types/form';
import { getValidationRules, formatSSN, formatPhone } from '@/lib/validations';
import { useCallback } from 'react';

interface TextFieldProps {
  question: TextQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  setValue?: UseFormSetValue<Record<string, unknown>>;
  watch?: UseFormWatch<Record<string, unknown>>;
}

export function TextField({ question, register, errors, setValue, watch }: TextFieldProps) {
  const error = errors[question.id];
  const isLongText = question.type === 'long-text';
  const validationType = question.validationType;

  // Get validation rules based on type
  const validationRules = getValidationRules(validationType);

  // Handle input masking for SSN and phone
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setValue) return;

    const value = e.target.value;
    let formattedValue = value;

    if (validationType === 'ssn') {
      formattedValue = formatSSN(value);
    } else if (validationType === 'phone') {
      formattedValue = formatPhone(value);
    }

    if (formattedValue !== value) {
      setValue(question.id, formattedValue);
    }
  }, [validationType, setValue, question.id]);

  // Get placeholder text based on validation type
  const getPlaceholder = () => {
    if (question.placeholder) return question.placeholder;
    switch (validationType) {
      case 'email':
        return 'email@example.com';
      case 'ssn':
        return '###-##-####';
      case 'phone':
        return '###-###-####';
      default:
        return undefined;
    }
  };

  // Get input type based on validation
  const getInputType = () => {
    if (validationType === 'email') return 'email';
    return 'text';
  };

  const commonProps = {
    id: question.id,
    placeholder: getPlaceholder(),
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
      ...validationRules,
    }),
  };

  // For SSN and phone, we need to handle onChange for masking
  const inputProps = validationType === 'ssn' || validationType === 'phone'
    ? { ...commonProps, onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        commonProps.onChange(e); // Call react-hook-form's onChange
        handleChange(e); // Apply masking
      }}
    : commonProps;

  return (
    <div className="space-y-2">
      <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500 whitespace-pre-line">{question.description}</p>
      )}
      {isLongText ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type={getInputType()} {...inputProps} />
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
