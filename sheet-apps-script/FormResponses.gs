/**
 * Form Builder - Append incoming submissions to this sheet.
 * 1. In your Google Sheet: Extensions → Apps Script
 * 2. Paste this entire file, save, then Deploy → New deployment → Web app
 * 3. Execute as: Me, Who has access: Anyone
 * 4. Copy the Web app URL into .env as APPS_SCRIPT_WEB_APP_URL
 */
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
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
