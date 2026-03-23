// ===========================================
// Google Apps Script for Fountain Onboarding
// ===========================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com
// 2. Click "New Project"
// 3. Delete default code, paste this entire file
// 4. Save (Ctrl+S), name it "Fountain Onboarding"
// 5. Click Deploy -> New deployment
// 6. Select type: Web app
// 7. Execute as: Me | Who has access: Anyone
// 8. Click Deploy, authorize when prompted
// 9. Copy the URL and add to Vercel as APPS_SCRIPT_WEB_APP_URL
//
// ===========================================
// CONFIGURATION - UPDATE THESE VALUES
// ===========================================
//
// To find your Spreadsheet ID:
//   Open your Google Sheet, copy the ID from the URL:
//   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
//
// To find your Uploads Folder ID:
//   Open your Google Drive folder, copy the ID from the URL:
//   https://drive.google.com/drive/folders/YOUR_FOLDER_ID
//   Or run getUploadsFolderInfo() after the folder is created automatically
//
// HR_EMAILS: List of email addresses to receive new hire notifications
//
// APP_URL: Your deployed Vercel app URL (for admin links in emails)
//
// ===========================================

// ---- START CONFIGURATION ----
const CONFIG = {
  // Google Spreadsheet ID (required)
  SPREADSHEET_ID: '1etgBQL9BjxFVVN4JYHN9a_6IfQr41gj8aDMrt6gpT_Y',

  // HR email addresses for notifications (required)
  HR_EMAILS: ['daniel@fountain.net', 'tammy.hale@fountain.net'],

  // Your deployed app URL (required for admin links)
  APP_URL: 'https://form-builder-pied-two.vercel.app',

  // Google Drive folder ID for file uploads (optional)
  // Leave empty string to auto-create a folder named "Fountain Onboarding Uploads"
  UPLOADS_FOLDER_ID: '',

  // Hyperlink display text for Drive URLs in spreadsheet
  HYPERLINK_TEXT: 'View File'
};
// ---- END CONFIGURATION ----

// ===========================================
// MAIN ENTRY POINT
// ===========================================

function doPost(e) {
  try {
    // Input validation
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: 'Missing request data' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse({ success: false, error: 'Invalid JSON: ' + parseError.message });
    }

    if (typeof data !== 'object' || data === null) {
      return createJsonResponse({ success: false, error: 'Request body must be an object' });
    }

    // Handle file upload
    if (data.fileUpload) {
      var result = uploadFileToDrive(data.fileUpload);
      return createJsonResponse(result);
    }

    // Log to spreadsheet
    if (data.headers && data.row) {
      if (!Array.isArray(data.headers) || !Array.isArray(data.row)) {
        return createJsonResponse({ success: false, error: 'Headers and row must be arrays' });
      }
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

    // Handle draft save
    if (data.saveDraft) {
      var draftResult = saveDraftToSheet(data.saveDraft);
      return createJsonResponse(draftResult);
    }

    // Handle draft retrieval
    if (data.getDraft) {
      var draft = getDraftFromSheet(data.getDraft.token);
      return createJsonResponse(draft);
    }

    // Handle draft deletion
    if (data.deleteDraft) {
      var deleteResult = deleteDraftFromSheet(data.deleteDraft.token);
      return createJsonResponse(deleteResult);
    }

    return createJsonResponse({ success: true });
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return createJsonResponse({ success: false, error: error.message });
  }
}

