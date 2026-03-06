import { NextRequest, NextResponse } from 'next/server';
import { updateSubmissionStatus, SubmissionStatus } from '@/lib/local-storage';

const validStatuses: SubmissionStatus[] = ['pending', 'reviewed', 'processing', 'complete'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = updateSubmissionStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated',
      submission: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    );
  }
}
