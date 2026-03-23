import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_WEB_APP_URL;

// Helper to call Apps Script
async function callAppsScript(data: Record<string, unknown>) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Apps Script URL not configured');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Generate continue link
function generateContinueLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://form-builder-pied-two.vercel.app';
  return `${baseUrl}/continue/${token}`;
}

// POST - Save draft and send continue link
export async function POST(request: NextRequest) {
  try {
    const { email, data, currentPage, sendEmail } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required to save your progress' },
        { status: 400 }
      );
    }

    // Save the draft via Apps Script
    const result = await callAppsScript({
      saveDraft: {
        email,
        data,
        currentPage,
      },
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to save draft');
    }

    const continueLink = generateContinueLink(result.token);

    // Send email via Apps Script if requested
    if (sendEmail) {
      try {
        await callAppsScript({
          reminderEmail: {
            to: email,
            subject: 'Continue Your Fountain Onboarding Form',
            name: data.firstName || data.fullLegalName || 'there',
            progress: Math.round((currentPage / 10) * 100), // Approximate progress
            continueUrl: continueLink,
            reminderNumber: 1,
          },
        });
        console.log('Continue link email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send continue link email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: sendEmail
        ? 'Your progress has been saved! Check your email for a link to continue later.'
        : 'Your progress has been saved.',
      draft: {
        id: result.token,
        expiresAt: result.expiresAt,
      },
      continueLink: sendEmail ? undefined : continueLink,
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save progress. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Retrieve draft by token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await callAppsScript({
      getDraft: { token },
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Draft not found or has expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      draft: {
        email: result.draft.email,
        data: result.draft.data,
        currentPage: result.draft.currentPage,
        expiresAt: result.draft.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error retrieving draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve draft' },
      { status: 500 }
    );
  }
}

// DELETE - Delete draft by token
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await callAppsScript({
      deleteDraft: { token },
    });

    return NextResponse.json({
      success: true,
      message: result.success ? 'Draft deleted' : 'Draft not found',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
