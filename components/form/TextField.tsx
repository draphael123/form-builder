'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { TextQuestion } from '@/types/form';
import { getValidationRules, formatSSN, formatPhone, formatPhoneInternational, formatZipCode } from '@/lib/validations';
import { useCallback, useState } from 'react';

interface TextFieldProps {
  question: TextQuestion;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  setValue?: UseFormSetValue<Record<string, unknown>>;
  watch?: UseFormWatch<Record<string, unknown>>;
  onBlur?: () => void;
}

export function TextField({ question, register, errors, setValue, watch, onBlur }: TextFieldProps) {
  const error = errors[question.id];
  const isLongText = question.type === 'long-text';
  const validationType = question.validationType;
  const [showSSN, setShowSSN] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Watch the current value for SSN masking
  const currentValue = watch ? watch(question.id) as string : '';

  // Get validation rules based on type
  const validationRules = getValidationRules(validationType);

  // Handle input masking for SSN, phone, and zip code
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setValue) return;

    const value = e.target.value;
    let formattedValue = value;

    if (validationType === 'ssn') {
      formattedValue = formatSSN(value);
    } else if (validationType === 'phone') {
      formattedValue = formatPhone(value);
    } else if (validationType === 'phoneInternational') {
      formattedValue = formatPhoneInternational(value);
    } else if (validationType === 'zipCode') {
      formattedValue = formatZipCode(value);
    }

    if (formattedValue !== value) {
      setValue(question.id, formattedValue);
    }
  }, [validationType, setValue, question.id]);

  // Get email value for confirmEmail validation
  const emailValue = watch ? watch('personalEmailAddress') as string : '';

  // Get placeholder text based on validation type
  const getPlaceholder = () => {
    if (question.placeholder) return question.placeholder;
    switch (validationType) {
      case 'email':
      case 'confirmEmail':
        return 'you@example.com';
      case 'ssn':
        return '###-##-####';
      case 'phone':
        return '(###) ###-####';
      case 'zipCode':
        return '12345 or 12345-6789';
      default:
        return undefined;
    }
  };

  // Get input type based on validation
  const getInputType = () => {
    if (validationType === 'email') return 'email';
    return 'text';
  };

  // Build validation rules, adding confirmEmail check if applicable
  const buildValidation = () => {
    // Default maxLength based on field type to prevent spreadsheet overflow
    const defaultMaxLength = isLongText ? 2000 : 500;
    const effectiveMaxLength = question.maxLength || defaultMaxLength;

    const baseRules = {
      required: question.required ? 'This field is required' : false,
      minLength: question.minLength
        ? { value: question.minLength, message: `Minimum ${question.minLength} characters` }
        : undefined,
      maxLength: { value: effectiveMaxLength, message: `Maximum ${effectiveMaxLength} characters` },
      ...validationRules,
    };

    // Add custom validation for confirmEmail type
    if (validationType === 'confirmEmail') {
      return {
        ...baseRules,
        validate: (value: unknown) => {
          if (!value || typeof value !== 'string') return true;
          if (value !== emailValue) {
            return 'Email addresses do not match';
          }
          return true;
        },
      };
    }

    return baseRules;
  };

  const commonProps = {
    id: question.id,
    placeholder: getPlaceholder(),
    className: `form-input ${error ? 'error' : ''}`,
    ...register(question.id, buildValidation()),
  };

  // For SSN, phone, and zip code, we need to handle onChange for masking
  const inputProps = validationType === 'ssn' || validationType === 'phone' || validationType === 'phoneInternational' || validationType === 'zipCode'
    ? { ...commonProps, onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        commonProps.onChange(e); // Call react-hook-form's onChange
        handleChange(e); // Apply masking
      }}
    : commonProps;

  // Get tooltip content based on field type
  const getTooltip = () => {
    if (question.tooltip) return question.tooltip;
    switch (validationType) {
      case 'ssn':
        return 'Your Social Security Number is encrypted and securely stored. It will only be used for employment verification purposes.';
      case 'phone':
        return 'Please enter a valid 10-digit US phone number.';
      case 'phoneInternational':
        return 'Enter your phone number without the country code (selected separately).';
      case 'email':
        return 'We\'ll use this email to send you important updates about your application.';
      case 'confirmEmail':
        return 'Please re-enter your email to confirm it matches.';
      case 'zipCode':
        return 'Enter a valid US ZIP code (5 digits) or ZIP+4 format (12345-6789).';
      default:
        return null;
    }
  };

  const tooltip = getTooltip();

  // Mask SSN display when not focused
  const getMaskedValue = () => {
    if (validationType !== 'ssn' || !currentValue || showSSN) return undefined;
    const formatted = formatSSN(currentValue);
    if (formatted.length < 7) return undefined;
    return `•••-••-${formatted.slice(-4)}`;
  };

  const maskedValue = getMaskedValue();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor={question.id} className="question-label block">
          {question.label}
          {question.required && <span className="required-mark">*</span>}
        </label>
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              className="text-[var(--color-warm-gray)] hover:text-[var(--color-terracotta)] transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label="More information"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showTooltip && (
              <div className="tooltip-popup">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}
      {isLongText ? (
        <textarea {...commonProps} rows={4} onBlur={onBlur} />
      ) : validationType === 'ssn' ? (
        <div className="relative">
          <input
            type={showSSN ? 'text' : 'text'}
            {...inputProps}
            onFocus={() => setShowSSN(true)}
            onBlur={() => {
              setShowSSN(false);
              onBlur?.();
            }}
            style={maskedValue && !showSSN ? { color: 'transparent', caretColor: 'transparent' } : undefined}
          />
          {maskedValue && !showSSN && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-[var(--color-charcoal)]">
              {maskedValue}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowSSN(!showSSN)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-gray)] hover:text-[var(--color-terracotta)] transition-colors"
            aria-label={showSSN ? 'Hide SSN' : 'Show SSN'}
          >
            {showSSN ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <input type={getInputType()} {...inputProps} onBlur={onBlur} />
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