function doGet(e) {
  return createJsonResponse({
    success: true,
    message: 'Fountain Onboarding Apps Script is running',
    version: '2.0.0'
  });
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function toHyperlinkFormula(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    var safeUrl = url.replace(/"/g, '""');
    return '=HYPERLINK("' + safeUrl + '", "' + CONFIG.HYPERLINK_TEXT + '")';
  }
  return url;
}

// ===========================================
// FILE UPLOAD FUNCTIONS
// ===========================================

function uploadFileToDrive(fileData) {
  try {
    var fileBase64 = fileData.fileBase64;
    var fileName = fileData.fileName;
    var mimeType = fileData.mimeType;
    var submitterName = fileData.submitterName;

    if (!fileBase64 || !fileName) {
      return { success: false, error: 'Missing file data: fileBase64 and fileName are required' };
    }

    // Get or create the uploads folder
    var folder = getUploadsFolder();

    // Create unique filename
    var timestamp = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_HH-mm-ss');
    var sanitizedName = (submitterName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
    var uniqueFileName = sanitizedName + '_' + timestamp + '_' + fileName;

    // Decode base64 and create file
    var decoded = Utilities.base64Decode(fileBase64);
    var blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', uniqueFileName);
    var file = folder.createFile(blob);

    // Make file viewable by anyone with link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileId = file.getId();
    var webViewLink = 'https://drive.google.com/file/d/' + fileId + '/view';
    var downloadLink = 'https://drive.google.com/uc?export=download&id=' + fileId;

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

function getUploadsFolder() {
  // Use configured folder ID if provided
  if (CONFIG.UPLOADS_FOLDER_ID && CONFIG.UPLOADS_FOLDER_ID.length > 0) {
    return DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER_ID);
  }

  // Fallback: find or create folder by name
  var folderName = 'Fountain Onboarding Uploads';
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }

  var newFolder = DriveApp.createFolder(folderName);
  Logger.log('Created uploads folder. ID: ' + newFolder.getId());
  Logger.log('TIP: Add this ID to CONFIG.UPLOADS_FOLDER_ID for faster lookups');
  return newFolder;
}

// ===========================================
// SPREADSHEET FUNCTIONS
// ===========================================

function logToSpreadsheet(headers, row) {
  var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // Log to Sheet1 (Form Responses 1) - standard horizontal format
  logToFormResponses(spreadsheet, headers, row);

  // Log to Sheet2 - cascading vertical format for licensing team
  logToCascadingSheet(spreadsheet, headers, row);
}

function logToFormResponses(spreadsheet, headers, row) {
  var sheet = spreadsheet.getSheetByName('Form Responses 1');
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }

  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Convert Drive URLs to clickable HYPERLINK formulas
  var processedRow = row.map(function(value) {
    return toHyperlinkFormula(value);
  });

  // Add the row data
  sheet.appendRow(processedRow);
}

function logToCascadingSheet(spreadsheet, headers, row) {
  // Get or create Sheet2
  var sheet = spreadsheet.getSheetByName('Sheet2');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Sheet2');
    // Set column widths
    sheet.setColumnWidth(1, 350); // Question column
    sheet.setColumnWidth(2, 500); // Answer column
  }

  var startRow = sheet.getLastRow() + 1;

  // Leave a blank row between submissions (except for first submission)
  var dataStartRow = startRow > 1 ? startRow + 1 : startRow;

  // Build the cascading rows: Question | Answer
  var cascadingRows = [];

  for (var i = 0; i < headers.length; i++) {
    var value = row[i];

    // Skip empty values
    if (value === undefined || value === null || value === '') continue;

    // Convert to string for processing
    var displayValue = toHyperlinkFormula(String(value));

    cascadingRows.push([headers[i], displayValue]);
  }

  // Write all rows at once
  if (cascadingRows.length > 0) {
    var range = sheet.getRange(dataStartRow, 1, cascadingRows.length, 2);
    range.setValues(cascadingRows);

    // Apply yellow highlighting to the entire submission block
    range.setBackground('#FFFF00');

    // Make question labels bold
    sheet.getRange(dataStartRow, 1, cascadingRows.length, 1).setFontWeight('bold');

    // Add border around the submission block
    range.setBorder(true, true, true, true, false, false, '#999999', SpreadsheetApp.BorderStyle.SOLID);
  }

  Logger.log('Cascading format logged to Sheet2 with ' + cascadingRows.length + ' fields');
}

// ===========================================
// DRAFT FUNCTIONS
// ===========================================

