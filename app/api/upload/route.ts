import { NextRequest, NextResponse } from 'next/server';

// Check if Google Drive is configured
const isGoogleDriveConfigured = () => {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SPREADSHEET_ID
  );
};

// Check if running on Vercel (serverless environment with read-only filesystem)
const isVercel = () => {
  return !!process.env.VERCEL;
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

    // Try Google Drive if configured
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
        console.error('Google Drive upload failed:', error);
        // Fall through to alternative storage
      }
    }

    // On Vercel or when Google Drive isn't configured, store as data URL
    // This embeds the file data directly, which works in serverless environments
    if (isVercel()) {
      const dataUrl = `data:${mimeType || 'application/octet-stream'};base64,${fileBase64}`;

      return NextResponse.json({
        success: true,
        data: {
          fileName: fileName,
          fileUrl: dataUrl,
          webViewLink: dataUrl,
          isDataUrl: true,
        },
      });
    }

    // Use local storage for non-Vercel environments
    try {
      const { saveFileLocally } = await import('@/lib/local-storage');
      const result = saveFileLocally(fileBase64, fileName, submitterName);

      if (result) {
        return NextResponse.json({
          success: true,
          data: {
            fileName: fileName,
            fileUrl: result.publicUrl,
            webViewLink: result.publicUrl,
          },
        });
      }
    } catch (error) {
      console.error('Local storage failed:', error);
    }

    // Fallback: return as data URL
    const dataUrl = `data:${mimeType || 'application/octet-stream'};base64,${fileBase64}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: fileName,
        fileUrl: dataUrl,
        webViewLink: dataUrl,
        isDataUrl: true,
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
