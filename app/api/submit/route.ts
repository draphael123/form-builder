import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet, initializeSheet } from '@/lib/google-sheets';
import { newHireFormConfig, getFormFieldIds, getFormHeaders } from '@/lib/form-config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Get field IDs in order
    const fieldIds = getFormFieldIds(newHireFormConfig);
    const headers = getFormHeaders(newHireFormConfig);

    // Initialize sheet with headers if needed
    await initializeSheet(headers);

    // Build row values in the correct order
    const rowValues: string[] = fieldIds.map((fieldId) => {
      if (fieldId === 'timestamp') {
        return new Date().toISOString();
      }

      const value = formData[fieldId];

      if (value === undefined || value === null) {
        return '';
      }

      // Handle arrays (checkboxes)
      if (Array.isArray(value)) {
        return value.join(', ');
      }

      // Handle objects (shouldn't happen with our current setup)
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    });

    // Append to sheet
    await appendToSheet(rowValues);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting form:', error);

    // Check if it's a Google API configuration error
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        !process.env.GOOGLE_PRIVATE_KEY ||
        !process.env.GOOGLE_SPREADSHEET_ID) {
      return NextResponse.json(
        {
          success: false,
          message: 'Google Sheets is not configured. Please set up your environment variables.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit form. Please try again.'
      },
      { status: 500 }
    );
  }
}