function getDraftsSheet() {
  var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName('Drafts');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Drafts');
    // Add headers
    sheet.getRange(1, 1, 1, 7).setValues([['Token', 'Email', 'Data', 'CurrentPage', 'CreatedAt', 'UpdatedAt', 'ExpiresAt']]);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function generateDraftToken() {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var token = '';
  for (var i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function saveDraftToSheet(draftData) {
  try {
    var sheet = getDraftsSheet();
    var email = draftData.email.toLowerCase();
    var data = JSON.stringify(draftData.data);
    var currentPage = draftData.currentPage || 0;

    var now = new Date();
    var expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Check if draft exists for this email
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var existingRow = -1;

    for (var i = 1; i < values.length; i++) {
      if (values[i][1] && values[i][1].toLowerCase() === email) {
        existingRow = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    var token;
    if (existingRow > 0) {
      // Update existing draft
      token = values[existingRow - 1][0]; // Keep existing token
      sheet.getRange(existingRow, 3).setValue(data);
      sheet.getRange(existingRow, 4).setValue(currentPage);
      sheet.getRange(existingRow, 6).setValue(now.toISOString());
      sheet.getRange(existingRow, 7).setValue(expiresAt.toISOString());
    } else {
      // Create new draft
      token = generateDraftToken();
      sheet.appendRow([
        token,
        email,
        data,
        currentPage,
        now.toISOString(),
        now.toISOString(),
        expiresAt.toISOString()
      ]);
    }

    return {
      success: true,
      token: token,
      expiresAt: expiresAt.toISOString()
    };
  } catch (error) {
    Logger.log('Error saving draft: ' + error.message);
    return { success: false, error: error.message };
  }
}

function getDraftFromSheet(token) {
  try {
    var sheet = getDraftsSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();

    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === token) {
        var expiresAt = new Date(values[i][6]);
        if (expiresAt < new Date()) {
          // Draft expired, delete it
          sheet.deleteRow(i + 1);
          return { success: false, error: 'Draft expired' };
        }

        return {
          success: true,
          draft: {
            token: values[i][0],
            email: values[i][1],
            data: JSON.parse(values[i][2]),
            currentPage: values[i][3],
            createdAt: values[i][4],
            updatedAt: values[i][5],
            expiresAt: values[i][6]
          }
        };
      }
    }

    return { success: false, error: 'Draft not found' };
  } catch (error) {
    Logger.log('Error getting draft: ' + error.message);
    return { success: false, error: error.message };
  }
}

function deleteDraftFromSheet(token) {
  try {
    var sheet = getDraftsSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();

    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === token) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }

    return { success: false, error: 'Draft not found' };
  } catch (error) {
    Logger.log('Error deleting draft: ' + error.message);
    return { success: false, error: error.message };
  }
}

function deleteDraftByEmail(email) {
  try {
    var sheet = getDraftsSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var emailLower = email.toLowerCase();

    for (var i = values.length - 1; i >= 1; i--) {
      if (values[i][1] && values[i][1].toLowerCase() === emailLower) {
        sheet.deleteRow(i + 1);
      }
    }

    return { success: true };
  } catch (error) {
    Logger.log('Error deleting draft by email: ' + error.message);
    return { success: false, error: error.message };
  }
}

// ===========================================
// EMAIL FUNCTIONS
// ===========================================

function sendEmails(emailData) {
  var submitterEmail = emailData.submitterEmail;
  var submitterName = emailData.submitterName;
  var submissionId = emailData.submissionId;
  var submittedAt = emailData.submittedAt;
  var isClinicalStaff = emailData.isClinicalStaff;

  // Send confirmation to submitter
  if (submitterEmail) {
    sendConfirmationEmail(submitterEmail, submitterName, submissionId, submittedAt, isClinicalStaff);
  }

  // Send notification to HR
  sendHRNotificationEmail(submitterName, submitterEmail, submissionId, submittedAt, isClinicalStaff);
}

function sendConfirmationEmail(toEmail, name, submissionId, submittedAt, isClinicalStaff) {
  var subject = 'Fountain Onboarding - Submission Received';
  var staffType = isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff';

  var htmlBody = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }',
    '    .container { max-width: 600px; margin: 0 auto; padding: 20px; }',
    '    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }',
    '    .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }',
    '    .info-box { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }',
    '    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="container">',
    '    <div class="header">',
    '      <h1 style="margin: 0;">Submission Received</h1>',
    '    </div>',
    '    <div class="content">',
    '      <p>Dear ' + name + ',</p>',
    '      <p>Thank you for completing the Fountain Onboarding: New Hire Information form. Your submission has been received successfully.</p>',
    '      <div class="info-box">',
    '        <p><strong>Submission ID:</strong> ' + submissionId + '</p>',
    '        <p><strong>Submitted:</strong> ' + submittedAt + '</p>',
    '        <p><strong>Staff Type:</strong> ' + staffType + '</p>',
    '      </div>',
    '      <p>Our HR team will review your information and reach out if any additional documentation is needed.</p>',
    '      <p>If you have any questions, please contact our HR department.</p>',
    '      <p>Best regards,<br>Fountain HR Team</p>',
    '    </div>',
    '    <div class="footer">',
    '      <p>This is an automated message. Please do not reply directly to this email.</p>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  GmailApp.sendEmail(toEmail, subject, '', { htmlBody: htmlBody });
}

