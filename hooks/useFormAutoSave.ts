'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { UseFormWatch, UseFormReset } from 'react-hook-form';

const STORAGE_KEY = 'form-draft';
const DEBOUNCE_MS = 1000; // Save after 1 second of inactivity

interface AutoSaveOptions {
  formId: string;
  watch: UseFormWatch<Record<string, unknown>>;
  reset: UseFormReset<Record<string, unknown>>;
  onRestore?: (data: Record<string, unknown>) => void;
}

interface SavedDraft {
  formId: string;
  data: Record<string, unknown>;
  savedAt: string;
  currentPage?: number;
}

export function useFormAutoSave({ formId, watch, reset, onRestore }: AutoSaveOptions) {
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);

  // Get storage key for this form
  const storageKey = `${STORAGE_KEY}-${formId}`;

  // Check if there's a saved draft
  const checkForDraft = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const draft: SavedDraft = JSON.parse(saved);
        // Check if draft is less than 7 days old
        const savedDate = new Date(draft.savedAt);
        const daysSinceSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceSave < 7) {
          setHasDraft(true);
          return true;
        } else {
          // Draft is too old, remove it
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error checking draft:', error);
    }
    setHasDraft(false);
    return false;
  }, [storageKey]);

  // Save current form data to localStorage
  const saveDraft = useCallback((data: Record<string, unknown>, currentPage?: number) => {
    if (typeof window === 'undefined') return;

    try {
      // Don't save if data is empty or only has undefined values
      const hasData = Object.values(data).some(v => v !== undefined && v !== '');
      if (!hasData) return;

      const draft: SavedDraft = {
        formId,
        data,
        savedAt: new Date().toISOString(),
        currentPage,
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setLastSaved(new Date());
      setHasDraft(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [formId, storageKey]);

  // Restore saved draft
  const restoreDraft = useCallback((): { data: Record<string, unknown>; currentPage?: number } | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const draft: SavedDraft = JSON.parse(saved);
        setIsRestoring(true);
        reset(draft.data);
        setLastSaved(new Date(draft.savedAt));
        onRestore?.(draft.data);
        setIsRestoring(false);
        return { data: draft.data, currentPage: draft.currentPage };
      }
    } catch (error) {
      console.error('Error restoring draft:', error);
      setIsRestoring(false);
    }
    return null;
  }, [storageKey, reset, onRestore]);

  // Clear saved draft
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
      setHasDraft(false);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [storageKey]);

  // Debounced save on form changes
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      checkForDraft();
      return;
    }

    const subscription = watch((data) => {
      // Don't save while restoring
      if (isRestoring) return;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show saving indicator
      setIsSaving(true);

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        saveDraft(data as Record<string, unknown>);
        // Hide saving indicator after a brief moment to show the saved state
        setTimeout(() => setIsSaving(false), 500);
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, saveDraft, checkForDraft, isRestoring]);

  // Format last saved time
  const getLastSavedText = useCallback(() => {
    if (!lastSaved) return null;

    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
      return 'Draft saved just now';
    } else if (diffMinutes < 60) {
      return `Draft saved ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `Draft saved ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `Draft saved on ${lastSaved.toLocaleDateString()}`;
    }
  }, [lastSaved]);

  return {
    hasDraft,
    lastSaved,
    lastSavedText: getLastSavedText(),
    isSaving,
    saveDraft,
    restoreDraft,
    clearDraft,
    checkForDraft,
  };
}
