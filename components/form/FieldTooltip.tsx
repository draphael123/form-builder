'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react';

interface FieldTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function FieldTooltip({ content, position = 'top' }: FieldTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Adjust position if tooltip would go off-screen
  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      if (position === 'top' && tooltipRect.top < 0) {
        setActualPosition('bottom');
      } else if (position === 'bottom' && tooltipRect.bottom > window.innerHeight) {
        setActualPosition('top');
      } else if (position === 'left' && tooltipRect.left < 0) {
        setActualPosition('right');
      } else if (position === 'right' && tooltipRect.right > window.innerWidth) {
        setActualPosition('left');
      } else {
        setActualPosition(position);
      }
    }
  }, [isVisible, position]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-charcoal)] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-charcoal)] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-charcoal)] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-charcoal)] border-y-transparent border-l-transparent',
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className="w-5 h-5 rounded-full bg-[var(--color-parchment)] hover:bg-[var(--color-warm-gray-light)] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)] focus:ring-offset-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="More information"
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
      >
        <svg
          className="w-3 h-3 text-[var(--color-warm-gray)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className={`absolute z-50 ${positionClasses[actualPosition]}`}
        >
          <div className="relative">
            <div className="bg-[var(--color-charcoal)] text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal">
              {content}
            </div>
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
