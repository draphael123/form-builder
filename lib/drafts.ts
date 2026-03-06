import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DRAFTS_FILE = path.join(DATA_DIR, 'drafts.json');

// Ensure directory exists
function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureDraftsFile() {
  ensureDirectory();
  if (!fs.existsSync(DRAFTS_FILE)) {
    fs.writeFileSync(DRAFTS_FILE, JSON.stringify({ drafts: [] }, null, 2));
  }
}

export interface Draft {
  id: string;
  token: string;
  email: string;
  data: Record<string, unknown>;
  currentPage: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

// Generate a secure token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get all drafts
function getDrafts(): Draft[] {
  ensureDraftsFile();
  const content = fs.readFileSync(DRAFTS_FILE, 'utf-8');
  const parsed = JSON.parse(content);
  return parsed.drafts || [];
}

// Save drafts
function saveDrafts(drafts: Draft[]): void {
  ensureDraftsFile();
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify({ drafts }, null, 2));
}

// Create or update a draft
export function saveDraft(
  email: string,
  data: Record<string, unknown>,
  currentPage: number
): Draft {
  const drafts = getDrafts();

  // Check if draft exists for this email
  const existingIndex = drafts.findIndex(d => d.email.toLowerCase() === email.toLowerCase());

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  if (existingIndex !== -1) {
    // Update existing draft
    drafts[existingIndex].data = data;
    drafts[existingIndex].currentPage = currentPage;
    drafts[existingIndex].updatedAt = now.toISOString();
    drafts[existingIndex].expiresAt = expiresAt.toISOString();
    saveDrafts(drafts);
    return drafts[existingIndex];
  }

  // Create new draft
  const newDraft: Draft = {
    id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    token: generateToken(),
    email: email.toLowerCase(),
    data,
    currentPage,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  drafts.push(newDraft);
  saveDrafts(drafts);
  return newDraft;
}

// Get draft by token
export function getDraftByToken(token: string): Draft | null {
  const drafts = getDrafts();
  const draft = drafts.find(d => d.token === token);

  if (!draft) {
    return null;
  }

  // Check if expired
  if (new Date(draft.expiresAt) < new Date()) {
    // Delete expired draft
    deleteDraft(token);
    return null;
  }

  return draft;
}

// Delete a draft
export function deleteDraft(token: string): boolean {
  const drafts = getDrafts();
  const filtered = drafts.filter(d => d.token !== token);

  if (filtered.length === drafts.length) {
    return false;
  }

  saveDrafts(filtered);
  return true;
}

// Delete draft by email (after successful submission)
export function deleteDraftByEmail(email: string): boolean {
  const drafts = getDrafts();
  const filtered = drafts.filter(d => d.email.toLowerCase() !== email.toLowerCase());

  if (filtered.length === drafts.length) {
    return false;
  }

  saveDrafts(filtered);
  return true;
}

// Clean up expired drafts
export function cleanupExpiredDrafts(): number {
  const drafts = getDrafts();
  const now = new Date();
  const validDrafts = drafts.filter(d => new Date(d.expiresAt) > now);
  const deleted = drafts.length - validDrafts.length;

  if (deleted > 0) {
    saveDrafts(validDrafts);
  }

  return deleted;
}

// Generate continue link
export function generateContinueLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/continue/${token}`;
}
