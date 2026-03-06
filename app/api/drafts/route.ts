import { NextRequest, NextResponse } from 'next/server';
import { saveDraft, getDraftByToken, deleteDraft, generateContinueLink } from '@/lib/drafts';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

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

    // Save the draft
    const draft = saveDraft(email, data, currentPage);
    const continueLink = generateContinueLink(draft.token);

    // Send email if requested
    if (sendEmail && resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Continue Your Fountain Onboarding Form',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Continue Your Form</h1>
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  <p>You requested to save your progress on the Fountain Onboarding form. Click the button below to continue where you left off:</p>

                  <div style="text-align: center;">
                    <a href="${continueLink}" class="button">Continue My Form</a>
                  </div>

                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; font-size: 12px; color: #6b7280;">${continueLink}</p>

                  <div class="warning">
                    <strong>Note:</strong> This link will expire in 7 days. After that, you'll need to start a new form.
                  </div>
                </div>
                <div class="footer">
                  <p>This is an automated message from Fountain Onboarding.</p>
                </div>
              </div>
            </body>
            </html>
          `,
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
        id: draft.id,
        expiresAt: draft.expiresAt,
      },
      continueLink: sendEmail ? undefined : continueLink, // Only return link if not emailed
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save progress' },
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

    const draft = getDraftByToken(token);

    if (!draft) {
      return NextResponse.json(
        { success: false, message: 'Draft not found or has expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      draft: {
        email: draft.email,
        data: draft.data,
        currentPage: draft.currentPage,
        expiresAt: draft.expiresAt,
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

    const deleted = deleteDraft(token);

    return NextResponse.json({
      success: true,
      message: deleted ? 'Draft deleted' : 'Draft not found',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
