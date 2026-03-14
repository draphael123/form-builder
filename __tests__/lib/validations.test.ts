import {
  emailPattern,
  ssnPattern,
  phonePattern,
  validateDateNotInFuture,
  validateDateNotTooOld,
  validateBirthDate,
  validateSignatureDate,
  getValidationRules,
  formatSSN,
  formatPhone,
} from '@/lib/validations';

describe('Validation Patterns', () => {
  describe('emailPattern', () => {
    const regex = emailPattern.value;

    it('should accept valid email addresses', () => {
      expect(regex.test('test@example.com')).toBe(true);
      expect(regex.test('user.name@domain.org')).toBe(true);
      expect(regex.test('user+tag@company.co.uk')).toBe(true);
      expect(regex.test('name123@test.io')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(regex.test('invalid')).toBe(false);
      expect(regex.test('invalid@')).toBe(false);
      expect(regex.test('@domain.com')).toBe(false);
      expect(regex.test('test@.com')).toBe(false);
      expect(regex.test('test@domain')).toBe(false);
      expect(regex.test('')).toBe(false);
    });
  });

  describe('ssnPattern', () => {
    const regex = ssnPattern.value;

    it('should accept valid SSN format', () => {
      expect(regex.test('123-45-6789')).toBe(true);
      expect(regex.test('000-00-0000')).toBe(true);
      expect(regex.test('999-99-9999')).toBe(true);
    });

    it('should reject invalid SSN formats', () => {
      expect(regex.test('123456789')).toBe(false);
      expect(regex.test('123-456-789')).toBe(false);
      expect(regex.test('12-345-6789')).toBe(false);
      expect(regex.test('123-4-56789')).toBe(false);
      expect(regex.test('abc-de-fghi')).toBe(false);
      expect(regex.test('')).toBe(false);
    });
  });

  describe('phonePattern', () => {
    const regex = phonePattern.value;

    it('should accept valid phone format', () => {
      expect(regex.test('123-456-7890')).toBe(true);
      expect(regex.test('000-000-0000')).toBe(true);
      expect(regex.test('999-999-9999')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(regex.test('1234567890')).toBe(false);
      expect(regex.test('123-45-67890')).toBe(false);
      expect(regex.test('(123) 456-7890')).toBe(false);
      expect(regex.test('123.456.7890')).toBe(false);
      expect(regex.test('')).toBe(false);
    });
  });
});

describe('Date Validation Functions', () => {
  describe('validateDateNotInFuture', () => {
    it('should return true for empty value', () => {
      expect(validateDateNotInFuture('')).toBe(true);
    });

    it('should return true for past dates', () => {
      expect(validateDateNotInFuture('2020-01-01')).toBe(true);
      expect(validateDateNotInFuture('1990-06-15')).toBe(true);
    });

    it('should return true for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(validateDateNotInFuture(today)).toBe(true);
    });

    it('should return error for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDateNotInFuture(futureDate.toISOString().split('T')[0]);
      expect(result).toBe('Date cannot be in the future');
    });
  });

  describe('validateDateNotTooOld', () => {
    it('should return true for empty value', () => {
      expect(validateDateNotTooOld('')).toBe(true);
    });

    it('should return true for recent dates', () => {
      expect(validateDateNotTooOld('2020-01-01')).toBe(true);
      expect(validateDateNotTooOld('1950-01-01')).toBe(true);
    });

    it('should return error for dates older than max years', () => {
      const veryOldDate = new Date();
      veryOldDate.setFullYear(veryOldDate.getFullYear() - 130);
      const result = validateDateNotTooOld(veryOldDate.toISOString().split('T')[0]);
      expect(result).toBe('Date cannot be more than 120 years ago');
    });

    it('should use custom max years parameter', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 15);
      const result = validateDateNotTooOld(oldDate.toISOString().split('T')[0], 10);
      expect(result).toBe('Date cannot be more than 10 years ago');
    });
  });

  describe('validateBirthDate', () => {
    it('should return true for empty value', () => {
      expect(validateBirthDate('')).toBe(true);
    });

    it('should return true for valid birth date (adult)', () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 30);
      expect(validateBirthDate(validDate.toISOString().split('T')[0])).toBe(true);
    });

    it('should return error for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateBirthDate(futureDate.toISOString().split('T')[0]);
      expect(result).toBe('Date cannot be in the future');
    });

    it('should return error for people under 16', () => {
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 10);
      const result = validateBirthDate(youngDate.toISOString().split('T')[0]);
      expect(result).toBe('Must be at least 16 years old');
    });

    it('should return error for impossibly old dates', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 130);
      const result = validateBirthDate(oldDate.toISOString().split('T')[0]);
      expect(result).toBe('Date cannot be more than 120 years ago');
    });
  });

  describe('validateSignatureDate', () => {
    it('should return true for empty value', () => {
      expect(validateSignatureDate('')).toBe(true);
    });

    it('should return true for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(validateSignatureDate(today)).toBe(true);
    });

    it('should return true for date within 7 days', () => {
      const recent = new Date();
      recent.setDate(recent.getDate() - 3);
      expect(validateSignatureDate(recent.toISOString().split('T')[0])).toBe(true);
    });

    it('should return error for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // Use 7 days to avoid timezone issues
      const result = validateSignatureDate(futureDate.toISOString().split('T')[0]);
      expect(result).toBe('Signature date cannot be in the future');
    });

    it('should return error for dates older than 7 days', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      const result = validateSignatureDate(oldDate.toISOString().split('T')[0]);
      expect(result).toBe('Signature date should be within the last 7 days');
    });
  });
});

