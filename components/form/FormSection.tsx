'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-t-4 border-blue-600" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
