import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, deleteSubmission, submissionsToCSV } from '@/lib/local-storage';

// GET - Retrieve all submissions or export as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    const submissions = getSubmissions();

    // Export as CSV
    if (format === 'csv') {
      const csv = submissionsToCSV(submissions);

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="form-submissions-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return as JSON
    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('Error getting submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get submissions' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a submission by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing submission ID' },
        { status: 400 }
      );
    }

    const deleted = deleteSubmission(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