describe('getValidationRules', () => {
  it('should return email pattern for email type', () => {
    const rules = getValidationRules('email');
    expect(rules.pattern).toBeDefined();
    expect(rules.pattern?.value).toBe(emailPattern.value);
  });

  it('should return SSN pattern for ssn type', () => {
    const rules = getValidationRules('ssn');
    expect(rules.pattern).toBeDefined();
    expect(rules.pattern?.value).toBe(ssnPattern.value);
  });

  it('should return phone pattern for phone type', () => {
    const rules = getValidationRules('phone');
    expect(rules.pattern).toBeDefined();
    expect(rules.pattern?.value).toBe(phonePattern.value);
  });

  it('should return validate function for birthDate type', () => {
    const rules = getValidationRules('birthDate');
    expect(rules.validate).toBeDefined();
    expect(typeof rules.validate).toBe('function');
  });

  it('should return validate function for signatureDate type', () => {
    const rules = getValidationRules('signatureDate');
    expect(rules.validate).toBeDefined();
    expect(typeof rules.validate).toBe('function');
  });

  it('should return validate function for pastDate type', () => {
    const rules = getValidationRules('pastDate');
    expect(rules.validate).toBeDefined();
    expect(typeof rules.validate).toBe('function');
  });

  it('should return empty object for undefined type', () => {
    const rules = getValidationRules(undefined);
    expect(rules).toEqual({});
  });
});

describe('Format Functions', () => {
  describe('formatSSN', () => {
    it('should format partial SSN correctly', () => {
      expect(formatSSN('1')).toBe('1');
      expect(formatSSN('12')).toBe('12');
      expect(formatSSN('123')).toBe('123');
      expect(formatSSN('1234')).toBe('123-4');
      expect(formatSSN('12345')).toBe('123-45');
      expect(formatSSN('123456')).toBe('123-45-6');
      expect(formatSSN('1234567')).toBe('123-45-67');
      expect(formatSSN('12345678')).toBe('123-45-678');
      expect(formatSSN('123456789')).toBe('123-45-6789');
    });

    it('should strip non-digit characters', () => {
      expect(formatSSN('123-45-6789')).toBe('123-45-6789');
      expect(formatSSN('123 45 6789')).toBe('123-45-6789');
      expect(formatSSN('abc123def456ghi789')).toBe('123-45-6789');
    });

    it('should limit to 9 digits', () => {
      expect(formatSSN('12345678901234')).toBe('123-45-6789');
    });
  });

  describe('formatPhone', () => {
    it('should format partial phone correctly', () => {
      expect(formatPhone('1')).toBe('1');
      expect(formatPhone('12')).toBe('12');
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('1234')).toBe('123-4');
      expect(formatPhone('12345')).toBe('123-45');
      expect(formatPhone('123456')).toBe('123-456');
      expect(formatPhone('1234567')).toBe('123-456-7');
      expect(formatPhone('12345678')).toBe('123-456-78');
      expect(formatPhone('123456789')).toBe('123-456-789');
      expect(formatPhone('1234567890')).toBe('123-456-7890');
    });

    it('should strip non-digit characters', () => {
      expect(formatPhone('123-456-7890')).toBe('123-456-7890');
      expect(formatPhone('(123) 456-7890')).toBe('123-456-7890');
      expect(formatPhone('123.456.7890')).toBe('123-456-7890');
    });

    it('should limit to 10 digits', () => {
      expect(formatPhone('12345678901234')).toBe('123-456-7890');
    });
  });
});
