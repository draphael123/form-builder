'use client';

import { useState } from 'react';
import { FormSection, Question } from '@/types/form';

interface SectionOverviewProps {
  section: FormSection;
  visibleQuestions: Question[];
  completedFields: Set<string>;
}

export function SectionOverview({
  section,
  visibleQuestions,
  completedFields,
}: SectionOverviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = visibleQuestions.filter((q) => completedFields.has(q.id)).length;
  const totalCount = visibleQuestions.length;
  const requiredCount = visibleQuestions.filter((q) => q.required).length;

  return (
    <div className="section-overview">
      <button
        type="button"
        className="section-overview-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {totalCount} questions in this section ({requiredCount} required)
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[var(--color-sage)]">{completedCount}/{totalCount}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="section-overview-content">
          {visibleQuestions.map((question) => {
            const isComplete = completedFields.has(question.id);
            return (
              <div
                key={question.id}
                className={`section-overview-item ${question.required ? 'required' : ''}`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4 text-[var(--color-sage)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[var(--color-warm-gray-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                )}
                <span className={isComplete ? 'text-[var(--color-charcoal)]' : ''}>
                  {question.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
