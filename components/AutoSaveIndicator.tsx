'use client';

import { useEffect, useState } from 'react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSavedText: string | null;
}

export function AutoSaveIndicator({ isSaving, lastSavedText }: AutoSaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  // Show "Saved" animation briefly after saving completes
  useEffect(() => {
    if (!isSaving && lastSavedText) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSavedText]);

  if (!isSaving && !lastSavedText) {
    return null;
  }

  return (
    <div className="auto-save-indicator">
      {isSaving ? (
        <div className="auto-save-saving">
          <svg
            className="auto-save-spinner"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="2"
              strokeDasharray="31.4"
              strokeDashoffset="10"
            />
          </svg>
          <span>Saving...</span>
        </div>
      ) : showSaved ? (
        <div className="auto-save-saved">
          <svg
            className="auto-save-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Saved</span>
        </div>
      ) : (
        <div className="auto-save-text">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{lastSavedText}</span>
        </div>
      )}
    </div>
  );
}