function sendHRNotificationEmail(name, email, submissionId, submittedAt, isClinicalStaff) {
  var subject = 'New Hire Submission: ' + name;
  var submissionLink = 'https://docs.google.com/spreadsheets/d/' + CONFIG.SPREADSHEET_ID;
  var staffType = isClinicalStaff ? 'Clinical Staff' : 'Non-Clinical Staff';
  var badgeClass = isClinicalStaff ? 'badge-clinical' : 'badge-non-clinical';

  var htmlBody = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }',
    '    .container { max-width: 600px; margin: 0 auto; padding: 20px; }',
    '    .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }',
    '    .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }',
    '    .info-box { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }',
    '    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }',
    '    .badge-clinical { background-color: #dbeafe; color: #1e40af; }',
    '    .badge-non-clinical { background-color: #f3f4f6; color: #374151; }',
    '    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="container">',
    '    <div class="header">',
    '      <h1 style="margin: 0;">New Hire Submission</h1>',
    '    </div>',
    '    <div class="content">',
    '      <p>A new hire has completed the onboarding form.</p>',
    '      <div class="info-box">',
    '        <p><strong>Name:</strong> ' + name + '</p>',
    '        <p><strong>Email:</strong> ' + email + '</p>',
    '        <p><strong>Submission ID:</strong> ' + submissionId + '</p>',
    '        <p><strong>Submitted:</strong> ' + submittedAt + '</p>',
    '        <p><strong>Staff Type:</strong> <span class="badge ' + badgeClass + '">' + staffType + '</span></p>',
    '      </div>',
    '      <p>Click below to view this submission:</p>',
    '      <a href="' + submissionLink + '" class="button">View Submission</a>',
    '      <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">',
    '        Or copy this link: ' + submissionLink,
    '      </p>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  CONFIG.HR_EMAILS.forEach(function(hrEmail) {
    GmailApp.sendEmail(hrEmail, subject, '', { htmlBody: htmlBody });
  });
}

function sendReminderEmail(reminderData) {
  var to = reminderData.to;
  var subject = reminderData.subject;
  var name = reminderData.name;
  var progress = reminderData.progress;
  var continueUrl = reminderData.continueUrl;
  var reminderNumber = reminderData.reminderNumber;

  var urgencyMessages = [
    "Just a friendly reminder to complete your onboarding form.",
    "We noticed you haven't finished your onboarding form yet.",
    "This is your final reminder to complete your onboarding form."
  ];

  var urgencyMessage = urgencyMessages[Math.min(reminderNumber - 1, urgencyMessages.length - 1)];

  var htmlBody = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <style>',
    '    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }',
    '    .container { max-width: 600px; margin: 0 auto; padding: 20px; }',
    '    .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }',
    '    .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }',
    '    .progress-container { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }',
    '    .progress-bar { background-color: #e5e7eb; border-radius: 9999px; height: 20px; overflow: hidden; }',
    '    .progress-fill { background-color: #10b981; height: 100%; border-radius: 9999px; }',
    '    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; font-weight: 600; }',
    '    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="container">',
    '    <div class="header">',
    '      <h1 style="margin: 0;">Complete Your Onboarding</h1>',
    '    </div>',
    '    <div class="content">',
    '      <p>Hi ' + name + ',</p>',
    '      <p>' + urgencyMessage + '</p>',
    '      <div class="progress-container">',
    '        <p><strong>Your Progress:</strong></p>',
    '        <div class="progress-bar">',
    '          <div class="progress-fill" style="width: ' + progress + '%;"></div>',
    '        </div>',
    '        <p style="text-align: center; margin-top: 8px; font-weight: 600; color: #10b981;">' + progress + '% Complete</p>',
    '      </div>',
    '      <p>Click the button below to pick up where you left off:</p>',
    '      <p style="text-align: center;">',
    '        <a href="' + continueUrl + '" class="button">Continue My Form</a>',
    '      </p>',
    '      <p style="margin-top: 20px;">If you have any questions or need assistance, please contact our HR department.</p>',
    '      <p>Best regards,<br>Fountain HR Team</p>',
    '    </div>',
    '    <div class="footer">',
    '      <p>This is an automated reminder. If you have already completed your form, please disregard this message.</p>',
    '      <p style="margin-top: 10px;">Cannot click the button? Copy this link: ' + continueUrl + '</p>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>'
  ].join('\n');

  GmailApp.sendEmail(to, subject, '', { htmlBody: htmlBody });
}

// ===========================================
// TEST & UTILITY FUNCTIONS
// Run these manually in the Apps Script editor
// ===========================================

