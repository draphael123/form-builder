import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById } from '@/lib/local-storage';
import { generateSubmissionPDF, generatePDFFilename } from '@/lib/pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = getSubmissionById(id);

    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateSubmissionPDF(submission);
    const filename = generatePDFFilename(submission);

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
