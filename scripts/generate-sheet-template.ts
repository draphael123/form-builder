/**
 * Generates form-responses-headers.csv and Apps Script for the Form Builder sheet.
 * Run from project root: npx tsx scripts/generate-sheet-template.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { newHireFormConfig, getFormHeaders } from '../lib/form-config';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const headers = getFormHeaders(newHireFormConfig);
const csvRow = headers.map(escapeCsv).join(',');
const root = path.resolve(__dirname, '..');
const csvPath = path.join(root, 'form-responses-headers.csv');
const scriptPath = path.join(root, 'sheet-apps-script', 'FormResponses.gs');

const appsScript = `/**
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
`;

fs.writeFileSync(csvPath, csvRow + '\n', 'utf-8');
console.log('Wrote', csvPath);

fs.mkdirSync(path.dirname(scriptPath), { recursive: true });
fs.writeFileSync(scriptPath, appsScript.trim() + '\n', 'utf-8');
console.log('Wrote', scriptPath);
console.log('Header count:', headers.length);
