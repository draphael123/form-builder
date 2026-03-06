'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface SectionTiming {
  sectionId: string;
  sectionTitle: string;
  startTime: number;
  endTime?: number;
  duration?: number; // in seconds
}

interface TimeTrackingData {
  formStartTime: number;
  formEndTime?: number;
  totalDuration?: number; // in seconds
  sectionTimings: SectionTiming[];
  pausedDuration: number; // time spent away from tab
}

interface UseTimeTrackingOptions {
  formId: string;
  currentSectionId: string;
  currentSectionTitle: string;
}

export function useTimeTracking({
  formId,
  currentSectionId,
  currentSectionTitle,
}: UseTimeTrackingOptions) {
  const [trackingData, setTrackingData] = useState<TimeTrackingData>(() => {
    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`form-timing-${formId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Ignore parse errors
        }
      }
    }
    return {
      formStartTime: Date.now(),
      sectionTimings: [],
      pausedDuration: 0,
    };
  });

  const lastActivityTime = useRef(Date.now());
  const isTabVisible = useRef(true);
  const pauseStartTime = useRef<number | null>(null);

  // Track tab visibility to account for time away
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabVisible.current = false;
        pauseStartTime.current = Date.now();
      } else {
        isTabVisible.current = true;
        if (pauseStartTime.current) {
          const pauseDuration = Date.now() - pauseStartTime.current;
          // Only count as pause if away for more than 30 seconds
          if (pauseDuration > 30000) {
            setTrackingData((prev) => ({
              ...prev,
              pausedDuration: prev.pausedDuration + pauseDuration,
            }));
          }
          pauseStartTime.current = null;
        }
        lastActivityTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Track section changes
  useEffect(() => {
    const now = Date.now();

    setTrackingData((prev) => {
      const updatedTimings = [...prev.sectionTimings];

      // End the previous section if there is one
      const lastTiming = updatedTimings[updatedTimings.length - 1];
      if (lastTiming && !lastTiming.endTime && lastTiming.sectionId !== currentSectionId) {
        lastTiming.endTime = now;
        lastTiming.duration = Math.round((now - lastTiming.startTime) / 1000);
      }

      // Check if we already have a timing for this section
      const existingIndex = updatedTimings.findIndex((t) => t.sectionId === currentSectionId);

      if (existingIndex === -1) {
        // New section, add timing
        updatedTimings.push({
          sectionId: currentSectionId,
          sectionTitle: currentSectionTitle,
          startTime: now,
        });
      } else if (updatedTimings[existingIndex].endTime) {
        // Revisiting a section, update start time for additional tracking
        updatedTimings[existingIndex].startTime = now;
        updatedTimings[existingIndex].endTime = undefined;
      }

      return {
        ...prev,
        sectionTimings: updatedTimings,
      };
    });
  }, [currentSectionId, currentSectionTitle]);

  // Save to localStorage periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(`form-timing-${formId}`, JSON.stringify(trackingData));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [formId, trackingData]);

  // Get final timing data when form is completed
  const getCompletionData = useCallback(() => {
    const now = Date.now();

    // Close any open section timing
    const finalTimings = trackingData.sectionTimings.map((timing) => {
      if (!timing.endTime) {
        return {
          ...timing,
          endTime: now,
          duration: Math.round((now - timing.startTime) / 1000),
        };
      }
      return timing;
    });

    // Calculate total active time (excluding paused time)
    const totalDuration = Math.round(
      (now - trackingData.formStartTime - trackingData.pausedDuration) / 1000
    );

    const completionData: TimeTrackingData = {
      ...trackingData,
      formEndTime: now,
      totalDuration,
      sectionTimings: finalTimings,
    };

    // Clear localStorage
    localStorage.removeItem(`form-timing-${formId}`);

    return completionData;
  }, [formId, trackingData]);

  // Format duration for display
  const formatDuration = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, []);

  // Get current elapsed time
  const getElapsedTime = useCallback(() => {
    const elapsed = Math.round(
      (Date.now() - trackingData.formStartTime - trackingData.pausedDuration) / 1000
    );
    return formatDuration(elapsed);
  }, [trackingData.formStartTime, trackingData.pausedDuration, formatDuration]);

  return {
    trackingData,
    getCompletionData,
    getElapsedTime,
    formatDuration,
  };
}
