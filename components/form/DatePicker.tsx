'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { DateQuestion } from '@/types/form';
import { validateBirthDate, validateSignatureDate, validateDateNotInFuture } from '@/lib/validations';
import { useCallback, useState } from 'react';

interface DatePickerProps {
  question: DateQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  setValue?: UseFormSetValue<Record<string, unknown>>;
  watch?: UseFormWatch<Record<string, unknown>>;
  onBlur?: () => void;
}

// Format input as MM/DD/YYYY mask
function formatDateMask(value: string): string {
  // Strip non-digits
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

// Convert MM/DD/YYYY to YYYY-MM-DD for internal form value
function maskedToISO(masked: string): string {
  const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return masked;
  return `${match[3]}-${match[1]}-${match[2]}`;
}

// Convert YYYY-MM-DD to MM/DD/YYYY for display
function isoToMasked(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

export function DatePicker({ question, register, errors, setValue, watch, onBlur }: DatePickerProps) {
  const error = errors[question.id];
  const useMaskedInput = question.validationType === 'birthDate';
  const currentValue = watch ? (watch(question.id) as string) || '' : '';
  const [displayValue, setDisplayValue] = useState(() =>
    currentValue && currentValue.includes('-') ? isoToMasked(currentValue) : currentValue
  );

  // Get validation function based on type
  const getValidateFunction = () => {
    const validator = (value: unknown): string | true => {
      if (!value || typeof value !== 'string') return true;

      switch (question.validationType) {
        case 'birthDate':
          return validateBirthDate(value);
        case 'signatureDate':
          return validateSignatureDate(value);
        case 'pastDate':
          return validateDateNotInFuture(value);
        default:
          return true;
      }
    };

    return question.validationType ? validator : undefined;
  };

  // Handle masked date input change
  const handleMaskedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatDateMask(raw);
    setDisplayValue(formatted);

    // When we have a full date (MM/DD/YYYY), convert to ISO and set form value
    if (formatted.length === 10) {
      const isoDate = maskedToISO(formatted);
      setValue?.(question.id, isoDate, { shouldValidate: true });
    } else {
      // Partial date â clear the form value so validation fails
      setValue?.(question.id, formatted, { shouldValidate: false });
    }
  }, [setValue, question.id]);

  // Get max date for date input (prevent future dates for certain types)
  const getMaxDate = () => {
    if (question.maxDate) return question.maxDate;
    if (question.validationType === 'birthDate' ||
        question.validationType === 'signatureDate' ||
        question.validationType === 'pastDate') {
      return new Date().toISOString().split('T')[0];
    }
    return undefined;
  };

  // Get min date for certain validation types
  const getMinDate = () => {
    if (question.minDate) return question.minDate;
    if (question.validationType === 'signatureDate') {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() - 7);
      return minDate.toISOString().split('T')[0];
    }
    return undefined;
  };

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
        {useMaskedInput ? (
          <>
            {/* Hidden registered field for react-hook-form */}
            <input
              type="hidden"
              {...register(question.id, {
                required: question.required ? 'Please enter your date of birth' : false,
                validate: getValidateFunction(),
              })}
            />
            {/* Visible masked input */}
            <input
              type="text"
              id={question.id}
              inputMode="numeric"
              placeholder="MM/DD/YYYY"
              maxLength={10}
              autoComplete={question.autocomplete || 'bday'}
              className={`form-input ${error ? 'error' : ''}`}
              value={displayValue}
              onChange={handleMaskedChange}
              onBlur={() => onBlur?.()}
            />
            {/* Calendar icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-warm-gray-light)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </>
        ) : (
          <input
            type="date"
            id={question.id}
            min={getMinDate()}
            max={getMaxDate()}
            autoComplete={question.autocomplete || 'off'}
            className={`form-input ${error ? 'error' : ''}`}
            {...register(question.id, {
              required: question.required ? 'Please select a date' : false,
              validate: getValidateFunction(),
            })}
            onBlur={() => onBlur?.()}
          />
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
