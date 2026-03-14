import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Get encryption key from environment
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Derive a 256-bit key from the provided key using PBKDF2
  const salt = process.env.ENCRYPTION_SALT || 'fountain-form-builder-salt';
  return crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt a string value
 * Returns base64-encoded string: iv + authTag + ciphertext
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine iv + authTag + ciphertext
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, 'hex'),
    ]);

    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a string value
 * Expects base64-encoded string: iv + authTag + ciphertext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return encryptedData;

  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedData, 'base64');

    // Extract iv, authTag, and ciphertext
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Check if a string appears to be encrypted
 * (basic heuristic - encrypted data is base64 with specific length)
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false;

  try {
    const decoded = Buffer.from(data, 'base64');
    // Minimum length: IV + AuthTag + at least some ciphertext
    return decoded.length >= IV_LENGTH + AUTH_TAG_LENGTH + 1;
  } catch {
    return false;
  }
}

// List of sensitive field IDs that should be encrypted
export const SENSITIVE_FIELDS = [
  'socialSecurityNumber',
  'ssn',
  'dateOfBirth',
  'dob',
  'driversLicenseNumber',
  'passportNumber',
  'bankAccountNumber',
  'routingNumber',
];

/**
 * Encrypt sensitive fields in form data
 */
export function encryptSensitiveFields(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };

  for (const field of SENSITIVE_FIELDS) {
    if (field in result && typeof result[field] === 'string' && result[field]) {
      result[field] = encrypt(result[field] as string);
      result[`_encrypted_${field}`] = true; // Mark as encrypted
    }
  }

  return result;
}

/**
 * Decrypt sensitive fields in form data
 */
export function decryptSensitiveFields(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };

  for (const field of SENSITIVE_FIELDS) {
    if (result[`_encrypted_${field}`] && typeof result[field] === 'string') {
      try {
        result[field] = decrypt(result[field] as string);
        delete result[`_encrypted_${field}`];
      } catch {
        // If decryption fails, leave as-is (might be legacy unencrypted data)
        console.warn(`Failed to decrypt field: ${field}`);
      }
    }
  }

  return result;
}

/**
 * Mask sensitive data for display (e.g., SSN: ***-**-1234)
 */
export function maskSensitiveData(value: string, type: 'ssn' | 'phone' | 'email' | 'generic'): string {
  if (!value) return value;

  switch (type) {
    case 'ssn':
      // Show only last 4 digits: ***-**-1234
      if (value.length >= 4) {
        return `***-**-${value.slice(-4)}`;
      }
      return '***-**-****';

    case 'phone':
      // Show only last 4 digits: ***-***-1234
      if (value.length >= 4) {
        return `***-***-${value.slice(-4)}`;
      }
      return '***-***-****';

    case 'email':
      // Show first char and domain: j***@example.com
      const [local, domain] = value.split('@');
      if (local && domain) {
        return `${local[0]}***@${domain}`;
      }
      return '***@***.***';

    case 'generic':
    default:
      // Show first and last chars with asterisks
      if (value.length <= 2) return '***';
      return `${value[0]}${'*'.repeat(Math.min(value.length - 2, 5))}${value.slice(-1)}`;
  }
}

/**
 * Hash data for comparison (one-way, non-reversible)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
