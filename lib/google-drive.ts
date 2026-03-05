import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize Google Drive client
function getGoogleDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

// Get the Shared Drive ID for uploads
async function getUploadsFolderId(): Promise<string> {
  const drive = getGoogleDriveClient();
  const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'Form Uploads';

  // First, try to find a Shared Drive with the given name
  const drivesResponse = await drive.drives.list({
    q: `name='${folderName}'`,
    fields: 'drives(id, name)',
  });

  if (drivesResponse.data.drives && drivesResponse.data.drives.length > 0) {
    return drivesResponse.data.drives[0].id!;
  }

  // Fallback: search for a folder with Shared Drive support
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }

  throw new Error(`Shared Drive or folder "${folderName}" not found. Please create a Shared Drive named "${folderName}" and share it with the service account.`);
}

// Convert base64 to readable stream
function base64ToStream(base64: string): Readable {
  const buffer = Buffer.from(base64, 'base64');
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export interface UploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
  webViewLink: string;
}

// Upload a file to Google Drive
export async function uploadToGoogleDrive(
  fileBase64: string,
  fileName: string,
  mimeType: string,
  submitterName?: string
): Promise<UploadResult> {
  const drive = getGoogleDriveClient();
  const folderId = await getUploadsFolderId();

  // Create a unique filename with timestamp and submitter name
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedSubmitterName = submitterName?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
  const uniqueFileName = `${sanitizedSubmitterName}_${timestamp}_${fileName}`;

  const fileMetadata = {
    name: uniqueFileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: base64ToStream(fileBase64),
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink, webContentLink',
    supportsAllDrives: true,
  });

  // Make the file viewable by anyone with the link
  await drive.permissions.create({
    fileId: file.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
    supportsAllDrives: true,
  });

  // Get the updated file with sharing link
  const updatedFile = await drive.files.get({
    fileId: file.data.id!,
    fields: 'id, name, webViewLink, webContentLink',
    supportsAllDrives: true,
  });

  return {
    fileId: updatedFile.data.id!,
    fileName: updatedFile.data.name!,
    fileUrl: updatedFile.data.webContentLink || `https://drive.google.com/uc?id=${updatedFile.data.id}`,
    webViewLink: updatedFile.data.webViewLink || `https://drive.google.com/file/d/${updatedFile.data.id}/view`,
  };
}

// Delete a file from Google Drive
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  const drive = getGoogleDriveClient();
  await drive.files.delete({ fileId, supportsAllDrives: true });
}
