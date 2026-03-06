import { NextRequest, NextResponse } from 'next/server';
import { addSubmission } from '@/lib/local-storage';

// Check if Google Sheets is configured
const isGoogleSheetsConfigured = () => {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SPREADSHEET_ID
  );
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Extract timing data (prefixed with underscore to separate from form data)
    const timingData = formData._timing;
    delete formData._timing;

    // Always save to local storage first (with timing data)
    const submission = addSubmission(formData, timingData);
    console.log('Submission saved locally:', submission.id, timingData ? `(${timingData.totalDuration}s)` : '');

    // If Google Sheets is configured, also save there
    if (isGoogleSheetsConfigured()) {
      try {
        const { appendToSheet, initializeSheet } = await import('@/lib/google-sheets');
        const { newHireFormConfig, getFormFieldIds, getFormHeaders } = await import('@/lib/form-config');

        // Get field IDs in order
        const fieldIds = getFormFieldIds(newHireFormConfig);
        const headers = getFormHeaders(newHireFormConfig);

        // Initialize sheet with headers if needed
        await initializeSheet(headers);

        // Build row values in the correct order
        const rowValues: string[] = fieldIds.map((fieldId) => {
          if (fieldId === 'timestamp') {
            return submission.timestamp;
          }

          const value = formData[fieldId];

          if (value === undefined || value === null) {
            return '';
          }

          // Handle arrays (checkboxes)
          if (Array.isArray(value)) {
            return value.join(', ');
          }

          // Handle objects
          if (typeof value === 'object') {
            return JSON.stringify(value);
          }

          return String(value);
        });

        // Append to sheet
        await appendToSheet(rowValues);
        console.log('Submission also saved to Google Sheets');
      } catch (error) {
        // Log but don't fail - local storage is the primary
        console.error('Failed to save to Google Sheets (continuing with local storage):', error);
      }
    }

    // Send to Apps Script for Google Sheets logging AND email notifications
    const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    if (appsScriptUrl) {
      try {
        const { newHireFormConfig, getFormFieldIds, getFormHeaders } = await import('@/lib/form-config');
        const fieldIds = getFormFieldIds(newHireFormConfig);
        const headers = getFormHeaders(newHireFormConfig);
        const rowValues: string[] = fieldIds.map((fieldId) => {
          if (fieldId === 'timestamp') return submission.timestamp;
          const value = formData[fieldId];
          if (value === undefined || value === null) return '';
          if (Array.isArray(value)) return value.join(', ');
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });

        // Send both spreadsheet data and email data to Apps Script
        await fetch(appsScriptUrl, {
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
        console.log('Submission sent to Apps Script (spreadsheet + emails)');
      } catch (error) {
        console.error('Failed to send to Apps Script (continuing):', error);
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
