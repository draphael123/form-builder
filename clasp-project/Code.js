// ===========================================
// Google Apps Script for Fountain Onboarding
// ===========================================

const SPREADSHEET_ID = '1etgBQL9BjxFVVN4JYHN9a_6IfQr41gj8aDMrt6gpT_Y';
const HR_EMAILS = ['daniel@fountain.net', 'tammy.hale@fountain.net'];
const APP_URL = 'https://form-builder-pied-two.vercel.app';
const UPLOADS_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.fileUpload) {
      const result = uploadFileToDrive(data.fileUpload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.headers && data.row) {
      logToSpreadsheet(data.headers, data.row);
    }
    if (data.emailData) {
      sendEmails(data.emailData);
    }
    if (data.reminderEmail) {
      sendReminderEmail(data.reminderEmail);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===========================================
// SPREADSHEET FUNCTIONS
// ===========================================

function logToSpreadsheet(headers, row) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  logToFormResponses(spreadsheet, headers, row);
  logToCascadingSheet(spreadsheet, headers, row);
}

function logToFormResponses(spreadsheet, headers, row) {
  let sheet = spreadsheet.getSheetByName('Form Responses 1');
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  // Convert Drive URLs to clickable HYPERLINK formulas
  var processedRow = row.map(function(value) {
    if (value && String(value).includes('drive.google.com')) {
      return '=HYPERLINK("' + String(value).replace(/"/g, '""') + '", "file.")';
    }
    return value;
  });
  sheet.appendRow(processedRow);
}

function logToCascadingSheet(spreadsheet, headers, row) {
  let sheet = spreadsheet.getSheetByName('Sheet2');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Sheet2');
    sheet.setColumnWidth(1, 350);
    sheet.setColumnWidth(2, 500);
  }

  const startRow = sheet.getLastRow() + 1;
  const dataStartRow = startRow > 1 ? startRow + 1 : startRow;
  const cascadingRows = [];

  for (var i = 0; i < headers.length; i++) {
    var value = row[i];
    if (value === undefined || value === null || value === '') continue;
    var displayValue = String(value);
    if (displayValue.includes('drive.google.com')) {
      displayValue = '=HYPERLINK("' + displayValue + '", "file.")';
    }
    cascadingRows.push([headers[i], displayValue]);
  }

  if (cascadingRows.length > 0) {
    const range = sheet.getRange(dataStartRow, 1, cascadingRows.length, 2);
    range.setValues(cascadingRows);
    range.setBackground('#FFFF00');
    sheet.getRange(dataStartRow, 1, cascadingRows.length, 1).setFontWeight('bold');
    range.setBorder(true, true, true, true, false, false, '#999999', SpreadsheetApp.BorderStyle.SOLID);
  }
  Logger.log('Cascading format logged to Sheet2 with ' + cascadingRows.length + ' fields');
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
    let folder;
    if (UPLOADS_FOLDER_ID && UPLOADS_FOLDER_ID !== 'YOUR_FOLDER_ID_HERE') {
      folder = DriveApp.getFolderById(UPLOADS_FOLDER_ID);
    } else {
      const folders = DriveApp.getFoldersByName('Fountain Onboarding Uploads');
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder('Fountain Onboarding Uploads');
      }
    }
    const timestamp = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_HH-mm-ss');
    const sanitizedName = (submitterName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueFileName = sanitizedName + '_' + timestamp + '_' + fileName;
    const decoded = Utilities.base64Decode(fileBase64);
    const blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', uniqueFileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileId = file.getId();
    return {
      success: true,
      data: {
        fileId: fileId,
        fileName: uniqueFileName,
        fileUrl: 'https://drive.google.com/uc?export=download&id=' + fileId,
        webViewLink: 'https://drive.google.com/file/d/' + fileId + '/view'
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ===========================================
// EMAIL FUNCTIONS
// ===========================================

function sendEmails(emailData) {
  const { submitterEmail, submitterName, submissionId, submittedAt, isClinicalStaff } = emailData;
  if (submitterEmail) {
    sendConfirmationEmail(submitterEmail, submitterName, submissionId, submittedAt, isClinicalStaff);
  }
  sendHRNotificationEmail(submitterName, submitterEmail, submissionId, submittedAt, isClinicalStaff);
}

function sendConfirmationEmail(toEmail, name, submissionId, submittedAt, isClinicalStaff) {
  const subject = 'Fountain Onboarding - Submission Received';
  const htmlBody = '<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background-color:#2563eb;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background-color:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px}.info-box{background-color:white;padding:15px;border-radius:8px;margin:15px 0;border:1px solid #e5e7eb}</style></head><body><div class="container"><div class="header"><h1 style="margin:0">Submission Received</h1></div><div class="content"><p>Dear ' + name + ',</p><p>Thank you for completing the Fountain Onboarding form. Your submission has been received.</p><div class="info-box"><p><strong>Submission ID:</strong> ' + submissionId + '</p><p><strong>Submitted:</strong> ' + submittedAt + '</p><p><strong>Staff Type:</strong> ' + (isClinicalStaff ? 'Clinical' : 'Non-Clinical') + '</p></div><p>Our HR team will review your information.</p><p>Best regards,<br>Fountain HR Team</p></div></div></body></html>';
  GmailApp.sendEmail(toEmail, subject, '', { htmlBody: htmlBody });
}

function sendHRNotificationEmail(name, email, submissionId, submittedAt, isClinicalStaff) {
  const subject = 'New Hire Submission: ' + name;
  const submissionLink = APP_URL + '/admin?highlight=' + submissionId;
  const htmlBody = '<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background-color:#059669;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background-color:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px}.info-box{background-color:white;padding:15px;border-radius:8px;margin:15px 0;border:1px solid #e5e7eb}.button{display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin-top:15px}</style></head><body><div class="container"><div class="header"><h1 style="margin:0">New Hire Submission</h1></div><div class="content"><p>A new hire has completed the onboarding form.</p><div class="info-box"><p><strong>Name:</strong> ' + name + '</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Submission ID:</strong> ' + submissionId + '</p><p><strong>Submitted:</strong> ' + submittedAt + '</p><p><strong>Staff Type:</strong> ' + (isClinicalStaff ? 'Clinical' : 'Non-Clinical') + '</p></div><a href="' + submissionLink + '" class="button">View Submission</a></div></div></body></html>';
  HR_EMAILS.forEach(function(hrEmail) {
    GmailApp.sendEmail(hrEmail, subject, '', { htmlBody: htmlBody });
  });
}

function sendReminderEmail(reminderData) {
  const { to, subject, name, progress, continueUrl, reminderNumber } = reminderData;
  const messages = ["Just a friendly reminder to complete your onboarding form.", "We noticed you haven't finished your onboarding form yet.", "This is your final reminder to complete your onboarding form."];
  const msg = messages[Math.min(reminderNumber - 1, messages.length - 1)];
  const htmlBody = '<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background-color:#f59e0b;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0}.content{background-color:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px}.button{display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin-top:15px}</style></head><body><div class="container"><div class="header"><h1 style="margin:0">Complete Your Onboarding</h1></div><div class="content"><p>Hi ' + name + ',</p><p>' + msg + '</p><p><strong>Progress: ' + progress + '% Complete</strong></p><p style="text-align:center"><a href="' + continueUrl + '" class="button">Continue My Form</a></p><p>Best regards,<br>Fountain HR Team</p></div></div></body></html>';
  GmailApp.sendEmail(to, subject, '', { htmlBody: htmlBody });
}

// ===========================================
// AUTHORIZATION TEST (run this first)
// ===========================================

function authorizeAndTest() {
  var folder = DriveApp.getFoldersByName('Test');
  Logger.log('Authorization successful!');
}
