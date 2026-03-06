// Input formatting utilities

/**
 * Format SSN as ###-##-####
 */
export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

/**
 * Format phone as (###) ###-####
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Mask SSN showing only last 4 digits
 */
export function maskSSN(value: string): string {
  const formatted = formatSSN(value);
  if (formatted.length < 11) return formatted;
  return `•••-••-${formatted.slice(-4)}`;
}

/**
 * Get raw digits from formatted value
 */
export function getDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validate SSN format
 */
export function isValidSSN(value: string): boolean {
  const digits = getDigitsOnly(value);
  return digits.length === 9;
}

/**
 * Validate phone format
 */
export function isValidPhone(value: string): boolean {
  const digits = getDigitsOnly(value);
  return digits.length === 10;
}

/**
 * Validate date format
 */
export function isValidDate(value: string): boolean {
  const digits = getDigitsOnly(value);
  if (digits.length !== 8) return false;

  const month = parseInt(digits.slice(0, 2), 10);
  const day = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4), 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;

  return true;
}
