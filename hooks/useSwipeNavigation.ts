'use client';

import { useEffect, useRef, useCallback } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
  enabled?: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
  enabled = true,
}: SwipeConfig) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, [enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger if horizontal swipe is more prominent than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [enabled, minSwipeDistance, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchEnd]);
}
