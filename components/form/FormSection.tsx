'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="form-card">
      <div className="p-6 sm:p-8">
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
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
