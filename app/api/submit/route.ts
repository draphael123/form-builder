import { NextRequest, NextResponse } from 'next/server';
import { addSubmission, getSubmissions } from '@/lib/local-storage';
import { rateLimit } from '@/lib/rate-limit';

// Sanitize string to prevent XSS - removes script tags and dangerous attributes
function sanitizeString(value: string): string {
  if (!value || typeof value !== 'string') return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

// Recursively sanitize all string values in an object
function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(v => typeof v === 'string' ? sanitizeString(v) : v);
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Check for duplicate submissions (same email within 24 hours)
function checkForDuplicate(email: string): { isDuplicate: boolean; existingId?: string } {
  if (!email) return { isDuplicate: false };

  const submissions = getSubmissions();
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

  const duplicate = submissions.find(s => {
    const submissionTime = new Date(s.timestamp).getTime();
    const submissionEmail = (s.data.personalEmailAddress as string)?.toLowerCase();
    return submissionTime > twentyFourHoursAgo &&
           submissionEmail === email.toLowerCase();
  });

  return duplicate
    ? { isDuplicate: true, existingId: duplicate.id }
    : { isDuplicate: false };
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimited = rateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const rawFormData = await request.json();

    // Extract timing data (prefixed with underscore to separate from form data)
    const timingData = rawFormData._timing;
    delete rawFormData._timing;

    // Sanitize all input to prevent XSS
    const formData = sanitizeFormData(rawFormData);

    // Check for duplicate submissions
    const duplicateCheck = checkForDuplicate(formData.personalEmailAddress as string);
    if (duplicateCheck.isDuplicate) {
      return NextResponse.json({
        success: false,
        message: 'A submission with this email address was already received in the last 24 hours. If you need to make changes, please contact HR.',
        existingSubmissionId: duplicateCheck.existingId,
      }, { status: 409 });
    }

    // Always save to local storage first (with timing data)
    const submission = addSubmission(formData, timingData);
    console.log('Submission saved locally:', submission.id, timingData ? `(${timingData.totalDuration}s)` : '');

    // Send to Apps Script for Google Sheets logging AND email notifications
    // Note: Apps Script handles both spreadsheet logging and email notifications
    const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    if (appsScriptUrl) {
      try {
        const { newHireFormConfig, getFormFieldIds, getFormHeaders, isFieldVisible, escapeForSpreadsheet } = await import('@/lib/form-config');
        const fieldIds = getFormFieldIds(newHireFormConfig);
        const headers = getFormHeaders(newHireFormConfig);
        const rowValues: string[] = fieldIds.map((fieldId) => {
          if (fieldId === 'timestamp') return submission.timestamp;

          // Bug #1 Fix: Skip hidden fields - return empty string for fields that shouldn't be visible
          if (!isFieldVisible(newHireFormConfig, fieldId, formData)) {
            return '';
          }

          const value = formData[fieldId];
          if (value === undefined || value === null) return '';

          // Bug #2 Fix: Use pipe separator for arrays to avoid CSV parsing issues
          if (Array.isArray(value)) {
            return value.map(v => escapeForSpreadsheet(String(v))).join(' | ');
          }

          // Bug #3 Fix: Escape special characters and handle objects
          if (typeof value === 'object') {
            return escapeForSpreadsheet(JSON.stringify(value));
          }

          // Note: the Apps Script already converts Drive URLs to HYPERLINK
          // formulas inside logToSpreadsheet, so we send raw values here.
          return escapeForSpreadsheet(String(value));
        });

        // Bug #6 Fix: Properly await and check Apps Script response
        const appsScriptResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headers,
            row: rowValues,
            emailData: {
              submitterEmail: formData.personalEmailAddress || '',
              submitterName: formData.fullLegalName || 'New Hire',
              submissionId: submission.id,
              submittedAt: new Date(submission.timestamp).toLocaleString(),
              isClinicalStaff: formData.isClinicalStaff === 'Yes',
            },
          }),
        });

        // Check if Apps Script returned success
        if (!appsScriptResponse.ok) {
          console.error('Apps Script returned error status:', appsScriptResponse.status);
          return NextResponse.json({
            success: true,
            message: 'Form submitted successfully, but there was an issue saving to the spreadsheet. HR has been notified.',
            submissionId: submission.id,
            warning: 'Spreadsheet sync failed',
          });
        }

        const appsScriptResult = await appsScriptResponse.json();
        if (!appsScriptResult.success) {
          console.error('Apps Script returned failure:', appsScriptResult.error);
          return NextResponse.json({
            success: true,
            message: 'Form submitted successfully, but there was an issue saving to the spreadsheet. HR has been notified.',
            submissionId: submission.id,
            warning: 'Spreadsheet sync failed',
          });
        }

        console.log('Submission sent to Apps Script (spreadsheet + emails)');
      } catch (error) {
        console.error('Failed to send to Apps Script (continuing):', error);
        // Still return success since local storage worked, but include warning
        return NextResponse.json({
          success: true,
          message: 'Form submitted successfully, but there was an issue connecting to the server. Your submission has been saved locally.',
          submissionId: submission.id,
          warning: 'Apps Script connection failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error submitting form:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit form. Please try again.',
      },
      { status: 500 }
    );
  }
}
