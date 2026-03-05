import { NextRequest, NextResponse } from 'next/server';
import { saveFileLocally } from '@/lib/local-storage';

// Check if Google Drive is configured
const isGoogleDriveConfigured = () => {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SPREADSHEET_ID
  );
};

export async function POST(request: NextRequest) {
  try {
    const { fileBase64, fileName, mimeType, submitterName } = await request.json();

    if (!fileBase64 || !fileName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: fileBase64, fileName' },
        { status: 400 }
      );
    }

    // Try Google Drive if configured, otherwise use local storage
    if (isGoogleDriveConfigured()) {
      try {
        const { uploadToGoogleDrive } = await import('@/lib/google-drive');
        const result = await uploadToGoogleDrive(fileBase64, fileName, mimeType, submitterName);

        return NextResponse.json({
          success: true,
          data: {
            fileName: result.fileName,
            fileUrl: result.fileUrl,
            webViewLink: result.webViewLink,
          },
        });
      } catch (error) {
        console.error('Google Drive upload failed, falling back to local storage:', error);
        // Fall through to local storage
      }
    }

    // Use local storage
    const result = saveFileLocally(fileBase64, fileName, submitterName);

    return NextResponse.json({
      success: true,
      data: {
        fileName: fileName,
        fileUrl: result.publicUrl,
        webViewLink: result.publicUrl,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
