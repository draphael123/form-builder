'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  // Item 10: Option to hide title when it's already shown elsewhere (e.g., sticky header)
  hideTitle?: boolean;
}

export function FormSection({ title, description, children, hideTitle = false }: FormSectionProps) {
  return (
    <div className="form-card">
      <div className="p-6 sm:p-8">
        {/* Item 10: Only show title/description if not hidden */}
        {!hideTitle && (
          <div className="section-accent mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-charcoal)] tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-[var(--color-warm-gray)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        {/* Show description only if title is hidden but description exists */}
        {hideTitle && description && (
          <div className="mb-6">
            <p className="text-[var(--color-warm-gray)] leading-relaxed">
              {description}
            </p>
          </div>
        )}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
