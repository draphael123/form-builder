import { handleCsrfTokenRequest } from '@/lib/csrf';

export async function GET() {
  return handleCsrfTokenRequest();
}
