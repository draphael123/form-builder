/**
 * DEPRECATED - This file is no longer maintained.
 *
 * Please use the main Apps Script file instead:
 *   - Source: ../apps-script.js
 *   - Clasp deployment: ../clasp-project/Code.js
 *
 * The main script includes:
 *   - File upload support
 *   - Email notifications (confirmation + HR)
 *   - Reminder emails
 *   - Cascading sheet format (Sheet2)
 *   - Better error handling and input validation
 *   - Configurable settings
 *
 * This file is kept for reference only.
 */

// ===========================================
// LEGACY CODE - DO NOT USE
// ===========================================

function toHyperlinkIfDriveUrl(value) {
  if (
    typeof value === 'string' &&
    (value.indexOf('drive.google.com') !== -1 ||
      value.indexOf('docs.google.com') !== -1)
  ) {
    var safeUrl = value.replace(/"/g, '""');
    return '=HYPERLINK("' + safeUrl + '", "View File")';
  }
  return value;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var headers = body.headers || [];
    var row = body.row || [];

    if (sheet.getLastRow() === 0 && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    if (row.length > 0) {
      var processedRow = row.map(function(value) {
        return toHyperlinkIfDriveUrl(value);
      });
      sheet.appendRow(processedRow);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
