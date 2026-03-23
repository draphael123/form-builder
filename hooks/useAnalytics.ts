'use client';

/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useCallback } from 'react';

interface AnalyticsSession {
  id: string;
  startedAt: string;
}

const SESSION_KEY = 'form-analytics-session';
const START_TIME_KEY = 'form-analytics-start-time';

export function useAnalytics() {
  const sessionRef = useRef<AnalyticsSession | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      // Check for existing session
      const stored = sessionStorage.getItem(SESSION_KEY);
      const storedStartTime = sessionStorage.getItem(START_TIME_KEY);

      if (stored && storedStartTime) {
        sessionRef.current = JSON.parse(stored);
        startTimeRef.current = parseInt(storedStartTime, 10);
        return;
      }

      // Start new session
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start_session' }),
        });

        const result = await response.json();
        if (result.success) {
          sessionRef.current = result.session;
          startTimeRef.current = Date.now();
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.session));
          sessionStorage.setItem(START_TIME_KEY, startTimeRef.current.toString());
        }
      } catch (error) {
        console.error('Failed to start analytics session:', error);
      }
    }

    initSession();
  }, []);

  // Calculate total time spent
  const getTotalTimeSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  // Track page change
  const trackPageChange = useCallback(async (page: number) => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_session',
          sessionId: sessionRef.current.id,
          currentPage: page,
          totalTimeSeconds: getTotalTimeSeconds(),
        }),
      });

      // Also record page view event
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          sessionId: sessionRef.current.id,
          type: 'page_view',
          page,
        }),
      });
    } catch (error) {
      console.error('Failed to track page change:', error);
    }
  }, [getTotalTimeSeconds]);

  // Track field interaction
  const trackFieldInteraction = useCallback(async (fieldId: string, page: number) => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          sessionId: sessionRef.current.id,
          type: 'field_interaction',
          fieldId,
          page,
        }),
      });
    } catch (error) {
      console.error('Failed to track field interaction:', error);
    }
  }, []);

  // Track validation error
  const trackValidationError = useCallback(async (fieldId: string, page: number) => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          sessionId: sessionRef.current.id,
          type: 'validation_error',
          fieldId,
          page,
        }),
      });
    } catch (error) {
      console.error('Failed to track validation error:', error);
    }
  }, []);

  // Track form completion
  const trackFormComplete = useCallback(async () => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_session',
          sessionId: sessionRef.current.id,
          status: 'completed',
          totalTimeSeconds: getTotalTimeSeconds(),
        }),
      });

      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          sessionId: sessionRef.current.id,
          type: 'form_submit',
        }),
      });

      // Clear session storage
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(START_TIME_KEY);
    } catch (error) {
      console.error('Failed to track form completion:', error);
    }
  }, [getTotalTimeSeconds]);

  // Track save draft
  const trackSaveDraft = useCallback(async (page: number) => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_event',
          sessionId: sessionRef.current.id,
          type: 'save_draft',
          page,
        }),
      });
    } catch (error) {
      console.error('Failed to track save draft:', error);
    }
  }, []);

  return {
    trackPageChange,
    trackFieldInteraction,
    trackValidationError,
    trackFormComplete,
    trackSaveDraft,
    sessionId: sessionRef.current?.id,
  };
}
