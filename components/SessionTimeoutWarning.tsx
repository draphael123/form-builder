'use client';

/* eslint-disable react-hooks/purity */
import { useEffect, useState, useCallback } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { getTranslation } from '@/lib/translations';

interface SessionTimeoutWarningProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onExtend?: () => void;
}

export function SessionTimeoutWarning({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onExtend,
}: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const { settings } = useAccessibility();
  const language = settings.language;

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const handleExtend = () => {
    resetTimer();
    onExtend?.();
  };

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning]);

  // Check for timeout
  useEffect(() => {
    const checkTimeout = () => {
      const now = Date.now();
      const elapsed = (now - lastActivity) / 1000 / 60; // minutes
      const remaining = timeoutMinutes - elapsed;

      if (remaining <= 0) {
        // Session expired - could redirect to login or clear data
        setShowWarning(false);
      } else if (remaining <= warningMinutes) {
        setShowWarning(true);
        setRemainingSeconds(Math.floor(remaining * 60));
      } else {
        setShowWarning(false);
      }
    };

    const interval = setInterval(checkTimeout, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, timeoutMinutes, warningMinutes]);

  // Update remaining seconds countdown
  useEffect(() => {
    if (showWarning && remainingSeconds > 0) {
      const timer = setTimeout(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showWarning, remainingSeconds]);

  if (!showWarning) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="session-timeout-warning" role="alert">
      <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="session-timeout-text">
        {getTranslation('session.warning', language)}{' '}
        <strong>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </strong>
      </span>
      <button type="button" className="session-timeout-btn" onClick={handleExtend}>
        {getTranslation('session.extend', language)}
      </button>
    </div>
  );
}
