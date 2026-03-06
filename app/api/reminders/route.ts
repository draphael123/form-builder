import { NextRequest, NextResponse } from 'next/server';

// Types for draft tracking
interface Draft {
  id: string;
  email: string;
  data: Record<string, unknown>;
  currentPage: number;
  createdAt: string;
  lastUpdated: string;
  remindersSent: number;
  lastReminderSent?: string;
}

// In-memory storage for drafts (in production, use a database)
// This is also stored in the drafts API, but we need to track reminder state
const draftsWithReminders = new Map<string, Draft>();

// Reminder intervals in hours
const REMINDER_INTERVALS = [24, 72, 168]; // 1 day, 3 days, 7 days

// Check if running on Vercel with cron
const isVercelCron = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
};

// GET - Process reminders (called by cron job)
export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request (in production)
  if (process.env.CRON_SECRET && !isVercelCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const remindersSent: string[] = [];
    const errors: string[] = [];

    // Get all drafts that might need reminders
    const drafts = Array.from(draftsWithReminders.values());

    for (const draft of drafts) {
      // Skip if no email
      if (!draft.email) continue;

      // Check how many reminders have been sent
      if (draft.remindersSent >= REMINDER_INTERVALS.length) continue;

      // Get the appropriate interval for next reminder
      const intervalHours = REMINDER_INTERVALS[draft.remindersSent];
      const lastActivityTime = new Date(draft.lastUpdated || draft.createdAt);
      const hoursSinceActivity = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60 * 60);

      // Check if enough time has passed
      if (hoursSinceActivity < intervalHours) continue;

      // Check if we already sent a reminder recently (within 12 hours)
      if (draft.lastReminderSent) {
        const hoursSinceLastReminder =
          (now.getTime() - new Date(draft.lastReminderSent).getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastReminder < 12) continue;
      }

      // Send reminder email
      try {
        await sendReminderEmail(draft, draft.remindersSent + 1);
        draft.remindersSent += 1;
        draft.lastReminderSent = now.toISOString();
        draftsWithReminders.set(draft.id, draft);
        remindersSent.push(draft.email);
      } catch (error) {
        console.error(`Failed to send reminder to ${draft.email}:`, error);
        errors.push(draft.email);
      }
    }

    return NextResponse.json({
      success: true,
      processed: drafts.length,
      remindersSent: remindersSent.length,
      emails: remindersSent,
      errors: errors.length,
    });
  } catch (error) {
    console.error('Reminder processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}

// POST - Register a draft for reminders
export async function POST(request: NextRequest) {
  try {
    const { id, email, data, currentPage } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const existingDraft = draftsWithReminders.get(id);

    const draft: Draft = {
      id,
      email,
      data: data || {},
      currentPage: currentPage || 0,
      createdAt: existingDraft?.createdAt || now,
      lastUpdated: now,
      remindersSent: existingDraft?.remindersSent || 0,
      lastReminderSent: existingDraft?.lastReminderSent,
    };

    draftsWithReminders.set(id, draft);

    return NextResponse.json({
      success: true,
      message: 'Draft registered for reminders',
    });
  } catch (error) {
    console.error('Error registering draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register draft' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a draft from reminders (when completed)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing draft ID' },
        { status: 400 }
      );
    }

    draftsWithReminders.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Draft removed from reminders',
    });
  } catch (error) {
    console.error('Error removing draft:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove draft' },
      { status: 500 }
    );
  }
}

// Helper function to send reminder email
async function sendReminderEmail(draft: Draft, reminderNumber: number): Promise<void> {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL;

  if (!appsScriptUrl) {
    console.log('Apps Script URL not configured - skipping reminder email');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://form-builder-pied-two.vercel.app';
  const continueUrl = `${appUrl}/continue/${draft.id}`;

  const name = String(draft.data.fullLegalName || 'there');
  const progress = Math.round(((draft.currentPage + 1) / 15) * 100); // Approximate progress

  const subjects = [
    `Reminder: Complete your Fountain Onboarding Form`,
    `Don't forget: Your Fountain Onboarding is ${progress}% complete`,
    `Final Reminder: Complete your Fountain Onboarding`,
  ];

  const subject = subjects[Math.min(reminderNumber - 1, subjects.length - 1)];

  await fetch(appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reminderEmail: {
        to: draft.email,
        subject,
        name,
        progress,
        continueUrl,
        reminderNumber,
      },
    }),
  });
}
