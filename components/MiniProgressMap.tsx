'use client';

import { useState } from 'react';
import { FormSection } from '@/types/form';

interface MiniProgressMapProps {
  sections: FormSection[];
  currentPage: number;
  completedSections: Set<number>;
  onSectionClick: (index: number) => void;
}

export function MiniProgressMap({
  sections,
  currentPage,
  completedSections,
  onSectionClick,
}: MiniProgressMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  return (
    <div className="mini-progress-map">
      <button
        type="button"
        className="mini-map-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle progress map"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span className="mini-map-count">{currentPage + 1}/{sections.length}</span>
      </button>

      {isExpanded && (
        <div className="mini-map-panel">
          <div className="mini-map-header">
            <span>Form Progress</span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="mini-map-close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mini-map-sections">
            {sections.map((section, index) => {
              const isCompleted = completedSections.has(index);
              const isCurrent = index === currentPage;
              const isAccessible = index <= currentPage || completedSections.has(index - 1);

              return (
                <button
                  key={section.id}
                  type="button"
                  className={`mini-map-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
                  onClick={() => isAccessible && onSectionClick(index)}
                  disabled={!isAccessible}
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="mini-map-dot">
                    {isCompleted ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span className="mini-map-title">
                    {section.title.length > 25 ? section.title.substring(0, 25) + '...' : section.title}
                  </span>
                  {section.estimatedMinutes && (
                    <span className="mini-map-time">~{section.estimatedMinutes}m</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
