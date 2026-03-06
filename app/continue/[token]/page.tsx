'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface DraftData {
  email: string;
  data: Record<string, unknown>;
  currentPage: number;
  expiresAt: string;
}

export default function ContinuePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftData | null>(null);

  useEffect(() => {
    async function fetchDraft() {
      try {
        const response = await fetch(`/api/drafts?token=${token}`);
        const result = await response.json();

        if (result.success) {
          setDraft(result.draft);
        } else {
          setError(result.message || 'Failed to load your saved progress');
        }
      } catch (err) {
        console.error('Error fetching draft:', err);
        setError('Failed to load your saved progress');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchDraft();
    }
  }, [token]);

  const handleContinue = () => {
    if (draft) {
      // Store draft data in localStorage for the form to pick up
      localStorage.setItem('form-draft-restore', JSON.stringify({
        data: draft.data,
        currentPage: draft.currentPage,
        token: token,
      }));
      router.push('/');
    }
  };

  const handleStartFresh = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your saved progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Link Expired or Invalid</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Your saved progress may have expired (links are valid for 7 days) or the link is invalid.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start a New Form
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-gray-600">
            We found your saved progress for <strong>{draft?.email}</strong>
          </p>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Saved fields:</span>
            <span className="font-medium text-gray-900">
              {Object.keys(draft?.data || {}).length} fields
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Progress:</span>
            <span className="font-medium text-gray-900">
              Section {(draft?.currentPage || 0) + 1}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Expires:</span>
            <span className="font-medium text-gray-900">
              {draft?.expiresAt ? new Date(draft.expiresAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Where I Left Off
          </button>
          <button
            onClick={handleStartFresh}
            className="w-full py-3 px-6 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Start Fresh
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          Your saved progress will be automatically deleted after submission.
        </p>
      </div>
    </div>
  );
}
