import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileBase64, fileName, mimeType, submitterName } = await request.json();

    if (!fileBase64 || !fileName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: fileBase64, fileName' },
        { status: 400 }
      );
    }

    // Use Apps Script for Google Drive upload
    const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    if (appsScriptUrl) {
      try {
        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileUpload: {
              fileBase64,
              fileName,
              mimeType: mimeType || 'application/octet-stream',
              submitterName,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          return NextResponse.json({
            success: true,
            data: {
              fileName: result.data.fileName,
              fileUrl: result.data.fileUrl,
              webViewLink: result.data.webViewLink,
            },
          });
        } else {
          console.error('Apps Script upload failed:', result.error);
          // Fall through to fallback
        }
      } catch (error) {
        console.error('Apps Script upload error:', error);
        // Fall through to fallback
      }
    }

    // Fallback: Return as data URL
    const dataUrl = `data:${mimeType || 'application/octet-stream'};base64,${fileBase64}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: fileName,
        fileUrl: dataUrl,
        webViewLink: dataUrl,
        isDataUrl: true,
      },
      warning: 'File stored as data URL. Configure APPS_SCRIPT_WEB_APP_URL for Google Drive storage.',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
