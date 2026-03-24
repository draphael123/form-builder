import { NextRequest, NextResponse } from 'next/server';
import { addSubmission } from '@/lib/local-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Extract timing data (prefixed with underscore to separate from form data)
    const timingData = formData._timing;
    delete formData._timing;

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
