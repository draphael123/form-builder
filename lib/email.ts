import nodemailer from 'nodemailer';

// SMTP Configuration - uses Google Workspace / Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // e.g., daniel@fountain.net
    pass: process.env.SMTP_PASSWORD, // App password (not regular password)
  },
});

// TODO: Update FROM_EMAIL once the email alias onboarding@fountainvitality.com is created and verified
const FROM_EMAIL = process.env.SMTP_USER || 'onboarding@fountainvitality.com';
const HR_NOTIFICATION_EMAILS = ['daniel@fountain.net', 'tammy.hale@fountain.net'];

interface SubmissionEmailData {
  submitterEmail: string;
  submitterName: string;
  submissionId: string;
  submittedAt: string;
  isClinicalStaff: boolean;
  pdfBuffer?: Buffer;
  pdfFilename?: string;
}

// Check if email is configured
function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

// Send confirmation email to the person who submitted the form
export async function sendConfirmationEmail(data: SubmissionEmailData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log('Email not configured - skipping confirmation email');
    return false;
  }

  try {
    const attachments = data.pdfBuffer && data.pdfFilename
      ? [{
          filename: data.pdfFilename,
          content: data.pdfBuffer,
        }]
      : undefined;

    await transporter.sendMail({
      from: `"Fountain Onboarding" <${FROM_EMAIL}>`,
      to: data.submitterEmail,
      subject: 'Fountain Onboarding - Submission Received',
      attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .info-box { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Submission Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data.submitterName},</p>
              <p>Thank you for completing the Fountain Onboarding: New Hire Information form. Your submission has been received successfully.</p>

              <div class="info-box">
                <p><strong>Submission ID:</strong> ${data.submissionId}</p>
                <p><strong>Submitted:</strong> ${data.submittedAt}</p>
                <p><strong>Staff Type:</strong> ${data.isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff'}</p>
              </div>

              <p>Our HR team will review your information and reach out if any additional documentation is needed.</p>

              ${data.pdfBuffer ? `
              <div class="info-box" style="background-color: #f0fdf4; border-color: #bbf7d0;">
                <p style="margin: 0; color: #166534;"><strong>PDF Attached</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #15803d;">A PDF copy of your submission is attached to this email for your records.</p>
              </div>
              ` : ''}

              <p>If you have any questions, please contact our HR department.</p>

              <p>Best regards,<br>Fountain HR Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Confirmation email sent to:', data.submitterEmail);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

// Send notification email to HR when a new submission is received
export async function sendHRNotificationEmail(data: SubmissionEmailData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log('Email not configured - skipping HR notification');
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://form-builder-pied-two.vercel.app';
  const submissionLink = `${appUrl}/admin?highlight=${data.submissionId}`;

  try {
    await transporter.sendMail({
      from: `"Fountain Onboarding" <${FROM_EMAIL}>`,
      to: HR_NOTIFICATION_EMAILS.join(', '),
      subject: `New Hire Submission: ${data.submitterName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .info-box { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
            .badge-clinical { background-color: #dbeafe; color: #1e40af; }
            .badge-non-clinical { background-color: #f3f4f6; color: #374151; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Hire Submission</h1>
            </div>
            <div class="content">
              <p>A new hire has completed the onboarding form.</p>

              <div class="info-box">
                <p><strong>Name:</strong> ${data.submitterName}</p>
                <p><strong>Email:</strong> ${data.submitterEmail}</p>
                <p><strong>Submission ID:</strong> ${data.submissionId}</p>
                <p><strong>Submitted:</strong> ${data.submittedAt}</p>
                <p><strong>Staff Type:</strong>
                  <span class="badge ${data.isClinicalStaff ? 'badge-clinical' : 'badge-non-clinical'}">
                    ${data.isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff'}
                  </span>
                </p>
              </div>

              <p>Click below to view this submission:</p>

              <a href="${submissionLink}" class="button">
                View Submission
              </a>

              <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                Or copy this link: ${submissionLink}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('HR notification email sent to:', HR_NOTIFICATION_EMAILS.join(', '));
    return true;
  } catch (error) {
    console.error('Failed to send HR notification email:', error);
    return false;
  }
}

// Send both emails
export async function sendSubmissionEmails(data: SubmissionEmailData): Promise<void> {
  await Promise.all([
    sendConfirmationEmail(data),
    sendHRNotificationEmail(data),
  ]);
}
