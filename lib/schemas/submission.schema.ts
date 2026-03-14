import { z } from 'zod';

// Common validation patterns
const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Date validation helpers
const validateDateNotInFuture = (dateStr: string) => {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

const validateBirthDate = (dateStr: string) => {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  const today = new Date();

  // Not in future
  if (date > today) return false;

  // Not too old (120 years)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  if (date < minDate) return false;

  // At least 16 years old
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);
  if (date > minAgeDate) return false;

  return true;
};

// Base personal information schema
export const personalInfoSchema = z.object({
  fullLegalName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  preferredName: z.string().max(50).optional(),
  dateOfBirth: z.string().refine(validateBirthDate, {
    message: 'Please enter a valid birth date (must be at least 16 years old)',
  }),
  socialSecurityNumber: z.string().regex(ssnPattern, {
    message: 'SSN must be in format: ###-##-####',
  }),
  personalEmailAddress: z.string().regex(emailPattern, {
    message: 'Please enter a valid email address',
  }),
  workEmailAddress: z.string().regex(emailPattern).optional().or(z.literal('')),
  cellPhoneNumber: z.string().regex(phonePattern, {
    message: 'Phone must be in format: ###-###-####',
  }),
  homePhoneNumber: z.string().regex(phonePattern).optional().or(z.literal('')),
});

// Address schema
export const addressSchema = z.object({
  streetAddress: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(50),
  zipCode: z.string().min(5).max(10),
});

// Employment schema
export const employmentSchema = z.object({
  isClinicalStaff: z.enum(['Yes', 'No']),
  startDate: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  supervisor: z.string().optional(),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  emergencyContactName: z.string().min(2).max(100),
  emergencyContactRelationship: z.string().min(2).max(50),
  emergencyContactPhone: z.string().regex(phonePattern),
});

// Complete form submission schema
export const submissionSchema = z.object({
  // Personal info
  fullLegalName: z.string().min(2).max(100),
  preferredName: z.string().max(50).optional(),
  dateOfBirth: z.string().refine(validateBirthDate).optional(),
  socialSecurityNumber: z.string().regex(ssnPattern).optional(),
  personalEmailAddress: z.string().regex(emailPattern),

  // Contact
  cellPhoneNumber: z.string().regex(phonePattern).optional(),

  // Employment
  isClinicalStaff: z.enum(['Yes', 'No']).optional(),

  // Allow additional fields (form is dynamic)
}).passthrough();

// Draft save schema
export const draftSaveSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  formData: z.record(z.string(), z.unknown()),
  currentPage: z.number().int().min(0).optional(),
});

// Draft restore schema
export const draftRestoreSchema = z.object({
  token: z.string().min(32).max(128),
});

// File upload schema
export const fileUploadSchema = z.object({
  fileBase64: z.string().min(1, 'File data is required'),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().optional(),
  submitterName: z.string().optional(),
});

// Allowed MIME types for file uploads
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  'application/pdf': 15 * 1024 * 1024, // 15MB
  'image/jpeg': 10 * 1024 * 1024, // 10MB
  'image/jpg': 10 * 1024 * 1024,
  'image/png': 10 * 1024 * 1024,
  'image/gif': 5 * 1024 * 1024, // 5MB
  'image/webp': 10 * 1024 * 1024,
  'application/msword': 10 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 10 * 1024 * 1024,
  default: 10 * 1024 * 1024, // 10MB default
};

// Analytics event schema
export const analyticsEventSchema = z.object({
  sessionId: z.string().min(1),
  event: z.enum([
    'session_start',
    'session_end',
    'page_view',
    'field_interaction',
    'validation_error',
    'form_submit',
    'draft_save',
    'draft_restore',
  ]),
  page: z.number().int().min(0).optional(),
  fieldId: z.string().optional(),
  timestamp: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Submission status update schema
export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'processing', 'complete', 'rejected']),
  notes: z.string().max(1000).optional(),
});

// Validate and parse submission data
export function validateSubmission(data: unknown): z.infer<typeof submissionSchema> {
  return submissionSchema.parse(data);
}

// Safe parse (returns success/error instead of throwing)
export function safeValidateSubmission(data: unknown) {
  return submissionSchema.safeParse(data);
}

// Validate file upload
export function validateFileUpload(data: unknown): {
  success: boolean;
  data?: z.infer<typeof fileUploadSchema>;
  error?: { issues: Array<{ message: string }> };
} {
  const result = fileUploadSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: {
        issues: result.error.issues.map(i => ({ message: i.message })),
      },
    };
  }

  // Additional validation: check MIME type
  const { mimeType, fileBase64 } = result.data;

  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      success: false,
      error: {
        issues: [{ message: `File type "${mimeType}" is not allowed` }],
      },
    };
  }

  // Check file size (base64 is ~33% larger than binary)
  const estimatedSize = (fileBase64.length * 3) / 4;
  const maxSize = mimeType
    ? MAX_FILE_SIZES[mimeType as keyof typeof MAX_FILE_SIZES] || MAX_FILE_SIZES.default
    : MAX_FILE_SIZES.default;

  if (estimatedSize > maxSize) {
    return {
      success: false,
      error: {
        issues: [{ message: `File size exceeds maximum allowed (${Math.round(maxSize / 1024 / 1024)}MB)` }],
      },
    };
  }

  return { success: true, data: result.data };
}
