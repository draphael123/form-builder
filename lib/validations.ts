// Validation patterns and functions for form fields

// Email validation
export const emailPattern = {
  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  message: 'Please enter a valid email address',
};

// SSN validation (format: ###-##-####)
export const ssnPattern = {
  value: /^\d{3}-\d{2}-\d{4}$/,
  message: 'Please enter SSN in format: ###-##-####',
};

// Phone number validation (format: ###-###-####)
export const phonePattern = {
  value: /^\d{3}-\d{3}-\d{4}$/,
  message: 'Please enter phone number in format: ###-###-####',
};

// International phone number validation (allows various formats)
export const phoneInternationalPattern = {
  value: /^[\d\s\-().]{6,20}$/,
  message: 'Please enter a valid phone number (6-20 digits)',
};

// ZIP/Postal code validation (3-7 alphanumeric characters, supports international formats)
export const zipCodePattern = {
  value: /^[A-Za-z0-9\s\-]{3,7}$/,
  message: 'Please enter a valid postal code (3-7 characters)',
};

// Format ZIP code as user types
export function formatZipCode(value: string): string {
  // Allow alphanumeric, spaces, and hyphens, limit to 7 characters
  return value.replace(/[^A-Za-z0-9\s\-]/g, '').slice(0, 7);
}

// Date validation functions
export function validateDateNotInFuture(value: string): string | true {
  if (!value) return true;
  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (date > today) {
    return 'Date cannot be in the future';
  }
  return true;
}

export function validateDateNotTooOld(value: string, maxYearsAgo: number = 120): string | true {
  if (!value) return true;
  const date = new Date(value);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - maxYearsAgo);

  if (date < minDate) {
    return `Date cannot be more than ${maxYearsAgo} years ago`;
  }
  return true;
}

export function validateBirthDate(value: string): string | true {
  if (!value) return true;

  const futureCheck = validateDateNotInFuture(value);
  if (futureCheck !== true) return futureCheck;

  const oldCheck = validateDateNotTooOld(value, 120);
  if (oldCheck !== true) return oldCheck;

  // Check minimum age (18 for employment)
  const date = new Date(value);
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

  if (date > minAgeDate) {
    return 'Must be at least 18 years old';
  }

  return true;
}

export function validateSignatureDate(value: string): string | true {
  if (!value) return true;

  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Signature date should be today or in the recent past (within 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (date > today) {
    return 'Signature date cannot be in the future';
  }

  if (date < sevenDaysAgo) {
    return 'Signature date should be within the last 7 days';
  }

  return true;
}

// Validation type for form fields
export type ValidationType = 'email' | 'ssn' | 'phone' | 'phoneInternational' | 'birthDate' | 'signatureDate' | 'pastDate' | 'zipCode' | 'confirmEmail';

// Get validation rules based on type
export function getValidationRules(validationType?: ValidationType): {
  pattern?: { value: RegExp; message: string };
  validate?: (value: unknown) => string | true;
} {
  switch (validationType) {
    case 'email':
      return { pattern: emailPattern };
    case 'ssn':
      return { pattern: ssnPattern };
    case 'phone':
      return { pattern: phonePattern };
    case 'phoneInternational':
      return { pattern: phoneInternationalPattern };
    case 'birthDate':
      return {
        validate: (value: unknown) => {
          if (!value || typeof value !== 'string') return true;
          return validateBirthDate(value);
        },
      };
    case 'signatureDate':
      return {
        validate: (value: unknown) => {
          if (!value || typeof value !== 'string') return true;
          return validateSignatureDate(value);
        },
      };
    case 'pastDate':
      return {
        validate: (value: unknown) => {
          if (!value || typeof value !== 'string') return true;
          return validateDateNotInFuture(value);
        },
      };
    case 'zipCode':
      return { pattern: zipCodePattern };
    case 'confirmEmail':
      // confirmEmail validation is handled separately in the form component
      // as it needs to compare against another field value
      return { pattern: emailPattern };
    default:
      return {};
  }
}

// Format helpers for input masking
export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatPhoneInternational(value: string): string {
  // Allow digits, spaces, dashes, parentheses, and periods
  // Just strip out any characters that aren't in the allowed set
  return value.replace(/[^\d\s\-().]/g, '').slice(0, 20);
}
