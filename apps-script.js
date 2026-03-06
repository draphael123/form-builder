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
// FILE UPLOAD SETUP:
// 1. Create a Google Drive folder called "Fountain Onboarding Uploads"
// 2. Copy the folder ID from the URL (the long string after /folders/)
// 3. Update UPLOADS_FOLDER_ID below with your folder ID
//
// ===========================================

const SPREADSHEET_ID = '1etgBQL9BjxFVVN4JYHN9a_6IfQr41gj8aDMrt6gpT_Y';
const HR_EMAILS = ['daniel@fountain.net', 'tammy.hale@fountain.net'];
const APP_URL = 'https://form-builder-pied-two.vercel.app';

// Create a folder in Google Drive and paste its ID here
// To get folder ID: Open folder in Drive, copy ID from URL after /folders/
const UPLOADS_FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // <-- UPDATE THIS

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Handle file upload
    if (data.fileUpload) {
      const result = uploadFileToDrive(data.fileUpload);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

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
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===========================================
// FILE UPLOAD FUNCTIONS
// ===========================================

function uploadFileToDrive(fileData) {
  try {
    const { fileBase64, fileName, mimeType, submitterName } = fileData;

    if (!fileBase64 || !fileName) {
      return { success: false, error: 'Missing file data' };
    }

    // Get or create the uploads folder
    let folder;
    if (UPLOADS_FOLDER_ID && UPLOADS_FOLDER_ID !== 'YOUR_FOLDER_ID_HERE') {
      folder = DriveApp.getFolderById(UPLOADS_FOLDER_ID);
    } else {
      // Fallback: create/get folder in root
      const folders = DriveApp.getFoldersByName('Fountain Onboarding Uploads');
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder('Fountain Onboarding Uploads');
        Logger.log('Created uploads folder. ID: ' + folder.getId());
      }
    }

    // Create unique filename
    const timestamp = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_HH-mm-ss');
    const sanitizedName = (submitterName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueFileName = sanitizedName + '_' + timestamp + '_' + fileName;

    // Decode base64 and create file
    const decoded = Utilities.base64Decode(fileBase64);
    const blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', uniqueFileName);
    const file = folder.createFile(blob);

    // Make file viewable by anyone with link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const webViewLink = 'https://drive.google.com/file/d/' + fileId + '/view';
    const downloadLink = 'https://drive.google.com/uc?export=download&id=' + fileId;

    Logger.log('File uploaded: ' + uniqueFileName + ' -> ' + webViewLink);

    return {
      success: true,
      data: {
        fileId: fileId,
        fileName: uniqueFileName,
        fileUrl: downloadLink,
        webViewLink: webViewLink
      }
    };
  } catch (error) {
    Logger.log('Upload error: ' + error.message);
    return { success: false, error: error.message };
  }
}

// ===========================================
// SPREADSHEET FUNCTIONS
// ===========================================

function logToSpreadsheet(headers, row) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

  // Check if headers exist and match
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    // Empty sheet - add headers
    sheet.appendRow(headers);
  } else {
    // Check if first row matches expected headers
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const headersMatch = headers.every(function(h, i) {
      return existingHeaders[i] === h;
    });

    if (!headersMatch) {
      // Update headers to match current form structure
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      Logger.log('Headers updated to match current form structure');
    }
  }

  // Ensure row has same length as headers (pad with empty strings if needed)
  while (row.length < headers.length) {
    row.push('');
  }

  // Convert Google Drive URLs to clickable hyperlinks
  const processedRow = row.map(function(cell, index) {
    if (typeof cell === 'string' && cell.includes('drive.google.com')) {
      // Use header name as link text, or "View File" as fallback
      const linkText = headers[index] ? headers[index].substring(0, 30) : 'View File';
      return '=HYPERLINK("' + cell + '", "📎 ' + linkText + '")';
    }
    return cell;
  });

  // Append the data row
  sheet.appendRow(processedRow);
}

// ===========================================
// EMAIL FUNCTIONS
// ===========================================

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

// ===========================================
// TEST FUNCTIONS - Run manually to test
// ===========================================

// Test email sending
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

// Test file upload (run this to verify Drive access works)
function testFileUpload() {
  // Create a simple test file
  const testContent = 'This is a test file uploaded at ' + new Date().toISOString();
  const base64Content = Utilities.base64Encode(testContent);

  const result = uploadFileToDrive({
    fileBase64: base64Content,
    fileName: 'test-upload.txt',
    mimeType: 'text/plain',
    submitterName: 'Test User'
  });

  Logger.log('Upload result: ' + JSON.stringify(result));

  if (result.success) {
    Logger.log('SUCCESS! File uploaded to: ' + result.data.webViewLink);
    Logger.log('Download link: ' + result.data.fileUrl);
  } else {
    Logger.log('FAILED: ' + result.error);
  }
}

// Get the uploads folder ID (run this to find your folder ID)
function getUploadsFolderInfo() {
  const folders = DriveApp.getFoldersByName('Fountain Onboarding Uploads');
  if (folders.hasNext()) {
    const folder = folders.next();
    Logger.log('Folder found!');
    Logger.log('Folder ID: ' + folder.getId());
    Logger.log('Folder URL: https://drive.google.com/drive/folders/' + folder.getId());
  } else {
    Logger.log('Folder not found. Run testFileUpload() to create it automatically.');
  }
}