// Run this first to authorize all required scopes
function authorizeAndTest() {
  Logger.log('Testing authorization...');

  // Test Spreadsheet access
  var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  Logger.log('Spreadsheet access: OK - ' + spreadsheet.getName());

  // Test Drive access
  var folder = getUploadsFolder();
  Logger.log('Drive access: OK - Folder ID: ' + folder.getId());

  // Test Gmail access (just checks we can access it)
  var drafts = GmailApp.getDrafts();
  Logger.log('Gmail access: OK');

  Logger.log('All authorizations successful!');
}

// Test spreadsheet logging
function testSpreadsheet() {
  var testHeaders = ['Timestamp', 'Name', 'Email', 'Status'];
  var testRow = [new Date().toISOString(), 'Test User', 'test@example.com', 'Active'];

  logToSpreadsheet(testHeaders, testRow);
  Logger.log('Test row added to spreadsheet');
}

// Test email sending
function testEmail() {
  sendEmails({
    submitterEmail: CONFIG.HR_EMAILS[0], // Send to first HR email for testing
    submitterName: 'Test User',
    submissionId: 'test-' + Date.now(),
    submittedAt: new Date().toLocaleString(),
    isClinicalStaff: true
  });
  Logger.log('Test emails sent to ' + CONFIG.HR_EMAILS[0]);
}

// Test reminder email
function testReminderEmail() {
  sendReminderEmail({
    to: CONFIG.HR_EMAILS[0],
    subject: 'Reminder: Complete your Fountain Onboarding Form',
    name: 'Test User',
    progress: 45,
    continueUrl: CONFIG.APP_URL + '/continue/test-draft-123',
    reminderNumber: 1
  });
  Logger.log('Test reminder email sent to ' + CONFIG.HR_EMAILS[0]);
}

// Test file upload
function testFileUpload() {
  var testContent = 'This is a test file uploaded at ' + new Date().toISOString();
  var base64Content = Utilities.base64Encode(testContent);

  var result = uploadFileToDrive({
    fileBase64: base64Content,
    fileName: 'test-upload.txt',
    mimeType: 'text/plain',
    submitterName: 'Test User'
  });

  Logger.log('Upload result: ' + JSON.stringify(result));

  if (result.success) {
    Logger.log('SUCCESS! File uploaded to: ' + result.data.webViewLink);
  } else {
    Logger.log('FAILED: ' + result.error);
  }
}

// Get the uploads folder ID (run this to find your folder ID)
function getUploadsFolderInfo() {
  var folder = getUploadsFolder();
  Logger.log('===========================================');
  Logger.log('UPLOADS FOLDER INFO');
  Logger.log('===========================================');
  Logger.log('Folder Name: ' + folder.getName());
  Logger.log('Folder ID: ' + folder.getId());
  Logger.log('Folder URL: https://drive.google.com/drive/folders/' + folder.getId());
  Logger.log('');
  Logger.log('To use this folder, update CONFIG.UPLOADS_FOLDER_ID:');
  Logger.log("UPLOADS_FOLDER_ID: '" + folder.getId() + "'");
  Logger.log('===========================================');
}

// Validate configuration
function validateConfig() {
  Logger.log('===========================================');
  Logger.log('CONFIGURATION VALIDATION');
  Logger.log('===========================================');

  var errors = [];

  if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    errors.push('SPREADSHEET_ID is not configured');
  }

  if (!CONFIG.HR_EMAILS || CONFIG.HR_EMAILS.length === 0) {
    errors.push('HR_EMAILS is empty');
  }

  if (!CONFIG.APP_URL || CONFIG.APP_URL === 'https://your-app.vercel.app') {
    errors.push('APP_URL is not configured');
  }

  if (errors.length > 0) {
    Logger.log('ERRORS FOUND:');
    errors.forEach(function(err) {
      Logger.log('  - ' + err);
    });
  } else {
    Logger.log('All required configuration is set!');
    Logger.log('');
    Logger.log('Current values:');
    Logger.log('  SPREADSHEET_ID: ' + CONFIG.SPREADSHEET_ID);
    Logger.log('  HR_EMAILS: ' + CONFIG.HR_EMAILS.join(', '));
    Logger.log('  APP_URL: ' + CONFIG.APP_URL);
    Logger.log('  UPLOADS_FOLDER_ID: ' + (CONFIG.UPLOADS_FOLDER_ID || '(auto-create)'));
  }

  Logger.log('===========================================');
}
