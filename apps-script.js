// ===========================================
// Google Apps Script for Fountain Onboarding
// ===========================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com
// 2. Click "New Project"
// 3. Delete default code, paste this entire file
// 4. Save (Ctrl+S), name it "Fountain Onboarding"
// 5. Click Deploy → New deployment
// 6. Select type: Web app
// 7. Execute as: Me | Who has access: Anyone
// 8. Click Deploy, authorize when prompted
// 9. Copy the URL and add to Vercel as APPS_SCRIPT_WEB_APP_URL
//
// ===========================================

const SPREADSHEET_ID = '1etgBQL9BjxFVVN4JYHN9a_6IfQr41gj8aDMrt6gpT_Y';
const HR_EMAILS = ['daniel@fountain.net', 'tammy.hale@fountain.net'];
const APP_URL = 'https://form-builder-pied-two.vercel.app';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Log to spreadsheet
    if (data.headers && data.row) {
      logToSpreadsheet(data.headers, data.row);
    }

    // Send emails if email data is provided
    if (data.emailData) {
      sendEmails(data.emailData);
    }

    // Send reminder email if reminder data is provided
    if (data.reminderEmail) {
      sendReminderEmail(data.reminderEmail);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logToSpreadsheet(headers, row) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  // Append the data row
  sheet.appendRow(row);
}

function sendEmails(emailData) {
  const { submitterEmail, submitterName, submissionId, submittedAt, isClinicalStaff } = emailData;

  // Send confirmation to submitter
  if (submitterEmail) {
    sendConfirmationEmail(submitterEmail, submitterName, submissionId, submittedAt, isClinicalStaff);
  }

  // Send notification to HR
  sendHRNotificationEmail(submitterName, submitterEmail, submissionId, submittedAt, isClinicalStaff);
}

function sendConfirmationEmail(toEmail, name, submissionId, submittedAt, isClinicalStaff) {
  const subject = 'Fountain Onboarding - Submission Received';
  const htmlBody = `
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
          <p>Dear ${name},</p>
          <p>Thank you for completing the Fountain Onboarding: New Hire Information form. Your submission has been received successfully.</p>

          <div class="info-box">
            <p><strong>Submission ID:</strong> ${submissionId}</p>
            <p><strong>Submitted:</strong> ${submittedAt}</p>
            <p><strong>Staff Type:</strong> ${isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff'}</p>
          </div>

          <p>Our HR team will review your information and reach out if any additional documentation is needed.</p>
          <p>If you have any questions, please contact our HR department.</p>

          <p>Best regards,<br>Fountain HR Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(toEmail, subject, '', { htmlBody: htmlBody });
}

function sendHRNotificationEmail(name, email, submissionId, submittedAt, isClinicalStaff) {
  const subject = 'New Hire Submission: ' + name;
  const submissionLink = APP_URL + '/admin?highlight=' + submissionId;

  const htmlBody = `
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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submission ID:</strong> ${submissionId}</p>
            <p><strong>Submitted:</strong> ${submittedAt}</p>
            <p><strong>Staff Type:</strong>
              <span class="badge ${isClinicalStaff ? 'badge-clinical' : 'badge-non-clinical'}">
                ${isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff'}
              </span>
            </p>
          </div>

          <p>Click below to view this submission:</p>

          <a href="${submissionLink}" class="button">View Submission</a>

          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Or copy this link: ${submissionLink}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  HR_EMAILS.forEach(function(hrEmail) {
    GmailApp.sendEmail(hrEmail, subject, '', { htmlBody: htmlBody });
  });
}

// Send reminder email for incomplete forms
function sendReminderEmail(reminderData) {
  const { to, subject, name, progress, continueUrl, reminderNumber } = reminderData;

  const urgencyMessages = [
    "Just a friendly reminder to complete your onboarding form.",
    "We noticed you haven't finished your onboarding form yet.",
    "This is your final reminder to complete your onboarding form."
  ];

  const urgencyMessage = urgencyMessages[Math.min(reminderNumber - 1, urgencyMessages.length - 1)];

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .progress-container { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
        .progress-bar { background-color: #e5e7eb; border-radius: 9999px; height: 20px; overflow: hidden; }
        .progress-fill { background-color: #10b981; height: 100%; border-radius: 9999px; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: 600; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Complete Your Onboarding</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>${urgencyMessage}</p>

          <div class="progress-container">
            <p><strong>Your Progress:</strong></p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <p style="text-align: center; margin-top: 8px; font-weight: 600; color: #10b981;">${progress}% Complete</p>
          </div>

          <p>Click the button below to pick up where you left off:</p>

          <p style="text-align: center;">
            <a href="${continueUrl}" class="button">Continue My Form</a>
          </p>

          <p style="margin-top: 20px;">If you have any questions or need assistance, please contact our HR department.</p>

          <p>Best regards,<br>Fountain HR Team</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder. If you've already completed your form, please disregard this message.</p>
          <p style="margin-top: 10px;">Can't click the button? Copy this link: ${continueUrl}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  GmailApp.sendEmail(to, subject, '', { htmlBody: htmlBody });
}

// Test function - run this manually to verify emails work
function testEmail() {
  sendEmails({
    submitterEmail: 'daniel@fountain.net',
    submitterName: 'Test User',
    submissionId: 'test-123',
    submittedAt: new Date().toLocaleString(),
    isClinicalStaff: true
  });
  Logger.log('Test emails sent!');
}

// Test reminder email
function testReminderEmail() {
  sendReminderEmail({
    to: 'daniel@fountain.net',
    subject: 'Reminder: Complete your Fountain Onboarding Form',
    name: 'Test User',
    progress: 45,
    continueUrl: APP_URL + '/continue/test-draft-123',
    reminderNumber: 1
  });
  Logger.log('Test reminder email sent!');
}
