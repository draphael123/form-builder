import { google } from 'googleapis';

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Append a row to the spreadsheet
export async function appendToSheet(values: string[]): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not configured');
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:Z', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    return true;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

// Get headers from the spreadsheet (first row)
export async function getSheetHeaders(): Promise<string[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!1:1',
    });

    return (response.data.values?.[0] as string[]) || [];
  } catch (error) {
    console.error('Error getting sheet headers:', error);
    throw error;
  }
}

// Initialize sheet with headers if empty
export async function initializeSheet(headers: string[]): Promise<void> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not configured');
    }

    // Check if sheet already has headers
    const existingHeaders = await getSheetHeaders();

    if (existingHeaders.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });
    }
  } catch (error) {
    console.error('Error initializing sheet:', error);
    throw error;
  }
}
