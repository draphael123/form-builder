import fs from 'fs';
import path from 'path';

// Directory for storing data
const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// Initialize submissions file if it doesn't exist
function ensureSubmissionsFile() {
  ensureDirectories();
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: [] }, null, 2));
  }
}

export interface Submission {
  id: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// Get all submissions
export function getSubmissions(): Submission[] {
  ensureSubmissionsFile();
  const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
  const parsed = JSON.parse(content);
  return parsed.submissions || [];
}

// Add a new submission
export function addSubmission(data: Record<string, unknown>): Submission {
  ensureSubmissionsFile();

  const submissions = getSubmissions();

  const newSubmission: Submission = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    data,
  };

  submissions.push(newSubmission);

  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions }, null, 2));

  return newSubmission;
}

// Get a single submission by ID
export function getSubmissionById(id: string): Submission | null {
  const submissions = getSubmissions();
  return submissions.find(s => s.id === id) || null;
}

// Delete a submission
export function deleteSubmission(id: string): boolean {
  const submissions = getSubmissions();
  const filtered = submissions.filter(s => s.id !== id);

  if (filtered.length === submissions.length) {
    return false; // Not found
  }

  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions: filtered }, null, 2));
  return true;
}

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Save an uploaded file locally
export function saveFileLocally(
  fileBase64: string,
  fileName: string,
  submitterName?: string
): { filePath: string; publicUrl: string } {
  ensureDirectories();

  // Create unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedSubmitterName = submitterName?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${sanitizedSubmitterName}_${timestamp}_${sanitizedFileName}`;

  // Convert base64 to buffer and save
  const buffer = Buffer.from(fileBase64, 'base64');
  const filePath = path.join(UPLOADS_DIR, uniqueFileName);

  fs.writeFileSync(filePath, buffer);

  // Return the public URL (relative to /public)
  return {
    filePath,
    publicUrl: `/uploads/${uniqueFileName}`,
  };
}

// Delete a file
export function deleteFile(publicUrl: string): boolean {
  const fileName = publicUrl.replace('/uploads/', '');
  const filePath = path.join(UPLOADS_DIR, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

// Convert submissions to CSV format
export function submissionsToCSV(submissions: Submission[]): string {
  if (submissions.length === 0) {
    return '';
  }

  // Get all unique keys from all submissions
  const allKeys = new Set<string>();
  allKeys.add('id');
  allKeys.add('timestamp');

  submissions.forEach(sub => {
    Object.keys(sub.data).forEach(key => allKeys.add(key));
  });

  const headers = Array.from(allKeys);

  // Create CSV header row
  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCSV).join(','));

  // Create data rows
  submissions.forEach(sub => {
    const row = headers.map(header => {
      if (header === 'id') return escapeCSV(sub.id);
      if (header === 'timestamp') return escapeCSV(sub.timestamp);

      const value = sub.data[header];
      if (value === undefined || value === null) return '';
      if (Array.isArray(value)) return escapeCSV(value.join('; '));
      if (typeof value === 'object') return escapeCSV(JSON.stringify(value));
      return escapeCSV(String(value));
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Escape a value for CSV
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
